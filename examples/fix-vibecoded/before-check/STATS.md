# UI stat sheet — before.html

**Overall 34 · rank F · gate FAIL**

```
ACCESS       █████░░░░░  53  D
ORIGINALITY  ░░░░░░░░░░   0  F
STATES       ███░░░░░░░  25  F
MOTION       █████░░░░░  52  D
RESPONSIVE   ███░░░░░░░  30  F
CRAFT        ██████░░░░  55  D
```

## Gate

- [ ] No critical/serious a11y findings
- [ ] No compositional slop tells (3, 8, 10)
- [ ] At most 1 slop tell
- [ ] No horizontal scroll at 390px
- [x] No console errors
- [ ] State coverage ≥ 6/8
- [ ] prefers-reduced-motion handled (if animated)

## Slop tells

- **1. Tech gradient** — Recolor: drop the blue/violet gradient; use a flat surface and spend color on one meaningful element.
  - `<div.logo> ✨ Hermes AI`
  - `<section.hero> Your AI Agent, Supercharged 🚀 Hermes au`
  - `<div.num> 99.9%`
  - `<div.num> 10x`
- **2. Default accent hue** — Recolor: derive the accent from the concept/brand. Framework default swatches and indigo/violet read as unchosen.
  - `#22c55e (Tailwind green-500) ×1`
- **3. Feature-tile grid** — Re-layout: rank the items. Give the most important one more space, or turn them into a list/table with real content.
  - `<div.features> 🤖 Smart Agents Deploy intelligent agent`
- **5. Unearned blur** — Remove: keep blur only on one real overlay (modal/sheet). Solid surfaces for everything else.
  - `<div.stat> 99.9% Uptime`
  - `<div.stat> 10x Faster Workflows`
  - `<div.stat> 2.4M Tokens Processed`
  - `<div.stat> 500+ Tasks Completed`
- **6. Monument stat** — Remove: big numbers that nobody acts on. Keep a number only if it is real and drives a decision; size it as data, not decoration.
  - `<div.num> 99.9%`
  - `<div.num> 10x`
  - `<div.num> 2.4M`
  - `<div.num> 500+`
- **8. Center stack** — Re-layout: commit to a grid with a left edge. Centering everything means no composition was chosen.
  - `5/8 text blocks centered`
- **9. Default type** — Re-typeset: pick a face for a reason (concept, density, numerals). Inter/system is fine only when it is a stated decision.
  - `primary face: Inter`
- **13. Ornament everywhere** — Remove: reserve glow/brackets/chamfers for 2–3 elements that carry state (active step, approval, connection). Everything else plain.
  - `7 ornamented elements (6 glow boxes, 0 glow text, 1 brackets/chamfers/patterns) of 52`
  - `<section.hero> Your AI Agent, Supercharged 🚀 Hermes au`
- **14. Emoji icons** — Remove: use one consistent SVG icon set, or no icons.
  - `<h1> Your AI Agent, Supercharged 🚀`
  - `<h2> Powerful Features ⚡`
  - `<div.icon> 🤖`
  - `<div.icon> ⚡`

## States defined

✔ hover · ✘ focusVisible · ✘ active · ✘ disabled · ✘ loading · ✘ empty · ✘ error · ✔ success

## Motion

Transitions: 56 (median 300ms, max 300ms). Reduced motion: no. Infinite loops: <button.btn> glow, <div.icon> float, <div.dot> pulse.
Layout/paint-heavy transitions (1): `all` — prefer transform/opacity.

## Layout

390px overflow: 810px (<div.container> right=1200, <nav> right=1180, <div.nav-links> right=1180, <a> right=956). Longest line: n/a chars. Mobile body: 16px.

## System

Font sizes in use: 11. Families: Inter, Arial. Accent hue buckets: 1. Off-grid spacing: 0.0%. Numeric nodes with tabular-nums: 0/4.

## Type & contrast (craft probe)

APCA: 12/31 text elements below target. All-caps without tracking: 0. Paragraph line-height out of 1.2–1.8: 0. Unique radii 6, shadows 3, z-index 0, font weights 4.
- Lc 15 (needs 60) `<footer> © 2026 Hermes AI. Made with 💜 and AI.`
- Lc 28 (needs 60) `<div.label> Uptime`
- Lc 28 (needs 60) `<div.label> Faster Workflows`
- Lc 28 (needs 60) `<div.label> Tokens Processed`
- Lc 28 (needs 60) `<div.label> Tasks Completed`
- Lc 28 (needs 75) `<p> Deploy intelligent agents that learn and`
- 12 text elements below APCA target (−20)
- 6 unique radii (budget 4) (−4)

## Accessibility (53/100)

- serious · contrast — Text contrast 2.36:1, needs 4.5:1 `<footer> © 2026 Hermes AI. Made with 💜 and AI.`
- serious · input-label — Form field has no label (placeholder is not a label) `<input> `
- serious · tap-target — Target is 72×17px (min 24, ideal 44) `<a> Dashboard`
- serious · tap-target — Target is 47×17px (min 24, ideal 44) `<a> Agents`
- serious · tap-target — Target is 54×17px (min 24, ideal 44) `<a> Settings`
- serious · tap-target — Target is 34×17px (min 24, ideal 44) `<a> Docs`
- serious · tap-target — Target is 20×20px (min 24, ideal 44) `<button.icon-btn> 📎`
- serious · focus-visible — Keyboard focus has no visible indicator (outline/box-shadow) `<input> `
- moderate · contrast — Text contrast 3.75:1, needs 4.5:1 `<div.label> Uptime`
- moderate · html-lang — <html> has no lang attribute
- moderate · reduced-motion — Page animates but has no prefers-reduced-motion handling
- minor · landmark — No <main> landmark

## Look at it

Scripts cannot judge taste. Open `desktop-fold.png`, `mobile-full.png` and `squint.png` (grayscale + blur: can you still find the primary action and the hierarchy?) and run the critique rubric in the ui-max skill (`references/critique.md`).
