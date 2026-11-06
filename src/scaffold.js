// Generates the "beyond pretty" layer: the states, motion and loading UI that
// a screenshot never shows but users feel on every interaction.

const v = (name) => `var(--${name})`;

function skeletonCSS() {
  return `/* Skeleton loaders: match the real layout so nothing jumps when data lands. */
.sk {
  position: relative;
  overflow: hidden;
  background: ${v('color-skeletonBase')};
  border-radius: ${v('radius-sm')};
  color: transparent !important;
  user-select: none;
  pointer-events: none;
}
.sk::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, ${v('color-skeletonShine')}, transparent);
  animation: sk-shimmer ${v('duration-skeleton')} ease-in-out infinite;
}
@keyframes sk-shimmer { to { transform: translateX(100%); } }

.sk-text   { height: 1em; margin: .35em 0; }
.sk-text:last-child { width: 62%; }
.sk-title  { height: 1.6em; width: 48%; margin-bottom: .6em; }
.sk-avatar { width: 40px; height: 40px; border-radius: ${v('radius-full')}; flex: none; }
.sk-media  { aspect-ratio: 16 / 9; width: 100%; border-radius: ${v('radius-md')}; }
.sk-button { height: 40px; width: 120px; border-radius: ${v('radius-md')}; }
.sk-card   { padding: ${v('space-4')}; border-radius: ${v('radius-lg')}; background: ${v('color-surface')}; display: grid; gap: ${v('space-2')}; }

/* Only show a skeleton if loading takes > 150ms, so fast loads don't flash. */
.sk-delay { animation: sk-reveal 1ms 150ms both; opacity: 0; }
@keyframes sk-reveal { to { opacity: 1; } }

@media (prefers-reduced-motion: reduce) {
  .sk::after { animation: none; }
  .sk { animation: sk-pulse 2s ease-in-out infinite; }
  @keyframes sk-pulse { 50% { opacity: .6; } }
}
`;
}

function motionCSS() {
  return `/* Motion system: enter fast-out-slow, exit quicker than enter, always honor reduced motion. */
.m-fade-in    { animation: m-fade ${v('duration-base')} ${v('ease-enter')} both; }
.m-rise-in    { animation: m-rise ${v('duration-base')} ${v('ease-enter')} both; }
.m-scale-in   { animation: m-scale ${v('duration-fast')} ${v('ease-spring')} both; }
.m-slide-in-r { animation: m-slide-r ${v('duration-slow')} ${v('ease-enter')} both; }
.m-fade-out   { animation: m-fade ${v('duration-fast')} ${v('ease-exit')} reverse both; }

@keyframes m-fade    { from { opacity: 0; } }
@keyframes m-rise    { from { opacity: 0; transform: translateY(8px); } }
@keyframes m-scale   { from { opacity: 0; transform: scale(.96); } }
@keyframes m-slide-r { from { opacity: 0; transform: translateX(24px); } }

/* Stagger children: set --i on each child (style="--i:3"). */
.m-stagger > * { animation-delay: calc(var(--i, 0) * 40ms); }

/* Content swap from skeleton → real content. */
.m-swap { animation: m-fade ${v('duration-base')} ${v('ease-standard')} both; }

/* Cross-page / cross-state transitions (View Transitions API, progressive). */
@view-transition { navigation: auto; }
::view-transition-old(root) { animation: m-fade ${v('duration-fast')} ${v('ease-exit')} reverse both; }
::view-transition-new(root) { animation: m-rise ${v('duration-base')} ${v('ease-enter')} both; }

/* Collapsible height without JS measuring. */
.m-collapse { display: grid; grid-template-rows: 0fr; transition: grid-template-rows ${v('duration-base')} ${v('ease-standard')}; }
.m-collapse[data-open="true"] { grid-template-rows: 1fr; }
.m-collapse > * { overflow: hidden; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
`;
}

