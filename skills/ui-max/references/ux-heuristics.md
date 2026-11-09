# UX audit checklist

`omni audit` checks the items marked ⚙. Check the rest by hand.

## Accessibility (WCAG 2.2 AA)
- ⚙ Text contrast ≥ 4.5:1 (≥ 3:1 large); also check UI component borders and focus rings at 3:1
- ⚙ Every image has `alt` (empty for decorative)
- ⚙ Every control has an accessible name; ⚙ every field has a label
- ⚙ Visible keyboard focus; logical tab order; no keyboard traps
- ⚙ Targets ≥ 24×24px (44×44 recommended on touch)
- ⚙ `lang`, `<title>`, one `<h1>`, ⚙ no skipped heading levels, ⚙ `<main>` landmark
- Errors described in text, not only color
- Works at 200% zoom and 320px wide without horizontal scrolling
- Respects `prefers-reduced-motion` (⚙), `prefers-color-scheme`, `forced-colors`

## Feedback & state
- Every action shows a response within 100ms
- ⚙ Loading states exist (skeletons / `aria-busy`); no infinite spinners
- Empty states explain and offer the next action
- Errors explain what happened and how to fix it, keep user input
- Destructive actions confirm or offer undo (undo is better)
- Success is confirmed but doesn't block

## Layout & visual
- ⚙ No layout shift (CLS < 0.1); ⚙ images have dimensions
- Consistent spacing from a scale; aligned to a grid
- Clear hierarchy: one primary action per view
- Line length 45–80 characters for body text
- ⚙ Text ≥ 12px (body 16px on mobile to avoid iOS zoom on inputs)
- ⚙ Viewport meta present; tested at 390 / 768 / 1280+

## Flow & content
- Users can tell where they are (active nav, breadcrumbs, titles)
- Back button works, scroll position is restored
- Forms: fewest fields possible, correct `type`/`inputmode`/`autocomplete`, inline validation on blur
- Copy: specific verbs on buttons ("Save changes", not "Submit"), no jargon
- Nielsen's 10: visibility of status, match real world, user control (undo), consistency, error prevention, recognition over recall, flexibility (shortcuts), minimalism, error recovery, help

## Performance as UX
- LCP < 2.5s, INP < 200ms, CLS < 0.1
- Fonts: `font-display: swap`, preload the main face, fallback metrics matched
- Images: right size, modern formats, lazy below the fold
