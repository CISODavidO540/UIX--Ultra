/**
 * Craft probe: the measurable fundamentals from
 * reports/Building UI taste beyond generic.md (typography, contrast, system size).
 *
 * Runs in the page (no imports). Budgets marked "inferred" are derived from
 * Material 3 / iOS / Radix role counts, not from a published benchmark.
 */
export function craftProbe() {
  // Any CSS color (oklch, color-mix, hex, named…) → rgb via canvas.
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const toRGB = (c) => {
    if (!c || c === 'transparent') return null;
    ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#000'; ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: a / 255 };
  };

  // APCA-W3 0.0.98G (Lc, signed). Dark-mode safe, unlike WCAG 2 ratios.
  const Y = ({ r, g, b }) => {
    const y = 0.2126729 * (r / 255) ** 2.4 + 0.7151522 * (g / 255) ** 2.4 + 0.072175 * (b / 255) ** 2.4;
    return y < 0.022 ? y + (0.022 - y) ** 1.414 : y;
  };
  const apca = (txt, bg) => {
    const yt = Y(txt), yb = Y(bg);
    if (Math.abs(yb - yt) < 0.0005) return 0;
    if (yb > yt) { const s = (yb ** 0.56 - yt ** 0.57) * 1.14; return s < 0.1 ? 0 : (s - 0.027) * 100; }
    const s = (yb ** 0.65 - yt ** 0.62) * 1.14; return s > -0.1 ? 0 : (s + 0.027) * 100;
  };
  // Required Lc by size/weight (APCA readability guide, simplified).
  const needLc = (px, w) => (px >= 36 || (px >= 24 && w >= 700) ? 45 : px >= 24 || (px >= 16 && w >= 700) ? 60 : 75);

  const canvasColor = () => {
    for (const n of [document.body, document.documentElement]) { const c = toRGB(getComputedStyle(n).backgroundColor); if (c && c.a > 0.9) return c; }
    const scheme = getComputedStyle(document.documentElement).colorScheme || '';
    return /dark/.test(scheme) && !/light/.test(scheme) ? { r: 18, g: 18, b: 18, a: 1 } : { r: 255, g: 255, b: 255, a: 1 };
  };
  const over = (top, base) => ({ r: top.r * top.a + base.r * (1 - top.a), g: top.g * top.a + base.g * (1 - top.a), b: top.b * top.a + base.b * (1 - top.a), a: 1 });
  // Composite translucent layers (rgba overlays) down to the first opaque ancestor or the canvas.
  const bgOf = (el) => {
    const layers = [];
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none' && !/gradient/.test(cs.backgroundImage)) return null;
      let c = toRGB(cs.backgroundColor);
      // Chamfered panels paint their fill on ::before; only count it if it covers the box.
      const ps = getComputedStyle(n, '::before');
      if (ps.content !== 'none') {
        const pre = toRGB(ps.backgroundColor), nb = n.getBoundingClientRect();
        if (pre && pre.a > 0.9 && parseFloat(ps.width) >= nb.width * 0.9 && parseFloat(ps.height) >= nb.height * 0.9) c = pre;
      }
      if (c && c.a > 0.02) { layers.push(c); if (c.a > 0.98) break; }
    }
    let base = layers.length && layers[layers.length - 1].a > 0.98 ? layers.pop() : canvasColor();
    for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    return base;
  };
  const desc = (el) => `<${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : ''}> ${(el.innerText || '').trim().slice(0, 40)}`;
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0; };

  const lowLc = []; let textNodes = 0;
  const capsTight = []; const lhBad = [];
  // Type system: families, distinct styles, tiny caps, small condensed faces, reading size/measure.
  const families = new Set(), styles = new Set(), tinyCaps = [], smallCondensed = [], wideMeasure = [];
  const readChars = new Map(); // style key → chars, to find the dominant reading style
  const radii = new Set(), shadows = new Set(), zs = new Set(), weights = new Set();
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.borderRadius !== '0px') radii.add(cs.borderRadius);
    if (cs.boxShadow !== 'none') shadows.add(cs.boxShadow);
    if (cs.zIndex !== 'auto' && cs.position !== 'static') zs.add(cs.zIndex);
    const ownText = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
    if (!ownText || !/[\p{L}\p{N}]/u.test(ownText)) continue; // skip separators/symbols
    if (el.closest('[aria-hidden="true"]')) continue; // decorative texture (micro-data), not content
    textNodes++;
    const px = parseFloat(cs.fontSize), w = Number(cs.fontWeight) || 400;
    weights.add(w);
    if (el.closest('[aria-disabled=true], :disabled')) continue; // disabled text is exempt (Lc 30 floor)
    const fg = toRGB(cs.color), bg = bgOf(el);
    if (fg && bg) {
      // Short labels/readouts are "non-body" text in APCA terms: allow ~15 Lc less (floor 45).
      const lc = Math.abs(apca(fg, bg)), body = needLc(px, w), need = ownText.length < 40 ? Math.max(45, body - 15) : body;
      if (lc < need && !el.matches('input, textarea, select, ::placeholder')) lowLc.push({ lc: Math.round(lc), need, sample: desc(el) });
    }
    // All caps needs 5–12% tracking (Butterick).
    const caps = cs.textTransform === 'uppercase' || (ownText.length >= 4 && ownText === ownText.toUpperCase() && /[A-Z]{4}/.test(ownText));
    const track = cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing) / px;
    if (caps && track < 0.04 && px < 24) capsTight.push(desc(el));
    const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    families.add(fam);
    styles.add(`${fam}|${px}|${w}|${caps ? 'caps' : ''}`);
    if (caps && px < 12 && ownText.length > 2) tinyCaps.push(`${px}px ${desc(el)}`);
    const condensed = /condensed|narrow|compressed|rajdhani|oswald|bebas|teko/i.test(cs.fontFamily.split(',')[0]) || parseFloat(cs.fontStretch) < 100;
    if (condensed && px < 14 && ownText.length > 3) smallCondensed.push(`${px}px ${fam} ${desc(el)}`);
    const lhRatio = cs.lineHeight === 'normal' ? 1.2 : parseFloat(cs.lineHeight) / px;
    const rk = `${px}|${lhRatio.toFixed(2)}|${fam}`;
    readChars.set(rk, (readChars.get(rk) || 0) + ownText.length);
    if (/^(P|LI|DD|BLOCKQUOTE)$/.test(el.tagName) && ownText.length > 160) {
      const ch = el.getBoundingClientRect().width / (px * 0.5);
      if (ch > 85) wideMeasure.push(`${Math.round(ch)}ch ${desc(el)}`);
    }
    // Body line-height 1.2–1.8 for multi-line copy.
    if (/^(P|LI|DD|BLOCKQUOTE)$/.test(el.tagName) && ownText.length > 80) {
      const lh = cs.lineHeight === 'normal' ? 1.2 : parseFloat(cs.lineHeight) / px;
      if (lh < 1.2 || lh > 1.8) lhBad.push(`${lh.toFixed(2)} ${desc(el)}`);
    }
  }
  return {
    textNodes,
    apcaFails: lowLc.length,
    apcaSamples: lowLc.sort((a, b) => a.lc - b.lc).slice(0, 6),
    capsTight: capsTight.length, capsSamples: [...new Set(capsTight)].slice(0, 4),
    lineHeightBad: lhBad.length, lineHeightSamples: lhBad.slice(0, 4),
    radii: radii.size, shadows: shadows.size, zIndexes: zs.size, weights: weights.size,
    families: families.size, familyNames: [...families].slice(0, 6), textStyles: styles.size,
    tinyCaps: tinyCaps.length, tinyCapsSamples: tinyCaps.slice(0, 3),
    smallCondensed: smallCondensed.length, smallCondensedSamples: smallCondensed.slice(0, 3),
    wideMeasure: wideMeasure.length, wideMeasureSamples: wideMeasure.slice(0, 3),
    reading: (() => { const top = [...readChars].sort((a, b) => b[1] - a[1])[0]; if (!top) return null; const [px, lh, fam] = top[0].split('|'); return { px: +px, lh: +lh, family: fam }; })(),
  };
}

