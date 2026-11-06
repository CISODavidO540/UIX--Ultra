import fs from 'node:fs/promises';
import path from 'node:path';
import { withPage } from './browser.js';

/**
 * Runs inside the page. Walks visible elements and tallies computed styles
 * so we learn the *system* behind the UI, not just one screenshot of it.
 */
function extractInPage() {
  const tally = () => new Map();
  const bump = (m, k, w = 1) => { if (k == null || k === '') return; m.set(k, (m.get(k) || 0) + w); };
  const top = (m, n = 40) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([value, count]) => ({ value, count }));

  const colors = { text: tally(), background: tally(), border: tally() };
  const type = { families: tally(), sizes: tally(), weights: tally(), lineHeights: tally(), letterSpacing: tally(), combos: tally() };
  const space = { padding: tally(), margin: tally(), gap: tally() };
  const radii = tally(), shadows = tally(), transitions = tally(), animations = tally(), easings = tally(), durations = tally();
  const zIndex = tally();

  const isTransparent = (c) => !c || c === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(c);
  const px = (v) => (v && v !== '0px' && v !== 'normal' && v !== 'auto' ? v : null);

  const all = [document.body, ...document.querySelectorAll('body *')];
  let visible = 0;
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
    visible++;
    const area = Math.min(r.width * r.height, 200000) / 1000 + 1;

    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (hasText) {
      bump(colors.text, cs.color, 1);
      bump(type.families, cs.fontFamily);
      bump(type.sizes, cs.fontSize);
      bump(type.weights, cs.fontWeight);
      bump(type.lineHeights, cs.lineHeight);
      if (cs.letterSpacing !== 'normal') bump(type.letterSpacing, cs.letterSpacing);
      bump(type.combos, `${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight}`);
    }
    if (!isTransparent(cs.backgroundColor)) bump(colors.background, cs.backgroundColor, area);
    if (cs.borderStyle !== 'none' && parseFloat(cs.borderWidth) > 0 && !isTransparent(cs.borderColor)) bump(colors.border, cs.borderColor);

    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      bump(space.padding, px(cs[`padding${side}`]));
      bump(space.margin, px(cs[`margin${side}`]));
    }
    bump(space.gap, px(cs.rowGap)); bump(space.gap, px(cs.columnGap));
    bump(radii, px(cs.borderRadius));
    if (cs.boxShadow !== 'none') bump(shadows, cs.boxShadow);
    if (cs.zIndex !== 'auto') bump(zIndex, cs.zIndex);

    if (cs.transitionProperty !== 'all' || cs.transitionDuration !== '0s') {
      if (cs.transitionDuration !== '0s') {
        bump(transitions, `${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction}`);
        cs.transitionDuration.split(',').forEach((d) => bump(durations, d.trim()));
        cs.transitionTimingFunction.split(/,(?![^(]*\))/).forEach((e) => bump(easings, e.trim()));
      }
    }
    if (cs.animationName !== 'none') {
      bump(animations, `${cs.animationName} ${cs.animationDuration} ${cs.animationTimingFunction}`);
      bump(easings, cs.animationTimingFunction);
    }
  }

  // CSS custom properties + keyframes + media features from readable stylesheets.
  const customProps = {};
  const keyframes = [];
  const media = { reducedMotion: false, darkMode: false, breakpoints: new Set() };
  let blockedSheets = 0;
  const rootCS = getComputedStyle(document.documentElement);
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { blockedSheets++; continue; }
    const walk = (list) => {
      for (const rule of list) {
        if (rule.type === CSSRule.STYLE_RULE && /^(:root|html|body)$/.test(rule.selectorText)) {
          for (const name of rule.style) if (name.startsWith('--')) customProps[name] = rootCS.getPropertyValue(name).trim() || rule.style.getPropertyValue(name).trim();
        } else if (rule.type === CSSRule.KEYFRAMES_RULE) {
          keyframes.push({ name: rule.name, css: rule.cssText.slice(0, 600) });
        } else if (rule.type === CSSRule.MEDIA_RULE) {
          const t = rule.conditionText || rule.media.mediaText;
          if (/prefers-reduced-motion/.test(t)) media.reducedMotion = true;
          if (/prefers-color-scheme:\s*dark/.test(t)) media.darkMode = true;
          (t.match(/(min|max)-width:\s*([\d.]+(px|em|rem))/g) || []).forEach((b) => media.breakpoints.add(b));
          walk(rule.cssRules);
        } else if (rule.cssRules) walk(rule.cssRules);
      }
    };
    walk(rules);
  }

  // Component inventory — what kinds of pieces is this UI built from?
  const q = (s) => document.querySelectorAll(s).length;
  const components = {
    buttons: q('button, [role=button], a.btn, a[class*=button], input[type=submit]'),
    links: q('a[href]'),
    inputs: q('input:not([type=hidden]), textarea, select'),
    forms: q('form'),
    navs: q('nav, [role=navigation]'),
    headers: q('header'),
    footers: q('footer'),
    cards: q('[class*=card], article'),
    images: q('img, picture, svg'),
    videos: q('video'),
    dialogs: q('dialog, [role=dialog]'),
    tabs: q('[role=tablist]'),
    tables: q('table'),
    lists: q('ul, ol'),
    icons: q('svg, i[class*=icon], [class*=icon]'),
    skeletons: q('[class*=skeleton], [class*=shimmer], [aria-busy=true]'),
    spinners: q('[class*=spinner], [class*=loader], [role=progressbar]'),
  };

  // Grab a sample of each interactive element's resting style for state diffing.
  const sampleButtons = [...document.querySelectorAll('button, [role=button], a[class*=btn], a[class*=button]')]
    .filter((el) => { const r = el.getBoundingClientRect(); return r.width && r.height && r.top < innerHeight * 3; })
    .slice(0, 6)
    .map((el, i) => { el.setAttribute('data-omni-sample', String(i)); return i; });

  return {
    meta: {
      title: document.title,
      lang: document.documentElement.lang || null,
      url: location.href,
      elements: all.length,
      visible,
      blockedSheets,
      docHeight: document.documentElement.scrollHeight,
    },
    colors: { text: top(colors.text), background: top(colors.background), border: top(colors.border, 15) },
    typography: {
      families: top(type.families, 8), sizes: top(type.sizes, 20), weights: top(type.weights, 8),
      lineHeights: top(type.lineHeights, 12), letterSpacing: top(type.letterSpacing, 8), combos: top(type.combos, 15),
    },
    spacing: { padding: top(space.padding, 20), margin: top(space.margin, 20), gap: top(space.gap, 12) },
    radii: top(radii, 12),
    shadows: top(shadows, 10),
    zIndex: top(zIndex, 10),
    motion: {
      transitions: top(transitions, 20), animations: top(animations, 15),
      durations: top(durations, 10), easings: top(easings, 10), keyframes: keyframes.slice(0, 20),
    },
    customProperties: customProps,
    media: { ...media, breakpoints: [...media.breakpoints] },
    pageBackground: (() => { for (const el of [document.body, document.documentElement]) { const c = getComputedStyle(el).backgroundColor; if (c && !/rgba\([^)]*,\s*0\)$/.test(c) && c !== 'transparent') return c; } return 'rgb(255, 255, 255)'; })(),
    headingFamily: (() => { const h = document.querySelector('h1, h2'); return h ? getComputedStyle(h).fontFamily : null; })(),
    components,
    sampleButtons,
  };
}

