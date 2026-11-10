// omni specimen — the theme visual test.
// Renders one component sheet (every component × state) using ONLY theme roles,
// once per theme, screenshots each, audits each, and stitches a comparison grid.
// Anything a theme doesn't define shows up as a visible gap (e.g. a role that
// falls back to the "MISSING" magenta).
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { withPage } from './browser.js';
import { audit } from './audit.js';
import { craftProbe } from './craft.js';

// Roles the sheet reads. A theme that lacks one renders it as loud magenta stripes.
export const REQUIRED_ROLES = [
  'surface-inset', 'surface-0', 'surface-1', 'surface-2', 'surface-3', 'border-1', 'border-2', 'border-strong',
  'text-1', 'text-2', 'text-3', 'focus',
  ...['ok', 'warn', 'danger', 'info', 'active', 'accent'].flatMap((f) => ['fg', 'bg', 'border', 'solid', 'on-solid'].map((x) => `${f}-${x}`)),
  // beyond color (round 4): state layers, data viz, shape, type, motion, elevation
  'state-hover', 'state-pressed', 'state-selected', 'state-disabled-opacity',
  'viz-1', 'viz-2', 'viz-3', 'viz-4', 'viz-5', 'viz-6',
  'radius-sm', 'radius-md', 'radius-lg', 'shadow-1', 'shadow-2', 'shadow-3',
  'font-sans', 'font-mono', 'duration-fast', 'duration-base', 'ease-standard',
];

const R = (name) => `var(--${name}, var(--missing))`;

