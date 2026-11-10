---
name: ui-max
description: Use for any UI/UX build, redesign or review. Gate on proof.
version: 1.0.0
author: David Olson
license: MIT
metadata:
  hermes:
    tags: [ui, ux, design, frontend, accessibility, motion, design-system, review]
    related_skills: [claude-design, popular-web-designs, design-md, dogfood]
---

# UI-MAX

The goal: whatever the user asks for, the first version they see is already good.
"Good" means four things, all checkable:

1. **It has a point of view.** One idea, derived from the product and real-world references. Not a mood board of web tropes.
2. **It works in every state.** Loading, empty, error, partial, success, disabled, focus. Not just the happy screenshot.
3. **It passes the stat gate.** `omni check` → gate PASS (a11y, slop tells, states, motion, 390px).
4. **It survives its own screenshots.** You look at what you made, critique it with the rubric, and fix the three worst things before the user sees it.

You are blind to your own output until you render it. Most bad AI UI comes from
never looking. Step 7 is not optional.

## Step 0: load taste (always)

Read the user's taste profile: `omni taste show` (MCP `ui_taste`). It starts
from seed defaults and grows from their own verdicts; their **Never** and
**Always** rules override every other reference, including this file. If a
direction you are about to take matches a past "no", change it before you build.
If it doesn't exist yet it is created from `taste/starter.md` on first read.
`taste/examples/` has a real profile after two weeks of use, for reference.

## Fast path (small tweaks)

For a tweak to an existing UI (one component, a color, a spacing fix): skip
steps 1–3, follow the repo's existing tokens, then do step 7 on the changed
screen. Still never ship without looking.

## The loop (new screens, redesigns, prototypes, themes)

Each step leaves a written artifact. If you can't write it down, you haven't done it.

### 1. Brief

Write five lines: who uses it, the **3–5 most frequent tasks**, what real content
exists (screens, data, copy, repo), the stack, and the fidelity. Ask the user at most
3 questions, and only questions whose answer changes the composition. Otherwise
state assumptions and go. He prefers you act.

If a repo or running app exists, read its tokens/components first, or run
`omni full <url>` to capture it. Design from the real thing, not memory.

### 1b. Route

`omni route "<task>"` (or MCP `ui_route`) → read the top playbook
(`playbooks/<id>.md` or `ui_playbook`). It lists the core tasks, the states that
must exist, the effects budget, the slop risks for that use case, and the Astryx
templates to start from. On a React 19 stack, also run `astryx build "<task>"`
(MCP `astryx`) and start from the template it picks; see `references/astryx.md`.

### 2. Surface

Name one archetype in one line: **Monitor, Operate, Compare, Configure,
Decide/Learn, Explore, Command/Inspect** (definitions in the `claude-design`
skill). A hero section belongs to Decide/Learn only. Wrong surface is the root
cause of most slop.

### 3. Direction

Read `references/direction.md`. Write `DIRECTION.md` next to the artifact:

- **Concept**, one sentence, taken from what the product *does*
  (e.g. "tool calls are flight strips; the user is the controller issuing clearances").
- **3–5 real references** that are not other web apps: film FUI, hardware panels,
  signage systems, print, instruments, industrial design.
- **What each gives you**: palette, type, shape, motion, and one signature detail.
- **Ornament budget**: the 2–3 elements that get special treatment, and why.
- **What it is not**: the tropes you're refusing.

For variants, make 3 that differ in *concept*, not color: conservative,
strong-fit, divergent.

### 4. System

Tokens before components. Color roles in OKLCH (bg, surface 1–3, text, muted,
border, one accent with a meaning, status colors used only for status). A type
scale with a stated ratio. Spacing on 4px. Radii, elevation, motion durations
and easings. Read `references/craft.md`.

Use the Pro Max database for **lookups**, not direction (see `references/pro-max.md`):
font pairings, UX rules, chart choice, stack gotchas.

```bash
PM=<this skill dir>/vendor/ui-ux-pro-max/scripts/search.py
python3 $PM "<topic>" --domain ux|typography|google-fonts|color|chart|icons|style -n 3
python3 $PM "<topic>" --stack react|nextjs|html-tailwind|shadcn|svelte|...
```

### 5. States

Before UI code, fill the matrix in `references/state-matrix.md` for every
component and data view. Write the real copy for empty and error states.
For agent/chat UIs also read `references/stylized-themes.md` (step-card state
machine, approval, stick-to-bottom).

### 6. Build

- Real content. Use the product's actual data, commands, names. No lorem, no fake metrics, no filler stat rows.
- Tokens only. No raw hex in components.
- Motion last, from `references/motion.md`. Effects report real state; keyboard actions never animate.
- Skeletons match the final layout (`references/skeletons.md`).
- Mobile 390px first, then 768, then 1280+.
- Include a way to see every state (a state switcher or `?state=empty|error|loading`) so the states can be verified.

### 7. Verify (mandatory)

