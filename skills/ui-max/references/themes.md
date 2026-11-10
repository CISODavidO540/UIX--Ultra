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

## What a complete theme contains (the contract)

Every theme exposes the same role names (themegen fails if not), and
`omni specimen` fails on any missing role. Research: `reports/Complete theme systems.md`.

| Group | Roles |
|---|---|
| Surfaces | `surface-inset`, `surface-0..3`, `scrim` |
| Lines | `border-1`, `border-2`, `border-strong` |
| Text | `text-1..3`, `link`, `link-visited` |
| Status families | `{ok,warn,danger,info,active,accent}-{fg,bg,border,solid,on-solid}` |
| Interaction | `state-hover` 8%, `state-focus` 10%, `state-pressed` 12%, `state-dragged` 16%, `state-selected` (info tint, never the attention color), `state-disabled-opacity` .38 |
| Focus | `focus`, `focus-width`, `focus-offset` |
| Elevation | `shadow-1..3` (dark: darker/larger; light: soft) + the surface ladder |
| Shape | `radius-sm/md/lg/full` from `shape: sharp|soft|round` |
| Type | `font-sans`, `font-mono` (themes may swap faces) |
| Motion | `duration-fast/base/slow`, `ease-standard/enter/exit` from `motion: calm|snappy`; 1ms under reduced motion |
| Data viz | `viz-1..8` categorical, each ≥ 3:1 on panels |
| Code | `syntax-keyword/string/number/function/type/comment/plain`, each Lc 60+ on the code well |

Checks per theme (74): APCA for every text/surface pair, WCAG 2 for placeholder
and lit legends, chart marks ≥ 3:1, syntax Lc 60+, and status families at least
ΔE 0.08 apart in OKLab (so "running" never looks like "failed").

Exports: `themes.css`, `themes.boot.html` (no-flash `<head>` snippet + `color-scheme`),
and with `--dtcg` one DTCG 2025.10 `.tokens.json` per theme plus `omni.resolver.json`.

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

## Forced colors (Windows High Contrast)

The generated CSS maps every role to system colors (Canvas, CanvasText,
ButtonFace/ButtonText, Highlight, LinkText, GrayText) and drops shadows.
Components still need two things themselves:

- `forced-color-adjust: none` on data marks (chart bars, legend swatches, status
  dots that carry meaning); everything else should let the OS recolor it.
- A visible border on lit controls (`1px solid ButtonText`), because fills are
  flattened to ButtonFace.
- State shown by fill must switch to Highlight: switches (on), checked boxes,
  selected rows. Error states use `--danger-border` (maps to CanvasText) and a
  2px border, never a fill color alone.

Check with `omni specimen` (writes `forced-colors.png`).

## Checks

`omni check` counts raw color literals in component CSS (`sheet.rawColors`);
more than 6 costs Craft and shows in the fix plan as sprinkled color.
