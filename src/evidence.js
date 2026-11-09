// Evidence log: every check result and every human verdict, append-only.
// This is how the tool "learns" without retraining: rejections with a named
// property become rules/examples, and we can measure whether the stat sheet
// predicts the owner's eye.
import fs from 'node:fs/promises';
import path from 'node:path';

export const evidencePath = (root = process.cwd()) => path.join(root, '.omni', 'evidence.jsonl');

export async function append(entry, root) {
  const file = evidencePath(root);
  await fs.mkdir(path.dirname(file), { recursive: true });
  const row = { at: new Date().toISOString(), ...entry };
  await fs.appendFile(file, JSON.stringify(row) + '\n');
  return row;
}

export async function read(root) {
  try {
    return (await fs.readFile(evidencePath(root), 'utf8')).split('\n').filter(Boolean).map((l) => JSON.parse(l));
  } catch { return []; }
}

/** Compact summary of a check.json for the log. */
export function summarizeCheck(r) {
  return { target: r.target, label: r.label, overall: r.overall, rank: r.rank, pass: r.pass, stats: r.stats, tells: (r.slop?.tells || []).map((t) => t.id) };
}

/** Record a human verdict. property = what specifically made it good/bad (type, color, spacing, ornament, motion, copy, layout, states…). */
export async function verdict({ target, verdict, reason, property, checkDir, playbook }, root) {
  if (!['keep', 'reject'].includes(verdict)) throw new Error('verdict must be "keep" or "reject"');
  let check = null;
  if (checkDir) { try { check = summarizeCheck(JSON.parse(await fs.readFile(path.join(checkDir, 'check.json'), 'utf8'))); } catch { /* no check.json */ } }
  return append({ type: 'verdict', target, verdict, reason, property, playbook, check }, root);
}

/** Does the stat sheet agree with the human? (pass ↔ keep) */
export async function agreement(root) {
  const v = (await read(root)).filter((e) => e.type === 'verdict' && e.check);
  const agree = v.filter((e) => (e.verdict === 'keep') === !!e.check.pass).length;
  const byProperty = {};
  for (const e of v.filter((x) => x.verdict === 'reject')) byProperty[e.property || 'unspecified'] = (byProperty[e.property || 'unspecified'] || 0) + 1;
  return { verdicts: v.length, agree, rate: v.length ? +(agree / v.length).toFixed(2) : null, rejectionsByProperty: byProperty };
}
