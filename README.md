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
git clone https://github.com/<you>/super-uiux-omni && cd super-uiux-omni
npm i -D playwright && npx playwright install chromium
npm link          # makes `omni` available everywhere
```

### As a Claude Code plugin

```
/plugin marketplace add <you>/super-uiux-omni
/plugin install super-uiux-omni@super-uiux-omni
```

Then ask Claude things like "audit the UI of localhost:3000 and add proper
loading and empty states", or run `/omni https://example.com make it feel premium`.

To use only the skill, copy `skills/super-uiux-omni/` into `~/.claude/skills/`.

## Commands

| Command | What it does |
|---|---|
| `omni capture <url\|file>` | Extract design DNA + screenshots → `ui-dna.json` |
| `omni audit <url\|file>` | Score UX/a11y: contrast, names/labels/alt, tap targets, focus visibility, heading order, landmarks, viewport, layout shift, reduced motion, loading states |
| `omni tokens <dir>` | `ui-dna.json` → `tokens.json` + `tokens.css` |
| `omni scaffold <dir> [--framework css\|react\|tailwind]` | Skeletons, motion, state styles, state sheet |
| `omni full <url\|file>` | All of the above + `REPORT.md` |

Options: `--out <dir>`, `--viewport 1440x900`, `--mobile`. Set `OMNI_CHROMIUM=/path/to/chrome` to use a specific browser binary.

## What "beyond pretty" means here

- **States**: every control and data view gets the full matrix ([state-matrix.md](skills/super-uiux-omni/references/state-matrix.md)).
- **Skeletons**: same box as the real content, delayed 150ms, `aria-busy`, no layout shift ([skeletons.md](skills/super-uiux-omni/references/skeletons.md)).
- **Motion**: duration/easing tokens, exits faster than entrances, View Transitions, reduced motion ([motion.md](skills/super-uiux-omni/references/motion.md)).
- **Verification**: re-audit, keyboard pass, slow-network pass, 390px and 1440px screenshots ([ux-heuristics.md](skills/super-uiux-omni/references/ux-heuristics.md)).

## Use it for good

OMNI reads what any browser already renders. Use it to learn from good UI, audit
and improve products you own or work on, and build design systems. Don't use it
to clone someone's brand or impersonate a site. See
[ethics.md](skills/super-uiux-omni/references/ethics.md).

## Develop

```bash
npm test
```

## License

MIT