function statesCSS() {
  return `/* Every interactive element needs all of these, not just "default". */
.btn {
  --_bg: ${v('color-primary')};
  --_fg: ${v('color-onPrimary')};
  display: inline-flex; align-items: center; justify-content: center; gap: ${v('space-2')};
  min-height: 44px; padding: 0 ${v('space-4')};
  border: 0; border-radius: ${v('radius-md')};
  background: var(--_bg); color: var(--_fg);
  font: inherit; font-weight: 600; cursor: pointer;
  transition:
    background-color ${v('duration-fast')} ${v('ease-standard')},
    transform ${v('duration-instant')} ${v('ease-standard')},
    box-shadow ${v('duration-fast')} ${v('ease-standard')},
    opacity ${v('duration-fast')} ${v('ease-standard')};
}
.btn:hover              { background: color-mix(in srgb, var(--_bg) 88%, black); }
.btn:active             { transform: scale(.98); }
.btn:focus-visible      { outline: 2px solid ${v('color-focusRing')}; outline-offset: 2px; }
.btn:disabled,
.btn[aria-disabled=true]{ opacity: .45; cursor: not-allowed; transform: none; }
.btn-ghost              { --_bg: transparent; --_fg: ${v('color-text')}; box-shadow: inset 0 0 0 1px ${v('color-border')}; }
.btn-ghost:hover        { background: ${v('color-surface')}; }

/* Loading: keep the width, swap label for a spinner, block double-submits. */
.btn[aria-busy=true] { color: transparent; pointer-events: none; position: relative; }
.btn[aria-busy=true]::after {
  content: ""; position: absolute; width: 1.1em; height: 1.1em;
  border: 2px solid var(--_fg); border-right-color: transparent; border-radius: 50%;
  animation: spin 700ms linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Success flash after an action completes. */
.btn[data-state=success] { --_bg: ${v('color-success')}; }

/* Inputs */
.field { display: grid; gap: ${v('space-1')}; }
.field label { font-weight: 600; font-size: ${v('font-size-sm')}; }
.input {
  min-height: 44px; padding: 0 ${v('space-3')};
  border: 1px solid ${v('color-border')}; border-radius: ${v('radius-md')};
  background: ${v('color-bg')}; color: ${v('color-text')}; font: inherit;
  transition: border-color ${v('duration-fast')} ${v('ease-standard')}, box-shadow ${v('duration-fast')} ${v('ease-standard')};
}
.input:hover         { border-color: ${v('color-muted')}; }
.input:focus-visible { outline: none; border-color: ${v('color-focusRing')}; box-shadow: 0 0 0 3px color-mix(in srgb, ${v('color-focusRing')} 30%, transparent); }
.input[aria-invalid=true] { border-color: ${v('color-danger')}; animation: shake 300ms ${v('ease-standard')}; }
.field .hint  { color: ${v('color-muted')}; font-size: ${v('font-size-sm')}; }
.field .error { color: ${v('color-danger')}; font-size: ${v('font-size-sm')}; }
@keyframes shake { 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }

/* Empty / error / offline panels: every list and fetch needs these. */
.state-panel {
  display: grid; justify-items: center; gap: ${v('space-3')}; text-align: center;
  padding: ${v('space-10')} ${v('space-6')};
  border: 1px dashed ${v('color-border')}; border-radius: ${v('radius-lg')};
  color: ${v('color-muted')};
}
.state-panel h3 { color: ${v('color-text')}; margin: 0; }
.state-panel[data-kind=error] { border-color: color-mix(in srgb, ${v('color-danger')} 40%, transparent); }

/* Toasts */
.toast-region { position: fixed; inset: auto ${v('space-4')} ${v('space-4')} auto; display: grid; gap: ${v('space-2')}; z-index: 1000; }
.toast { padding: ${v('space-3')} ${v('space-4')}; border-radius: ${v('radius-md')}; background: ${v('color-text')}; color: ${v('color-bg')}; box-shadow: ${v('shadow-lg')}; animation: m-rise ${v('duration-base')} ${v('ease-enter')} both; }
`;
}

function demoHTML(tokens) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>OMNI state sheet</title>
<link rel="stylesheet" href="../tokens.css">
<link rel="stylesheet" href="css/skeleton.css">
<link rel="stylesheet" href="css/motion.css">
<link rel="stylesheet" href="css/states.css">
<style>
  body { margin: 0; background: var(--color-bg); color: var(--color-text); font-family: var(--font-family-body); line-height: 1.5; }
  main { max-width: 960px; margin: 0 auto; padding: var(--space-8) var(--space-4); display: grid; gap: var(--space-10); }
  section { display: grid; gap: var(--space-4); }
  .row { display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: center; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--space-4); }
  .card { padding: var(--space-4); border-radius: var(--radius-lg); background: var(--color-surface); box-shadow: var(--shadow-sm); }
  h2 { margin: 0; font-size: var(--font-size-xl, 1.25rem); }
