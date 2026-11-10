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

/** hex → OKLab, for perceptual distance between colors. */
export function oklab(hex) {
  const lin = [1, 3, 5].map((i) => { const v = parseInt(hex.slice(i, i + 2), 16) / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  const [r, g, b] = lin;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
export const deltaE = (a, b) => { const [x, y] = [oklab(a), oklab(b)]; return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };

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
  // WCAG 1.4.3 counts placeholder as text: also hold 4.5:1 on the surfaces inputs sit on.
  for (let L = dark ? 0.62 : 0.58, i = 0; i < 60 && Math.min(wcag(roles['text-3'], roles['surface-inset']), wcag(roles['text-3'], roles['surface-0'])) < 4.5; i++) {
    L += dark ? 0.01 : -0.01; roles['text-3'] = oklch(L, bc * 0.6, bh);
  }

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

  // ---- beyond color (round 4; numbers from reports/Complete theme systems.md) ----
  // Interaction state layers: overlays of the content color, M3 opacities
  // (hover .08, focus .10, pressed .12 so it reads apart from hover, dragged .16).
  const t1 = roles['text-1'];
  roles['state-hover'] = `color-mix(in oklab, ${t1} 8%, transparent)`;
  roles['state-focus'] = `color-mix(in oklab, ${t1} 10%, transparent)`;
  roles['state-pressed'] = `color-mix(in oklab, ${t1} 12%, transparent)`;
  roles['state-dragged'] = `color-mix(in oklab, ${t1} 16%, transparent)`;
  // Selection is not attention: tint from the info family (or preset.selection) so a
  // selected row never reads as "needs you" when the accent means attention.
  roles['state-selected'] = `color-mix(in oklab, ${roles[`${preset.selection || 'info'}-solid`]} 18%, transparent)`;
  roles['state-disabled-opacity'] = '0.38';

  // Elevation: dark mode leans on the lighter surface ladder; shadows get darker
  // and larger to stay visible. Light mode uses soft, tinted shadows.
  const sh = dark
    ? ['0 1px 2px rgba(0, 0, 0, 0.5)', '0 4px 12px rgba(0, 0, 0, 0.45), 0 1px 3px rgba(0, 0, 0, 0.5)', '0 16px 40px rgba(0, 0, 0, 0.55), 0 4px 12px rgba(0, 0, 0, 0.4)']
    : ['0 1px 2px rgba(0, 0, 0, 0.08)', '0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)', '0 16px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)'];
  sh.forEach((v, i) => { roles[`shadow-${i + 1}`] = v; });

  // Shape: one scale per concept (sharp instruments, soft tools, round consumer).
  const SHAPES = { sharp: [2, 3, 6], soft: [4, 8, 12], round: [8, 12, 20] };
  const [rs, rm, rl] = SHAPES[preset.shape] || SHAPES.soft;
  Object.assign(roles, { 'radius-sm': `${rs}px`, 'radius-md': `${rm}px`, 'radius-lg': `${rl}px`, 'radius-full': '999px' });

  // Type roles: a theme may swap faces (M3 brand/plain idea); sizes stay in the component scale.
  roles['font-sans'] = preset.font?.sans || 'system-ui, -apple-system, "Segoe UI", sans-serif';
  roles['font-mono'] = preset.font?.mono || 'ui-monospace, "SFMono-Regular", Menlo, monospace';

  // Motion: calm tools vs snappy consoles; reduced motion zeroes them in CSS.
  const MOTION = { calm: [140, 220, 320], snappy: [90, 160, 240] };
  const [mf, mb, ms] = MOTION[preset.motion] || MOTION.calm;
  Object.assign(roles, { 'duration-fast': `${mf}ms`, 'duration-base': `${mb}ms`, 'duration-slow': `${ms}ms`,
    'ease-standard': 'cubic-bezier(0.2, 0, 0, 1)', 'ease-enter': 'cubic-bezier(0, 0, 0.2, 1)', 'ease-exit': 'cubic-bezier(0.4, 0, 1, 1)' });

  // Syntax highlighting: code is content, so every token color reads at Lc 60+ on the code well.
  const SYN = { keyword: [preset.status?.active ?? 320, 0.12], string: [st.ok, 0.11], number: [st.warn, 0.12], function: [st.info, 0.11], type: [(st.info + 40) % 360, 0.1] };
  for (const [k, [h, c]] of Object.entries(SYN)) {
    let L = dark ? 0.78 : 0.45, hex = oklch(L, c, h);
    for (let i = 0; i < 50 && apca(hex, roles['surface-inset']) < 62; i++) { L += dark ? 0.01 : -0.01; hex = oklch(L, c, h); }
    roles[`syntax-${k}`] = hex;
  }
  roles['syntax-comment'] = roles['text-2'];
  roles['syntax-plain'] = roles['text-1'];

  // Links, scrim, focus ring geometry.
  roles['link'] = roles['info-fg'];
  roles['link-visited'] = roles['active-fg'];
  roles['scrim'] = dark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)';
  roles['focus-width'] = hi ? '3px' : '2px';
  roles['focus-offset'] = '2px';

  // Categorical data viz: 8 hues spread for distinctness (blue, orange, green, pink,
  // teal, red, olive, violet order), each solved to ≥ 3:1 against panels (WCAG 1.4.11).
  const VIZ = [255, 60, 150, 345, 195, 25, 105, 295];
  VIZ.forEach((h, i) => {
    let L = dark ? 0.72 : 0.56, hex = oklch(L, 0.13, h);
    for (let k = 0; k < 40 && Math.min(wcag(hex, roles['surface-1']), wcag(hex, roles['surface-0'])) < 3; k++) { L += dark ? 0.01 : -0.01; hex = oklch(L, 0.13, h); }
    roles[`viz-${i + 1}`] = hex;
  });

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
  for (const k of ['keyword', 'string', 'number', 'function', 'type', 'comment']) if (r[`syntax-${k}`]) need(`syntax-${k}`, 'surface-inset', 60, `code ${k}`);
  if (r.link) { need('link', 'surface-0', 60, 'link text'); need('link', 'surface-1', 60, 'link text'); }
  // Placeholder is text under WCAG 1.4.3.
  for (const sname of ['surface-0', 'surface-inset']) pairs.push({ fg: 'text-3', bg: sname, target: 4.5, lc: wcag(r['text-3'], r[sname]), why: 'placeholder (WCAG 2)', wcag: true });
  // Data viz marks: ≥ 3:1 against panels (WCAG 1.4.11 non-text contrast).
  for (let i = 1; r[`viz-${i}`]; i++) pairs.push({ fg: `viz-${i}`, bg: 'surface-1', target: 3, lc: wcag(r[`viz-${i}`], r['surface-1']), why: 'chart mark vs panel', wcag: true });
  // Lit legends are small bold text: also hold WCAG 2 AA (4.5:1).
  for (const f of ['ok', 'warn', 'danger', 'info', 'active', 'accent']) {
    const ratio = wcag(r[`${f}-on-solid`], r[`${f}-solid`]);
    pairs.push({ fg: `${f}-on-solid`, bg: `${f}-solid`, target: 4.5, lc: ratio, why: 'WCAG 2 AA for small legends', wcag: true });
  }
  // Distinct families must not look alike (studio: active == danger; master-control: accent ≈ danger).
  // OKLab ΔE ≥ 0.08 between lit fills. warn/accent may share a hue when the accent *is* the caution color.
  const fams = ['ok', 'warn', 'danger', 'info', 'active', 'accent'];
  for (let i = 0; i < fams.length; i++) for (let j = i + 1; j < fams.length; j++) {
    if (fams[i] === 'warn' && fams[j] === 'accent') continue;
    const d = +deltaE(r[`${fams[i]}-solid`], r[`${fams[j]}-solid`]).toFixed(3);
    pairs.push({ fg: `${fams[i]}-solid`, bg: `${fams[j]}-solid`, target: 0.08, lc: d, why: 'status families must look different (OKLab ΔE)' });
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
  out.push('@media (prefers-reduced-motion: reduce) { :root, [data-theme] { --duration-fast: 1ms; --duration-base: 1ms; --duration-slow: 1ms; } }');
  // Windows High Contrast: map every role onto system colors so nothing relies on our palette.
  const fc = ['--surface-inset: Canvas', '--surface-0: Canvas', '--surface-1: Canvas', '--surface-2: Canvas', '--surface-3: Canvas',
    '--border-1: CanvasText', '--border-2: CanvasText', '--border-strong: CanvasText', '--text-1: CanvasText', '--text-2: CanvasText', '--text-3: GrayText',
    '--focus: Highlight', '--link: LinkText', '--link-visited: VisitedText', '--state-hover: transparent', '--state-pressed: transparent', '--state-selected: Highlight',
    ...['ok', 'warn', 'danger', 'info', 'active', 'accent'].flatMap((f) => [`--${f}-fg: CanvasText`, `--${f}-bg: Canvas`, `--${f}-border: CanvasText`, `--${f}-solid: ButtonFace`, `--${f}-on-solid: ButtonText`])];
  out.push(`@media (forced-colors: active) { :root, [data-theme] { ${fc.join('; ')}; --shadow-1: none; --shadow-2: none; --shadow-3: none; } }`);
  return out.join('\n') + '\n';
}

/**
 * Blocking <head> snippet: applies ?theme= → saved → OS contrast/scheme before
 * first paint (no flash of the wrong theme), and sets color-scheme so native
 * controls/scrollbars match. Put it inline in <head>, before stylesheets.
 */
export function bootScript(themes, { storageKey = 'theme', dark, light, highContrast } = {}) {
  const names = themes.map((t) => t.name);
  dark ||= themes.find((t) => t.mode === 'dark' && t.contrast !== 'high')?.name;
  light ||= themes.find((t) => t.mode === 'light')?.name || dark;
  highContrast ||= themes.find((t) => t.contrast === 'high')?.name || dark;
  const modes = Object.fromEntries(themes.map((t) => [t.name, t.mode]));
  return `<script>(function(){var n=${JSON.stringify(names)},m=${JSON.stringify(modes)},t=new URLSearchParams(location.search).get('theme'),s=null;try{s=localStorage.getItem(${JSON.stringify(storageKey)})}catch(e){}var q=function(x){return matchMedia(x).matches};var pick=n.indexOf(t)>-1?t:n.indexOf(s)>-1?s:q('(prefers-contrast: more)')?${JSON.stringify(highContrast)}:q('(prefers-color-scheme: light)')?${JSON.stringify(light)}:${JSON.stringify(dark)};var d=document.documentElement;d.dataset.theme=pick;d.style.colorScheme=m[pick]||'dark';})();</script>`;
}

/**
 * DTCG 2025.10 export: one <name>.tokens.json per theme (semantic tier) plus a
 * resolver with a `theme` modifier. Overlays (color-mix) are flattened to
 * hex-with-alpha so every color token is a plain color value.
 */
export function toDTCG(theme) {
  const tok = {};
  const put = (pathArr, token) => { let o = tok; for (const k of pathArr.slice(0, -1)) o = (o[k] ||= {}); o[pathArr.at(-1)] = token; };
  for (const [k, v] of Object.entries(theme.roles)) {
    let m;
    if (/^#[0-9a-f]{6}$/i.test(v)) put(['color', ...k.split('-')], { $type: 'color', $value: v });
    else if ((m = v.match(/^color-mix\(in oklab, (#[0-9a-f]{6}) (\d+)%, transparent\)$/i))) put(['color', ...k.split('-')], { $type: 'color', $value: m[1] + Math.round((+m[2] / 100) * 255).toString(16).padStart(2, '0'), $description: `${m[2]}% overlay of ${m[1]}` });
    else if (/^\d+(\.\d+)?px$/.test(v)) put(['dimension', ...k.split('-')], { $type: 'dimension', $value: { value: parseFloat(v), unit: 'px' } });
    else if (/^\d+ms$/.test(v)) put(['duration', k.replace(/^duration-/, '')], { $type: 'duration', $value: { value: parseFloat(v), unit: 'ms' } });
    else if ((m = v.match(/^cubic-bezier\(([^)]+)\)$/))) put(['easing', k.replace(/^ease-/, '')], { $type: 'cubicBezier', $value: m[1].split(',').map(Number) });
    else if (k.startsWith('font-')) put(['font', k.replace(/^font-/, '')], { $type: 'fontFamily', $value: v.split(',').map((x) => x.trim().replace(/^"|"$/g, '')) });
    else if (k === 'state-disabled-opacity') put(['opacity', 'disabled'], { $type: 'number', $value: +v });
    else put(['other', k], { $value: v, $description: 'CSS value (not a DTCG primitive type)' });
  }
  tok.$description = `${theme.label} · ${theme.mode}${theme.contrast === 'high' ? ' · high contrast' : ''} · generated by omni themegen`;
  return tok;
}

export function toResolver(themes, dir = '.') {
  return {
    $schema: 'https://www.designtokens.org/schemas/2025.10/resolver.json',
    name: 'omni-themes',
    modifiers: { theme: { contexts: Object.fromEntries(themes.map((t) => [t.name, [{ $ref: `${dir}/${t.name}.tokens.json` }]])), default: themes.find((t) => t.mode === 'dark')?.name || themes[0].name } },
    resolutionOrder: [{ $ref: '#/modifiers/theme' }],
  };
}
