import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { check } from './check.js';
import { withPage } from './browser.js';

/**
 * omni diff <before> <after> — prove an improvement.
 * Runs `check` on both, writes a side-by-side image and DIFF.md with stat deltas.
 */
export async function diff(a, b, { out, viewport } = {}) {
  await fs.mkdir(out, { recursive: true });
  const A = await check(a, { out: path.join(out, 'before'), viewport, label: `before: ${a}` });
  const B = await check(b, { out: path.join(out, 'after'), viewport, label: `after: ${b}` });

  // Side-by-side composite, rendered by the browser so we need no image library.
  const html = path.join(out, 'compare.html');
  const img = (side, f) => pathToFileURL(path.join(out, side, f)).href;
  await fs.writeFile(html, `<!doctype html><meta charset=utf-8><style>
    body{margin:0;background:#16181b;color:#d9dde2;font:14px/1.4 ui-monospace,monospace}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px}
    figure{margin:0}figcaption{padding:0 0 8px}img{width:100%;display:block;border:1px solid #33373d}
    .m{grid-template-columns:repeat(2,390px);justify-content:center}
  </style>
  <div class=row><figure><figcaption>BEFORE · ${A.overall} ${A.rank}</figcaption><img src="${img('before', 'desktop-fold.png')}"></figure>
  <figure><figcaption>AFTER · ${B.overall} ${B.rank}</figcaption><img src="${img('after', 'desktop-fold.png')}"></figure></div>
  <div class="row m"><img src="${img('before', 'mobile-full.png')}"><img src="${img('after', 'mobile-full.png')}"></div>`);
  await withPage(html, { viewport: '1600x900' }, async (page) => {
    await page.screenshot({ path: path.join(out, 'compare.png'), fullPage: true });
  });

  const L = ['# omni diff', '', `before: \`${a}\`  →  after: \`${b}\``, '', '| stat | before | after | Δ |', '|---|---:|---:|---:|'];
  for (const k of Object.keys(A.stats)) {
    const d = B.stats[k] - A.stats[k];
    L.push(`| ${k} | ${A.stats[k]} | ${B.stats[k]} | ${d > 0 ? '+' : ''}${d} |`);
  }
  const d = B.overall - A.overall;
  L.push(`| **overall** | **${A.overall} ${A.rank}** | **${B.overall} ${B.rank}** | **${d > 0 ? '+' : ''}${d}** |`, '');
  L.push(`Gate: ${A.pass ? 'PASS' : 'FAIL'} → ${B.pass ? 'PASS' : 'FAIL'}`, '');
  const ta = new Set(A.slop.tells.map((t) => t.name)), tb = new Set(B.slop.tells.map((t) => t.name));
  const fixed = [...ta].filter((t) => !tb.has(t)), added = [...tb].filter((t) => !ta.has(t));
  if (fixed.length) L.push(`Slop tells removed: ${fixed.join(', ')}`);
  if (added.length) L.push(`Slop tells **introduced**: ${added.join(', ')}`);
  const ia = A.a11y.issues.length, ib = B.a11y.issues.length;
  L.push(`A11y issues: ${ia} → ${ib}`, '', '![compare](compare.png)', '');
  const regressions = Object.keys(A.stats).filter((k) => B.stats[k] < A.stats[k] - 2);
  if (regressions.length) L.push(`**Regressions:** ${regressions.join(', ')}. An "improvement" that regresses a stat needs a reason.`);
  await fs.writeFile(path.join(out, 'DIFF.md'), L.join('\n') + '\n');
  return { before: A, after: B, regressions };
}
