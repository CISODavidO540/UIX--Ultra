import { withPage } from './browser.js';

const WEIGHT = { critical: 10, serious: 5, moderate: 2, minor: 1, info: 0 };

/** Runs in the page: static checks over the DOM. */
function staticChecks() {
  const issues = [];
  const add = (severity, rule, message, sample) => issues.push({ severity, rule, message, sample: sample ? sample.slice(0, 160) : undefined });
  const describe = (el) => {
    const id = el.id ? `#${el.id}` : '';
    const cls = typeof el.className === 'string' && el.className.trim() ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}` : '';
    return `<${el.tagName.toLowerCase()}${id}${cls}> ${(el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 50)}`;
  };
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };

  // --- color contrast (WCAG 2.x) ---
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r, g, b, a }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const bgOf = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage !== 'none') return null; // gradient/image: can't know
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0.9) return c;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  let contrastFails = 0;
  const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue;
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el);
    const fg = parse(cs.color); const bg = bgOf(el);
    if (!fg || !bg) continue;
    const size = parseFloat(cs.fontSize); const bold = Number(cs.fontWeight) >= 700;
    const large = size >= 24 || (bold && size >= 18.66);
    const need = large ? 3 : 4.5;
    const r = ratio(fg, bg);
    if (r < need) {
      contrastFails++;
      const key = `${cs.color}|${bg.r},${bg.g},${bg.b}`;
      if (!seen.has(key) && seen.size < 8) { seen.add(key); add(r < 3 ? 'serious' : 'moderate', 'contrast', `Text contrast ${r.toFixed(2)}:1, needs ${need}:1`, describe(el)); }
    }
    if (size < 12 && el.innerText.trim().length > 3) { add('minor', 'tiny-text', `Text at ${size}px is hard to read`, describe(el)); }
  }

  // --- names, labels, alt ---
  document.querySelectorAll('img').forEach((img) => { if (!img.hasAttribute('alt') && visible(img)) add('serious', 'img-alt', 'Image has no alt attribute (use alt="" if decorative)', img.src); });
  document.querySelectorAll('img').forEach((img) => { if (!img.getAttribute('width') && !img.style.aspectRatio && !getComputedStyle(img).aspectRatio.includes('/') && visible(img)) add('minor', 'img-dimensions', 'Image without width/height or aspect-ratio can cause layout shift', img.src); });
  document.querySelectorAll('button, [role=button], a[href]').forEach((el) => {
    if (!visible(el)) return;
    const name = (el.innerText || '').trim() || el.getAttribute('aria-label') || el.getAttribute('title') || (el.querySelector('img[alt]') || {}).alt || el.getAttribute('aria-labelledby');
    if (!name) add('critical', 'control-name', 'Interactive element has no accessible name', describe(el));
  });
  document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]), textarea, select').forEach((el) => {
    if (!visible(el)) return;
    const labelled = el.labels?.length || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title');
    if (!labelled) add('serious', 'input-label', `Form field has no label${el.placeholder ? ' (placeholder is not a label)' : ''}`, describe(el));
  });

  // --- tap targets (WCAG 2.2 2.5.8: 24px min; 44px recommended) ---
  let small = 0;
  document.querySelectorAll('button, a[href], input, select, textarea, [role=button], [tabindex]:not([tabindex="-1"])').forEach((el) => {
    if (!visible(el)) return;
    const r = el.getBoundingClientRect();
    const inline = getComputedStyle(el).display === 'inline' && el.tagName === 'A' && el.closest('p, li');
    if (inline) return; // inline links in prose are exempt
    if (r.width < 24 || r.height < 24) { small++; if (small <= 5) add('serious', 'tap-target', `Target is ${Math.round(r.width)}×${Math.round(r.height)}px (min 24, ideal 44)`, describe(el)); }
  });

  // --- document structure ---
  if (!document.documentElement.lang) add('moderate', 'html-lang', '<html> has no lang attribute');
  if (!document.querySelector('meta[name=viewport]')) add('serious', 'viewport-meta', 'No <meta name="viewport"> — mobile layout will break');
  if (!document.title.trim()) add('moderate', 'title', 'Page has no <title>');
  const h1s = document.querySelectorAll('h1').length;
  if (h1s === 0) add('moderate', 'h1', 'No <h1> on the page');
  if (h1s > 1) add('minor', 'h1', `${h1s} <h1> elements; usually one per page`);
  let last = 0;
  document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => { const lvl = Number(h.tagName[1]); if (last && lvl > last + 1) add('minor', 'heading-order', `Heading jumps h${last} → h${lvl}`, describe(h)); last = lvl; });
  if (!document.querySelector('main, [role=main]')) add('minor', 'landmark', 'No <main> landmark');

  // --- beyond pretty: states & motion hygiene ---
  let reducedMotion = false, hasAnim = false;
  for (const s of document.styleSheets) {
    let rules; try { rules = s.cssRules; } catch { continue; }
    for (const r of rules) {
      if (r.type === CSSRule.MEDIA_RULE && /prefers-reduced-motion/.test(r.conditionText || r.media.mediaText)) reducedMotion = true;
      if (r.type === CSSRule.KEYFRAMES_RULE) hasAnim = true;
    }
  }
  const transitioned = [...document.querySelectorAll('body *')].some((el) => getComputedStyle(el).transitionDuration.split(',').some((d) => parseFloat(d) > 0));
  if ((hasAnim || transitioned) && !reducedMotion) add('moderate', 'reduced-motion', 'Page animates but has no prefers-reduced-motion handling');
  if (!document.querySelector('[class*=skeleton], [class*=shimmer], [aria-busy]')) add('info', 'loading-states', 'No skeleton/aria-busy patterns found in the initial DOM — check async views have loading states');
  if (!transitioned && !hasAnim) add('info', 'motion', 'No transitions at all — state changes will feel abrupt');

  return issues;
}

async function focusCheck(page) {
  // Tab through the first focusables and see whether anything visibly changes.
  const issues = [];
  let invisible = 0;
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none';
      return { ring, desc: `<${el.tagName.toLowerCase()}> ${(el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 40)}` };
    });
    if (!r) break;
    if (!r.ring) { invisible++; if (invisible <= 4) issues.push({ severity: 'serious', rule: 'focus-visible', message: 'Keyboard focus has no visible indicator (outline/box-shadow)', sample: r.desc }); }
  }
  return issues;
}

async function layoutShift(page) {
  const cls = await page.evaluate(() => new Promise((resolve) => {
    let total = 0;
    try {
      new PerformanceObserver((list) => { for (const e of list.getEntries()) if (!e.hadRecentInput) total += e.value; })
        .observe({ type: 'layout-shift', buffered: true });
    } catch { return resolve(null); }
    setTimeout(() => resolve(total), 600);
  }));
  if (cls == null) return [];
  const sev = cls > 0.25 ? 'serious' : cls > 0.1 ? 'moderate' : null;
  return sev ? [{ severity: sev, rule: 'cls', message: `Cumulative layout shift ${cls.toFixed(3)} (good < 0.1) — reserve space / use skeletons` }] : [];
}

export async function audit(target, { viewport } = {}) {
  return withPage(target, { viewport }, async (page) => {
    const issues = [
      ...(await page.evaluate(staticChecks)),
      ...(await layoutShift(page)),
      ...(await focusCheck(page)),
    ];
    const penalty = issues.reduce((s, i) => s + WEIGHT[i.severity], 0);
    const score = Math.max(0, 100 - penalty);
    const bySeverity = Object.fromEntries(Object.keys(WEIGHT).map((k) => [k, issues.filter((i) => i.severity === k).length]));
    const order = Object.keys(WEIGHT);
    issues.sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity));
    return { target, score, bySeverity, issues, auditedAt: new Date().toISOString() };
  });
}
