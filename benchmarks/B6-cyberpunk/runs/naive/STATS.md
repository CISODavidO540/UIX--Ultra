# UI stat sheet — http://127.0.0.1:8822/index.html?variant=naive

**Overall 69 · rank C · gate FAIL**

```
ACCESS       ██████████  98  S
ORIGINALITY  █████░░░░░  52  D
STATES       ██████████ 100  S
MOTION       ████████░░  80  B
RESPONSIVE   ██████████ 100  S
CRAFT        ████████░░  76  C
EXPRESSION   ████░░░░░░  40  F
```

## Gate

- [x] No critical/serious a11y findings
- [x] No compositional slop tells (3, 8, 10)
- [ ] At most 1 slop tell
- [x] No horizontal scroll at 390px
- [x] No console errors
- [x] State coverage ≥ 6/8
- [x] prefers-reduced-motion handled (if animated)

## Slop tells

- **2. Default accent hue** — Recolor: derive the accent from the concept/brand. Framework default swatches and indigo/violet read as unchosen.
  - `#00e5ff (stock cyberpunk cyan) ×129`
  - `#ff2bd6 (stock cyberpunk magenta) ×8`
- **11. Shouty labels** — Re-typeset: uppercase tracking for at most one label level. Everything else sentence case.
  - `176/176 text nodes are UPPERCASE + tracked`
  - `<div.x2lah0s.xrrkdod> TODAY`
  - `<span.xb3r6kr.xlyipyv> AUTH-SERVICE.TS`
- **12. Mono as texture** — Re-typeset: monospace only for data (numbers, IDs, commands, logs). Sentences and UI labels go in the content sans.
  - `100% of non-code text is monospace`
  - `<span.astryx-chat-tokenized-text.xt0psk2> @AGENT CAN YOU REVIEW THESE AUTH FILES? `
  - `<div.astryx-chat-message-bubble.x78zum5> LOOKING INTO THE AUTH FILES NOW. LET ME `
  - `<div.astryx-markdown-paragraph.x14cgwvg> FOUND THE ISSUE. IN MIDDLEWARE.TS, THE T`
- **13. Ornament everywhere** — Remove: reserve glow/brackets/chamfers for 2–3 elements that carry state (active step, approval, connection). Everything else plain.
  - `246 ornamented elements (240 glow boxes, 6 glow text, 0 brackets/chamfers/patterns) of 402`

## States defined

✔ hover · ✔ focusVisible · ✔ active · ✔ disabled · ✔ loading · ✔ empty · ✔ error · ✔ success

## Motion

Transitions: 36 (median 125ms, max 300ms). Reduced motion: yes. Infinite loops: <span.x1lliihq> x11cqc53-B.
Layout/paint-heavy transitions (13): `box-shadow var(--duration-fast) var(--ease-standard),border-color var(--duration-fast) var(--ease-standard)`, `background-color, box-shadow`, `border-color, box-shadow, background-color`, `border-color, box-shadow`, `box-shadow, border-color`, `box-shadow` — prefer transform/opacity.

## Layout

390px overflow: 0px. Longest line: n/a chars. Mobile body: 16px.

## System

Font sizes in use: 5. Families: "Courier New", ui-monospace. Accent hue buckets: 4. Off-grid spacing: 0.7%. Numeric nodes with tabular-nums: 0/28.

## Type & contrast (craft probe)

APCA: 0/172 text elements below target. All-caps without tracking: 0. Paragraph line-height out of 1.2–1.8: 0. Unique radii 9, shadows 2, z-index 3, font weights 3.
- 9 unique radii (budget 4) (−6)
- 9 raw color literals in component CSS — use theme roles (omni themegen) (−1)

## Expression (color + structure)

Colorfulness 61.5 · color share 34.4% · hue families 2 · framed regions 5.
- 4 slop tells: the color on screen is decoration, not color with a job (capped)
- Measures only *amount* of color and structure. Whether it is good still needs eyes and the critique rubric.

## Accessibility (98/100)

- minor · h1 — 2 <h1> elements; usually one per page
- minor · landmark — No <main> landmark

## Look at it

Scripts cannot judge taste. Open `desktop-fold.png`, `mobile-full.png` and `squint.png` (grayscale + blur: can you still find the primary action and the hierarchy?) and run the critique rubric in the ui-max skill (`references/critique.md`).
