# Harvis desktop UI (feat/hermes-ui): feedback, loading and transitions audit

Target: `front_end/hermes-desktop-ui` on `brandoz2255/Harvis@feat/hermes-ui`
(Nous Research's Hermes desktop app, MIT; React 19, Tailwind 4, Motion,
assistant-ui). Method: ran the real renderer in a browser (Vite + its
`desktop-shim`, no backend), recorded the boot → failure flow, measured
hover / pressed / keyboard-focus styles with Playwright, and grepped the code
against the app's own `DESIGN.md`, which is good. Most findings are the code
not following it.

## What's already good

- `DESIGN.md` sets the right rules: one `Loader`, `ErrorState`, `EmptyState`,
  `ConfirmDialog`; ~100ms functional motion; "pressed feedback paints in the
  current frame"; no `transition-all`; respect reduced motion.
- **Boot failure is handled well** (02): plain cause, "nothing here deletes your
  chats or settings", four recovery actions, Retry as the primary.
- **Session list has real skeletons** shaped like rows (03).
- Composer says "Starting Harvis…" and disables send while connecting; the
  status bar shows "Gateway connecting".
- A global `prefers-reduced-motion` rule stops CSS animations.

## Findings (most serious first)

| # | Finding | Evidence | Fixed in patch |
|---|---|---|---|
| 1 | **No keyboard focus indicator anywhere.** `styles.css` has a deliberate "No focus rings, anywhere" rule that sets `outline: none` and zeroes Tailwind rings on `*:focus-visible`. Fails WCAG 2.4.7 (AA). | 04: Retry focused by keyboard, nothing visible (border 0, ring transparent, outline none) | ✔ ring only on keyboard focus (`:focus-visible`), none on click; real outline so it survives High Contrast; composer keeps its glow (05) |
| 2 | **No pressed state.** `Button` has no `active:` styles; measured press = hover on every button. Only ~8 `active:` uses in 1,800 files. Contradicts DESIGN.md. | press.cjs measurements | ✔ 1px press-down for all variants + darker fill for default / destructive / secondary / ghost (06). Retry uses its own classes and still needs one |
| 3 | **`transition-all` in the `Button` primitive** (and 7 more places). DESIGN.md forbids it on hot interactions. | `button.tsx` | ✔ in Button: named properties only; press paints instantly (`active:duration-0`) |
| 4 | **Boot progress races to 95% then stalls** ~20s on "Connecting live desktop gateway" before failing. A bar that stops moving reads as frozen. | 01 | ✘ switch to an indeterminate bar + elapsed time + "Retry / settings" after ~5s of no progress |
| 5 | **Main pane is blank white while connecting.** Sidebar has skeletons; the transcript area has nothing. | 03 | ✘ show a connecting state in the main pane (Loader + one line), or the last session dimmed |
| 6 | **Skeletons never resolve on failure.** They keep pulsing after the gateway has failed. | 03 + 02 | ✘ swap to an offline/error row ("Can't load sessions · Retry") when the gateway fails |
| 7 | **Skeletons flash on fast loads** (shown at 0ms). | `skeleton.tsx` | ✔ 150ms delay, then pulse (verified opacity 0 at 80ms) |
| 8 | **JS animations ignore reduced motion.** The `Loader` runs a `requestAnimationFrame` loop the CSS rule can't stop; no `MotionConfig reducedMotion="user"` for Motion animations. | `loader.tsx`, `main.tsx` | ◐ Loader draws one still frame under reduced motion. Still to do: wrap the app in `MotionConfig reducedMotion="user"` |
| 9 | **Loading is fragmented:** 229 ad-hoc spinners (`Loader2 animate-spin`) vs 55 uses of the `Loader` primitive; "Loading…" literal in 16 places plus i18n strings, which DESIGN.md bans. Worst: `gateway-settings.tsx` (10), `toolset-config-panel.tsx` (9). | grep | ✘ add `<Loader size="inline">` for in-button busy states and migrate |
| 10 | **React infinite loop** in the shell: "Maximum update depth exceeded. The result of getSnapshot should be cached." A `useSyncExternalStore` selector returns a new object each call. Candidates: `session-tile.tsx`, `model-pill.tsx`, `use-status-presence.ts`, `contrib/registry.ts`. | browser console | ✘ needs a look with the backend up |
| 11 | 67 raw hex colors in `.tsx` (outside themes). DESIGN.md: tokens, not literals. | grep | ✘ |

Note: the `/hermes/api/profiles` 404 in the console comes from running the
renderer under Vite's `/hermes/` base in a plain browser, not a product bug.

## The patch

`hermes-desktop-ui-fixes.patch` (4 files: `styles.css`, `button.tsx`,
`skeleton.tsx`, `loader.tsx`). Apply from the Harvis repo root:

```bash
git checkout feat/hermes-ui
git apply path/to/hermes-desktop-ui-fixes.patch
```

Verified in the running renderer: focus ring visible on keyboard focus only,
pressed shade on secondary/ghost buttons, transitions name their properties,
skeleton hidden for the first 150ms. Not run: the app's vitest and Playwright
suites (they expect the Nous monorepo layout and Electron), so run
`npm test` there before merging. `active:translate-y-px` uses Tailwind 4's
`translate` property; check it doesn't fight any `asChild` button that sets
its own transform.

## How this maps to OMNI

Every finding here is now a check worth automating against live apps:
focus visible on keyboard Tab (already in `omni audit`), **press ≠ hover**
(new: measured with mouse-down), **skeleton delay ≥ 150ms**, **JS animation
stops under reduced motion**, **no blank region > 40% of the viewport while
loading**, **progress that stalls > 5s**.

## Re-check with `omni audit`

| | Focus findings |
|---|---|
| Before patch | `focus-visible` (serious): keyboard focus invisible; `focus-forced-colors` ×2: focus only via box-shadow; `focus-caret-only` |
| After patch | none |

`omni audit` now also runs a press check (mouse-down vs hover on up to 6 buttons).
