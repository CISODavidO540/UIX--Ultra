# UI-MAX

*(repo: UIX Ultra — "super UI UX OMNI Pro Max Ultra Supreme")*

A UI/UX skill plus a verification tool, built so an AI agent makes UI that has a
point of view, works in every state, and is checked by **looking at it** before
anyone else does.

- **`skills/ui-max/`** — the skill (Hermes + Claude Code). Loop: taste → brief → surface → direction → system → states → build → **verify** → deliver, and a taste log that learns from David's verdicts.
- **`omni check`** — the UI stat sheet: Access, Originality (15 slop tells), States, Motion, Responsive, Craft → rank S–F and a pass/fail gate, with screenshots and forced-state contact sheets for visual critique.
- **`omni diff`** — before/after proof for redesigns.
- **UI/UX Pro Max** (MIT, v2.15) vendored in `skills/ui-max/vendor/` as a lookup database (UX rules, fonts, charts, stack gotchas). Not used for direction: see `references/pro-max.md` for why.
- **`benchmarks/`** — fixed briefs and `results.csv` to measure whether output quality is actually improving.

```bash
omni check page.html --states empty,error,loading     # stat sheet + screenshots
omni diff old.html new.html                            # did the redesign improve it?
```

```
✘ FAIL  overall 84 (B)  access 99 · originality 52 · …   themes/cyberpunk/demo.html ("too vibe coded")
  tell 2: Default accent hue · tell 11: Shouty labels · tell 12: Mono as texture · tell 13: Ornament everywhere
✔ PASS  overall 100 (S)  …                                 benchmarks/runs/2026-11-08-B1 (strip-bay agent console)
```

A perfect script score means the script found nothing, not that it's good. The
skill requires a screenshot critique (`references/critique.md`) on top.

### Install the skill

```bash
git clone git@github.com:CISODavidO540/UIX--Ultra ~/Projects/UIX--Ultra && cd ~/Projects/UIX--Ultra
npm i && npx playwright install chromium
ln -s ~/Projects/UIX--Ultra/skills/ui-max ~/.hermes/skills/creative/ui-max   # Hermes
ln -s ~/Projects/UIX--Ultra/skills/ui-max ~/.claude/skills/ui-max            # Claude Code
printf '#!/usr/bin/env bash\nexec node "$HOME/Projects/UIX--Ultra/bin/omni.js" "$@"\n' > ~/.local/bin/omni && chmod +x ~/.local/bin/omni
```

---

# super UI UX OMNI Pro Max Ultra Supreme

A UI/UX tool and Claude skill that doesn't stop at "pretty".

Point it at a page and it **obtains** the UI's design DNA (colors, type, spacing,
radii, shadows, motion, interaction states), **audits** the UX and accessibility,
and **generates** the layer most redesigns skip: skeleton loaders, enter/exit
transitions, hover/focus/active/disabled/loading/empty/error/success states, and
reduced-motion fallbacks. The bundled skill teaches Claude to work the same way:
capture → understand → audit → design every state → build → verify.

```
omni full https://your-site.com --mobile --framework react
```

```
omni-out/your-site.com/
├── REPORT.md          ← start here: DNA, observed states, gaps, audit findings
├── ui-dna.json        ← raw tallies of every computed style on the page
├── audit.json         ← scored UX/a11y findings
├── tokens.json/.css   ← normalized design tokens (+ reduced-motion overrides)
├── desktop.png, desktop-fold.png, mobile.png
└── scaffold/
    ├── state-sheet.html   ← every state, rendered with the captured tokens
    ├── css/skeleton.css   css/motion.css   css/states.css
    └── react/ (AsyncView, AsyncButton, Skeleton, useViewTransition)  or  tailwind/omni.preset.js
```

## Install

Requires Node 18+ and Playwright's Chromium.

```bash
git clone https://github.com/CISODavidO540/UIX--Ultra && cd UIX--Ultra
npm i -D playwright && npx playwright install chromium
npm link          # makes `omni` available everywhere
```

### As a Claude Code plugin

```
/plugin marketplace add CISODavidO540/UIX--Ultra
/plugin install ui-max@ui-max
```

Then ask Claude things like "audit the UI of localhost:3000 and add proper
loading and empty states", or run `/omni https://example.com make it feel premium`.

To use only the skill, copy `skills/ui-max/` into `~/.claude/skills/`.

## Commands

