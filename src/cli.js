import fs from 'node:fs/promises';
import path from 'node:path';
import { capture } from './capture.js';
import { audit } from './audit.js';
import { buildTokens } from './tokens.js';
import { scaffold } from './scaffold.js';
import { renderReport } from './report.js';
import { check } from './check.js';
import { diff } from './diff.js';
import { fileURLToPath } from 'node:url';

const THEMES_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'themes');

const HELP = `
super UI UX OMNI Pro Max Ultra Supreme  —  omni

USAGE
  omni capture  <url|file.html> [--out dir] [--viewport 1440x900] [--mobile]
      Load the page, extract its design DNA (colors, type, spacing, radii,
      shadows, motion), take screenshots, and write ui-dna.json.

  omni audit    <url|file.html> [--out dir]
      UX + accessibility audit: contrast, tap targets, focus visibility,
      missing labels/alt, reduced-motion support, layout shift, heading order.

  omni tokens   <dir>
      Turn ui-dna.json into tokens.json + tokens.css (normalized scales).

  omni scaffold <dir> [--framework css|react|tailwind]
      Generate the "beyond pretty" layer from tokens: skeleton loaders,
      enter/exit transitions, state styles (hover/focus/active/disabled/
      loading/empty/error/success) and prefers-reduced-motion fallbacks.

  omni theme    <name> [--out dir]
      Copy a stylized-but-usable theme pack into your project.
      Available: cyberpunk  (run "omni theme list")

  omni full     <url|file.html> [--out dir] [--framework ...]
      capture → audit → tokens → scaffold → REPORT.md, all in one.

  omni check    <url|file.html> [--out dir] [--json] [--states empty,error,loading]
      The UI stat sheet: Access, Originality (slop tells), States, Motion,
      Responsive, Craft → overall rank S–F and a pass/fail gate. Writes
      STATS.md, check.json and screenshots at 1440 and 390. Exit 1 on FAIL.
      --states screenshots <target>?state=<name> for each, desktop + mobile.

  omni route    "<what you're building>"
      Pick the use-case playbook(s) for a task (agent chat, dashboard, table…).

  omni playbook <id>
      Print a use-case playbook.

  omni plan     <url|file.html> [--task "<what it is>"] [--out dir]
      Check the page and write FIXPLAN.md: P0 blockers, P1 vibe-coded tells and
      missing states, P2 craft — plus the use-case playbook's must-haves.

  omni verdict  <target> keep|reject "<reason>" [--property type|color|spacing|ornament|motion|copy|layout|states] [--check dir] [--playbook id]
      Log a human verdict to .omni/evidence.jsonl (how the toolkit learns your taste).

  omni evidence
      Summarize the evidence log and whether the stat sheet agrees with your verdicts.

  omni setup    [--client claude-code|cursor|claude-desktop|all] [--write]
      Register the UI-MAX MCP server and link the skill. Dry run unless --write.

  omni mcp
      Run the MCP server on stdio (what agent clients launch).

  omni diff     <before> <after> [--out dir]
      Check both, write DIFF.md (stat deltas, tells removed/introduced,
      regressions) and compare.png side by side.

OPTIONS
  --out <dir>        Output directory (default: ./omni-out/<host>)
  --viewport WxH     Desktop viewport (default 1440x900)
  --mobile           Also capture at 390x844
  --framework        css (default) | react | tailwind

Respect site terms. Capture for study, audits and your own products —
not for passing off someone else's brand as yours.
`;

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { args[key] = next; i++; }
      else args[key] = true;
    } else args._.push(a);
  }
  return args;
}

function defaultOut(target) {
  let name = 'page';
  try { name = new URL(target).host || name; } catch { name = path.basename(target, path.extname(target)); }
  return path.resolve('omni-out', name.replace(/[^a-z0-9.-]/gi, '_'));
}

