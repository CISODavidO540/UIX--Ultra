// Theme engine: a few OKLCH inputs → every semantic color role, light/dark,
// contrast-validated with APCA. Components consume roles, never raw colors.
//
// Why (taste.md 2026-11-09): "needs better theme management and colors… more
// grounding". Grounded = every status/accent comes with its own tinted surface,
// border and solid; surfaces form a visible elevation ladder with inset wells.

// ---------- color math ----------
const clamp01 = (x) => Math.min(1, Math.max(0, x));
function oklchToLinear(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
const inGamut = (rgb) => rgb.every((v) => v >= -0.0005 && v <= 1.0005);
const toSrgb = (v) => { v = clamp01(v); return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055; };
/** OKLCH → hex, reducing chroma until it fits sRGB (keeps hue and lightness). */
export function oklch(L, C, h) {
  let c = C, rgb = oklchToLinear(L, c, h);
  while (!inGamut(rgb) && c > 0) { c = Math.max(0, c - 0.005); rgb = oklchToLinear(L, c, h); }
  return '#' + rgb.map((v) => Math.round(toSrgb(v) * 255).toString(16).padStart(2, '0')).join('');
}

// APCA-W3 0.0.98G (same as src/craft.js), absolute Lc.
const Ys = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const y = 0.2126729 * r ** 2.4 + 0.7151522 * g ** 2.4 + 0.072175 * b ** 2.4;
  return y < 0.022 ? y + (0.022 - y) ** 1.414 : y;
};
export function apca(txt, bg) {
  const yt = Ys(txt), yb = Ys(bg);
  if (Math.abs(yb - yt) < 0.0005) return 0;
  const s = yb > yt ? (yb ** 0.56 - yt ** 0.57) * 1.14 : (yb ** 0.65 - yt ** 0.62) * 1.14;
  const lc = yb > yt ? (s < 0.1 ? 0 : s - 0.027) : (s > -0.1 ? 0 : s + 0.027);
  return Math.round(Math.abs(lc * 100));
}

