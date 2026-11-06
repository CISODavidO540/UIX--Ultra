# State matrix

Fill one of these per component or screen before building. An empty cell is a
bug you haven't shipped yet.

## Controls (button, link, toggle, tab, menu item)

| State | Visual | Behavior | A11y |
|---|---|---|---|
| default | resting style | — | accessible name |
| hover | subtle shift (bg ±8–12%, or elevation) | pointer devices only (`@media (hover: hover)`) | — |
| focus-visible | 2px ring, offset 2px, ≥3:1 vs adjacent | keyboard only | never `outline: none` without replacement |
| active / pressed | scale .98 or darker bg | instant (≤80ms) | `aria-pressed` for toggles |
| disabled | ~45% opacity, `not-allowed` cursor | no events | prefer `aria-disabled` + explanation if users need to know why |
| loading | label → spinner, width fixed | blocks double submit | `aria-busy="true"` |
| success | brief confirmation (color/✓) 1–2s | returns to idle | announce via live region |
| error | message near control | offers retry | `role="alert"` or live region |
| selected / current | distinct from hover | — | `aria-current` / `aria-selected` |

## Inputs (text, select, textarea, checkbox, radio)

| State | Notes |
|---|---|
| empty | visible `<label>`; placeholder is an example, not a label |
| filled | value clearly readable |
| hover | border darkens |
| focus | ring + border color; never only a color change |
| invalid | red border + icon + text message linked by `aria-describedby`; validate on blur, not each keystroke |
| valid | optional subtle check, only where it helps (passwords, usernames) |
| disabled / read-only | different from each other |
| loading (async validation) | inline spinner |

## Data views (list, table, grid, chart, detail page)

| State | What to show |
|---|---|
| initial loading | skeleton matching final layout (after 150ms delay) |
| refreshing | keep old data, show subtle progress (top bar or inline spinner), don't blank the view |
| empty (first use) | why it's empty + the action to fill it ("Create your first project") |
| empty (filtered / search) | "No results for 'x'" + clear filters action |
| error | plain-language cause + retry; keep anything already loaded |
| partial | show what loaded; mark what failed |
| offline | banner + cached data if available |
| success | content, swapped in with a short fade, no layout jump |
| overflow | very long text, 1 item, 10,000 items, missing image |
| permission denied | why + who to ask |

## Overlays (modal, drawer, popover, toast, tooltip)

- Enter/exit animation (exit faster).
- Focus moves in on open, returns to trigger on close; focus trapped in modals.
- Escape closes; click outside closes (except destructive confirms).
- Background scroll locked for modals.
- Toasts: auto-dismiss 4–6s, pause on hover/focus, never the only place for critical errors.

## Page level

- First paint: skeleton or real content, never blank white.
- Route change: view transition or at least a progress indicator after ~300ms.
- 404 / 500 pages designed, with a way back.
- Scroll position restored on back navigation.