| Command | What it does |
|---|---|
| `omni capture <url\|file>` | Extract design DNA + screenshots → `ui-dna.json` |
| `omni audit <url\|file>` | Score UX/a11y: contrast, names/labels/alt, tap targets, focus visibility (incl. glow-only rings that vanish in high-contrast mode), heading order, landmarks, viewport, layout shift, reduced motion, loading states |
| `omni tokens <dir>` | `ui-dna.json` → `tokens.json` + `tokens.css` |
| `omni scaffold <dir> [--framework css\|react\|tailwind]` | Skeletons, motion, state styles, state sheet |
| `omni full <url\|file>` | All of the above + `REPORT.md` |
| `omni check <url\|file> [--states a,b]` | UI stat sheet + gate + screenshots + forced-state contact sheets (exit 1 on FAIL) |
| `omni diff <before> <after>` | Stat deltas, slop tells removed/introduced, regressions, `compare.png` |
| `omni theme <name> [--out dir]` | Copy a theme pack (`cyberpunk`) into your project |

Options: `--out <dir>`, `--viewport 1440x900`, `--mobile`. Set `OMNI_CHROMIUM=/path/to/chrome` to use a specific browser binary.

## Toolkit mode (REA-style)

UI-MAX installs like a toolkit, not just a prompt:

```bash
git clone https://github.com/CISODavidO540/UIX--Ultra && cd UIX--Ultra
npm i && npx playwright install chromium
node bin/omni.js setup            # dry run: shows what it will register
node bin/omni.js setup --write    # links the skill, registers the MCP server (Claude Code, Cursor, Claude Desktop)
```

Installed as a Claude Code plugin, the MCP server is registered automatically (`.claude-plugin/plugin.json`).

| MCP tool | Does |
|---|---|
| `ui_route` / `ui_playbook` | Task → use-case playbook (agent chat, dashboard, data table, forms/settings, detail, onboarding, landing, mobile, stylized/FUI) |
| `ui_capture` | Design DNA + tokens + screenshots of an existing UI |
| `ui_check` / `ui_audit` / `ui_diff` | Stat sheet (Access, Originality, States, Motion, Responsive, Craft), a11y, before/after |
| `ui_verdict` / `ui_evidence` | Log your keep/reject verdicts with the deciding property; see whether the gate agrees with you |
| `astryx` | Read-only queries to Meta's [Astryx](https://github.com/facebook/astryx) design system (templates, components, tokens, build kits) |
| `ui_reference` | Taste, direction, craft, critique, motion, states and other references |

How it gets better without retraining: playbooks say what each use case needs, Astryx supplies real components instead of invented ones, `ui_check` grades the result, and your verdicts in `.omni/evidence.jsonl` become taste rules.

## Themes: stylized and still usable

```bash
omni theme cyberpunk --out src/theme
```

`themes/cyberpunk/` is a cyberpunk / sci-fi theme pack for tool-heavy apps (built for an AI agent console):

- `cyber.css`: tokens (tinted near-black, off-white text, neon used only for meaning), chamfered panels, corner brackets, glow buttons with a cursor spotlight, status LEDs, tool step cards (pending → running → approval → done/error/denied), thinking indicator, context meter, command palette, toasts, skeletons. Forced-colors and reduced-motion safe.
- `fx.js`: an effects dial (Full / Subtle / Off), text decode for short labels, assemble-in on first view, event-only glitch and success ping, opt-in synthesized UI sounds, stick-to-bottom streaming with a "New output" pill, and a Ctrl/Cmd+K palette. No dependencies.
- `demo.html`: a working agent console (streaming, tool calls, approval, failure, palette). Serve the folder (`npx serve themes/cyberpunk`) and open it.

The rule behind it: **animate the chrome, never the work** — every effect reports real state. Research: [reports/Stylized UI that stays usable.md](reports/Stylized%20UI%20that%20stays%20usable.md), rules: [stylized-themes.md](skills/ui-max/references/stylized-themes.md).

## What "beyond pretty" means here

- **States**: every control and data view gets the full matrix ([state-matrix.md](skills/ui-max/references/state-matrix.md)).
- **Skeletons**: same box as the real content, delayed 150ms, `aria-busy`, no layout shift ([skeletons.md](skills/ui-max/references/skeletons.md)).
- **Motion**: duration/easing tokens, exits faster than entrances, View Transitions, reduced motion ([motion.md](skills/ui-max/references/motion.md)).
- **Verification**: re-audit, keyboard pass, slow-network pass, 390px and 1440px screenshots ([ux-heuristics.md](skills/ui-max/references/ux-heuristics.md)).

## Use it for good

OMNI reads what any browser already renders. Use it to learn from good UI, audit
and improve products you own or work on, and build design systems. Don't use it
to clone someone's brand or impersonate a site. See
[ethics.md](skills/ui-max/references/ethics.md).

## Develop

```bash
npm test
```

## License

MIT
