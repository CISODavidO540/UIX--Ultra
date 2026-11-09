// UI-MAX MCP server (stdio, JSON-RPC 2.0, newline-delimited). No dependencies.
// Lets an agent call the toolkit directly instead of shelling out:
//   ui_route → ui_playbook → (build) → ui_check → ui_verdict, plus astryx lookups.
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { route, playbook, loadPlaybooks } from './route.js';
import * as evidence from './evidence.js';

// stdout is the protocol channel: anything else that logs must go to stderr.
console.log = (...a) => console.error(...a);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REF_DIR = path.join(ROOT, 'skills', 'ui-max', 'references');
const VERSION = JSON.parse(await fs.readFile(path.join(ROOT, 'package.json'), 'utf8')).version;
const outDir = (target, kind) => path.join(os.tmpdir(), 'ui-max', kind, String(target).replace(/[^a-z0-9.-]+/gi, '_').slice(-60));

const str = (description) => ({ type: 'string', description });
const TOOLS = [
  {
    name: 'ui_route',
    description: 'Map a UI task description to the best-fitting use-case playbooks (agent chat, dashboard, data table, forms/settings, detail page, onboarding, landing, mobile, stylized/FUI). Call this first for any UI build or redesign.',
    inputSchema: { type: 'object', properties: { task: str('What is being built, in plain words') }, required: ['task'] },
    run: async ({ task }) => {
      const r = await route(task);
      if (!r.length) return `No playbook matched. Available: ${(await loadPlaybooks()).map((b) => b.id).join(', ')}. Pick the closest with ui_playbook.`;
      const { themesFor } = await import('./route.js');
      const th = await themesFor(r[0].id);
      return r.map((b, i) => `${i + 1}. ${b.id} — ${b.title} (surface: ${b.surface}; matched: ${b.hits.join(', ')})`).join('\n') +
        (th.length ? `\n\nTheme presets for ${r[0].id} (themes/presets, generate with omni themegen):\n` + th.map((t) => `- ${t.name} (${t.mode}): ${t.concept}`).join('\n') : '') +
        '\n\nNext: ui_playbook with the top id; its "Concepts & themes" section says which concept fits which job.';
    },
  },
  {
    name: 'ui_playbook',
    description: 'Get a use-case playbook: core tasks, states that must exist, effects budget, slop risks and Astryx component guidance.',
    inputSchema: { type: 'object', properties: { id: str('Playbook id from ui_route') }, required: ['id'] },
    run: async ({ id }) => (await playbook(id)).body,
  },
  {
    name: 'ui_themegen',
    description: 'Generate a theme (semantic color roles: surfaces, text, grounded ok/warn/danger/info/active/accent families) from OKLCH inputs, APCA-validated. Pass a preset name from themes/presets or a custom preset object. Returns CSS custom properties plus any failing contrast pairs.',
    inputSchema: { type: 'object', properties: { preset: str('Preset name (e.g. flight-deck-night, ledger, studio)'), custom: { type: 'object', description: 'Custom preset: { name, mode, contrast, base:{hue,chroma}, accent:{hue,chroma}, status:{ok,warn,danger,info,active} }' } } },
    run: async ({ preset, custom }) => {
      const { generate, toCSS } = await import('./theme-engine.js');
      const p = custom || JSON.parse(await fs.readFile(path.join(ROOT, 'themes', 'presets', `${String(preset).replace(/[^a-z0-9-]/gi, '')}.json`), 'utf8'));
      const t = generate(p);
      const f = t.report.fails;
      return `${f.length ? `${f.length} contrast pairs FAIL: ` + f.map((x) => `${x.fg} on ${x.bg} Lc ${x.lc}<${x.target}`).join('; ') : `All ${t.report.pairs} APCA pairs pass.`}\n\n${toCSS([t])}`;
    },
  },
  {
    name: 'ui_reference',
    description: 'Read a UI-MAX reference doc: taste, direction, craft, critique, state-matrix, motion, skeletons, ux-heuristics, stylized-themes, astryx, ethics, pro-max.',
    inputSchema: { type: 'object', properties: { name: str('Reference name without .md') }, required: ['name'] },
    run: async ({ name }) => fs.readFile(path.join(REF_DIR, `${String(name).replace(/[^a-z0-9-]/gi, '')}.md`), 'utf8'),
  },
  {
    name: 'ui_check',
    description: 'Render a page (URL or local HTML) at 1440 and 390, and grade it: Access, Originality (slop tells), States, Motion, Responsive, Craft (APCA, type, value budgets) → rank S–F + pass/fail gate. Writes screenshots incl. squint.png; LOOK at them before claiming quality. Logged to .omni/evidence.jsonl.',
    inputSchema: { type: 'object', properties: { target: str('URL or path to HTML'), out: str('Output dir (optional)'), states: str('Comma-separated ?state= values to screenshot, e.g. empty,error,loading') }, required: ['target'] },
    run: async ({ target, out, states }) => {
      const { check, renderStats } = await import('./check.js');
      const dir = path.resolve(out || outDir(target, 'check'));
      const r = await check(target, { out: dir, states: states ? states.split(',').map((s) => s.trim()).filter(Boolean) : [] });
      await evidence.append({ type: 'check', ...evidence.summarizeCheck(r), dir });
      return `${renderStats(r)}\nScreenshots in ${dir}: ${r.screenshots.join(', ')}`;
    },
  },
  {
    name: 'ui_fix_plan',
    description: 'Check a page and return an ordered fix plan: P0 blockers (a11y, overflow, errors), P1 why it reads as vibe coded (slop tells, missing states, motion), P2 craft, plus the use-case playbook must-haves. Use this to fix bad or vibe-coded UI.',
    inputSchema: { type: 'object', properties: { target: str('URL or path to HTML'), task: str('What the page is for (routes to a playbook)'), states: str('Comma-separated ?state= values to screenshot'), out: str('Output dir (optional)') }, required: ['target'] },
    run: async ({ target, task, out, states }) => {
      const { plan } = await import('./plan.js');
      const dir = path.resolve(out || outDir(target, 'plan'));
      await fs.mkdir(dir, { recursive: true });
      const r = await plan(target, { out: dir, task, states: states ? states.split(',').map((x) => x.trim()).filter(Boolean) : [] });
      await evidence.append({ type: 'check', ...evidence.summarizeCheck(r.result), dir });
      return `${r.markdown}\nScreenshots in ${dir}`;
    },
  },
  {
    name: 'ui_audit',
    description: 'Accessibility/UX audit only (contrast, names, labels, targets, focus, headings, CLS, reduced motion).',
    inputSchema: { type: 'object', properties: { target: str('URL or path to HTML') }, required: ['target'] },
    run: async ({ target }) => {
      const { audit } = await import('./audit.js');
      const r = await audit(target);
      return `Score ${r.score}/100\n` + r.issues.map((i) => `- ${i.severity} ${i.rule}: ${i.message}${i.sample ? ` [${i.sample.slice(0, 80)}]` : ''}`).join('\n');
    },
  },
  {
    name: 'ui_capture',
    description: 'Capture an existing UI: design DNA (colors, type, spacing, radii, shadows, motion, observed hover/focus states), tokens.json/tokens.css and screenshots. Use before redesigning something that exists.',
    inputSchema: { type: 'object', properties: { target: str('URL or path to HTML'), out: str('Output dir (optional)') }, required: ['target'] },
    run: async ({ target, out }) => {
      const { capture } = await import('./capture.js');
      const { buildTokens } = await import('./tokens.js');
      const dir = path.resolve(out || outDir(target, 'capture'));
      const dna = await capture(target, { out: dir, mobile: true });
      const { json, css } = buildTokens(dna);
      await fs.writeFile(path.join(dir, 'ui-dna.json'), JSON.stringify(dna, null, 2));
      await fs.writeFile(path.join(dir, 'tokens.json'), JSON.stringify(json, null, 2));
      await fs.writeFile(path.join(dir, 'tokens.css'), css);
      return `Captured to ${dir} (ui-dna.json, tokens.json, tokens.css, ${dna.screenshots.join(', ')}).\nColor roles: ${JSON.stringify(json.color)}\nFonts: ${json.font.family.body} / ${json.font.family.display}\nType sizes: ${Object.values(json.font.size).join(', ')}\nComponents: ${JSON.stringify(dna.components)}`;
    },
  },
  {
    name: 'ui_diff',
    description: 'Before/after comparison of two pages: stat deltas, slop tells removed/introduced, side-by-side compare.png.',
    inputSchema: { type: 'object', properties: { before: str('URL/path'), after: str('URL/path'), out: str('Output dir (optional)') }, required: ['before', 'after'] },
    run: async ({ before, after, out }) => {
      const { diff } = await import('./diff.js');
      const dir = path.resolve(out || outDir(after, 'diff'));
      const r = await diff(before, after, { out: dir });
      return `before ${r.before.overall} (${r.before.rank}) → after ${r.after.overall} (${r.after.rank})${r.regressions.length ? `\nregressions: ${r.regressions.join(', ')}` : ''}\n${dir}/DIFF.md, ${dir}/compare.png`;
    },
  },
  {
    name: 'ui_verdict',
    description: "Record the human's verdict on a result (keep/reject) with the specific property that decided it (type, color, spacing, ornament, motion, copy, layout, states, density). Rejections become taste rules. Only call with the user's actual verdict.",
    inputSchema: {
      type: 'object',
      properties: {
        target: str('What was judged'), verdict: { type: 'string', enum: ['keep', 'reject'] }, reason: str("The user's reason, in their words"),
        property: str('Deciding property'), checkDir: str('Dir of the ui_check run for this target (optional)'), playbook: str('Playbook id used (optional)'),
      },
      required: ['target', 'verdict', 'reason'],
    },
    run: async (a) => { const row = await evidence.verdict(a); return `Logged ${row.verdict} for ${row.target}. Add the rule to references/taste.md if it generalizes.`; },
  },
  {
    name: 'ui_evidence',
    description: 'Summarize the evidence log: recent checks and verdicts, whether the stat sheet agrees with the human (pass↔keep), and rejections by property.',
    inputSchema: { type: 'object', properties: {} },
    run: async () => {
      const rows = await evidence.read();
      const ag = await evidence.agreement();
      return `Entries: ${rows.length}. Verdicts: ${ag.verdicts}, gate agrees with human: ${ag.agree}${ag.rate != null ? ` (${ag.rate})` : ''}. Rejections by property: ${JSON.stringify(ag.rejectionsByProperty)}\n\nRecent:\n` +
        rows.slice(-15).map((r) => `- ${r.at.slice(0, 16)} ${r.type} ${r.target || ''} ${r.type === 'check' ? `${r.overall} ${r.rank} ${r.pass ? 'PASS' : 'FAIL'}` : `${r.verdict} [${r.property || '-'}] ${r.reason || ''}`}`).join('\n');
    },
  },
  {
    name: 'astryx',
    description: "Query Meta's Astryx design system CLI (React 19 + StyleX, 150+ components) with --json. Examples: [\"search\",\"table\"], [\"component\",\"Button\"], [\"docs\",\"tokens\"], [\"template\",\"--list\"], [\"build\"]. Uses the project's @astryxdesign/cli if installed, else npx.",
    inputSchema: { type: 'object', properties: { args: { type: 'array', items: { type: 'string' }, description: 'CLI arguments' }, cwd: str('Project dir (optional)') }, required: ['args'] },
    run: ({ args, cwd }) => runAstryx(args, cwd),
  },
];

