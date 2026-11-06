// Turns raw ui-dna.json tallies into a normalized, named design-token set.

export function toRGBA(c) {
  const m = String(c).match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  return { r, g, b, a };
}
export const hex = ({ r, g, b }) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const dist = (a, b) => Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
const sat = ({ r, g, b }) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mx === 0 ? 0 : (mx - mn) / mx; };
export const luminance = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
export const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

/** Merge near-identical colors (anti-aliasing noise, 1-off hexes). */
function cluster(list, threshold = 12) {
  const groups = [];
  for (const { value, count } of list) {
    const c = toRGBA(value);
    if (!c || c.a < 0.05) continue;
    const g = groups.find((x) => dist(x.c, c) < threshold);
    if (g) g.count += count; else groups.push({ c, count });
  }
  return groups.sort((a, b) => b.count - a.count);
}

const num = (v) => parseFloat(v);
const uniqSorted = (arr) => [...new Set(arr.map((v) => Math.round(v * 100) / 100))].filter((v) => v > 0).sort((a, b) => a - b);

function detectBase(values) {
  for (const base of [8, 4]) {
    const hits = values.filter((v) => v % base === 0).length;
    if (values.length && hits / values.length >= 0.7) return base;
  }
  return 4;
}

function msToNum(d) { return d.endsWith('ms') ? num(d) : num(d) * 1000; }

