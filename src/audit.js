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
  // Screen-reader-only text (1px clipped boxes) is not visible: don't measure its contrast or size.
  const srOnly = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return (r.width <= 2 || r.height <= 2) && (cs.position === 'absolute' || cs.clipPath !== 'none' || cs.overflow === 'hidden'); };
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !srOnly(el); };

  // --- color contrast (WCAG 2.x) ---
  const _cv = document.createElement('canvas'); _cv.width = _cv.height = 1;
  const _cx = _cv.getContext('2d', { willReadFrequently: true }); const _cc = new Map();
  // Any CSS color (rgb, oklch, lab, color()) → {r,g,b,a} via a 1px canvas, cached.
  const parse = (c) => {
    if (!c || c === 'none') return null;
    const m = c.match(/^rgba?\(([^)]+)\)$/);
    if (m) { const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r, g, b, a }; }
    if (_cc.has(c)) return _cc.get(c);
    _cx.fillStyle = '#010203'; _cx.fillStyle = c;
    if (_cx.fillStyle === '#010203' && !/^#010203$/i.test(c)) { _cc.set(c, null); return null; }
    _cx.clearRect(0, 0, 1, 1); _cx.fillRect(0, 0, 1, 1);
    const d = _cx.getImageData(0, 0, 1, 1).data; const v = { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
    _cc.set(c, v); return v;
  };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  // Effective background: composite every translucent layer from the page canvas up
  // to the element. (Design systems like Astryx use rgba overlays everywhere; treating
  // them as "no background" made white-on-dark read as white-on-white.)
  const canvasColor = () => {
    for (const n of [document.body, document.documentElement]) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0.9) return c; }
    const scheme = getComputedStyle(document.documentElement).colorScheme || '';
    return /dark/.test(scheme) && !/light/.test(scheme) ? { r: 18, g: 18, b: 18, a: 1 } : { r: 255, g: 255, b: 255, a: 1 };
  };
  const over = (top, base) => ({ r: top.r * top.a + base.r * (1 - top.a), g: top.g * top.a + base.g * (1 - top.a), b: top.b * top.a + base.b * (1 - top.a), a: 1 });
  const bgOf = (el) => {
    const layers = [];
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage !== 'none') return null; // gradient/image: can't know
      // Chamfered/clip-path panels paint the fill on an inset ::before; text sits on it.
      const pb = getComputedStyle(n, '::before');
      const covers = pb.content !== 'none' && pb.position === 'absolute' && pb.backgroundImage === 'none'
        && parseFloat(pb.width) >= n.getBoundingClientRect().width - 6 && parseFloat(pb.height) >= n.getBoundingClientRect().height - 6;
      const pc = covers ? parse(pb.backgroundColor) : null;
      const c = pc && pc.a > 0.02 ? pc : parse(cs.backgroundColor);
      if (c && c.a > 0.02) { layers.push(c); if (c.a > 0.98) break; }
    }
    let base = layers.length && layers[layers.length - 1].a > 0.98 ? layers.pop() : canvasColor();
    for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    return base;
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
    if (el.getAttribute('role') === 'separator' || el.closest('[role=separator]')) return; // drag handles: thin by design, hit area is padded
    const inline = getComputedStyle(el).display === 'inline' && el.tagName === 'A' && el.closest('p, li');
    if (inline) return; // inline links in prose are exempt
    // A control wrapped in (or tied to) a label that is itself ≥ 24px: the label is the hit target.
    const lab = el.closest('label') || (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`));
    if (lab) { const lr = lab.getBoundingClientRect(); if (lr.width >= 24 && lr.height >= 24) return; }
    // WCAG 2.5.8 spacing exception: an undersized target passes if a 24px box centered on it
    // touches no other target (e.g. a 22px-tall text field alone in a composer card).
    if (r.width < 24 || r.height < 24) {
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const box = { l: Math.min(r.left, cx - 12), r: Math.max(r.right, cx + 12), t: Math.min(r.top, cy - 12), b: Math.max(r.bottom, cy + 12) };
      const others = [...document.querySelectorAll('button, a[href], input, select, textarea, [role=button]')].filter((o) => o !== el && !el.contains(o) && !o.contains(el) && visible(o));
      const clash = others.some((o) => { const q = o.getBoundingClientRect(); return q.left < box.r && q.right > box.l && q.top < box.b && q.bottom > box.t; });
      if (!clash && Math.min(r.width, r.height) >= 16) return;
    }
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
  let invisible = 0, glowOnly = 0;
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 && !/rgba\([^)]*,\s*0\)$/.test(cs.outlineColor);
      let ring = outline || cs.boxShadow !== 'none';
      // Composite controls (a text field inside a composer card) often show focus on a
      // wrapper via :focus-within. Compare wrapper styles focused vs blurred. Text fields
      // also show a caret, which WCAG 2.4.7 accepts as a focus indicator.
      if (!ring) {
        const chain = []; for (let n = el.parentElement, k = 0; n && k < 4; n = n.parentElement, k++) chain.push(n);
        const snap = () => chain.map((n) => { const c = getComputedStyle(n); return [c.outlineStyle, c.outlineWidth, c.outlineColor, c.boxShadow, c.borderTopColor, c.backgroundColor].join('|'); }).join('#');
        const focused = snap(); el.blur(); const blurred = snap(); el.focus({ preventScroll: true });
        if (focused !== blurred) ring = true;
        if (!ring && (el.isContentEditable || /^(INPUT|TEXTAREA)$/.test(el.tagName))) ring = 'caret';
      }
      return { ring: !!ring, caretOnly: ring === 'caret', glowOnly: !outline && cs.boxShadow !== 'none', desc: `<${el.tagName.toLowerCase()}> ${(el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 40)}` };
    });
    if (!r) break;
    if (r.glowOnly) { glowOnly++; if (glowOnly <= 2) issues.push({ severity: 'moderate', rule: 'focus-forced-colors', message: 'Focus shown only with box-shadow/glow — it disappears in Windows High Contrast. Keep a real outline (transparent is fine) under the glow', sample: r.desc }); }
    if (r.caretOnly && !issues.some((x) => x.rule === 'focus-caret-only')) issues.push({ severity: 'minor', rule: 'focus-caret-only', message: 'Text field shows focus only by its caret; add a ring on the field or its container (:focus-within)', sample: r.desc });
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
