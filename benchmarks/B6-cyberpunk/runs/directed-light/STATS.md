# UI stat sheet — http://127.0.0.1:8822/index.html?variant=directed&mode=light

**Overall 88 · rank A · gate PASS**

```
ACCESS       ██████████  95  S
ORIGINALITY  ██████████ 100  S
STATES       ██████████ 100  S
MOTION       ████████░░  80  B
RESPONSIVE   ██████████ 100  S
CRAFT        ████████░░  77  C
EXPRESSION   ██████░░░░  55  D
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

Transitions: 40 (median 125ms, max 300ms). Reduced motion: yes. Infinite loops: <span.x1lliihq> x11cqc53-B.
Layout/paint-heavy transitions (13): `box-shadow var(--duration-fast) var(--ease-standard),border-color var(--duration-fast) var(--ease-standard)`, `background-color, box-shadow`, `border-color, box-shadow, background-color`, `border-color, box-shadow`, `box-shadow, border-color`, `box-shadow` — prefer transform/opacity.

## Layout

390px overflow: 0px. Longest line: n/a chars. Mobile body: 16px.

## System

Font sizes in use: 8. Families: "Barlow Condensed", "IBM Plex Mono", "IBM Plex Sans". Accent hue buckets: 5. Off-grid spacing: 0.7%. Numeric nodes with tabular-nums: 3/29.

## Type & contrast (craft probe)

APCA: 0/184 text elements below target. All-caps without tracking: 1. Paragraph line-height out of 1.2–1.8: 0. Unique radii 7, shadows 3, z-index 3, font weights 4.
- caps, no tracking `<kbd> ENTER`
- 1 all-caps labels without tracking (−2)
- 7 unique radii (budget 4) (−6)
- 9 raw color literals in component CSS — use theme roles (omni themegen) (−1)

## Expression (color + structure)

Colorfulness 21.1 · color share 2.3% · hue families 1 · framed regions 7.
- colorfulness 21.1 (low; 25+ wanted)
- only 2.3% of the first screen carries color
- 1 hue family — color isn't doing zone/state work
- Measures only *amount* of color and structure. Whether it is good still needs eyes and the critique rubric.

## Accessibility (95/100)

- moderate · cls — Cumulative layout shift 0.198 (good < 0.1) — reserve space / use skeletons
- minor · tiny-text — Text at 11px is hard to read `<kbd> ENTER`
- minor · h1 — 3 <h1> elements; usually one per page
- minor · landmark — No <main> landmark

## Look at it

Scripts cannot judge taste. Open `desktop-fold.png`, `mobile-full.png` and `squint.png` (grayscale + blur: can you still find the primary action and the hierarchy?) and run the critique rubric in the ui-max skill (`references/critique.md`).