function runAstryx(args, cwd = process.cwd()) {
  const safe = args.map(String).filter((a) => /^[\w@./:=,-]+$/.test(a));
  if (safe.length !== args.length) throw new Error('astryx args may only contain letters, digits and @./:=,-');
  if (['swizzle', 'init', 'upgrade', 'theme'].includes(safe[0]) && !safe.includes('--dry-run')) {
    // These write to the project; leave them to the agent's normal, user-approved shell.
    throw new Error(`"astryx ${safe[0]}" changes files — run it in the shell so the user can approve it.`);
  }
  return new Promise((resolve, reject) => {
    const p = spawn('npx', ['-y', '@astryxdesign/cli', ...safe, ...(safe.includes('--json') ? [] : ['--json'])], { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    const timer = setTimeout(() => { p.kill(); reject(new Error('astryx timed out after 120s')); }, 120000);
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', (d) => { err += d; });
    p.on('error', (e) => { clearTimeout(timer); reject(e); });
    p.on('close', (code) => { clearTimeout(timer); code === 0 ? resolve(out.slice(0, 60000)) : reject(new Error(`astryx exited ${code}: ${(err || out).slice(0, 2000)}`)); });
  });
}

// ---- JSON-RPC plumbing ----
const send = (msg) => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...msg }) + '\n');

