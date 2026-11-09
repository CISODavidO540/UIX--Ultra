# Astryx with UI-MAX

[Astryx](https://github.com/facebook/astryx) is Meta's open-source, agent-ready
React design system: MIT, **beta**, React 19+, StyleX, 150+ components, seven
themes (neutral, butter, chocolate, matcha, stone, gothic, y2k). Verified
against CLI/Core **0.7.11** (Nov 2026).

## Division of labor

| Astryx gives | UI-MAX gives |
|---|---|
| The vocabulary: real, accessible components, page templates, blocks, tokens | The judgment: which use case this is, what it must contain, the direction, the ornament budget |
| Correct props (agents query instead of guessing) | Proof: `omni check` (slop, states, craft, APCA), screenshots, verdicts |
| `astryx build "<task>"` picks a page template | `omni route "<task>"` picks a playbook (states, effects budget, slop risks) |

Use both: route → playbook → `astryx build` → scaffold the template → adapt
with DIRECTION.md → custom theme → `omni check` → look → verdict.

## Commands (prefix `npx @astryxdesign/cli@0.7.11` before install; avoid bare `npx astryx`, a different package)

| Command | Use |
|---|---|
| `build "<what you're building>"` | Build kit: best page template, 2 alternatives, blocks and components for missing parts |
| `template --list --type page` | All page templates |
| `template <name> --type page <path>` | Scaffold a page template |
| `template <BlockName>` | Print a block |
| `component <Name>` | Props/docs (read before changing a component) |
| `search <query>` | Search components, docs, templates, themes |
| `docs tokens` | Design tokens |
| `init --agent claude\|cursor\|codex\|hermes\|all` | Write the agent doc block into CLAUDE.md / .cursorrules / AGENTS.md / `.hermes.md` |
| `init --user` | One computer-level skill at `~/.agents/skills/astryx/SKILL.md`, linked into `~/.claude/skills` |
| `init --features theme` | Writes `theme.template.ts` for a custom theme |
| `--json` on any command; `manifest --json` | Machine-readable output |

The UI-MAX MCP tool `astryx` runs read-only commands (search, component,
docs, template --list, build). Commands that write files (init, swizzle,
theme, template into a path) go through the normal shell so the user approves.

## Astryx's own rules (from `astryx build`)

- Start every page from a page template; never lay out from scratch.
- Keep the template's frame, gap and padding; replace data, copy and sections.
- No `<div>` for layout (VStack/HStack/Grid/Stack/Card); no `style={{}}`; tokens for values.
- Wrap in `<Theme theme={...}>` and import `reset.css` + `astryx.css`.
- Customization ladder: as-is → `className`/`xstyle` → theme tokens → `swizzle` (last resort, then you own it).

## Where they conflict, and the call

- **Template layout vs. direction.** Astryx says keep the template frame. UI-MAX says identity comes from the concept. Keep Astryx's spacing and structure, and carry identity through the theme (palette, type, radius, density) and 2–3 ornamented state elements. If the template's composition is itself a slop tell (centered hero, row of identical KPI tiles), pick another template rather than fighting it.
- **Default themes are not a direction.** A stock theme (neutral etc.) out of the box will read as generic. Write a custom theme from DIRECTION.md.
- **Agent-app specifics.** `ai-chat` covers transcript, tool-call output and the artifact panel. Still check the agent-chat playbook for the approval prompt, stick-to-bottom, Esc/queue and the context meter.

## When not to use it

- Stack isn't React 19 (use it as a pattern reference only; template descriptions are good specs).
- Tailwind-only or CSS-in-JS teams that can't adopt StyleX (cascade-order issues reported).
- Production apps that can't absorb beta API churn.
