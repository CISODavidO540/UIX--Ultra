# Handoff context: UIX Ultra (super UI UX OMNI Pro Max Ultra Supreme)

This is everything from the cloud session that built this repo, so you can
continue locally. Repo: https://github.com/CISODavidO540/UIX--Ultra (branch `main`).

## Goal (in the owner's words, paraphrased)

A UI/UX tool and Claude skill that works like a good tool (the owner compared
it to "REA"), but only for UI/UX. It should obtain a UI, do it well, and go
past "pretty": transitions, skeletons, states. It's for learning and improving,
not for harm. The near-term target is **Hermes** (the owner's AI agent app, the
`feat/hermes-ui` work in the Harvis repo). Hermes has a cyberpunk theme that is
a flat copy with weak effects; the goal is to make it more productive, usable
and alive.

## What exists

| Path | What it is |
|---|---|
| `bin/omni.js`, `src/cli.js` | CLI: `capture`, `audit`, `tokens`, `scaffold`, `full`, `theme` |
| `src/capture.js` | Playwright: tallies computed styles of visible elements → colors, type, spacing, radii, shadows, motion, custom props, keyframes, breakpoints, component counts. Hovers/focuses up to 6 buttons and diffs styles. Screenshots. |
| `src/audit.js` | Contrast, img alt, control names, input labels, tap targets (24px), lang/title/h1/heading order/main, viewport meta, reduced-motion, CLS, Tab-through focus visibility, glow-only focus (forced-colors). Score = 100 − weighted penalties. |
| `src/tokens.js` | Clusters colors, assigns roles (bg from body bg, surface, text, muted, border, primary = most-used saturated color), type scale named relative to body size, spacing base 4/8, radii, shadows, motion tokens with defaults. Emits `tokens.json` + `tokens.css`. |
| `src/scaffold.js` | Generates skeleton.css, motion.css, states.css, state-sheet.html; React (AsyncView, AsyncButton, Skeleton, useViewTransition) or a Tailwind preset. |
| `src/report.js` | REPORT.md: DNA table, observed hover/focus changes, "missing beyond pretty" list, findings. |
| `skills/ui-max/` | Claude skill: SKILL.md (OBTAIN → UNDERSTAND → AUDIT → DESIGN STATES → BUILD → VERIFY) + references: state-matrix, motion, skeletons, ux-heuristics, ethics, stylized-themes |
| `.claude-plugin/`, `commands/omni.md` | Plugin + marketplace manifest, `/omni` command |
| `themes/cyberpunk/` | cyber.css (tokens + components), fx.js (runtime), demo.html (mock agent console), screenshot.png |
| `research_notes/Stylized UI that stays usable/` | 4 researcher notes with sources |
| `reports/Stylized UI that stays usable.md` | Synthesized report |
| `test/` | Fixture page with 10 planted flaws + node:test (`npm test`, 2 passing) |

Verified in the session: the fixture audit caught all 10 planted flaws (47/100);
example.com scored 92; the cyberpunk demo went 78 → 98 after fixing what the
audit found; no console errors; no horizontal scroll at 390px.

## Owner's verdict on the theme: "looks too vibe coded"

Agreed. Why it reads as AI-generic, so you don't repeat it:

- **Default cyberpunk palette.** Cyan #00e5ff + magenta #ff2bd6 + yellow on near-black is what every generated "cyberpunk" UI uses. No palette decision was made from a brand or a reference.
- **Every label is uppercase monospace with letter-spacing and a `// ` prefix.** Applied everywhere, it has no hierarchy and becomes texture.
- **Decoration applied uniformly**: corner brackets, chamfers, background grid, radial glows, scanlines on the header. Nothing is reserved for something important.
- **No point of view.** It's a mood board of FUI tropes, not a system derived from what Hermes does. Real FUI (Territory Studio, Dead Space) starts from the world and the data, then designs widgets.
- **Generic layout**: sidebar / chat / right panel, the stock AI-app shell. Stat rows and "Loading state" panel are filler.
- **Fake content.** The demo is a scripted mock, so nothing was tested against Hermes' real density, real tool output or real session counts.

What to do differently (suggested):

1. Start from Hermes' real screens and data (capture them with `omni full`), and list the 5 most frequent tasks. Design for those.
2. Pick ONE strong idea for the theme (e.g. "terminal-grade instrument panel", "industrial signage", "military-spec readouts") and derive palette, type and shape from it. Find 3–5 real references (film FUI, hardware panels, signage), not other web cyberpunk UIs.
3. One accent color with meaning, neutrals doing most of the work. Status colors only for status.
4. Type: one good sans for content with a real scale (size and weight steps); monospace only for data (numbers, IDs, commands). Uppercase tracking for at most one level of label.
5. Use ornament on maybe 2–3 elements per screen (active step, approval, connection state). Everything else plain.
6. Motion as instrumentation (see the report): effects only on real state changes, keyboard actions never animate.

