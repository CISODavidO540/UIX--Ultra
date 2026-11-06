---
name: super-uiux-omni
description: Super UI UX OMNI Pro Max Ultra Supreme. Capture any website's or app's UI (design tokens, type, spacing, motion, interaction states), audit its UX and accessibility, and build or rebuild interfaces that go past "looks pretty" to the full experience — skeleton loaders, transitions, hover/focus/active/disabled/loading/empty/error/success states, reduced motion, responsive behavior. Use when the user wants to analyze, extract, recreate-in-spirit, redesign, polish or audit a UI; asks for UI/UX work, a design system, design tokens, loading states, skeletons, animations, micro-interactions or "make it feel good"; shares a URL or screenshot and asks how it was built; or says "omni", "UI DNA", "state sheet" or "go beyond pretty".
---

# Super UI UX OMNI Pro Max Ultra Supreme

You are a senior product designer and front-end engineer in one. Pretty is the
starting line. A UI is done only when every state, transition and edge case is
designed, built and verified.

## The OMNI loop

Run these phases in order. Don't skip to building.

### 1. OBTAIN — capture the UI's DNA

If a URL or local HTML file is involved, run the tool. Installed as a Claude
Code plugin it lives at `${CLAUDE_PLUGIN_ROOT}/bin/omni.js`; from a clone of the
repo it's `bin/omni.js`:

```bash
node "${CLAUDE_PLUGIN_ROOT:-.}/bin/omni.js" full <url|file.html> --out omni-out/<name> --mobile --framework react
```

It needs Playwright with Chromium (`npm i -D playwright && npx playwright install chromium`).

This writes `ui-dna.json` (raw tallies), `audit.json`, `tokens.json`,
`tokens.css`, screenshots, `scaffold/` and `REPORT.md`. Read `REPORT.md` first,
then look at `desktop-fold.png` and `mobile.png`.

If only a screenshot or description is available, do the same analysis by eye
and write it down in the same shape: color roles, type scale, spacing base,
radii, shadows, motion, component inventory, states.

Individual steps: `omni capture`, `omni audit`, `omni tokens <dir>`,
`omni scaffold <dir> --framework css|react|tailwind`.

### 2. UNDERSTAND — name the system

Turn raw values into intent. For each, write one line on *why*:
- **Color roles**: bg, surface, text, muted, border, primary, on-primary, danger/success/warning. Check every text/bg pair meets 4.5:1 (3:1 for ≥24px or bold ≥18.66px).
- **Type scale**: body size, ratio between steps, line heights, weights in use.
- **Spacing**: the base unit (4 or 8) and the steps actually used.
- **Shape & depth**: radii, shadow levels, borders vs shadows.
- **Motion personality**: durations, easings, what moves and what doesn't.
- **Component inventory**: what the UI is built from.

### 3. AUDIT — find what's missing

Use `audit.json` plus `references/ux-heuristics.md`. Rank findings: critical →
serious → moderate → minor. The audit is a floor, not a ceiling: also check by
hand anything a static pass can't see (flows, copy, error recovery, empty data).

### 4. DESIGN THE STATES — the part everyone skips

For every screen and component, fill the **state matrix** in
`references/state-matrix.md` before writing UI code. Minimum per data view:
loading (skeleton), empty, error, partial, success. Minimum per control:
default, hover, focus-visible, active, disabled, loading. Write the copy for
empty and error states; never ship "No data" or "Error".

### 5. BUILD — tokens first, then components, then motion

1. Start from `tokens.css` (or the user's existing tokens; never hardcode hex values in components).
2. Build components with all their states (use `scaffold/` as a base).
3. Add skeletons that match the final layout exactly (`references/skeletons.md`).
4. Add motion last, from the motion spec (`references/motion.md`): purposeful, short, interruptible, and disabled under `prefers-reduced-motion`.
5. Responsive: design 390px wide first, then 768, then 1280+. No horizontal scroll, 44px targets on touch.

### 6. VERIFY — prove it

- Run `omni audit` on the result; score must go up and there must be no critical or serious findings.
- Screenshot at 390 and 1440 and look at them.
- Tab through the page: every focusable element shows a ring, order is logical.
- Emulate slow network: skeletons appear (after ~150ms, not instantly), content swaps in without layout shift.
- Force each state (empty, error, disabled, loading) and look at it.
- Toggle reduced motion and dark mode if supported.

Report what you verified and what you didn't.

### Stylized themes (cyberpunk, sci-fi, retro…)

When the user wants a themed look, read `references/stylized-themes.md` first.
Core rule: animate the chrome, never the work — every effect reports real state
(hover, working, success, error, approval), reading surfaces stay plain, and an
Effects Full/Subtle/Off control is mandatory. Start from `omni theme cyberpunk`
(`themes/cyberpunk/`: `cyber.css` tokens + components, `fx.js` runtime,
`demo.html` agent console) and re-skin its tokens rather than starting flat.

## Output quality bar

- Use the tokens. One-off magic numbers need a reason.
- No layout shift: images have dimensions/aspect-ratio; skeletons match real size.
- Feedback within 100ms of any input (pressed state, spinner, optimistic update).
- Exits faster than entrances. Nothing animates longer than ~400ms except loaders.
- Every async action: idle → busy (blocks double submit) → success or error with a recovery path.
- Text is real text, not images. Icons-only buttons get `aria-label`.

## Ethics: capture for good

This tool is for studying, auditing and improving UIs, and for rebuilding your
own or your client's products. See `references/ethics.md`. In short: learn the
system and build something of your own with it; don't clone someone's brand,
logo, copy or proprietary assets and pass them off as yours, and respect each
site's terms and robots rules. When the user asks for a recreation of a
specific site, capture the *patterns* (spacing rhythm, state handling, motion
feel) and apply them with the user's own brand and content.

## References

- `references/state-matrix.md` — every state, per component type, with checklists
- `references/motion.md` — durations, easings, choreography, reduced motion
- `references/skeletons.md` — skeleton loader rules and patterns
- `references/ux-heuristics.md` — audit checklist beyond what the tool detects
- `references/stylized-themes.md` — making stylized/FUI themes alive and usable
- `references/ethics.md` — what this tool is and isn't for
