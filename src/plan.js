// omni plan — turn a check result into an ordered fix plan.
// P0: things that block use or the gate. P1: composition (what makes it read as
// "vibe coded"). P2: polish. Each item says what to change and how to verify it.
import fs from 'node:fs/promises';
import path from 'node:path';
import { check } from './check.js';
import { route, playbook } from './route.js';

const COMPOSITIONAL = new Set([3, 8, 10]);
const STATE_FIX = {
  hover: 'Add :hover styles to every control (pointer devices only: @media (hover:hover)).',
  focusVisible: 'Add :focus-visible rings (2px outline, offset 2px, 3:1 contrast) to every focusable element.',
  active: 'Add :active / pressed feedback (≤80ms).',
  disabled: 'Style :disabled / [aria-disabled] distinctly from enabled (and explain why where useful).',
  loading: 'Add loading UI: skeletons that match the final layout (aria-busy), button busy state that blocks double submit.',
  empty: 'Design the empty state: why it is empty + the one next action.',
  error: 'Design error states: plain cause + retry, keep user input, role="alert".',
  success: 'Confirm success (inline ✓ / status text with role="status"), then return to idle.',
};

export function buildPlan(r, book) {
  const items = [];
  const add = (p, area, what, verify) => items.push({ p, area, what, verify });

  // P0 — accessibility blockers and gate items
  for (const i of r.a11y.issues.filter((x) => x.severity === 'critical' || x.severity === 'serious')) {
    add('P0', `a11y:${i.rule}`, `${i.message}${i.sample ? ` — ${i.sample.slice(0, 70)}` : ''}`, 'omni audit shows no critical/serious');
  }
  if (r.layout.mobile.overflowPx > 1) add('P0', 'responsive', `Horizontal scroll at 390px (${r.layout.mobile.overflowPx}px). Offenders: ${r.layout.mobile.offenders.join(', ') || 'see mobile-full.png'}`, 'mobile-full.png has no sideways scroll');
  if (r.consoleErrors.length) add('P0', 'runtime', `Console errors: ${r.consoleErrors.slice(0, 3).join(' | ')}`, 'no console errors');

  // P1 — composition: the tells that make it read as generated
  for (const t of r.slop.tells.filter((t) => COMPOSITIONAL.has(t.id))) add('P1', `slop:${t.name}`, `${t.fix} Evidence: ${t.evidence.slice(0, 2).join('; ')}`, 'tell no longer fires');
  const missing = Object.entries(r.sheet.states).filter(([, ok]) => !ok).map(([k]) => k);
  for (const s of missing) add('P1', `state:${s}`, STATE_FIX[s] || `Add the ${s} state.`, `check shows ${s} ✔; force it with ?state= and screenshot`);
  for (const t of r.slop.tells.filter((t) => !COMPOSITIONAL.has(t.id))) add('P1', `slop:${t.name}`, `${t.fix} Evidence: ${t.evidence.slice(0, 2).join('; ')}`, 'tell no longer fires');
  if (r.motion.infiniteLoops.length > 1) add('P1', 'motion', `${r.motion.infiniteLoops.length} infinite animations (${r.motion.infiniteLoops.slice(0, 3).join(', ')}). Keep at most one, and only while something is actually working.`, 'one or zero loops');
  if (r.motion.durations.count && !r.sheet.reducedMotion) add('P1', 'motion', 'Animates but ignores prefers-reduced-motion. Add a reduce block that removes movement (keep opacity/color feedback).', 'check shows reduced motion: yes');

  // P1 — expression (what "not good enough to flex" measurably lacks)
  for (const n of r.expression?.notes || []) add('P1', 'expression', `${n}. Give color a job (zones, states, controls) and make regions visible — see taste.md 2026-11-09.`, 'expression ≥ 70');

  // P2 — craft and polish
  for (const n of r.craft?.notes || []) add('P2', 'craft', n, 'craft note gone');
  for (const a of (r.craft?.apcaSamples || []).slice(0, 3)) add('P2', 'contrast', `Lc ${a.lc} < ${a.need}: ${a.sample}. Raise the text token (muted/secondary) rather than per element.`, 'APCA fails drop');
  if (r.sheet.heavyTransitionCount) add('P2', 'motion', `Layout/paint-heavy transitions: ${r.sheet.heavyTransitions.slice(0, 3).join(', ')}. Animate transform/opacity only; never transition: all.`, 'no heavy transitions');
  if (!r.sheet.forcedColors) add('P2', 'a11y', 'No forced-colors handling: make sure focus uses outline (not only box-shadow) and borders stay visible in High Contrast.', 'test with DevTools → Rendering → forced-colors');
  const s = r.slop.system;
  if (s.fontSizes > 9) add('P2', 'type', `${s.fontSizes} font sizes in use. Collapse to a scale of ~6–8.`, 'fontSizes ≤ 9');
  if (s.numericNodes >= 4 && s.tabularNumericNodes === 0) add('P2', 'type', 'Numbers without tabular-nums: add font-variant-numeric: tabular-nums to data.', 'tabular numerals on numeric nodes');

  // Playbook must-haves the checker can't see
  const playbookItems = book ? (book.body.match(/\*\*Must exist\*\*([\s\S]*?)(\n\*\*|$)/)?.[1] || '').split('\n').map((l) => l.replace(/^-\s*/, '').trim()).filter(Boolean) : [];
  return { items, playbookItems };
}

export function renderPlan(r, plan, book, routeHits) {
  const L = [`# Fix plan — ${r.label}`, '', `Now: **${r.overall} ${r.rank}**, gate **${r.pass ? 'PASS' : 'FAIL'}**, ${r.slop.tells.length} slop tells, a11y ${r.a11y.score}/100.`, ''];
  if (book) L.push(`Use case: **${book.title}** (playbook \`${book.id}\`${routeHits ? `, matched: ${routeHits.join(', ')}` : ''}).`, '');
  L.push('Work top to bottom. After each block, re-run `omni check` and look at the screenshots.', '');
  for (const p of ['P0', 'P1', 'P2']) {
    const xs = plan.items.filter((i) => i.p === p);
    if (!xs.length) continue;
    L.push(`## ${p} ${p === 'P0' ? '— blocks use / fails the gate' : p === 'P1' ? '— why it reads as vibe coded' : '— craft and polish'}`, '');
    xs.forEach((i, n) => L.push(`${n + 1}. **${i.area}** — ${i.what}  \n   _verify: ${i.verify}_`));
    L.push('');
  }
  if (plan.playbookItems.length) {
    L.push('## Use-case must-haves (not machine-checkable — confirm by hand)', '');
    for (const x of plan.playbookItems) L.push(`- [ ] ${x}`);
    L.push('');
  }
  L.push('## Before rebuilding', '', '- If more than two P1 slop tells fire, patching won\'t fix it: write DIRECTION.md (concept, 3–5 non-web references, ornament budget) and recompose. See `skills/ui-max/references/direction.md`.', '- Keep what works: real content, working logic, any states that already exist.', '- Prove it: `omni diff before after` must show no regressions.', '');
  return L.join('\n');
}

export async function plan(target, { out, task, states } = {}) {
  const r = await check(target, { out, states });
  let book = null, hits = null;
  if (task) {
    const routed = await route(task);
    if (routed[0]) { book = await playbook(routed[0].id); hits = routed[0].hits; }
  }
  const p = buildPlan(r, book);
  const md = renderPlan(r, p, book, hits);
  await fs.writeFile(path.join(out, 'FIXPLAN.md'), md);
  return { result: r, plan: p, markdown: md };
}