```bash
omni check <file.html|url> --out <dir>      # stat sheet + screenshots; exit 1 on FAIL
omni diff <before> <after> --out <dir>      # for any redesign: prove it improved
```

1. Gate must PASS. Fix failures; don't argue with them unless a tell is a stated decision in `DIRECTION.md`.
2. **Look.** Open `desktop-fold.png` and `mobile-full.png` with `vision_analyze` and run `references/critique.md`. Write down the three worst things. Fix them. Re-check.
3. Force each state (switcher / query param) and look at least at empty and error.
4. Keyboard pass: Tab through the main path; focus is visible and in order.

Stop when: gate PASS, overall ≥ 88 (A), critique has no "fix before showing" items.
Max 3 iterations; if still failing, ship with an honest note.

### 8. Deliver

Short: path (as `MEDIA:` or `::preview`), the stat line
(`PASS · 92 A · access 98 · originality 100 · …`), what was not verified, and
**one** question about taste. When the user answers, log it in their words:
`omni verdict <page> keep|reject "<their words>" --property <what decided it>`
(MCP `ui_verdict`). If it generalizes, add the rule it implies with
`omni taste rule never|always "<rule>" --from "<their words>"` (MCP `ui_taste_rule`).
Never invent a verdict or a rule the user didn't say. This is how their taste
compounds across sessions and projects.

## Hard rules

- One accent color, and it means something. Neutrals do most of the work.
- One content sans with a real scale; monospace only for data. Uppercase tracking for at most one label level.
- Ornament on 2–3 elements per screen that carry state. Everything else plain.
- Every interactive element: hover, focus-visible, active, disabled. Every async action: idle → busy → success | error with recovery.
- Contrast 4.5:1 on every text token including muted, placeholder and disabled. Targets ≥ 24px (44px touch).
- No emoji as icons. One icon set or none.
- Never claim it looks good without having looked at a screenshot.

## Commands

`omni` is on PATH (wrapper in `~/.local/bin/omni`; repo `~/Projects/UIX--Ultra`, node `bin/omni.js`).

| Command | Use |
|---|---|
| `omni check <target>` | Stat sheet: Access, Originality, States, Motion, Responsive, Craft → rank S–F + gate |
| `omni diff <a> <b>` | Before/after stats, tells removed/introduced, side-by-side `compare.png` |
| `omni full <target> --mobile` | Capture an existing UI: DNA, tokens, audit, scaffold, REPORT.md |
| `omni audit <target>` | Accessibility audit only |
| `omni theme cyberpunk` | Old theme pack: keep its behaviors (step cards, effects dial, stick-to-bottom), not its look |

| `omni plan <target> --task "<what>"` | Fix plan for bad / vibe-coded UI: P0 → P1 → P2 + playbook must-haves (MCP `ui_fix_plan`). Example: `examples/fix-vibecoded/WALKTHROUGH.md` |
| `omni themegen [--for <playbook>]` | Generate APCA-validated themes from OKLCH presets (MCP `ui_themegen`); see `references/themes.md` |
| `omni route "<task>"` / `omni playbook <id>` | Use-case router and playbooks (with Astryx template ids) |
| `omni verdict <target> keep\|reject "<reason>" --property p --check dir` | Log the user's verdict (also written to their taste profile); `omni evidence` shows whether the gate agrees with them |
| `omni setup [--write]` | Register the MCP server (Claude Code, Cursor, Claude Desktop) and link this skill |

**MCP tools** (server `ui-max`, `bin/omni-mcp.js`): `ui_taste`, `ui_taste_rule`, `ui_fix_plan`, `ui_themegen`, `ui_route`, `ui_playbook`,
`ui_reference`, `ui_capture`, `ui_check`, `ui_audit`, `ui_diff`, `ui_verdict`,
`ui_evidence`, `astryx` (read-only Astryx CLI queries). Prefer them over shelling
out when available. Only call `ui_verdict` and `ui_taste_rule` with the user's actual words.

Local files that use ES modules or fetch need a server (`python3 -m http.server`); plain HTML can be checked by path.

## References

- Taste profile (`omni taste show` / `ui_taste`) — the user's rules and verdicts; read first, write after. Seed: `taste/starter.md`
- `references/direction.md` — concept-first direction, reference sourcing, ornament budget
- `references/craft.md` — the details that make UI feel intricate and finished
- `references/critique.md` — rubric for looking at your own screenshots
- `references/themes.md` — theme engine, semantic roles, grounding, switching (every color is a role)
- `references/astryx.md` — Meta's agent-ready design system: when and how to use it with UI-MAX
- `playbooks/` — one per use case (agent-chat, monitor-dashboard, data-table-admin, forms-settings, detail-page, onboarding-empty, landing-marketing, mobile-app, game-fui)
- `references/pro-max.md` — how to use the vendored UI/UX Pro Max database, and its blind spots
- `references/state-matrix.md`, `motion.md`, `skeletons.md`, `ux-heuristics.md`, `stylized-themes.md`, `ethics.md`
- `benchmarks/` in the repo — fixed briefs for measuring whether this skill is improving
