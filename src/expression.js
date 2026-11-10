// Expression probe: the part of "good enough to flex" a script can measure.
// Added after David rejected a 100 S page as "lacks color and enough structure"
// (taste/examples/david.md, 2026-11-09). Hygiene ≠ impressive.
//
// - colorfulness: Hasler & Süsstrunk (2003) M on the first-viewport screenshot
//   (<15 not colorful · 15–33 slightly · 33–45 moderately · 45–59 quite · 59+ highly)
// - colorShare: % of pixels with real chroma (not near-gray)
// - hueFamilies: distinct hue families covering ≥0.5% of pixels each
// - regions: framed regions in the first viewport (own border or own background, ≥1.5% of viewport)

/** Runs in the page: analyze a screenshot passed as a data URL. */
export function colorProbe(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const w = Math.min(480, img.width), h = Math.round(img.height * (w / img.width));
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(img, 0, 0, w, h);
      const d = cx.getImageData(0, 0, w, h).data;
      let n = 0, srg = 0, syb = 0, srg2 = 0, syb2 = 0, chromatic = 0;
      const hueBins = new Array(12).fill(0);
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const rg = r - g, yb = 0.5 * (r + g) - b;
        srg += rg; syb += yb; srg2 += rg * rg; syb2 += yb * yb; n++;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        if (max - min > 40 && max > 60) {
          chromatic++;
          let hh; const dd = max - min;
          if (max === r) hh = ((g - b) / dd + 6) % 6; else if (max === g) hh = (b - r) / dd + 2; else hh = (r - g) / dd + 4;
          hueBins[Math.floor(hh * 2) % 12]++;
        }
      }
      const mrg = srg / n, myb = syb / n;
      const sdrg = Math.sqrt(Math.max(0, srg2 / n - mrg * mrg)), sdyb = Math.sqrt(Math.max(0, syb2 / n - myb * myb));
      const M = Math.sqrt(sdrg ** 2 + sdyb ** 2) + 0.3 * Math.sqrt(mrg ** 2 + myb ** 2);
      resolve({ colorfulness: +M.toFixed(1), colorShare: +(100 * chromatic / n).toFixed(1), hueFamilies: hueBins.filter((c) => c / n >= 0.005).length });
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

/** Runs in the page: count visibly framed regions in the first viewport. */
export function structureProbe() {
  const vw = innerWidth, vh = innerHeight, minArea = vw * vh * 0.015;
  const bgOf = (el) => getComputedStyle(el).backgroundColor;
  let regions = 0; const samples = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.top >= vh || r.bottom <= 0 || r.width * r.height < minArea || r.width >= vw - 2) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'inline' || cs.visibility === 'hidden') continue;
    const bordered = ['Top', 'Right', 'Bottom', 'Left'].filter((s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none').length >= 3;
    const ownBg = !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor) && el.parentElement && bgOf(el) !== bgOf(el.parentElement);
    if (bordered || ownBg) { regions++; if (samples.length < 5) samples.push(`<${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className ? '.' + el.className.split(/\s+/)[0] : ''}>`); }
  }
  return { regions, samples };
}

/** Expression stat, 0–100, and notes. Thresholds are first guesses calibrated on one verdict; recalibrate with more. */
export function expressionScore(c, s) {
  let e = 100; const notes = [];
  if (c) {
    if (c.colorfulness < 15) { e -= 35; notes.push(`colorfulness ${c.colorfulness} (<15 reads monochrome/unfinished)`); }
    else if (c.colorfulness < 25) { e -= 15; notes.push(`colorfulness ${c.colorfulness} (low; 25+ wanted)`); }
    if (c.colorShare < 3) { e -= 20; notes.push(`only ${c.colorShare}% of the first screen carries color`); }
    if (c.hueFamilies < 2) { e -= 10; notes.push(`${c.hueFamilies} hue family — color isn't doing zone/state work`); }
  }
  if (s) {
    if (s.regions < 4) { e -= 25; notes.push(`${s.regions} framed regions in the first viewport (structure reads thin; 4+ wanted)`); }
  }
  return { expression: Math.max(0, Math.min(100, Math.round(e))), notes };
}