const STATE_PROPS = ['color', 'backgroundColor', 'borderColor', 'boxShadow', 'transform', 'opacity', 'outline', 'outlineOffset', 'textDecorationLine', 'filter'];

async function diffStates(page, count) {
  const out = [];
  const read = (i) => page.evaluate(([i, props]) => {
    const el = document.querySelector(`[data-omni-sample="${i}"]`);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return Object.fromEntries(props.map((p) => [p, cs[p]]));
  }, [i, STATE_PROPS]);

  for (let i = 0; i < count; i++) {
    const loc = page.locator(`[data-omni-sample="${i}"]`);
    try {
      const rest = await read(i);
      const label = (await loc.innerText({ timeout: 1000 })).trim().slice(0, 40);
      await loc.hover({ timeout: 1500 });
      await page.waitForTimeout(400); // let transitions finish
      const hover = await read(i);
      await page.mouse.move(0, 0);
      await loc.focus({ timeout: 1000 });
      await page.keyboard.press('Shift'); // triggers :focus-visible heuristics in Chromium
      await page.waitForTimeout(300);
      const focus = await read(i);
      await loc.blur().catch(() => {});
      const delta = (s) => Object.fromEntries(Object.entries(s || {}).filter(([k, v]) => rest && rest[k] !== v));
      out.push({ label, rest, hover: delta(hover), focus: delta(focus) });
    } catch { /* element detached or covered — skip */ }
  }
  return out;
}

export async function capture(target, { out, viewport, mobile } = {}) {
  await fs.mkdir(out, { recursive: true });
  return withPage(target, { viewport }, async (page, context) => {
    const dna = await page.evaluate(extractInPage);
    dna.states = await diffStates(page, dna.sampleButtons.length);
    delete dna.sampleButtons;
    dna.capturedAt = new Date().toISOString();
    dna.viewport = page.viewportSize();

    await page.screenshot({ path: path.join(out, 'desktop.png'), fullPage: true }).catch(() => {});
    await page.screenshot({ path: path.join(out, 'desktop-fold.png') }).catch(() => {});
    dna.screenshots = ['desktop.png', 'desktop-fold.png'];

    if (mobile) {
      const m = await context.newPage();
      await m.setViewportSize({ width: 390, height: 844 });
      await m.goto(page.url(), { waitUntil: 'load' });
      await m.waitForTimeout(500);
      await m.screenshot({ path: path.join(out, 'mobile.png'), fullPage: true }).catch(() => {});
      dna.screenshots.push('mobile.png');
    }
    return dna;
  });
}