export function specimenHTML(themeCssHref) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Theme specimen</title>
<link rel="stylesheet" href="${themeCssHref}">
<style>
  /* Missing roles show as hazard stripes so gaps are impossible to miss. */
  :root { --missing: repeating-linear-gradient(45deg, #ff00c8 0 6px, #000 6px 12px); }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; background: var(--surface-0, #f0f); color: var(--text-1, #f0f); font: 14px/1.5 var(--font-sans, system-ui); }
  h1 { font-size: 18px; margin: 0 0 4px; } h2 { font-size: 13px; margin: 0 0 10px; color: var(--text-2); font-weight: 600; }
  .meta { color: var(--text-2); margin: 0 0 20px; font: 12px var(--font-mono, monospace); }
  .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
  .card { background: var(--surface-1); border: 1px solid var(--border-1); border-radius: var(--radius-lg, 0); padding: 14px; box-shadow: var(--shadow-1, none); }
  .row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 8px; }
  .lbl { width: 64px; color: var(--text-2); font-size: 12px; }
  /* buttons, with forced states (.is-*) so a static screenshot shows them */
  .btn { min-height: 32px; padding: 0 12px; border-radius: var(--radius-md, 0); border: 1px solid var(--border-2); background: var(--surface-2); color: var(--text-1); font: inherit; font-weight: 500; position: relative; }
  .btn::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: transparent; }
  .btn.is-hover::after { background: ${R('state-hover')}; } .btn.is-pressed::after { background: ${R('state-pressed')}; }
  .btn.is-focus { outline: 2px solid var(--focus); outline-offset: 2px; }
  .btn.is-disabled { opacity: var(--state-disabled-opacity, .4); }
  .btn.primary { background: var(--accent-solid); color: var(--accent-on-solid); border-color: var(--accent-solid); }
  .btn.danger { background: var(--danger-solid); color: var(--danger-on-solid); border-color: var(--danger-solid); }
  .btn.ghost { background: transparent; border-color: transparent; }
  /* inputs */
  .in { width: 100%; min-height: 32px; padding: 6px 10px; background: var(--surface-inset); color: var(--text-1); border: 1px solid var(--border-2); border-radius: var(--radius-sm, 0); font: inherit; }
  .in::placeholder { color: var(--text-3); } .in.is-focus { outline: 2px solid var(--focus); outline-offset: 0; }
  .in.is-invalid { border-color: var(--danger-solid); background: var(--danger-bg); } .in:disabled { opacity: var(--state-disabled-opacity, .4); }
  .help { font-size: 12px; color: var(--text-2); } .err { font-size: 12px; color: var(--danger-fg); }
  /* status families, grounded */
  .alert { display: flex; gap: 8px; padding: 8px 10px; border: 1px solid; border-radius: var(--radius-sm, 0); margin-bottom: 6px; }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 999px; font-size: 12px; font-weight: 600; border: 1px solid; }
  .tag { padding: 2px 8px; border-radius: var(--radius-sm, 0); font-size: 12px; font-weight: 600; }
  ${['ok', 'warn', 'danger', 'info', 'active', 'accent'].map((f) => `.alert.${f}, .badge.${f} { background: var(--${f}-bg); border-color: var(--${f}-border); color: var(--text-1); } .alert.${f} b, .badge.${f} { color: var(--${f}-fg); } .tag.${f} { background: var(--${f}-solid); color: var(--${f}-on-solid); }`).join('\n  ')}
  /* table */
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; color: var(--text-2); font-weight: 600; border-bottom: 1px solid var(--border-2); padding: 6px; }
  td { padding: 6px; border-bottom: 1px solid var(--border-1); } td.num { text-align: right; font-family: var(--font-mono, monospace); font-variant-numeric: tabular-nums; }
  tr.is-hover td { background: ${R('state-hover')}; } tr.is-selected td { background: ${R('state-selected')}; }
  /* tabs, toggles */
  .tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--border-1); margin-bottom: 10px; }
  .tab { padding: 6px 10px; color: var(--text-2); border-bottom: 2px solid transparent; } .tab.on { color: var(--text-1); border-color: var(--accent-solid); } .tab.is-hover { background: ${R('state-hover')}; }
  .sw { width: 34px; height: 20px; border-radius: 999px; background: var(--border-2); position: relative; display: inline-block; vertical-align: middle; }
  .sw::after { content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: var(--surface-3); box-shadow: var(--shadow-1, none); }
  .sw.on { background: var(--accent-solid); } .sw.on::after { left: 16px; }
  .box { width: 16px; height: 16px; border: 1.5px solid var(--border-strong); border-radius: 3px; display: inline-grid; place-items: center; vertical-align: middle; font-size: 11px; }
  .box.on { background: var(--accent-solid); border-color: var(--accent-solid); color: var(--accent-on-solid); }
  /* elevation */
  .elev { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .elev div { height: 48px; border-radius: var(--radius-md, 0); display: grid; place-items: center; font-size: 12px; color: var(--text-2); border: 1px solid var(--border-1); }
  .e0 { background: var(--surface-inset); } .e1 { background: var(--surface-1); box-shadow: ${R('shadow-1')}; } .e2 { background: var(--surface-2); box-shadow: ${R('shadow-2')}; } .e3 { background: var(--surface-3); box-shadow: ${R('shadow-3')}; }
  /* data viz */
  .bars { display: flex; align-items: end; gap: 6px; height: 90px; padding-top: 6px; }
  .bars i { flex: 1; border-radius: 2px 2px 0 0; }
  ${[1, 2, 3, 4, 5, 6].map((n) => `.v${n} { background: ${R(`viz-${n}`)}; }`).join(' ')}
  .legend { display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; color: var(--text-2); margin-top: 6px; } .legend span::before { content: ""; display: inline-block; width: 10px; height: 10px; margin-right: 4px; vertical-align: -1px; background: var(--c); }
  /* code, toast, skeleton */
  pre { margin: 0; padding: 10px; background: var(--surface-inset); border: 1px solid var(--border-1); border-radius: var(--radius-sm, 0); font: 12px/1.6 var(--font-mono, monospace); overflow: auto; }
  .k { color: var(--active-fg); } .s { color: var(--ok-fg); } .c { color: var(--text-3); } .n { color: var(--warn-fg); }
  .toast { display: flex; justify-content: space-between; gap: 10px; padding: 10px 12px; background: var(--surface-3); border: 1px solid var(--border-2); border-radius: var(--radius-md, 0); box-shadow: ${R('shadow-3')}; }
  .sk { height: 10px; border-radius: 2px; background: var(--surface-2); margin: 6px 0; }
  a { color: var(--info-fg); } ::selection { background: var(--accent-bg); }
  .motion { font: 12px var(--font-mono, monospace); color: var(--text-2); }
</style>
</head>
<body>
<h1>Theme specimen</h1>
<p class="meta" id="meta"></p>
<div class="grid">
  <section class="card"><h2>Buttons × states</h2>
    ${['', 'primary', 'danger', 'ghost'].map((v) => `<div class="row"><span class="lbl">${v || 'default'}</span>${['', 'is-hover', 'is-pressed', 'is-focus', 'is-disabled'].map((s) => `<button class="btn ${v} ${s}" type="button">${s ? s.slice(3) : 'rest'}</button>`).join('')}</div>`).join('')}
  </section>
  <section class="card"><h2>Inputs × states</h2>
    <div class="row"><input class="in" placeholder="Placeholder text" aria-label="empty"></div>
    <div class="row"><input class="in is-focus" value="Focused value" aria-label="focused"></div>
    <div class="row"><input class="in is-invalid" value="not-an-email" aria-label="invalid"><span class="err">Enter a valid email.</span></div>
    <div class="row"><input class="in" value="Disabled" disabled aria-label="disabled"><span class="help">Help text explains the field.</span></div>
    <div class="row"><span class="sw on"></span> On <span class="sw"></span> Off <span class="box on">✓</span> Checked <span class="box"></span> Unchecked</div>
  </section>
  <section class="card"><h2>Status families (grounded)</h2>
    ${['ok', 'warn', 'danger', 'info', 'active', 'accent'].map((f) => `<div class="alert ${f}"><b>${f}</b><span>Body text on the ${f} ground stays readable.</span></div>`).join('')}
    <div class="row">${['ok', 'warn', 'danger', 'info', 'active', 'accent'].map((f) => `<span class="badge ${f}">${f}</span>`).join('')}</div>
    <div class="row">${['ok', 'warn', 'danger', 'info', 'active', 'accent'].map((f) => `<span class="tag ${f}">${f.toUpperCase()}</span>`).join('')}</div>
  </section>
  <section class="card"><h2>Table · hover · selected</h2>
    <div class="tabs"><span class="tab on">Sessions</span><span class="tab is-hover">Agents</span><span class="tab">Cron</span></div>
    <table><thead><tr><th>Session</th><th>Status</th><th class="num">Tokens</th></tr></thead><tbody>
      <tr><td>Fix failing auth test</td><td><span class="badge accent">needs you</span></td><td class="num">18,412</td></tr>
      <tr class="is-hover"><td>Nightly report digest</td><td><span class="badge ok">done</span></td><td class="num">4,090</td></tr>
      <tr class="is-selected"><td>GPU node health</td><td><span class="badge danger">failed</span></td><td class="num">912</td></tr>
      <tr><td>Refactor middleware</td><td><span class="badge active">running</span></td><td class="num">31,007</td></tr>
    </tbody></table>
  </section>
  <section class="card"><h2>Data viz (categorical 1–6)</h2>
    <div class="bars"><i class="v1" style="height:80%"></i><i class="v2" style="height:55%"></i><i class="v3" style="height:95%"></i><i class="v4" style="height:40%"></i><i class="v5" style="height:70%"></i><i class="v6" style="height:30%"></i></div>
    <div class="legend">${[1, 2, 3, 4, 5, 6].map((n) => `<span style="--c:var(--viz-${n}, var(--missing))">series ${n}</span>`).join('')}</div>
  </section>
  <section class="card"><h2>Elevation · shape</h2>
    <div class="elev"><div class="e0">inset</div><div class="e1">1</div><div class="e2">2</div><div class="e3">3</div></div>
    <p class="motion" id="motion"></p>
  </section>
  <section class="card"><h2>Code · links · selection</h2>
<pre><span class="k">await</span> cache.set(KEY, fresh); <span class="c">// retry reads new token</span>
<span class="k">const</span> msg = <span class="s">"47 passed"</span>; <span class="k">let</span> n = <span class="n">47</span>;</pre>
    <p>Read the <a href="#">run log</a> or <mark style="background:var(--accent-bg);color:var(--text-1)">selected text</mark>.</p>
  </section>
  <section class="card"><h2>Overlay · toast · loading</h2>
    <div class="toast"><span>Pushed to origin/fix/token-refresh.</span><button class="btn ghost" type="button">Undo</button></div>
    <div class="sk" style="width:70%"></div><div class="sk"></div><div class="sk" style="width:40%"></div>
  </section>
  <section class="card"><h2>Text ladder</h2>
    <p style="margin:0;color:var(--text-1)">text-1 · Body text, the thing people read.</p>
    <p style="margin:0;color:var(--text-2)">text-2 · Secondary, metadata, labels.</p>
    <p style="margin:0;color:var(--text-3)">text-3 · Placeholder and disabled only.</p>
  </section>
</div>
<script>
  const t = new URLSearchParams(location.search).get('theme');
  if (t) document.documentElement.dataset.theme = t;
  const cs = getComputedStyle(document.documentElement);
  const missing = ${JSON.stringify(REQUIRED_ROLES)}.filter((r) => !cs.getPropertyValue('--' + r).trim());
  document.getElementById('meta').textContent = (t || 'default') + ' · ' + cs.colorScheme + ' · missing roles: ' + (missing.length ? missing.join(', ') : 'none');
  document.getElementById('motion').textContent = 'motion: fast ' + (cs.getPropertyValue('--duration-fast').trim() || '—') + ' · base ' + (cs.getPropertyValue('--duration-base').trim() || '—') + ' · ease ' + (cs.getPropertyValue('--ease-standard').trim() || '—');
  window.__missing = missing;
</script>
</body>
</html>`;
}

export async function specimen({ themesCss, themes, out }) {
  await fs.mkdir(out, { recursive: true });
  const css = path.resolve(themesCss);
  const htmlPath = path.join(out, 'specimen.html');
  await fs.writeFile(htmlPath, specimenHTML(pathToFileURL(css).href));
  const results = [];
  for (const t of themes) {
    const url = `${pathToFileURL(htmlPath).href}?theme=${encodeURIComponent(t)}`;
    const r = await withPage(url, { viewport: '1440x900' }, async (page) => {
      const missing = await page.evaluate(() => window.__missing);
      const craft = await page.evaluate(craftProbe);
      await page.screenshot({ path: path.join(out, `${t}.png`), fullPage: true });
      return { missing, craft };
    });
    const a = await audit(url);
    results.push({ theme: t, missing: r.missing, apcaFails: r.craft.apcaFails, apcaSamples: r.craft.apcaSamples, textNodes: r.craft.textNodes, a11y: a.score, a11yIssues: a.issues.filter((i) => i.severity !== 'info').map((i) => `${i.rule}: ${i.message}`) });
  }
  // Forced colors (Windows High Contrast): does the sheet survive with the OS palette?
  if (themes[0]) {
    const url = `${pathToFileURL(htmlPath).href}?theme=${encodeURIComponent(themes[0])}`;
    await withPage(url, { viewport: '1440x900', before: (page) => page.emulateMedia({ forcedColors: 'active' }) }, async (page) => {
      await page.screenshot({ path: path.join(out, 'forced-colors.png'), fullPage: true });
    });
  }
  // Comparison grid
  const grid = path.join(out, 'grid.html');
  await fs.writeFile(grid, `<!doctype html><meta charset=utf-8><body style="margin:0;background:#1b1b1b;color:#ddd;font:14px monospace;display:grid;grid-template-columns:repeat(${Math.min(themes.length, 3)},1fr);gap:10px;padding:10px">${themes.map((t) => `<figure style="margin:0"><figcaption style="padding:4px 0">${t}</figcaption><img style="width:100%;display:block" src="${t}.png"></figure>`).join('')}</body>`);
  await withPage(grid, { viewport: '2400x900' }, async (page) => { await page.screenshot({ path: path.join(out, 'grid.png'), fullPage: true }); });
  const L = ['# Theme specimen report', '', '| theme | missing roles | APCA fails | a11y |', '|---|---|---|---|'];
  for (const r of results) L.push(`| ${r.theme} | ${r.missing.length ? r.missing.length + ': ' + r.missing.slice(0, 6).join(', ') + (r.missing.length > 6 ? '…' : '') : '0'} | ${r.apcaFails}/${r.textNodes} | ${r.a11y} |`);
  L.push('', '![grid](grid.png)', '', 'Forced colors (Windows High Contrast) on the first theme: `forced-colors.png`. Check focus rings, borders on controls, and that status is still readable without color.', '');
  for (const r of results.filter((x) => x.apcaSamples.length || x.a11yIssues.length)) {
    L.push(`## ${r.theme}`, ...r.apcaSamples.map((s) => `- APCA Lc ${s.lc} < ${s.need}: \`${s.sample.slice(0, 60)}\``), ...r.a11yIssues.slice(0, 5).map((i) => `- ${i}`), '');
  }
  await fs.writeFile(path.join(out, 'SPECIMEN.md'), L.join('\n'));
  return results;
}
