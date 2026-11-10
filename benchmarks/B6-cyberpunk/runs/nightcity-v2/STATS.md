# UI stat sheet — http://127.0.0.1:8822/index.html?variant=nightcity

**Overall 93 · rank A · gate PASS**

```
ACCESS       ██████████  97  S
ORIGINALITY  ██████████ 100  S
STATES       ██████████ 100  S
MOTION       ████████░░  80  B
RESPONSIVE   ██████████ 100  S
CRAFT        ███████░░░  72  C
EXPRESSION   ██████████ 100  S
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

Transitions: 48 (median 125ms, max 300ms). Reduced motion: yes. Infinite loops: <span.x1lliihq> x11cqc53-B.
Layout/paint-heavy transitions (13): `box-shadow var(--duration-fast) var(--ease-standard),border-color var(--duration-fast) var(--ease-standard)`, `background-color, box-shadow`, `border-color, box-shadow, background-color`, `border-color, box-shadow`, `box-shadow, border-color`, `box-shadow` — prefer transform/opacity.

## Layout

390px overflow: 0px. Longest line: n/a chars. Mobile body: 16px.

## System

Font sizes in use: 10. Families: "Barlow Condensed", "IBM Plex Mono", "IBM Plex Sans". Accent hue buckets: 7. Off-grid spacing: 1.6%. Numeric nodes with tabular-nums: 2/30.

## Type & contrast (craft probe)

APCA: 0/191 text elements below target. All-caps without tracking: 1. Paragraph line-height out of 1.2–1.8: 0. Unique radii 5, shadows 2, z-index 3, font weights 4.
- caps, no tracking `<kbd> ENTER`
- 1 all-caps labels without tracking (−2)
- 5 unique radii (budget 4) (−2)
- 9 raw color literals in component CSS — use theme roles (omni themegen) (−1)

## Expression (color + structure)

Colorfulness 25.8 · color share 3.5% · hue families 3 · framed regions 9.
- Measures only *amount* of color and structure. Whether it is good still needs eyes and the critique rubric.

## Accessibility (97/100)

- minor · tiny-text — Text at 11px is hard to read `<kbd> ENTER`
- minor · h1 — 3 <h1> elements; usually one per page
- minor · landmark — No <main> landmark

## Look at it

Scripts cannot judge taste. Open `desktop-fold.png`, `mobile-full.png` and `squint.png` (grayscale + blur: can you still find the primary action and the hierarchy?) and run the critique rubric in the ui-max skill (`references/critique.md`).

Forced states (contact sheets — look at these too): `states-desktop.png`, `states-mobile.png`