</style>
</head>
<body>
<main>
  <header><h1>State sheet</h1><p>Generated from <code>${tokens.meta.source}</code>. Every state below should exist in the real product.</p></header>

  <section>
    <h2>Buttons</h2>
    <div class="row">
      <button class="btn">Default</button>
      <button class="btn" disabled>Disabled</button>
      <button class="btn" aria-busy="true">Saving</button>
      <button class="btn" data-state="success">Saved ✓</button>
      <button class="btn btn-ghost">Secondary</button>
      <button class="btn" id="demo-async">Click: async flow</button>
    </div>
  </section>

  <section>
    <h2>Inputs</h2>
    <div class="grid">
      <div class="field"><label for="a">Email</label><input id="a" class="input" placeholder="you@example.com"><span class="hint">We never share it.</span></div>
      <div class="field"><label for="b">Email (error)</label><input id="b" class="input" aria-invalid="true" aria-describedby="b-err" value="not-an-email"><span class="error" id="b-err">Enter a valid email address.</span></div>
    </div>
  </section>

  <section>
    <h2>Loading → content</h2>
    <div class="grid" id="cards" aria-busy="true" aria-live="polite">
      ${[0, 1, 2].map(() => '<div class="sk-card sk-delay"><div class="sk sk-media"></div><div class="sk sk-title"></div><div class="sk sk-text"></div><div class="sk sk-text"></div></div>').join('\n      ')}
    </div>
    <div class="row"><button class="btn btn-ghost" id="reload">Replay loading</button></div>
  </section>

  <section>
    <h2>Empty & error</h2>
    <div class="grid">
      <div class="state-panel" data-kind="empty"><h3>No projects yet</h3><p>Projects you create show up here.</p><button class="btn">New project</button></div>
      <div class="state-panel" data-kind="error" role="alert"><h3>Couldn't load projects</h3><p>Check your connection and try again.</p><button class="btn btn-ghost">Retry</button></div>
    </div>
  </section>
</main>
<div class="toast-region" aria-live="polite"></div>
<script>
  const cards = document.getElementById('cards');
  const skeleton = cards.innerHTML;
  function load() {
    cards.setAttribute('aria-busy', 'true');
    cards.innerHTML = skeleton;
    setTimeout(() => {
      cards.innerHTML = [1, 2, 3].map((n, i) =>
        '<article class="card m-swap m-rise-in" style="--i:' + i + ';animation-delay:' + i * 40 + 'ms"><h3>Item ' + n + '</h3><p>Real content replaces the skeleton without moving the layout.</p></article>').join('');
      cards.setAttribute('aria-busy', 'false');
    }, 1200);
  }
  load();
  document.getElementById('reload').onclick = load;

  const toast = (msg) => { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.querySelector('.toast-region').append(t); setTimeout(() => { t.classList.add('m-fade-out'); t.addEventListener('animationend', () => t.remove(), { once: true }); }, 2200); };
  const b = document.getElementById('demo-async');
  b.onclick = () => {
    const label = b.textContent;
    b.setAttribute('aria-busy', 'true');
    setTimeout(() => { b.removeAttribute('aria-busy'); b.dataset.state = 'success'; b.textContent = 'Done ✓'; toast('Changes saved');
      setTimeout(() => { delete b.dataset.state; b.textContent = label; }, 1500); }, 1000);
  };
</script>
</body>
</html>
`;
}

function reactFiles() {
  return {
    'react/Skeleton.tsx': `import type { CSSProperties } from 'react';