async function readJSON(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function writeJSON(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

export async function run(argv) {
  const args = parseArgs(argv);
  const [cmd, target] = args._;
  if (!cmd || cmd === 'help' || args.help) { console.log(HELP); return; }

  const needTarget = () => { if (!target) throw new Error(`"${cmd}" needs a target. Run "omni help".`); };

  switch (cmd) {
    case 'capture': {
      needTarget();
      const out = path.resolve(args.out || defaultOut(target));
      const dna = await capture(target, { out, viewport: args.viewport, mobile: !!args.mobile });
      await writeJSON(path.join(out, 'ui-dna.json'), dna);
      console.log(`✔ captured → ${out}/ui-dna.json`);
      return;
    }
    case 'audit': {
      needTarget();
      const out = path.resolve(args.out || defaultOut(target));
      const result = await audit(target, { viewport: args.viewport });
      await writeJSON(path.join(out, 'audit.json'), result);
      console.log(`✔ audit score ${result.score}/100, ${result.issues.length} issues → ${out}/audit.json`);
      return;
    }
    case 'tokens': {
      needTarget();
      const dir = path.resolve(target);
      const { json, css } = buildTokens(await readJSON(path.join(dir, 'ui-dna.json')));
      await writeJSON(path.join(dir, 'tokens.json'), json);
      await fs.writeFile(path.join(dir, 'tokens.css'), css);
      console.log(`✔ tokens → ${dir}/tokens.json, tokens.css`);
      return;
    }
    case 'scaffold': {
      needTarget();
      const dir = path.resolve(target);
      const tokens = await readJSON(path.join(dir, 'tokens.json'));
      const files = scaffold(tokens, { framework: args.framework || 'css' });
      for (const [rel, content] of Object.entries(files)) {
        const p = path.join(dir, 'scaffold', rel);
        await fs.mkdir(path.dirname(p), { recursive: true });
        await fs.writeFile(p, content);
      }
      console.log(`✔ scaffold (${Object.keys(files).length} files) → ${dir}/scaffold/`);
      return;
    }
    case 'full': {
      needTarget();
      const out = path.resolve(args.out || defaultOut(target));
      console.log('① capture…');
      const dna = await capture(target, { out, viewport: args.viewport, mobile: !!args.mobile });
      await writeJSON(path.join(out, 'ui-dna.json'), dna);
      console.log('② audit…');
      const result = await audit(target, { viewport: args.viewport });
      await writeJSON(path.join(out, 'audit.json'), result);
      console.log('③ tokens…');
      const { json, css } = buildTokens(dna);
      await writeJSON(path.join(out, 'tokens.json'), json);
      await fs.writeFile(path.join(out, 'tokens.css'), css);
      console.log('④ scaffold…');
      const files = scaffold(json, { framework: args.framework || 'css' });
      for (const [rel, content] of Object.entries(files)) {
        const p = path.join(out, 'scaffold', rel);
        await fs.mkdir(path.dirname(p), { recursive: true });
        await fs.writeFile(p, content);
      }
      await fs.writeFile(path.join(out, 'REPORT.md'), renderReport({ dna, audit: result, tokens: json, files: Object.keys(files) }));
      console.log(`✔ done → ${out}/REPORT.md  (audit ${result.score}/100)`);
      return;
    }
    case 'check': {
      needTarget();
      const out = path.resolve(args.out || defaultOut(target));
      const r = await check(target, { out, viewport: args.viewport, states: typeof args.states === 'string' ? args.states.split(',').map((s) => s.trim()).filter(Boolean) : [] });
      if (args.json) console.log(JSON.stringify({ overall: r.overall, rank: r.rank, pass: r.pass, stats: r.stats, tells: r.slop.tells.map((t) => t.name), gate: r.gate }, null, 2));
      else {
        console.log(`${r.pass ? '✔ PASS' : '✘ FAIL'}  overall ${r.overall} (${r.rank})  ` + Object.entries(r.stats).map(([k, v]) => `${k} ${v}`).join(' · '));
        for (const g of r.gate.filter((g) => !g.ok)) console.log(`  ✘ ${g.name}`);
        for (const t of r.slop.tells) console.log(`  tell ${t.id}: ${t.name}`);
        console.log(`  → ${out}/STATS.md`);
      }
      if (!r.pass) process.exitCode = 1;
      return;
    }
    case 'diff': {
      const [, a, b] = args._;
      if (!a || !b) throw new Error('"diff" needs <before> <after>.');
      const out = path.resolve(args.out || path.join('omni-out', 'diff'));
      const r = await diff(a, b, { out, viewport: args.viewport });
      console.log(`before ${r.before.overall} (${r.before.rank}) → after ${r.after.overall} (${r.after.rank})${r.regressions.length ? `  regressions: ${r.regressions.join(', ')}` : ''}\n  → ${out}/DIFF.md`);
      return;
    }
    case 'plan': {
      needTarget();
      const { plan } = await import('./plan.js');
      const out = path.resolve(args.out || defaultOut(target));
      const r = await plan(target, { out, task: typeof args.task === 'string' ? args.task : undefined, states: typeof args.states === 'string' ? args.states.split(',').map((x) => x.trim()).filter(Boolean) : [] });
      const n = (p) => r.plan.items.filter((i) => i.p === p).length;
      console.log(`${r.result.pass ? '✔ PASS' : '✘ FAIL'}  ${r.result.overall} (${r.result.rank})  fixes: P0 ${n('P0')} · P1 ${n('P1')} · P2 ${n('P2')}\n  → ${out}/FIXPLAN.md`);
      return;
    }
    case 'route': {
      const { route } = await import('./route.js');
      const task = args._.slice(1).join(' ');
      if (!task) throw new Error('"route" needs a task description.');
      const r = await route(task);
      if (!r.length) { console.log('No playbook matched. See: omni playbook list'); return; }
      for (const b of r) console.log(`${b.id.padEnd(20)} ${b.title}  [${b.surface}]  matched: ${b.hits.join(', ')}`);
      return;
    }
    case 'playbook': {
      const { playbook, loadPlaybooks } = await import('./route.js');
      if (!target || target === 'list') { for (const b of await loadPlaybooks()) console.log(`${b.id.padEnd(20)} ${b.title}`); return; }
      console.log((await playbook(target)).body);
      return;
    }
    case 'verdict': {
      const ev = await import('./evidence.js');
      const [, t, v, ...reason] = args._;
      if (!t || !v) throw new Error('usage: omni verdict <target> keep|reject "<reason>" [--property p] [--check dir]');
      const row = await ev.verdict({ target: t, verdict: v, reason: reason.join(' '), property: args.property, checkDir: args.check, playbook: args.playbook });
      console.log(`✔ logged ${row.verdict} → ${ev.evidencePath()}`);
      return;
    }
    case 'evidence': {
      const ev = await import('./evidence.js');
      const rows = await ev.read(); const ag = await ev.agreement();
      console.log(`${rows.length} entries · ${ag.verdicts} verdicts · stat-sheet agrees with you ${ag.agree}/${ag.verdicts}${ag.rate != null ? ` (${ag.rate})` : ''}`);
      if (Object.keys(ag.rejectionsByProperty).length) console.log('rejections by property:', ag.rejectionsByProperty);
      return;
    }
    case 'setup': {
      const { setup } = await import('./setup.js');
      console.log(await setup({ client: args.client || 'all', write: !!args.write }));
      return;
    }
    case 'mcp': {
      await import('./mcp.js');
      await new Promise(() => {}); // serve until stdin closes
      return;
    }
    case 'theme': {
      const names = (await fs.readdir(THEMES_DIR, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
      if (!target || target === 'list') { console.log(`Themes: ${names.join(', ')}`); return; }
      if (!names.includes(target)) throw new Error(`No theme "${target}". Available: ${names.join(', ')}`);
      const out = path.resolve(args.out || path.join('omni-theme', target));
      await fs.cp(path.join(THEMES_DIR, target), out, { recursive: true });
      console.log(`✔ ${target} theme → ${out}\n  open ${path.join(out, 'demo.html')} through a local server (ES modules) to see it live.`);
      return;
    }
    default:
      throw new Error(`Unknown command "${cmd}". Run "omni help".`);
  }
}
