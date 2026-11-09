import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { withPage } from './browser.js';
import { audit } from './audit.js';
import { slopInPage } from './slop.js';

/**
 * omni check — the UI stat sheet.
 *
 * Renders the page at 1440 and 390, runs the a11y audit, the slop detector,
 * a state-coverage probe, a motion probe and a responsive probe, then grades
 * six stats and a pass/fail gate. Screenshots are written so a human (or a
 * vision model) can do the part no script can: "does this look good?"
 */

/** Runs in the page: what states / motion hygiene does the CSS actually define? */
function stylesheetProbe() {
  const sel = [];
  const media = [];
  const transitions = [];
  let blocked = 0;
  const walk = (rules) => {
    for (const r of rules) {
      if (r.selectorText) sel.push(r.selectorText);
      if (r.conditionText || r.media) media.push(r.conditionText || r.media?.mediaText || '');
      if (r.style && (r.style.transitionProperty || r.style.transition)) transitions.push(r.style.transitionProperty || r.style.transition);
      if (r.cssRules) walk(r.cssRules);
    }
  };
  for (const s of document.styleSheets) { try { walk(s.cssRules); } catch { blocked++; } }
  const all = sel.join('\n');
  const dom = document.documentElement.outerHTML;
  const has = (re, src = all) => re.test(src);
  const states = {
    hover: has(/:hover/),
    focusVisible: has(/:focus-visible|:focus\b/),
    active: has(/:active|\[aria-pressed|\[data-pressed/),
    disabled: has(/:disabled|\[aria-disabled|\[disabled\]/),
    loading: has(/skeleton|shimmer|aria-busy|\[data-state=["']?loading|spinner|\.loading|is-loading/i, all + dom),
    empty: has(/empty|no-results|zero-state|blank-slate|data-state=["']?empty/i, all + dom),
    error: has(/\berror\b|invalid|aria-invalid|danger|data-state=["']?error|role=["']?alert/i, all + dom),
    success: has(/success|\bdone\b|complete|data-state=["']?(done|success)|role=["']?status/i, all + dom),
  };
  const mediaAll = media.join('\n');
  // layout-thrashing transitions: width/height/top/left/margin/box-shadow/filter as transitioned props
  const heavy = transitions.filter((t) => /(^|[\s,])(width|height|top|left|right|bottom|margin|padding|box-shadow|filter|backdrop-filter|all)([\s,]|$)/.test(t));
  return {
    states,
    reducedMotion: /prefers-reduced-motion/.test(mediaAll),
    forcedColors: /forced-colors/.test(mediaAll),
    darkMode: /prefers-color-scheme/.test(mediaAll) || /data-theme|\.dark\b/.test(all),
    containerOrMedia: /min-width|max-width|width\s*[<>]|@container/.test(mediaAll) || /@container/.test(all),
    heavyTransitions: heavy.slice(0, 6),
    heavyTransitionCount: heavy.length,
    blockedSheets: blocked,
  };
}

/** Runs in the page: computed motion durations in use. */
function motionProbe() {
  const durs = [];
  const loops = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    cs.transitionDuration.split(',').forEach((d) => { const s = parseFloat(d) * (d.includes('ms') ? 1 : 1000); if (s > 0) durs.push(s); });
    if (cs.animationName !== 'none' && cs.animationIterationCount === 'infinite') {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) loops.push(`<${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(/\s+/)[0] : ''}> ${cs.animationName}`);
    }
  }
  return { durations: durs, infiniteLoops: [...new Set(loops)] };
}

/** Runs in the page: layout facts for the responsive stat. */
function layoutProbe() {
  const doc = document.documentElement;
  const overflow = doc.scrollWidth - doc.clientWidth;
  const offenders = [];
  if (overflow > 1) {
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.right > doc.clientWidth + 1 && r.width > 0 && getComputedStyle(el).position !== 'fixed') { offenders.push(`<${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(/\s+/)[0] : ''}> right=${Math.round(r.right)}`); if (offenders.length >= 4) break; }
    }
  }
  // line length: characters per line in paragraphs
  const measures = [];
  for (const p of document.querySelectorAll('p, li')) {
    const t = (p.innerText || '').trim(); if (t.length < 120) continue;
    const cs = getComputedStyle(p); const fs = parseFloat(cs.fontSize);
    const cpl = p.getBoundingClientRect().width / (fs * 0.5);
    measures.push(Math.round(cpl));
  }
  const body = parseFloat(getComputedStyle(document.body).fontSize);
  return { overflowPx: overflow, offenders, maxCharsPerLine: measures.length ? Math.max(...measures) : null, bodyFontPx: body };
}

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
const rank = (n) => (n >= 95 ? 'S' : n >= 88 ? 'A' : n >= 78 ? 'B' : n >= 65 ? 'C' : n >= 50 ? 'D' : 'F');
const bar = (n) => '█'.repeat(Math.round(n / 10)) + '░'.repeat(10 - Math.round(n / 10));

export async function check(target, { out, viewport = "1440x900", label, states: forceStates = [] } = {}) {
  await fs.mkdir(out, { recursive: true });
  const consoleErrors = [];
  const before = (page) => {
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
    page.on('pageerror', (e) => consoleErrors.push(String(e.message || e).slice(0, 200)));
  };

  const desktop = await withPage(target, { viewport, before }, async (page) => {
    await page.screenshot({ path: path.join(out, 'desktop-fold.png') });
    await page.screenshot({ path: path.join(out, 'desktop-full.png'), fullPage: true });
    return {
      slop: await page.evaluate(slopInPage),
      sheet: await page.evaluate(stylesheetProbe),
      motion: await page.evaluate(motionProbe),
      layout: await page.evaluate(layoutProbe),
    };
  });
  const mobile = await withPage(target, { viewport: '390x844', before }, async (page) => {
    await page.screenshot({ path: path.join(out, 'mobile-full.png'), fullPage: true });
    return { layout: await page.evaluate(layoutProbe) };
  });
  const a11y = await audit(target, { viewport });

  // Force each named state (?state=<name>) and screenshot it, so empty/error/loading get looked at too.
  const stateShots = [];
  for (const s of forceStates) {
    const u = withState(target, s);
    for (const [vp, tag] of [[viewport, 'desktop'], ['390x844', 'mobile']]) {
      const file = `state-${s}-${tag}.png`;
      await withPage(u, { viewport: vp, before }, async (page) => { await page.screenshot({ path: path.join(out, file) }); });
      stateShots.push(file);
    }
  }
  if (stateShots.length) {
    // One contact sheet per viewport so all states can be reviewed in a single look.
    for (const tag of ['desktop', 'mobile']) {
      const shots = stateShots.filter((f) => f.endsWith(`-${tag}.png`));
      const cols = tag === 'desktop' ? 2 : Math.min(shots.length, 4);
      const html = path.join(out, `.sheet-${tag}.html`);
      await fs.writeFile(html, `<!doctype html><meta charset=utf-8><body style="margin:0;background:#101010;color:#ccc;font:13px ui-monospace,monospace;display:grid;grid-template-columns:repeat(${cols},1fr);gap:12px;padding:12px">` +
        shots.map((f) => `<figure style="margin:0"><figcaption style="padding-bottom:6px">${f.replace(/^state-|\.png$/g, '')}</figcaption><img style="width:100%;display:block;border:1px solid #333" src="${pathToFileURL(path.join(out, f)).href}"></figure>`).join(''));
      await withPage(html, { viewport: tag === 'desktop' ? '1800x900' : '1600x900' }, async (page) => {
        await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 10000 }).catch(() => {});
        await page.screenshot({ path: path.join(out, `states-${tag}.png`), fullPage: true });
      });
      await fs.rm(html);
      stateShots.push(`states-${tag}.png`);
    }
  }

  // ---------- stats ----------
  const sev = a11y.bySeverity;
  const access = a11y.score;

  const COMPOSITIONAL = new Set([3, 8, 10]);
  const tells = desktop.slop.tells;
  const slopPenalty = tells.reduce((s, t) => s + (COMPOSITIONAL.has(t.id) ? 20 : 12), 0);
  const originality = clamp(100 - slopPenalty);

  const st = desktop.sheet.states;
  const stateHits = Object.values(st).filter(Boolean).length;
  const states = clamp((stateHits / 8) * 100);

  const d = desktop.motion.durations;
  const hasMotion = d.length > 0;
  const tooLong = d.filter((x) => x > 500).length;
  let motion = 100;
  if (!hasMotion) motion -= 35;
  if (!desktop.sheet.reducedMotion && hasMotion) motion -= 30;
  if (tooLong) motion -= Math.min(20, tooLong * 2);
  motion -= Math.min(20, desktop.sheet.heavyTransitionCount * 4);
  motion -= Math.min(20, Math.max(0, desktop.motion.infiniteLoops.length - 1) * 7); // one ambient loop allowed
  motion = clamp(motion);

  let responsive = 100;
  if (mobile.layout.overflowPx > 1) responsive -= 40;
  if (desktop.layout.maxCharsPerLine && desktop.layout.maxCharsPerLine > 90) responsive -= 15;
  if (mobile.layout.bodyFontPx < 14) responsive -= 15;
  if (!desktop.sheet.containerOrMedia) responsive -= 15;
  responsive -= Math.min(15, a11y.issues.filter((i) => i.rule === 'tap-target').length * 5);
  responsive = clamp(responsive);

  const sys = desktop.slop.system;
  let craft = 100;
  if (sys.fontSizes > 9) craft -= Math.min(20, (sys.fontSizes - 9) * 3);
  if (sys.fontFamilies.length > 3) craft -= 15;
  if (sys.accentHueBuckets > 3) craft -= Math.min(20, (sys.accentHueBuckets - 3) * 7);
  if (sys.offGridSpacingRatio > 0.1) craft -= 15;
  if (sys.numericNodes >= 4 && sys.tabularNumericNodes === 0) craft -= 10;
  if (consoleErrors.length) craft -= Math.min(25, consoleErrors.length * 10);
  if (!desktop.sheet.forcedColors) craft -= 5;
  craft = clamp(craft);

  const stats = { access, originality, states, motion, responsive, craft };
  const W = { access: 1.2, originality: 1.3, states: 1.0, motion: 0.8, responsive: 1.0, craft: 1.0 };
  let overall = clamp(Object.entries(stats).reduce((s, [k, v]) => s + v * W[k], 0) / Object.values(W).reduce((a, b) => a + b, 0));

  const gate = [
    ['No critical/serious a11y findings', sev.critical === 0 && sev.serious === 0],
    ['No compositional slop tells (3, 8, 10)', !tells.some((t) => COMPOSITIONAL.has(t.id))],
    ['At most 1 slop tell', tells.length <= 1],
    ['No horizontal scroll at 390px', mobile.layout.overflowPx <= 1],
    ['No console errors', consoleErrors.length === 0],
    ['State coverage ≥ 6/8', stateHits >= 6],
    ['prefers-reduced-motion handled (if animated)', !hasMotion || desktop.sheet.reducedMotion],
  ];
  const pass = gate.every(([, ok]) => ok);
  // You can't be A-rank with a failing gate: cap at B.
  if (!pass) overall = Math.min(overall, 84);

  const result = {
    target, label: label || target, checkedAt: new Date().toISOString(),
    overall, rank: rank(overall), pass, stats, gate: gate.map(([name, ok]) => ({ name, ok })),
    slop: desktop.slop, sheet: desktop.sheet, motion: { ...desktop.motion, durations: summarize(d) },
    layout: { desktop: desktop.layout, mobile: mobile.layout }, a11y, consoleErrors,
    screenshots: ['desktop-fold.png', 'desktop-full.png', 'mobile-full.png', ...stateShots],
  };
  await fs.writeFile(path.join(out, 'check.json'), JSON.stringify(result, null, 2));
  await fs.writeFile(path.join(out, 'STATS.md'), renderStats(result));
  return result;
}

function withState(target, s) {
  const isUrl = /^(https?|file):/i.test(target);
  const base = isUrl ? target : pathToFileURL(path.resolve(target)).href;
  const u = new URL(base); u.searchParams.set('state', s); return u.href;
}

function summarize(d) {
  if (!d.length) return { count: 0 };
  const s = [...d].sort((a, b) => a - b);
  return { count: d.length, min: s[0], median: s[Math.floor(s.length / 2)], max: s[s.length - 1] };
}

export function renderStats(r) {
  const L = [];
  L.push(`# UI stat sheet — ${r.label}`, '');
  L.push(`**Overall ${r.overall} · rank ${r.rank} · gate ${r.pass ? 'PASS' : 'FAIL'}**`, '');
  L.push('```');
  for (const [k, v] of Object.entries(r.stats)) L.push(`${k.toUpperCase().padEnd(12)} ${bar(v)} ${String(v).padStart(3)}  ${rank(v)}`);
  L.push('```', '');
  L.push('## Gate', '');
  for (const g of r.gate) L.push(`- [${g.ok ? 'x' : ' '}] ${g.name}`);
  L.push('', '## Slop tells', '');
  if (!r.slop.tells.length) L.push('None fired.');
  for (const t of r.slop.tells) L.push(`- **${t.id}. ${t.name}** — ${t.fix}`, ...t.evidence.map((e) => `  - \`${e}\``));
  L.push('', '## States defined', '');
  L.push(Object.entries(r.sheet.states).map(([k, v]) => `${v ? '✔' : '✘'} ${k}`).join(' · '));
  L.push('', '## Motion', '');
  L.push(`Transitions: ${r.motion.durations.count || 0}${r.motion.durations.count ? ` (median ${r.motion.durations.median}ms, max ${r.motion.durations.max}ms)` : ''}. Reduced motion: ${r.sheet.reducedMotion ? 'yes' : 'no'}. Infinite loops: ${r.motion.infiniteLoops.length ? r.motion.infiniteLoops.join(', ') : 'none'}.`);
  if (r.sheet.heavyTransitionCount) L.push(`Layout/paint-heavy transitions (${r.sheet.heavyTransitionCount}): ${r.sheet.heavyTransitions.map((t) => `\`${t}\``).join(', ')} — prefer transform/opacity.`);
  L.push('', '## Layout', '');
  L.push(`390px overflow: ${r.layout.mobile.overflowPx}px${r.layout.mobile.offenders.length ? ` (${r.layout.mobile.offenders.join(', ')})` : ''}. Longest line: ${r.layout.desktop.maxCharsPerLine ?? 'n/a'} chars. Mobile body: ${r.layout.mobile.bodyFontPx}px.`);
  const s = r.slop.system;
  L.push('', '## System', '');
  L.push(`Font sizes in use: ${s.fontSizes}. Families: ${s.fontFamilies.join(', ')}. Accent hue buckets: ${s.accentHueBuckets}. Off-grid spacing: ${(s.offGridSpacingRatio * 100).toFixed(1)}%. Numeric nodes with tabular-nums: ${s.tabularNumericNodes}/${s.numericNodes}.`);
  L.push('', `## Accessibility (${r.a11y.score}/100)`, '');
  const shown = r.a11y.issues.filter((i) => i.severity !== 'info').slice(0, 12);
  if (!shown.length) L.push('No findings above info.');
  for (const i of shown) L.push(`- ${i.severity} · ${i.rule} — ${i.message}${i.sample ? ` \`${i.sample.slice(0, 80)}\`` : ''}`);
  if (r.consoleErrors.length) L.push('', '## Console errors', '', ...r.consoleErrors.slice(0, 6).map((e) => `- \`${e}\``));
  L.push('', '## Look at it', '', 'Scripts cannot judge taste. Open `desktop-fold.png` and `mobile-full.png` and run the critique rubric in the ui-max skill (`references/critique.md`).');
  const extra = r.screenshots.filter((f) => f.startsWith('states-'));
  if (extra.length) L.push('', 'Forced states (contact sheets — look at these too): ' + extra.map((f) => `\`${f}\``).join(', '));
  return L.join('\n') + '\n';
}