type Variant = 'text' | 'title' | 'avatar' | 'media' | 'button';
export function Skeleton({ variant = 'text', lines = 1, style }: { variant?: Variant; lines?: number; style?: CSSProperties }) {
  return (
    <>
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className={\`sk sk-\${variant}\`} style={{ display: 'block', ...style }} aria-hidden="true" />
      ))}
    </>
  );
}
`,
    'react/AsyncView.tsx': `import type { ReactNode } from 'react';

/** Forces every data view to decide what it shows for each state. */
export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error; retry?: () => void }
  | { status: 'success'; data: T };

export function AsyncView<T>({ state, skeleton, empty, isEmpty = (d) => Array.isArray(d) && d.length === 0, children }: {
  state: AsyncState<T>;
  skeleton: ReactNode;
  empty: ReactNode;
  isEmpty?: (data: T) => boolean;
  children: (data: T) => ReactNode;
}) {
  if (state.status === 'loading') return <div aria-busy="true" aria-live="polite" className="sk-delay">{skeleton}</div>;
  if (state.status === 'error')
    return (
      <div className="state-panel m-fade-in" data-kind="error" role="alert">
        <h3>Something went wrong</h3>
        <p>{state.error.message}</p>
        {state.retry && <button className="btn btn-ghost" onClick={state.retry}>Retry</button>}
      </div>
    );
  if (isEmpty(state.data)) return <div className="m-fade-in">{empty}</div>;
  return <div className="m-swap">{children(state.data)}</div>;
}
`,
    'react/AsyncButton.tsx': `import { useState, type ButtonHTMLAttributes } from 'react';

/** Button with loading, success and error states built in; blocks double submits. */
export function AsyncButton({ onAction, children, successLabel = 'Done', ...rest }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
  onAction: () => Promise<unknown>;
  successLabel?: string;
}) {
  const [state, setState] = useState<'idle' | 'busy' | 'success' | 'error'>('idle');
  const run = async () => {
    if (state === 'busy') return;
    setState('busy');
    try { await onAction(); setState('success'); setTimeout(() => setState('idle'), 1500); }
    catch { setState('error'); setTimeout(() => setState('idle'), 2000); }
  };
  return (
    <button {...rest} className={\`btn \${rest.className ?? ''}\`} aria-busy={state === 'busy'} data-state={state} onClick={run}>
      {state === 'success' ? successLabel : state === 'error' ? 'Try again' : children}
    </button>
  );
}
`,
    'react/useViewTransition.ts': `/** Wrap a state update so the browser animates between before/after (falls back to instant). */
export function withViewTransition(update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!doc.startViewTransition || reduce) return update();
  doc.startViewTransition(update);
}
`,
  };
}

function tailwindFiles(t) {
  return {
    'tailwind/omni.preset.js': `// Tailwind preset generated by super-uiux-omni. Use: presets: [require('./omni.preset.js')]
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(Object.fromEntries(Object.keys(t.color).map((k) => [k, `var(--color-${k})`])), null, 6).replace(/\n}/, '\n    }')},
      borderRadius: ${JSON.stringify(Object.fromEntries(Object.keys(t.radius).map((k) => [k, `var(--radius-${k})`])))},
      boxShadow: ${JSON.stringify(Object.fromEntries(Object.keys(t.shadow).map((k) => [k, `var(--shadow-${k})`])))},
      transitionDuration: ${JSON.stringify(Object.fromEntries(Object.keys(t.motion.duration).map((k) => [k, `var(--duration-${k})`])))},
      transitionTimingFunction: ${JSON.stringify(Object.fromEntries(Object.keys(t.motion.easing).map((k) => [k, `var(--ease-${k})`])))},
      keyframes: {
        shimmer: { to: { transform: 'translateX(100%)' } },
        rise: { from: { opacity: '0', transform: 'translateY(8px)' } },
      },
      animation: {
        shimmer: 'shimmer var(--duration-skeleton) ease-in-out infinite',
        rise: 'rise var(--duration-base) var(--ease-enter) both',
      },
    },
  },
};
`,
  };
}

export function scaffold(tokens, { framework = 'css' } = {}) {
  const files = {
    'css/skeleton.css': skeletonCSS(),
    'css/motion.css': motionCSS(),
    'css/states.css': statesCSS(),
    'state-sheet.html': demoHTML(tokens),
  };
  if (framework === 'react') Object.assign(files, reactFiles());
  if (framework === 'tailwind') Object.assign(files, tailwindFiles(tokens));
  return files;
}
