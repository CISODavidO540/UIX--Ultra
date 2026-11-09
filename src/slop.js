/**
 * Slop detector: finds the visual tells that make a UI read as
 * "AI-generated / vibe coded". Runs inside the page against computed styles.
 *
 * Each tell is evidence, not a verdict. A tell can be correct on purpose
 * (a pricing page may want centered text). The point is that every tell that
 * fires must have a reason the designer can say out loud.
 *
 * Sources: claude-design "ten tells", the UIX Ultra cyberpunk post-mortem
 * ("too vibe coded"), and NN/g / WCAG notes in reports/.
 */
export function slopInPage() {
  const tells = [];
  const fire = (id, name, fix, evidence) => tells.push({ id, name, fix, evidence: evidence.slice(0, 4) });

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05;
  };
  const describe = (el) => {
    const cls = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    return `<${el.tagName.toLowerCase()}${cls}> ${(el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40)}`;
  };
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
  const hsl = ({ r, g, b }) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l };
    const d = max - min; const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return { h: h * 60, s, l };
  };
  const hexOf = ({ r, g, b }) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const saturated = (c) => { const x = hsl(c); return x.s > 0.45 && x.l > 0.2 && x.l < 0.85; };
  const techHue = (h) => h >= 225 && h <= 285; // indigo / violet / "AI purple"

  const els = [...document.querySelectorAll('body *')].filter(visible);
  const textEls = els.filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1));
  const vw = innerWidth;

  // 1. tech gradient — blue/violet gradients on big surfaces or headline text
  const grads = els.filter((el) => {
    const bi = getComputedStyle(el).backgroundImage;
    if (!/gradient/.test(bi)) return false;
    const stops = [...bi.matchAll(/(?:rgba?|oklch|oklab|lab|lch|hsla?|color)\([^)]+\)/g)].map((m) => parse(m[0])).filter(Boolean);
    const r = el.getBoundingClientRect();
    const big = r.width * r.height > 0.08 * vw * innerHeight || getComputedStyle(el).backgroundClip === 'text' || getComputedStyle(el).webkitBackgroundClip === 'text';
    return big && stops.filter((s) => saturated(s) && techHue(hsl(s).h)).length >= 1 && stops.length >= 2;
  });
  if (grads.length) fire(1, 'Tech gradient', 'Recolor: drop the blue/violet gradient; use a flat surface and spend color on one meaningful element.', grads.map(describe));

  // 2. generic accent hue — the model's favorite colors, not a decision
  const DEFAULTS = {
    '#6366f1': 'Tailwind indigo-500', '#4f46e5': 'Tailwind indigo-600', '#8b5cf6': 'Tailwind violet-500', '#7c3aed': 'Tailwind violet-600',
    '#a855f7': 'Tailwind purple-500', '#3b82f6': 'Tailwind blue-500', '#2563eb': 'Tailwind blue-600', '#0ea5e9': 'Tailwind sky-500',
    '#00e5ff': 'stock cyberpunk cyan', '#00ffff': 'pure cyan', '#ff2bd6': 'stock cyberpunk magenta', '#ff00ff': 'pure magenta',
    '#0000ee': 'unstyled browser link blue', '#22c55e': 'Tailwind green-500', '#10b981': 'Tailwind emerald-500', '#0f172a': 'Tailwind slate-900 bg', '#1e293b': 'Tailwind slate-800',
  };
  const accentTally = new Map();
  for (const el of els) {
    const cs = getComputedStyle(el);
    const interactive = el.matches('a,button,[role=button],input[type=submit],[class*=btn],[class*=accent],[class*=primary]');
    for (const c of [cs.backgroundColor, interactive ? cs.color : null, cs.borderTopColor]) {
      const p = parse(c); if (!p || p.a < 0.5) continue;
      const hx = hexOf(p);
      if (saturated(p) || DEFAULTS[hx]) accentTally.set(hx, (accentTally.get(hx) || 0) + 1);
    }
  }
  const accents = [...accentTally.entries()].sort((a, b) => b[1] - a[1]);
  const defaultHits = accents.filter(([hx]) => DEFAULTS[hx]).map(([hx, n]) => `${hx} (${DEFAULTS[hx]}) ×${n}`);
  const topAccent = accents.find(([hx]) => { const p = parse(`rgb(${parseInt(hx.slice(1, 3), 16)},${parseInt(hx.slice(3, 5), 16)},${parseInt(hx.slice(5, 7), 16)})`); return saturated(p); });
  const topIsTech = topAccent && techHue(hsl(parse(`rgb(${parseInt(topAccent[0].slice(1, 3), 16)},${parseInt(topAccent[0].slice(3, 5), 16)},${parseInt(topAccent[0].slice(5, 7), 16)})`)).h);
  if (defaultHits.length || topIsTech) fire(2, 'Default accent hue', 'Recolor: derive the accent from the concept/brand. Framework default swatches and indigo/violet read as unchosen.', defaultHits.length ? defaultHits : [`top accent ${topAccent[0]} is indigo/violet`]);

  // 3. feature-tile grid — ≥3 equal siblings each icon + heading + sentence
  const tileGrids = [];
  for (const parent of new Set(els.map((e) => e.parentElement).filter(Boolean))) {
    const kids = [...parent.children].filter(visible);
    if (kids.length < 3 || kids.length > 8) continue;
    const tiles = kids.filter((k) => k.querySelector('svg,img,[class*=icon],i') && k.querySelector('h2,h3,h4,h5,strong,[class*=title]') && k.querySelector('p'));
    if (tiles.length < 3) continue;
    const w = tiles.map((t) => Math.round(t.getBoundingClientRect().width));
    if (Math.max(...w) - Math.min(...w) <= 8) tileGrids.push(parent);
  }
  if (tileGrids.length) fire(3, 'Feature-tile grid', 'Re-layout: rank the items. Give the most important one more space, or turn them into a list/table with real content.', tileGrids.map(describe));

  // 4. accent rail — colored left border used as decoration
  const rails = els.filter((el) => {
    const cs = getComputedStyle(el);
    const l = parseFloat(cs.borderLeftWidth), t = parseFloat(cs.borderTopWidth), rgt = parseFloat(cs.borderRightWidth);
    const c = parse(cs.borderLeftColor);
    return l >= 2 && t < 1 && rgt < 1 && c && saturated(c) && el.getBoundingClientRect().height > 40;
  });
  if (rails.length >= 2) fire(4, 'Accent rail', 'Remove: the left color strip is decoration pretending to be structure. Use spacing, a heading, or a status label.', rails.map(describe));

  // 5. unearned blur — backdrop-filter used as a default surface
  const blurs = els.filter((el) => { const cs = getComputedStyle(el); return /blur/.test(cs.backdropFilter || cs.webkitBackdropFilter || ''); });
  if (blurs.length > 2) fire(5, 'Unearned blur', 'Remove: keep blur only on one real overlay (modal/sheet). Solid surfaces for everything else.', blurs.map(describe));

  // 6. monument stat — giant numbers filling space
  const monuments = textEls.filter((el) => {
    const t = (el.innerText || '').trim();
    return parseFloat(getComputedStyle(el).fontSize) >= 40 && t.length <= 10 && /^[\d.,%+×xkKmMbB$€£<>~\s/:-]+$/.test(t) && /\d/.test(t);
  });
  if (monuments.length >= 2) fire(6, 'Monument stat', 'Remove: big numbers that nobody acts on. Keep a number only if it is real and drives a decision; size it as data, not decoration.', monuments.map(describe));

  // 7. icon topper — rounded-square icon chip centered above a heading, repeated
  const toppers = els.filter((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 32 || r.width > 80 || Math.abs(r.width - r.height) > 4) return false;
    const cs = getComputedStyle(el);
    if (parseFloat(cs.borderRadius) < 6 || !parse(cs.backgroundColor) || parse(cs.backgroundColor).a < 0.05) return false;
    if (!el.querySelector('svg,img,i') && !/\p{Extended_Pictographic}/u.test(el.textContent)) return false;
    const next = el.nextElementSibling;
    return next && /^H[2-5]$/.test(next.tagName);
  });
  if (toppers.length >= 3) fire(7, 'Icon topper', 'Remove: the icon chip above every heading is template filler. Let the heading carry the hierarchy.', toppers.map(describe));

  // 8. center stack — most text blocks centered
  const blocks = textEls.filter((el) => (el.innerText || '').trim().length > 20 && /^(P|H1|H2|H3|H4|LI|DIV|SPAN)$/.test(el.tagName));
  const centered = blocks.filter((el) => getComputedStyle(el).textAlign === 'center');
  if (blocks.length >= 6 && centered.length / blocks.length > 0.5) fire(8, 'Center stack', 'Re-layout: commit to a grid with a left edge. Centering everything means no composition was chosen.', [`${centered.length}/${blocks.length} text blocks centered`]);

  // 9. default type — Inter / system stack / Arial used as the primary face
  const famTally = new Map();
  for (const el of textEls) { const f = getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim(); famTally.set(f, (famTally.get(f) || 0) + (el.innerText || '').length); }
  const fams = [...famTally.entries()].sort((a, b) => b[1] - a[1]);
  const primary = fams[0]?.[0] || '';
  if (/^(inter|system-ui|-apple-system|blinkmacsystemfont|segoe ui|roboto|arial|helvetica|helvetica neue|sans-serif|ui-sans-serif)$/i.test(primary)) {
    fire(9, 'Default type', 'Re-typeset: pick a face for a reason (concept, density, numerals). Inter/system is fine only when it is a stated decision.', [`primary face: ${primary}`]);
  }

  // 10. wrong surface — app-like page (many controls) with a marketing hero
  const controls = els.filter((el) => el.matches('button,input,select,textarea,[role=tab],[role=menuitem]')).length;
  const hero = els.find((el) => /^H1$/.test(el.tagName) && parseFloat(getComputedStyle(el).fontSize) >= 48 && getComputedStyle(el).textAlign === 'center' && el.getBoundingClientRect().top < innerHeight);
  if (hero && controls >= 12) fire(10, 'Wrong surface', 'Re-layout: this is a tool (many controls) wearing a landing-page hero. Name the surface (Monitor/Operate/Configure/Inspect) and compose for it.', [describe(hero), `${controls} controls`]);

  // ---- UIX extras (from the "too vibe coded" post-mortem) ----
  // 11. shouty labels — uppercase + tracking applied everywhere
  const shouty = textEls.filter((el) => { const cs = getComputedStyle(el); return cs.textTransform === 'uppercase' && parseFloat(cs.letterSpacing) > 0.5; });
  const shoutyRatio = textEls.length ? shouty.length / textEls.length : 0;
  if (shouty.length > 12 && shoutyRatio > 0.2) fire(11, 'Shouty labels', 'Re-typeset: uppercase tracking for at most one label level. Everything else sentence case.', [`${shouty.length}/${textEls.length} text nodes are UPPERCASE + tracked`, ...shouty.slice(0, 2).map(describe)]);

  // 12. mono as texture — monospace on prose, not just data
  const monoProse = textEls.filter((el) => /mono|courier|consolas|menlo|code/i.test(getComputedStyle(el).fontFamily) && !el.closest('pre,code,kbd,samp,[class*=code],[class*=terminal],[class*=log]') && (el.innerText || '').trim().split(/\s+/).length >= 8);
  const isMono = (el) => /mono|courier|consolas|menlo|code/i.test(getComputedStyle(el).fontFamily);
  const nonCode = textEls.filter((el) => !el.closest('pre,code,kbd,samp,[class*=code],[class*=terminal],[class*=log],textarea'));
  const monoChars = nonCode.filter(isMono).reduce((s, el) => s + [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('').length, 0);
  const allChars = nonCode.reduce((s, el) => s + [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('').length, 0);
  const monoShare = allChars ? monoChars / allChars : 0;
  if (monoProse.length >= 3 || (monoShare > 0.4 && nonCode.length >= 10)) fire(12, 'Mono as texture', 'Re-typeset: monospace only for data (numbers, IDs, commands, logs). Sentences and UI labels go in the content sans.', [`${Math.round(monoShare * 100)}% of non-code text is monospace`, ...monoProse.map(describe)]);

  // 13. ornament everywhere — glow/ornament on many elements, so nothing is special
  const glows = els.filter((el) => {
    const bs = getComputedStyle(el).boxShadow; if (bs === 'none') return false;
    return [...bs.matchAll(/((?:rgba?|oklch|oklab|lab|lch|hsla?|color)\([^)]+\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px/g)].some((m) => { const c = parse(m[1]); return c && saturated(c) && Math.abs(+m[2]) < 2 && Math.abs(+m[3]) < 2 && +m[4] >= 6; });
  });
  const textGlows = textEls.filter((el) => { const ts = getComputedStyle(el).textShadow; return ts !== 'none' && /(\d+)px\s*\)?\s*$/.test(ts) && [...ts.matchAll(/(?:rgba?|oklch|oklab|lab|lch|hsla?|color)\([^)]+\)/g)].some((m) => saturated(parse(m[0]) || { r: 0, g: 0, b: 0 })); });
  // Ornament that lives on pseudo-elements and shapes: corner brackets, chamfers, grids, scanlines.
  const ornamented = els.filter((el) => {
    const cs = getComputedStyle(el);
    if (cs.clipPath && cs.clipPath !== 'none') return true;
    if (/repeating-(linear|radial)-gradient/.test(cs.backgroundImage)) return true;
    for (const pe of ['::before', '::after']) {
      const p = getComputedStyle(el, pe);
      if (p.content === 'none' || p.position !== 'absolute') continue;
      const border = ['Top', 'Right', 'Bottom', 'Left'].filter((s) => parseFloat(p[`border${s}Width`]) > 0).length;
      const r = el.getBoundingClientRect();
      const small = parseFloat(p.width) < r.width * 0.5 && parseFloat(p.height) < r.height * 0.5;
      if ((border === 2 && small) || /gradient/.test(p.backgroundImage) || (p.boxShadow !== 'none' && /\d+px\s+\d+px\s+\d+px/.test(p.boxShadow))) return true;
    }
    return false;
  });
  const sized = els.filter((el) => { const r = el.getBoundingClientRect(); return r.width > 24 && r.height > 16; }).length || 1;
  const ornamentCount = glows.length + textGlows.length + ornamented.length;
  if (ornamentCount > 8 || ornamentCount / sized > 0.12) fire(13, 'Ornament everywhere', 'Remove: reserve glow/brackets/chamfers for 2–3 elements that carry state (active step, approval, connection). Everything else plain.', [`${ornamentCount} ornamented elements (${glows.length} glow boxes, ${textGlows.length} glow text, ${ornamented.length} brackets/chamfers/patterns) of ${sized}`, ...ornamented.slice(0, 3).map(describe)]);

  // 14. emoji icons
  const emoji = els.filter((el) => el.matches('button,a,h1,h2,h3,h4,li,[class*=icon]') && /\p{Extended_Pictographic}/u.test([...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('')));
  if (emoji.length >= 3) fire(14, 'Emoji icons', 'Remove: use one consistent SVG icon set, or no icons.', emoji.map(describe));

  // 15. halation — pure white text on pure black
  const halation = textEls.filter((el) => {
    const fg = parse(getComputedStyle(el).color);
    let bg = null; for (let n = el; n && !bg; n = n.parentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0.9) bg = c; }
    return fg && bg && fg.r > 250 && fg.g > 250 && fg.b > 250 && bg.r < 8 && bg.g < 8 && bg.b < 8;
  });
  if (halation.length >= 3) fire(15, 'Halation', 'Recolor: tinted near-black (#0b0f14–#121212) and off-white (#d6dee8–#e8e8e8) instead of #fff on #000.', halation.map(describe));

  // ---- system health numbers (not tells; feed the Craft stat) ----
  const sizes = new Set(textEls.map((el) => getComputedStyle(el).fontSize));
  const families = new Set(textEls.map((el) => getComputedStyle(el).fontFamily.split(',')[0].trim()));
  const hues = new Set(accents.map(([hx]) => { const p = parse(`rgb(${parseInt(hx.slice(1, 3), 16)},${parseInt(hx.slice(3, 5), 16)},${parseInt(hx.slice(5, 7), 16)})`); return saturated(p) ? Math.round(hsl(p).h / 30) : null; }).filter((x) => x != null));
  let offGrid = 0, spaced = 0;
  for (const el of els) {
    const cs = getComputedStyle(el);
    for (const v of [cs.paddingTop, cs.paddingLeft, cs.marginTop, cs.rowGap, cs.columnGap]) {
      const n = parseFloat(v); if (!n || n < 2) continue; spaced++; if (n % 4 !== 0 && n % 2 !== 0) offGrid++;
    }
  }
  const tabular = textEls.filter((el) => /\d/.test(el.innerText || '') && /tabular-nums/.test(getComputedStyle(el).fontVariantNumeric)).length;
  const numeric = textEls.filter((el) => /^\s*[\d.,:%+\-$€£]+\s*\w{0,3}\s*$/.test(el.innerText || '')).length;

  return {
    tells,
    slopScore: tells.length,
    system: {
      fontSizes: sizes.size,
      fontFamilies: [...families],
      accentHueBuckets: hues.size,
      offGridSpacingRatio: spaced ? +(offGrid / spaced).toFixed(3) : 0,
      numericNodes: numeric,
      tabularNumericNodes: tabular,
      textNodes: textEls.length,
      controls,
      ornamentCount,
      monoShare: +monoShare.toFixed(2),
    },
  };
}