/** WCAG 2.x contrast ratio (still the legal bar in many places; APCA is the better perceptual one). */
export function wcag(a, b) {
  const lin = (hex) => [1, 3, 5].map((i) => { const v = parseInt(hex.slice(i, i + 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  const L = (hex) => { const [r, g, bb] = lin(hex); return 0.2126 * r + 0.7152 * g + 0.0722 * bb; };
  const [x, y] = [L(a), L(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(2);
}

// ---------- generation ----------
const DEFAULT_STATUS = { ok: 150, warn: 75, danger: 25, info: 245, active: 320 };

/**
 * preset = { name, label, mode: 'dark'|'light', contrast: 'normal'|'high',
 *            base: { hue, chroma }, accent: { hue, chroma, meaning },
 *            status?: { ok, warn, danger, info, active } (hues), usecases?: [...] }
 */
export function generate(preset) {
  const dark = preset.mode !== 'light';
  const hi = preset.contrast === 'high';
  const bh = preset.base?.hue ?? 250, bc = preset.base?.chroma ?? 0.012;
  const st = { ...DEFAULT_STATUS, ...(preset.status || {}) };
  const roles = {};
  const N = (L, c = bc) => oklch(L, c, bh);

  // Surface ladder (grounding): inset well < app bg < panel < raised < overlay.
  const S = dark
    ? { inset: 0.15, bg: 0.18, panel: 0.215, raised: 0.25, overlay: 0.285 }
    : { inset: 0.94, bg: 0.975, panel: 1.0, raised: 1.0, overlay: 1.0 };
  if (hi) for (const k of Object.keys(S)) S[k] = dark ? S[k] - 0.04 : Math.min(1, S[k] + 0.02);
  roles['surface-inset'] = N(S.inset);
  roles['surface-0'] = N(S.bg);
  roles['surface-1'] = N(S.panel, dark ? bc : bc * 0.4);
  roles['surface-2'] = N(S.raised, dark ? bc : bc * 0.3);
  roles['surface-3'] = N(S.overlay, dark ? bc : bc * 0.2);
  roles['border-1'] = N(dark ? 0.32 : 0.88);
  roles['border-2'] = N(dark ? 0.42 : 0.78);
  roles['border-strong'] = N(dark ? 0.6 : 0.55);

  // Text: solve lightness so it passes on the hardest surface it sits on.
  const hardest = dark ? [roles['surface-3'], roles['surface-2']] : [roles['surface-inset'], roles['surface-0']];
  const solve = (target, start, step, chroma = bc * 0.6, hue = bh) => {
    let L = start, hex = oklch(L, chroma, hue);
    for (let i = 0; i < 80 && Math.min(...hardest.map((b) => apca(hex, b))) < target; i++) { L += step; hex = oklch(Math.min(1, Math.max(0, L)), chroma, hue); }
    return hex;
  };
  roles['text-1'] = solve(hi ? 95 : 88, dark ? 0.9 : 0.25, dark ? 0.01 : -0.01);
  roles['text-2'] = solve(hi ? 80 : 75, dark ? 0.78 : 0.42, dark ? 0.01 : -0.01);
  roles['text-3'] = solve(hi ? 60 : 50, dark ? 0.62 : 0.58, dark ? 0.01 : -0.01); // placeholder / disabled (APCA Lc 45+)

  // Status + accent families, each grounded: fg, bg (tinted surface), border, solid, on-solid.
  const families = { ...Object.fromEntries(Object.entries(st).map(([k, h]) => [k, { hue: h, chroma: 0.15 }])), accent: { hue: preset.accent?.hue ?? 75, chroma: preset.accent?.chroma ?? 0.16 } };
  for (const [name, { hue, chroma }] of Object.entries(families)) {
    // foreground text: must read on its own tinted bg and on panels
    const bg = oklch(dark ? 0.24 : 0.96, chroma * (dark ? 0.32 : 0.22), hue);
    roles[`${name}-bg`] = bg;
    roles[`${name}-border`] = oklch(dark ? 0.5 : 0.72, chroma * 0.7, hue);
    let L = dark ? 0.78 : 0.48, fg = oklch(L, chroma, hue);
    const fgTargets = [bg, roles['surface-1'], roles['surface-2']];
    for (let i = 0; i < 60 && Math.min(...fgTargets.map((b) => apca(fg, b))) < (hi ? 75 : 62); i++) { L += dark ? 0.01 : -0.01; fg = oklch(L, chroma, hue); }
    roles[`${name}-fg`] = fg;
    // Lit/solid fill: search lightness until its legend (dark or white) reads at Lc 60+ (75 in high contrast).
    const onDark = N(0.18), onLight = '#ffffff', want = hi ? 75 : 62;
    let best = null;
    for (const dir of dark ? [1, -1] : [-1, 1]) {
      for (let Ls = dark ? 0.76 : 0.6; Ls > 0.3 && Ls < 0.95 && !best; Ls += dir * 0.01) {
        const solid = oklch(Ls, chroma * 1.05, hue);
        const on = apca(onDark, solid) >= apca(onLight, solid) ? onDark : onLight;
        if (apca(on, solid) >= want && wcag(on, solid) >= 4.5) best = { solid, on };
      }
      if (best) break;
    }
    best ||= { solid: oklch(dark ? 0.8 : 0.55, chroma, hue), on: dark ? onDark : onLight };
    roles[`${name}-solid`] = best.solid;
    roles[`${name}-on-solid`] = best.on;
  }
  roles['focus'] = roles['accent-solid'];

  return { name: preset.name, label: preset.label || preset.name, mode: dark ? 'dark' : 'light', contrast: hi ? 'high' : 'normal', roles, report: validate(roles) };
}

/** Every pair that matters, with its APCA target. */
export function validate(r) {
  const pairs = [];
  const need = (fg, bg, target, why) => pairs.push({ fg, bg, target, lc: apca(r[fg], r[bg]), why });
  for (const s of ['surface-0', 'surface-1', 'surface-2', 'surface-inset']) {
    need('text-1', s, 75, 'body text'); need('text-2', s, 60, 'secondary text'); need('text-3', s, 45, 'placeholder/disabled');
  }
  for (const f of ['ok', 'warn', 'danger', 'info', 'active', 'accent']) {
    need(`${f}-fg`, `${f}-bg`, 60, `${f} label on its ground`);
    need(`${f}-fg`, 'surface-1', 60, `${f} label on panel`);
    need(`${f}-on-solid`, `${f}-solid`, 60, `text on lit ${f}`);
    need('text-1', `${f}-bg`, 75, `body text on ${f} ground`);
  }
  // Lit legends are small bold text: also hold WCAG 2 AA (4.5:1).
  for (const f of ['ok', 'warn', 'danger', 'info', 'active', 'accent']) {
    const ratio = wcag(r[`${f}-on-solid`], r[`${f}-solid`]);
    pairs.push({ fg: `${f}-on-solid`, bg: `${f}-solid`, target: 4.5, lc: ratio, why: 'WCAG 2 AA for small legends', wcag: true });
  }
  // Distinct families must not collapse into the same color (studio: active == danger).
  const fams = ['ok', 'warn', 'danger', 'info', 'active', 'accent'];
  for (let i = 0; i < fams.length; i++) for (let j = i + 1; j < fams.length; j++) {
    if (r[`${fams[i]}-solid`] === r[`${fams[j]}-solid`]) pairs.push({ fg: `${fams[i]}-solid`, bg: `${fams[j]}-solid`, target: 1, lc: 0, why: 'two status families are the same color' });
  }
  const fails = pairs.filter((p) => p.lc < p.target);
  return { pairs: pairs.length, fails };
}

export function toCSS(themes, { defaultTheme } = {}) {
  const out = ['/* Generated by omni themegen — edit the presets, not this file. */'];
  for (const t of themes) {
    const sel = t.name === (defaultTheme || themes[0].name) ? `:root, [data-theme="${t.name}"]` : `[data-theme="${t.name}"]`;
    out.push(`${sel} {`, `  color-scheme: ${t.mode};`);
    for (const [k, v] of Object.entries(t.roles)) out.push(`  --${k}: ${v};`);
    out.push('}');
  }
  out.push('@media (forced-colors: active) { :root { --focus: Highlight; } }');
  return out.join('\n') + '\n';
}
