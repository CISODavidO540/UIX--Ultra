# UI stat sheet — examples/fix-vibecoded/v2-flightdeck/index.html

**Overall 95 · rank S · gate PASS**

```
ACCESS       █████████░  94  A
ORIGINALITY  ██████████ 100  S
STATES       ██████████ 100  S
MOTION       ██████████ 100  S
RESPONSIVE   ██████████ 100  S
CRAFT        █████████░  87  B
EXPRESSION   █████████░  85  B
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

Transitions: 51 (median 120ms, max 120ms). Reduced motion: yes. Infinite loops: none.

## Layout

390px overflow: 0px. Longest line: 77 chars. Mobile body: 15px.

## System

Font sizes in use: 6. Families: "IBM Plex Sans", "IBM Plex Mono". Accent hue buckets: 4. Off-grid spacing: 0.0%. Numeric nodes with tabular-nums: 2/7.

## Type & contrast (craft probe)

APCA: 0/93 text elements below target. All-caps without tracking: 0. Paragraph line-height out of 1.2–1.8: 0. Unique radii 4, shadows 9, z-index 0, font weights 3.
- 9 unique shadows (budget 4) (−6)

## Expression (color + structure)

Colorfulness 22.7 · color share 3.7% · hue families 2 · framed regions 15.
- colorfulness 22.7 (low; 25+ wanted)
- Measures only *amount* of color and structure. Whether it is good still needs eyes and the critique rubric.

## Accessibility (94/100)

- moderate · contrast — Text contrast 4.06:1, needs 4.5:1 `<button#allow.key.solid> Allow
Enter`
- minor · tiny-text — Text at 11px is hard to read `<small#link-sub> hermes-pop`
- minor · tiny-text — Text at 11px is hard to read `<small#sb-sub> run-7f3a`
- minor · tiny-text — Text at 11px is hard to read `<small#tests-sub> 47/47`
- minor · tiny-text — Text at 11px is hard to read `<kbd> Enter`

## Look at it

Scripts cannot judge taste. Open `desktop-fold.png`, `mobile-full.png` and `squint.png` (grayscale + blur: can you still find the primary action and the hierarchy?) and run the critique rubric in the ui-max skill (`references/critique.md`).

Forced states (contact sheets — look at these too): `states-desktop.png`, `states-mobile.png`