export function buildTokens(dna) {
  // ---- color roles ----
  const bgs = cluster(dna.colors.background);
  const texts = cluster(dna.colors.text);
  const borders = cluster(dna.colors.border);
  const white = { r: 255, g: 255, b: 255, a: 1 };

  const bg = toRGBA(dna.pageBackground) || bgs[0]?.c || white;
  const surface = bgs.find((x) => dist(x.c, bg) > 3 && dist(x.c, bg) < 60 && sat(x.c) < 0.25)?.c || bg;
  const text = texts.find((x) => contrast(x.c, bg) >= 4.5)?.c || texts[0]?.c || { r: 17, g: 17, b: 17, a: 1 };
  const muted = texts.find((x) => dist(x.c, text) > 30 && sat(x.c) < 0.3)?.c || text;
  const accentPool = [...bgs, ...texts, ...borders].filter((x) => sat(x.c) > 0.35 && dist(x.c, bg) > 40);
  const primary = accentPool.sort((a, b) => b.count - a.count)[0]?.c || { r: 37, g: 99, b: 235, a: 1 };
  const border = borders[0]?.c || surface;
  const onPrimary = contrast(primary, white) >= contrast(primary, { r: 0, g: 0, b: 0 }) ? white : { r: 0, g: 0, b: 0 };
  const isDark = luminance(bg) < 0.2;

  const palette = cluster([...dna.colors.background, ...dna.colors.text, ...dna.colors.border]).slice(0, 16).map((x) => hex(x.c));

  // ---- typography ----
  const sizes = uniqSorted(dna.typography.sizes.map((s) => num(s.value)));
  // Most-used text size is the body size; name the rest relative to it.
  const bodySize = num(dna.typography.sizes[0]?.value) || 16;
  const bodyIdx = Math.max(0, sizes.indexOf(Math.round(bodySize * 100) / 100));
  const below = ['sm', 'xs', '2xs', '3xs'];
  const above = ['lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl'];
  const fontSize = {};
  sizes.forEach((s, i) => {
    const d = i - bodyIdx;
    const name = d === 0 ? 'base' : d < 0 ? below[-d - 1] : above[d - 1];
    if (name) fontSize[name] = `${s}px`;
  });
  if (!fontSize.base) fontSize.base = '16px';
  const families = dna.typography.families.map((f) => f.value);
  const fontFamily = { body: families[0] || 'system-ui, sans-serif', display: dna.headingFamily || families[0] || 'system-ui, sans-serif' };
  const fontWeight = Object.fromEntries(uniqSorted(dna.typography.weights.map((w) => num(w.value))).map((w) => [w, String(w)]));

  // ---- spacing ----
  const spaceVals = uniqSorted([...dna.spacing.padding, ...dna.spacing.margin, ...dna.spacing.gap].map((s) => num(s.value))).filter((v) => v <= 160);
  const base = detectBase(spaceVals);
  const spacing = Object.fromEntries([0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((m) => [String(m).replace('.', '_'), `${m * base}px`]));

  // ---- radii / shadows ----
  const radiiVals = uniqSorted(dna.radii.map((r) => num(r.value))).filter((v) => v < 999);
  const radius = { none: '0px', sm: `${radiiVals[0] ?? 4}px`, md: `${radiiVals[Math.floor(radiiVals.length / 2)] ?? 8}px`, lg: `${radiiVals[radiiVals.length - 1] ?? 12}px`, full: '9999px' };
  const shadow = Object.fromEntries(dna.shadows.slice(0, 4).map((s, i) => [['sm', 'md', 'lg', 'xl'][i], s.value]));
  if (!shadow.sm) Object.assign(shadow, { sm: '0 1px 2px rgba(0,0,0,.06)', md: '0 4px 12px rgba(0,0,0,.08)', lg: '0 12px 32px rgba(0,0,0,.12)' });

  // ---- motion (fall back to sane defaults when the source has none) ----
  const durs = uniqSorted(dna.motion.durations.map((d) => msToNum(d.value))).filter((v) => v > 0 && v <= 1500);
  const pick = (arr, q, d) => (arr.length ? arr[Math.min(arr.length - 1, Math.floor(arr.length * q))] : d);
  const duration = { instant: '80ms', fast: `${pick(durs, 0, 150)}ms`, base: `${pick(durs, 0.5, 220)}ms`, slow: `${pick(durs, 0.99, 360)}ms`, skeleton: '1400ms' };
  const sourceEasing = dna.motion.easings.map((e) => e.value).find((e) => e.startsWith('cubic-bezier'));
  const easing = {
    standard: sourceEasing || 'cubic-bezier(0.2, 0, 0, 1)',
    enter: 'cubic-bezier(0, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  };

  const json = {
    meta: { source: dna.meta.url, title: dna.meta.title, generatedAt: new Date().toISOString(), scheme: isDark ? 'dark' : 'light', spacingBase: base },
    color: {
      bg: hex(bg), surface: hex(surface), text: hex(text), muted: hex(muted), border: hex(border),
      primary: hex(primary), onPrimary: hex(onPrimary),
      danger: '#dc2626', success: '#16a34a', warning: '#d97706',
      skeletonBase: isDark ? '#ffffff14' : '#0000000f', skeletonShine: isDark ? '#ffffff26' : '#0000001a',
      focusRing: hex(primary),
    },
    palette,
    font: { family: fontFamily, size: fontSize, weight: fontWeight, lineHeight: { tight: '1.2', base: '1.5', loose: '1.7' } },
    space: spacing, radius, shadow,
    motion: { duration, easing },
    breakpoints: dna.media.breakpoints,
    sourceCustomProperties: dna.customProperties,
  };

  return { json, css: tokensToCSS(json) };
}

export function tokensToCSS(t) {
  const lines = [];
  const emit = (prefix, obj) => { for (const [k, v] of Object.entries(obj)) { if (typeof v === 'object') emit(`${prefix}-${k}`, v); else lines.push(`  --${prefix}-${k}: ${v};`); } };
  emit('color', t.color);
  emit('font', { family: t.font.family, size: t.font.size, weight: t.font.weight, lh: t.font.lineHeight });
  emit('space', t.space); emit('radius', t.radius); emit('shadow', t.shadow);
  emit('duration', t.motion.duration); emit('ease', t.motion.easing);
  return `/* Generated by super-uiux-omni from ${t.meta.source} */\n:root {\n${lines.join('\n')}\n}\n\n@media (prefers-reduced-motion: reduce) {\n  :root {\n    --duration-fast: 0ms;\n    --duration-base: 0ms;\n    --duration-slow: 0ms;\n  }\n}\n`;
}
