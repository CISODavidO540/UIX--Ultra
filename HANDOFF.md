# Handoff: UIX Ultra / UI-MAX (cloud → local), 2026-11-10

Repo: https://github.com/CISODavidO540/UIX--Ultra (branch `main`; everything is pushed).
`CONTEXT.md` has the long running history. **This file is the current state; read it first.**

## What this project is
UI-MAX (CLI `omni`) is an open-source UI/UX toolkit and Claude skill, in the spirit of REA but for UI. It captures, audits, scores
and fixes UI, covering states, skeletons, motion and loading as well as looks. It has an MCP server, per-user taste profiles
that learn from verdicts, a theme engine, use-case playbooks, and Astryx (Meta's design system) integration. Open source by choice.

**Names:** Astra = David's GPT-6 assistant. Astryx = Meta's design system. Don't mix them up.

## Run it
```
npm ci                       # Playwright Chromium needed
npm test                     # 15 tests, all passing
node bin/omni.js --help
node bin/omni.js check <url|file> [--states a,b,c] [--out dir]   # stat sheet + gate + screenshots
node bin/omni.js verdict <artifact> keep|reject "<words>" --property x,y [--check <run dir>]
node bin/omni.js route "<task>"   /   playbook <id>   /   themegen --out themes/omni-themes.css --dtcg --astryx
node bin/omni.js mcp               # stdio MCP server (setup: omni setup [--write])
```
B6 app: `cd benchmarks/B6-cyberpunk/app && npm ci && node gen-theme.mjs && npx vite build && python3 -m http.server -d dist 8822`
then `http://localhost:8822/index.html?variant=nightcity&state=attention|running|done|error|empty|loading`.

## Where the work is right now: B6 cyberpunk benchmark (Hermes agent chat on the Astryx `ai-chat` frame)
| Version | Score | David's verdict |
|---|---|---|
| v1 "hazard label" (directed) | 88 A | 3/5: "blue one is way too everywhere… bland, doesn't fit cyberpunk" |
| v2 "Night City" (from 2077 menu refs) | 93 A | **4/5**: "a lot better theme wise but word font probably needs some work" |
| v3 type pass (Chakra Petch chrome + Plex Sans 15/24) | 94 A | **revise**: "font still needs work, the word style doesnt match… just a box around a word or a simple banner, no visual depth" |
| **Depth study** (static HTML) | not scored | **KEEP**: "now that is what im talking about that is what we like to see" |

- Diagnosis: `benchmarks/B6-cyberpunk/WHY-V3-IS-FLAT.md`
- Study: `benchmarks/B6-cyberpunk/depth-study/study.html` (open it directly; fonts are next to it)
- Side-by-side: `benchmarks/B6-cyberpunk/depth-study-v3-v4.png`

What the study does, and what David liked:
- **One genre font for everything:** Rajdhani in mixed case, 18px body tinted pale cyan with a slight bloom. Caps only for tabs and units. Mono only for commands and IDs.
- **Layered depth:**
  - atmosphere (vignette, dot grid, scanlines, edge binary)
  - chamfered bezel + glowing red spine
  - translucent filled panel with an inner glow
  - tool calls as gradient-filled tiles with a 4px glowing category bar, notched corner and a connector trace, plus tick progress
  - needs-you notice with a ghost frame offset behind a lit yellow plate and a glowing diamond
  - notched selected tab with an inner glow
  - full-width glowing deck rule
  - big light-weight numbers with the unit on the same baseline

## NEXT STEP: build v4 in the real app (was just starting when transferred)
1. Add Rajdhani woff2 (in `depth-study/fonts/`) to `app/src/fonts/` and `fonts.css`, and set the preset font (`themes/presets/night-city.json`) to Rajdhani.
2. In `app/src/nightcity.css`, port the study:
   - Set reading tokens on `[data-astryx-theme]` (**Astryx re-declares `--text-*` there; `html` overrides are ignored**): body ~18px / 1.42 in Rajdhani, tinted.
   - Bezel/spine around `.astryx-chat-layout`.
   - Tool-call rows as tiles: inspect the Astryx DOM under `.astryx-chat-tool-calls` first.
   - In `NightCity.tsx`, wrap `.nc-notice` so the ghost frame isn't clipped by `clip-path`.
3. Add an effects switch: `?fx=full|subtle|off`, mapped to `data-fx`. Subtle drops bloom and scanlines; off is plain. Keep reduced-motion and forced-colors.
4. Re-run `omni check … --states attention,running,done,error,empty,loading --out benchmarks/B6-cyberpunk/runs/nightcity-v4`. Watch:
   - APCA with glow and fills (measure against the fill behind the text)
   - Rajdhani legibility at reading size (≥ 17–18px)
   - mobile 390px
5. Make `compare-v3-v4.png`, add a row to `results.csv` and the README, log David's verdict with `omni verdict`.

## Astra (GPT-6)
It was never reachable from the cloud session. The prompt is ready at `benchmarks/B6-cyberpunk/ASTRA-PROMPT.md`.
Attach `depth-study-v3-v4.png` plus 1–2 Cyberpunk 2077 menu screenshots. **The reference screenshots were in the cloud scratchpad and are
not in the repo (copyright)**, so grab fresh ones locally (Character, Crafting, Email menus are the useful ones). Fold Astra's
answer into v4 (typography roles, ranked depth techniques, what the study still gets wrong).

## Done this session (all pushed)
- **UI formats study.** Notes are in `research_notes/UI formats/` (chat, presentation-web, app-guis; about 9.5k words, sourced). The report is `reports/UI formats and Astryx.md`.
- **Type reference.** `skills/ui-max/references/type-by-format.md` gives reading size, ratio and measure per format, plus stylized-theme type rules.
- **Five new playbooks:** docs-editorial, slides-presentation, workspace-tool, terminal-tui, commerce. Router fixes went in too.
- **Astryx coverage.** Strong for chat, dashboards, tables, forms, IDE, canvas, kanban and commerce. Nothing for slides, editorial, changelog, onboarding, calendar, mobile tabs, game HUD or TV. Its router misses `messaging-shell` and `checkout-wizard`.
- **Craft probe type-system check:**
  - reading size and line-height
  - caps under 12px
  - condensed faces under 14px
  - measure over 85ch
  - more than 3 families

  On v2 it scores craft 56 and finds all three problems; on v3 it scores 77 and is clean.
- **Night City v3.** Kept in `runs/nightcity/`; v2 is in `runs/nightcity-v2/`.
- **Verdicts.** All logged to `.omni/evidence.jsonl`, `benchmarks/results.csv` and `skills/ui-max/taste/examples/david.md`. The cloud container's `~/.config/ui-max/taste.md` doesn't travel, so run `omni taste init` locally; the example profile in the repo has the full verdict log.

## Open offers David hasn't answered
- Draft reply to Joeri at Agensi (free listing / open source).
- "Learns with use" features: examples library, per-user score calibration.
- A second Harvis/Hermes patch for the remaining audit findings: boot stall, blank pane, skeleton failure state, spinner migration, MotionConfig, the getSnapshot bug.
- Checks not built yet: glyph height for game/TV text, `clamp()` max ≤ 2.5× min, slide type as a percentage of slide height, a pty harness for TUIs.
- Benchmarks: B7 docs page, B8 web deck.

## Rules David has set
- Never invent his verdicts or taste rules; quote his words.
- Don't send email from his account without approval.
- Don't commit copyrighted reference images.
- Stylized themes come from real genre references.
- Restraint without color fails, and kit-default controls fail.
