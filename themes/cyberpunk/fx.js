// OMNI // CYBERPUNK runtime. ~6KB, no dependencies.
// Everything here is progressive: the UI works fully without it.
// Effects are interaction- or event-driven; nothing loops on reading surfaces.

const root = document.documentElement;
const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
const store = {
  get(k, d) { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

const motionOK = () => !reduceMQ.matches && root.dataset.fx !== 'off';

/* ---------- Effect level: full | subtle | off ---------- */
export function setFx(level) {
  root.dataset.fx = level;
  store.set('cy-fx', level);
  document.dispatchEvent(new CustomEvent('cy:fx', { detail: level }));
}
export function initFx() {
  setFx(store.get('cy-fx', reduceMQ.matches ? 'subtle' : 'full'));
}

/* ---------- Cursor spotlight: one listener, rAF-throttled ---------- */
export function initSpotlight(selector = '.cy-btn, [data-spotlight]') {
  let frame = 0, last;
  document.addEventListener('pointermove', (e) => {
    last = e;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const el = last.target.closest?.(selector);
      if (!el || root.dataset.fx === 'off') return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${last.clientX - r.left}px`);
      el.style.setProperty('--my', `${last.clientY - r.top}px`);
    });
  }, { passive: true });
}

/* ---------- Text decode (for SHORT labels/headings only, never prose) ---------- */
const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEF';
export function scramble(el, text, { duration = 420 } = {}) {
  // Remember the real text once so overlapping calls never lock in garbage.
  if (!el.dataset.text) el.dataset.text = el.textContent;
  text = text ?? el.dataset.text;
  el.dataset.text = text;
  if (el._scr) cancelAnimationFrame(el._scr);
  el.setAttribute('aria-label', text);           // screen readers get the final text immediately
  if (!motionOK() || text.length > 48) { el.textContent = text; return Promise.resolve(); }
  const start = performance.now();
  return new Promise((resolve) => {
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const settled = Math.floor(p * text.length);
      let out = text.slice(0, settled);
      for (let i = settled; i < text.length; i++) out += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      el.textContent = out;
      if (p < 1) el._scr = requestAnimationFrame(tick); else { el._scr = 0; el.textContent = text; resolve(); }
    };
    el._scr = requestAnimationFrame(tick);
  });
}

/* ---------- Assemble-in on first view (once), staggered ---------- */
export function initAssemble(selector = '[data-assemble]') {
  const io = new IntersectionObserver((entries) => {
    let i = 0;
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const el = en.target;
      io.unobserve(el);
      if (!motionOK()) continue;
      el.style.setProperty('--i', i++);
      el.classList.add('cy-enter');
      el.addEventListener('animationend', () => el.classList.remove('cy-enter'), { once: true });
      el.querySelectorAll('[data-decode]').forEach((t) => scramble(t));
    }
  }, { threshold: 0.15 });
  document.querySelectorAll(selector).forEach((el) => io.observe(el));
}

/* ---------- Event feedback: glitch on error, ping on success ---------- */
function oneShot(el, cls) {
  if (!el || !motionOK()) return;
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
  el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
}
export const glitch = (el) => { oneShot(el, 'cy-glitch'); sound.play('error'); };
export const ping = (el) => { oneShot(el, 'cy-ping'); sound.play('ok'); };

/* ---------- Sound: off by default, tiny synthesized blips ---------- */
export const sound = {
  ctx: null,
  get enabled() { return store.get('cy-sound', 'off') === 'on'; },
  set enabled(v) { store.set('cy-sound', v ? 'on' : 'off'); if (v) this.ensure(); },
  ensure() { if (!this.ctx) { try { this.ctx = new AudioContext(); } catch { return null; } } if (this.ctx.state === 'suspended') this.ctx.resume(); return this.ctx; },
  last: 0,
  play(kind) {
    if (!this.enabled || document.hidden) return;
    const now = performance.now();
    if (now - this.last < 40) return;   // throttle: never a buzz
    this.last = now;
    const ctx = this.ensure(); if (!ctx) return;
    const spec = { tick: [1800, 0.012, 0.02], click: [900, 0.035, 0.04], ok: [1320, 0.05, 0.12], error: [180, 0.06, 0.18], open: [600, 0.03, 0.08] }[kind] || [1000, 0.02, 0.04];
    const [freq, vol, dur] = spec;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = kind === 'error' ? 'sawtooth' : 'square';
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    if (kind === 'ok') o.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + dur);
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur);
  },
};
export function initSounds() {
  document.addEventListener('pointerdown', (e) => { if (e.target.closest('.cy-btn, summary')) sound.play('click'); });
}

/* ---------- Stick-to-bottom for streaming output ----------
   On send: scroll the new message into view. While streaming: follow only if
   the user is at the bottom. If they scroll up: stop following, show the pill. */
export function stickToBottom(scroller, pill) {
  let follow = true;
  const atBottom = () => scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 48;
  scroller.addEventListener('scroll', () => {
    follow = atBottom();
    if (pill) pill.dataset.show = String(!follow);
  }, { passive: true });
  const ro = new ResizeObserver(() => { if (follow) scroller.scrollTop = scroller.scrollHeight; else if (pill) pill.dataset.show = 'true'; });
  [...scroller.children].forEach((c) => ro.observe(c));
  const mo = new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && ro.observe(n))));
  mo.observe(scroller, { childList: true });
  pill?.addEventListener('click', () => { follow = true; scroller.scrollTo({ top: scroller.scrollHeight, behavior: motionOK() ? 'smooth' : 'auto' }); pill.dataset.show = 'false'; });
  return { jump: () => pill?.click(), get following() { return follow; } };
}

/* ---------- Command palette (Ctrl/Cmd+K) ---------- */
export function initPalette(overlay, commands) {
  const input = overlay.querySelector('input');
  const list = overlay.querySelector('ul');
  let items = [], sel = 0, returnFocus = null;
  const render = () => {
    const q = input.value.toLowerCase().trim();
    items = commands.filter((c) => !q || c.label.toLowerCase().includes(q) || c.keywords?.includes(q));
    sel = Math.min(sel, Math.max(0, items.length - 1));
    list.innerHTML = items.length
      ? items.map((c, i) => `<li role="option" id="cy-opt-${i}" aria-selected="${i === sel}"><span>${c.label}</span>${c.kbd ? `<span class="cy-kbd">${c.kbd}</span>` : ''}</li>`).join('')
      : '<li aria-disabled="true">No matching command</li>';
    input.setAttribute('aria-activedescendant', items.length ? `cy-opt-${sel}` : '');
    list.querySelector('[aria-selected=true]')?.scrollIntoView({ block: 'nearest' });
  };
  const open = () => { returnFocus = document.activeElement; overlay.hidden = false; input.value = ''; sel = 0; render(); input.focus(); sound.play('open'); };
  const close = () => { overlay.hidden = true; returnFocus?.focus?.(); };
  const run = (i) => { const c = items[i]; if (!c) return; close(); c.run(); };
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); overlay.hidden ? open() : close(); }
  });
  input.addEventListener('input', () => { sel = 0; render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { sel = (sel + 1) % Math.max(1, items.length); render(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = (sel - 1 + items.length) % Math.max(1, items.length); render(); e.preventDefault(); }
    else if (e.key === 'Enter') { run(sel); e.preventDefault(); }
    else if (e.key === 'Escape') { close(); }
  });
  list.addEventListener('click', (e) => { const li = e.target.closest('li[role=option]'); if (li) run([...list.children].indexOf(li)); });
  overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) close(); });
  return { open, close };
}

/* ---------- Toasts (pause on hover, never the only place for errors) ---------- */
export function toast(msg, { tone = 'accent', ms = 4500 } = {}) {
  let region = document.querySelector('.cy-toasts');
  if (!region) { region = Object.assign(document.createElement('div'), { className: 'cy-toasts' }); region.setAttribute('aria-live', 'polite'); document.body.append(region); }
  const t = document.createElement('div');
  t.className = 'cy-panel cy-toast'; t.dataset.tone = tone; t.setAttribute('data-assemble', '');
  t.textContent = msg;
  region.append(t);
  if (motionOK()) t.classList.add('cy-enter');
  let timer, left = ms, started = Date.now();
  const arm = () => { started = Date.now(); timer = setTimeout(() => t.remove(), left); };
  t.addEventListener('mouseenter', () => { clearTimeout(timer); left -= Date.now() - started; });
  t.addEventListener('mouseleave', arm);
  arm();
  tone === 'danger' ? glitch(t) : tone === 'ok' ? ping(t) : null;
}

export function initAll() {
  initFx(); initSpotlight(); initAssemble(); initSounds();
}

if (typeof window !== 'undefined') window.CyberFX = { setFx, initFx, initSpotlight, scramble, initAssemble, glitch, ping, sound, stickToBottom, initPalette, toast, initAll };
