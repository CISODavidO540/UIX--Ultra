# UI stat sheet — after.html

**Overall 87 · rank B · gate PASS**

```
ACCESS       ██████████ 100  S
ORIGINALITY  ██████████ 100  S
STATES       ██████████ 100  S
MOTION       ██████████ 100  S
RESPONSIVE   ██████████ 100  S
CRAFT        ██████████ 100  S
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

Transitions: 46 (median 140ms, max 140ms). Reduced motion: yes. Infinite loops: none.

## Layout

390px overflow: 0px. Longest line: 82 chars. Mobile body: 16px.

## System

Font sizes in use: 5. Families: "IBM Plex Sans", "IBM Plex Mono". Accent hue buckets: 2. Off-grid spacing: 0.0%. Numeric nodes with tabular-nums: 12/7.

## Type & contrast (craft probe)

APCA: 0/69 text elements below target. All-caps without tracking: 0. Paragraph line-height out of 1.2–1.8: 0. Unique radii 3, shadows 2, z-index 0, font weights 3.

## Expression (color + structure)

Colorfulness 11.2 · color share 0.5% · hue families 0 · framed regions 10.
- colorfulness 11.2 (<15 reads monochrome/unfinished)
- only 0.5% of the first screen carries color
- 0 hue family — color isn't doing zone/state work
- Measures only *amount* of color and structure. Whether it is good still needs eyes and the critique rubric.

## Accessibility (100/100)

No findings above info.

## Look at it

Scripts cannot judge taste. Open `desktop-fold.png`, `mobile-full.png` and `squint.png` (grayscale + blur: can you still find the primary action and the hierarchy?) and run the critique rubric in the ui-max skill (`references/critique.md`).

Forced states (contact sheets — look at these too): `states-desktop.png`, `states-mobile.png`