## Key research conclusions (details + sources in reports/)

- **Rule: animate the chrome, never the work.** Every effect must report real state (working, tool started, approval waiting, error, success). Constant glow/scanlines say nothing, which is why the flat copy feels stiff.
- Latency is the biggest lever: 0.1s feels instant, 1s keeps flow, 10s needs progress + cancel (Nielsen); 400ms Doherty threshold; Superhuman targets <50–100ms. INP ≤200ms.
- Motion: ~100ms feedback, 200–300ms panels, never >500ms, exits faster than entries, frequent actions subtler, keyboard-triggered actions not animated (Emil Kowalski, Rauno Freiberg, NN/g).
- Loading: nothing <1s; spinners for modules 2–10s; skeletons for full-page loads; progress bars >10s. Delay showing loaders 150–300ms; keep them ≥300–500ms once shown (Vercel).
- Reskins drop states (hover, focus-visible, active, disabled, loading, empty, error, success), break focus (glow-only rings vanish in forced-colors), fail contrast on muted/placeholder/disabled neon, hard-code colors outside tokens, and add effects that stutter (animated backdrop-filter, box-shadow, clip-path).
- Weak clickability signifiers ≈ 22% slower (NN/g). Flat isn't the problem; missing signifiers are.
- Halation: avoid pure white on pure black; use tinted near-black (#0b0f14–#121212) and off-white (#d6dee8–#e0e0e0).
- WCAG 2.3.1: <3 flashes/s; avoid saturated-red flicker. 2.4.11 Focus Not Obscured (AA). 2.5.8 targets ≥24px (AA).
- Aesthetic-usability effect: users praise pretty UIs that slow them down. Measure task times (send, approve, stop, find session), not compliments.
- Redesign failures (Sonos 2024 ~$20–30M + CEO exit, Skype 2017 rolled back, Snapchat 2018 DAU drop, Reddit kept old.reddit): protect the core task path, keep feature parity, ship the new look opt-in with the plain theme available.
- Agent-app patterns: step card state machine (pending, running, awaiting approval, done, error, denied) like Vercel AI Elements `Tool`; stick-to-bottom only while the user is at the bottom, else a "new output" pill (reconciles NN/g "don't autoscroll" with use-stick-to-bottom); Streamdown-style closing of partial markdown; Esc interrupts keeping work, queued messages, Ctrl+O verbose transcript, Ctrl+B background, checkpoints (Claude Code); approval prompt shows exact command and can't scroll away; context meter; per-message token/cost; honest undo.
- Arwes: good architecture (animator state machines + sounds tied to states) but unmaintained, no React Strict Mode/RSC. augmented-ui: BSD-2 clip-path frames. GSAP is fully free incl. ScrambleText/SplitText.
- **Hermes caveat:** if it's Nous Research's stock `hermes dashboard` (port 9119), the Chat tab embeds the real TUI via xterm.js, so CSS can only change terminal colors/font there. Then the high-value work is web-native step cards and approval UI, plus theming Status/Sessions/Cron/Logs/Analytics pages. Unknown which front end the owner's Hermes uses (Harvis repo, `feat/hermes-ui`, includes AI skills, per-chat sandbox, sandbox UI).

Known gaps in the research: no controlled study on neon-glow legibility (glow values are judgment); Arwes docs site was down (503); Cyberpunk 2077 / Dead Space GDC talks paywalled; Bloomberg, Raycast, Figma, VS Code, Apple HIG not fetched; Linear sync details secondhand.

## Technical decisions worth keeping in the theme code

- Glow on pseudo-elements, animate opacity only. One `@property` conic border (`.cy-live`) only on the running step.
- Focus: real `outline` (transparent when idle) with `outline-offset: -5px` so `clip-path` chamfers don't cut it; forced-colors removes clip-paths and uses system colors.
- `[data-fx="full|subtle|off"]` on `<html>` scales glow/scanline/motion variables; reduced motion forces motion off.
- Sound off by default, synthesized Web Audio, throttled, silent when tab hidden.
- `scramble()` caches original text in `data-text` (fixed a race that froze garbled text); only for strings ≤48 chars; sets aria-label.
- Disabled must beat tone colors: `.cy-btn:is(:disabled,[aria-disabled=true])` after tone rules.

## Known limitations / TODO

- Audit contrast check reads the element's own background; it misreads chamfered panels whose fill is a `::before` pseudo-element (it sees the border color).
- Capture can't read cross-origin stylesheets (counted in `meta.blockedSheets`), so keyframes/media queries from CDNs are missed.
- Token role guessing is heuristic (primary = most-used saturated color); surface can pick an icon's gray on small pages.
- Focus check only tabs through the first 15 elements; state diff only samples 6 buttons.
- No visual-regression or before/after comparison yet (`omni diff` would be a good next command).
- Theme pack has only `cyberpunk`, and its look needs redoing (see verdict above).
- Not published to npm; Playwright is a peer dependency (`npm i -D playwright && npx playwright install chromium`).
- `/omni` plugin command assumes `${CLAUDE_PLUGIN_ROOT}`; from a clone use `node bin/omni.js`.

## Next steps (suggested order)

1. Run `omni full` against the real Hermes UI and read REPORT.md.
2. Decide the theme concept and references (see "What to do differently").
3. Rebuild the theme tokens from that concept; keep the component behaviors (step card states, approval, palette, stick-to-bottom, effects dial).
4. If Hermes chat is xterm.js: build web-native step cards + approval UI first.
5. Add `omni diff <before> <after>` (screenshots + audit score delta) to prove improvements.
6. Measure core task times in the flat vs themed versions.

## Session notes

- Built in a Claude Code cloud session (Nov 6, 2026). Tried to "ask Astra" as requested, but no Astra agent was reachable and the Harvis/Hermes repo wasn't attached, so nothing was applied to Hermes.
- GitHub initially refused pushes until the Claude GitHub App was granted access; it works now.


---

## Session 2 (local, 2026-11-08): UI-MAX

Done:
- Skill renamed `super-uiux-omni` → **`ui-max`** and rewritten around a mandatory verify-by-looking loop. New references: `taste.md` (David's verdict log + Never list), `direction.md` (concept from the world, ornament budget), `craft.md`, `critique.md`, `pro-max.md`.
- UI/UX Pro Max v2.15 vendored (MIT) at `skills/ui-max/vendor/ui-ux-pro-max` (its SKILL.md renamed PROMAX.md so it doesn't register twice). Its `--design-system` gave an agent console a "FAQ landing" + Tailwind slate/green, so it's a lookup DB only.
- `src/slop.js`: 15 tells (claude-design's 10 + shouty labels, mono as texture, ornament everywhere, emoji icons, halation). Flags the old cyberpunk demo with 2, 11, 12, 13, matching David's verdict.
- `omni check` (stat sheet, gate, `--states` contact sheets) and `omni diff`.
- Fixed: audit now reads OKLCH/any CSS color (was a silent pass); contrast reads chamfered `::before` fills; labels ≥24px count as the tap target.
- Benchmarks B1–B5 in `benchmarks/README.md`. B1 (strip-bay agent console) built through the full loop: gate PASS, 8/8 interaction tests, 3 critique fixes that the script couldn't see.
- Installed: symlinks in `~/.hermes/skills/creative/ui-max` and `~/.claude/skills/ui-max`; `omni` wrapper in `~/.local/bin`.

Next:
- David's verdict on B1 → `taste.md` + `results.csv`.
- Run B2–B5; the skill counts as maxed after 5 consecutive runs with gate PASS, rank ≥ A and David ≥ 4.
- Capture the real Hermes desktop (CDP, see Hermes skill `inspecting-hermes-desktop-dom`) and run `omni full` on it before redesigning the real thing.

## Update (Nov 9): taste research + craft probe

- Report: `reports/Building UI taste beyond generic.md` (notes in `research_notes/Building UI taste beyond generic/`).
- Added `src/craft.js` to `omni check`: APCA contrast per text element (non-body allowance for short labels), all-caps tracking, paragraph line-height, unique radii/shadows/z-index/weights budgets (budgets are inferred, not published norms), and `squint.png`.
- B1 benchmark now reads craft 76: ~30% of text (dim secondary labels, kbd hints, status text) is below APCA targets on the dark theme, though WCAG 2 passes it. That gap is the known WCAG-2-on-dark weakness.
- Report's top recommendations not built yet: reference lock in the skill, `omni judge a b` (pairwise, region-cited, no 1–10 score), `--direction DIRECTION.md` conformance check, dated slop tells + cross-run sameness tracking, record the owner's verdict per benchmark to calibrate the stat sheet.
- Astra was requested again but no Astra session/agent was reachable from the cloud session.
