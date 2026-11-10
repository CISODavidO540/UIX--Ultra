# UI stat sheet — http://127.0.0.1:8822/index.html?variant=stock

**Overall 82 · rank B · gate PASS**

```
ACCESS       ██████████  98  S
ORIGINALITY  ██████████ 100  S
STATES       ██████████ 100  S
MOTION       ████████░░  80  B
RESPONSIVE   ██████████ 100  S
CRAFT        ██████░░░░  55  D
EXPRESSION   ████░░░░░░  35  F
```

## Gate

- [x] No critical/serious a11y findings
- [x] No compositional slop tells (3, 8, 10)
- [x] At most 1 slop tell
- [x] No horizontal scroll at 390px
- [x] No console errors
- [x] State coverage ≥ 6/8
- [x] prefers-reduced-motion handled (if animated)

## Slop tells

None fired.

## States defined

✔ hover · ✔ focusVisible · ✔ active · ✔ disabled · ✔ loading · ✔ empty · ✔ error · ✔ success

## Motion

Transitions: 36 (median 125ms, max 300ms). Reduced motion: yes. Infinite loops: <span.x1lliihq> x11cqc53-B.
Layout/paint-heavy transitions (13): `box-shadow var(--duration-fast) var(--ease-standard),border-color var(--duration-fast) var(--ease-standard)`, `background-color, box-shadow`, `border-color, box-shadow, background-color`, `border-color, box-shadow`, `box-shadow, border-color`, `box-shadow` — prefer transform/opacity.

## Layout

390px overflow: 0px. Longest line: n/a chars. Mobile body: 16px.

## System

Font sizes in use: 5. Families: Figtree, ui-monospace. Accent hue buckets: 2. Off-grid spacing: 0.7%. Numeric nodes with tabular-nums: 0/28.

## Type & contrast (craft probe)

APCA: 49/172 text elements below target. All-caps without tracking: 4. Paragraph line-height out of 1.2–1.8: 0. Unique radii 9, shadows 2, z-index 3, font weights 3.
- Lc 48 (needs 60) `<span.astryx-text> Document`
- Lc 48 (needs 60) `<div.x10l6tqk> Ask anything...`
- Lc 49 (needs 60) `<div.x2lah0s> Today`
- Lc 49 (needs 60) `<time.xt0psk2> 10:15 AM`
- Lc 49 (needs 60) `<span.x141an7d> 3 tool calls`
- Lc 49 (needs 60) `<span.x141an7d> read`
- caps, no tracking `<div.astryx-avatar-fallback> A`
- 49 text elements below APCA target (−20)
- 4 all-caps labels without tracking (−8)
- 9 unique radii (budget 4) (−6)
- 9 raw color literals in component CSS — use theme roles (omni themegen) (−1)

## Expression (color + structure)

Colorfulness 1.2 · color share 0% · hue families 0 · framed regions 6.
- colorfulness 1.2 (<15 reads monochrome/unfinished)
- only 0% of the first screen carries color
- 0 hue family — color isn't doing zone/state work
- Measures only *amount* of color and structure. Whether it is good still needs eyes and the critique rubric.

## Accessibility (98/100)

- minor · h1 — 2 <h1> elements; usually one per page
- minor · landmark — No <main> landmark

## Look at it

Scripts cannot judge taste. Open `desktop-fold.png`, `mobile-full.png` and `squint.png` (grayscale + blur: can you still find the primary action and the hierarchy?) and run the critique rubric in the ui-max skill (`references/critique.md`).