/** Budgets (inferred from M3 / iOS / Radix role counts). */
export const CRAFT_BUDGET = { radii: 4, shadows: 4, zIndexes: 8, weights: 4, families: 3 };

/** Score deductions for the Craft stat. Returns [penalty, notes]. */
export function craftPenalty(c) {
  let p = 0; const notes = [];
  const ratio = c.textNodes ? c.apcaFails / c.textNodes : 0;
  if (c.apcaFails) { const d = Math.min(20, Math.ceil(ratio * 100) + 3); p += d; notes.push(`${c.apcaFails} text elements below APCA target (−${d})`); }
  if (c.capsTight) { const d = Math.min(8, c.capsTight * 2); p += d; notes.push(`${c.capsTight} all-caps labels without tracking (−${d})`); }
  if (c.lineHeightBad) { const d = Math.min(8, c.lineHeightBad * 2); p += d; notes.push(`${c.lineHeightBad} paragraphs with line-height outside 1.2–1.8 (−${d})`); }
  // Type system (reports/UI formats.md): reading text, tiny caps, condensed faces at small sizes.
  const r = c.reading;
  if (r && (r.px < 14 || (r.px < 16 && r.lh < 1.5))) { p += 4; notes.push(`dominant reading text is ${r.px}px / ${r.lh} in ${r.family}: cramped (want ≥15px at ≥1.5) (−4)`); }
  if (c.tinyCaps) { const d = Math.min(6, c.tinyCaps * 2); p += d; notes.push(`${c.tinyCaps} all-caps labels under 12px (−${d})`); }
  if (c.smallCondensed) { const d = Math.min(6, c.smallCondensed); p += d; notes.push(`${c.smallCondensed} condensed-face texts under 14px: condensed faces are for display sizes (−${d})`); }
  if (c.wideMeasure) { const d = Math.min(4, c.wideMeasure); p += d; notes.push(`${c.wideMeasure} paragraphs wider than ~85ch (−${d})`); }
  for (const k of Object.keys(CRAFT_BUDGET)) {
    if (c[k] > CRAFT_BUDGET[k]) { const d = Math.min(6, (c[k] - CRAFT_BUDGET[k]) * 2); p += d; notes.push(`${c[k]} unique ${k} (budget ${CRAFT_BUDGET[k]}) (−${d})`); }
  }
  return [p, notes];
}