async function handle(msg) {
  const { id, method, params = {} } = msg;
  if (id === undefined) return; // notification (e.g. notifications/initialized)
  try {
    if (method === 'initialize') {
      return send({ id, result: { protocolVersion: params.protocolVersion || '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'ui-max', version: VERSION },
        instructions: 'UI-MAX: route the task (ui_route), read the playbook (ui_playbook), build, then ui_check and look at the screenshots. Log the user\'s verdicts with ui_verdict.' } });
    }
    if (method === 'ping') return send({ id, result: {} });
    if (method === 'tools/list') return send({ id, result: { tools: TOOLS.map(({ run, ...t }) => t) } });
    if (method === 'tools/call') {
      const tool = TOOLS.find((t) => t.name === params.name);
      if (!tool) return send({ id, error: { code: -32602, message: `Unknown tool ${params.name}` } });
      try {
        const text = await tool.run(params.arguments || {});
        return send({ id, result: { content: [{ type: 'text', text: String(text) }] } });
      } catch (e) {
        return send({ id, result: { content: [{ type: 'text', text: `Error: ${e.message}` }], isError: true } });
      }
    }
    send({ id, error: { code: -32601, message: `Method not found: ${method}` } });
  } catch (e) {
    send({ id, error: { code: -32603, message: e.message } });
  }
}

let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buf += chunk;
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
    if (!line) continue;
    let msg; try { msg = JSON.parse(line); } catch { send({ id: null, error: { code: -32700, message: 'Parse error' } }); continue; }
    handle(msg);
  }
});
