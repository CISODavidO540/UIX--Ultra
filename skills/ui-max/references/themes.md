# Theme management

Rule (taste.md 2026-11-09): **every color is a semantic role from a generated
theme**. Components never hold raw hex. Color is grounded: a status is a family
(fg + tinted bg + border + solid + on-solid), not a colored word.

## Generate

```bash
omni themegen                       # all presets in themes/presets → themes.css, APCA report
omni themegen --for agent-chat      # which presets fit this use case
omni themegen my-brand.json --out src/themes.css
```

MCP: `ui_themegen({ preset })` or `ui_themegen({ custom: {...} })`.

A preset is a few OKLCH inputs:

```json
{ "name": "flight-deck-night", "mode": "dark", "contrast": "normal",
  "base":   { "hue": 235, "chroma": 0.014 },
  "accent": { "hue": 75,  "chroma": 0.16, "meaning": "needs the operator" },
  "status": { "ok": 150, "warn": 75, "danger": 25, "info": 230, "active": 325 },
  "concept": "…", "usecases": ["agent-chat", "monitor-dashboard"] }
```

The engine solves lightness so every pair below passes APCA (≥ 75 body, ≥ 60
labels, ≥ 45 placeholder; higher in `contrast: high`), and fails loudly if not.

## Roles

| Role | Use |
|---|---|
| `surface-inset` | Wells: screens, inputs, sunken areas (grounding) |
| `surface-0` | App background |
| `surface-1` / `-2` / `-3` | Panels → raised → overlays (elevation ladder) |
| `border-1` / `-2` / `-strong` | Hairlines → control edges → emphasis |
| `text-1` / `-2` / `-3` | Body → secondary → placeholder/disabled |
| `{ok,warn,danger,info,active,accent}-fg` | Status word/icon color |
| `…-bg` | Tinted ground behind that status (rows, banners, cells) |
| `…-border` | Edge of a grounded status area |
| `…-solid` / `…-on-solid` | Lit fills (keys, tags, master caution) and their legend |
| `focus` | Focus ring (Highlight in forced colors) |

## Grounding checklist

- A failed row = `danger-bg` + `danger-solid` inset bar + icon + word. Not red text alone.
- The decision waiting on the user = `accent-bg` area + `accent-solid` key. It is the only solid accent on screen.
- Panels sit on `surface-0`; content screens are `surface-inset` wells inside `surface-1` panels.
- Each region gets a zone color (top border) only if zones mean something (e.g. checklist = active, synoptic = ok).

## Switching

`<html data-theme="…">`. Order: `?theme=` (checks, links) → saved choice →
`prefers-contrast: more` → `prefers-color-scheme`. Ship at least: the concept's
dark, a light variant, and a high-contrast variant. Check each with
`omni check "<url>?theme=<name>"`.

## Checks

`omni check` counts raw color literals in component CSS (`sheet.rawColors`);
more than 6 costs Craft and shows in the fix plan as sprinkled color.
