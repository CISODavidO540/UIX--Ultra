# Using UI/UX Pro Max inside UI-MAX

Vendored at `vendor/ui-ux-pro-max/` (MIT, NextLevelBuilder, v2.15.0, upstream
commit in `UPSTREAM_COMMIT`). Its own instructions are in `PROMAX.md`
(renamed from SKILL.md so it doesn't register as a second skill).

```bash
PM="$(dirname "$0")/vendor/ui-ux-pro-max/scripts/search.py"   # or the absolute path
python3 "$PM" "<2–5 terms, one intent>" --domain <domain> -n 3
python3 "$PM" "<topic>" --stack <stack>
```

## What it's good for (use it)

| Need | Domain | Example query |
|---|---|---|
| A specific UX rule with do/don't | `ux` | `"error summary validation"`, `"focus not obscured"`, `"number formatting"` |
| Font pairings / individual Google Fonts with licenses | `typography`, `google-fonts` | `"technical condensed signage"` |
| Chart type for a data shape | `chart` | `"real-time time series"` |
| Icon set choice and a11y | `icons` | `"icon button accessible label"` |
| Stack gotchas | `--stack` | `"form validation" --stack react`, `"virtualized list" --stack svelte` |
| Motion presets (GSAP) | `gsap` | `"stagger list enter"` |
| React perf rules | `react` | `"rerender memo list"` |

## Blind spots (don't let it decide)

- **Direction.** `--design-system` maps keywords to a stock style + palette.
  Tested 2026-11-08: "AI agent console developer tool dark" returned a
  *FAQ/Documentation Landing* pattern with Tailwind slate `#0F172A` + green
  `#22C55E`. That is the generic answer UI-MAX exists to avoid.
- **Agent / tool UIs.** `"agent console tool calls approval"` → 0 UX results.
  Use `stylized-themes.md` and `state-matrix.md` instead.
- **Concept styles.** `"instrument panel industrial"` → 0 style results. Its 80 styles
  are web-trend names (glassmorphism, bento, claymorphism), not world references.

Rule: decide the concept in `direction.md` first, then use Pro Max to check
specific choices against its rules. If a search returns 0 results, say so; don't
invent a "Pro Max says".

## Updating

```bash
git clone --depth 1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill /tmp/uupm
rsync -a --delete --exclude PROMAX.md --exclude LICENSE --exclude UPSTREAM_COMMIT \
  /tmp/uupm/.claude/skills/ui-ux-pro-max/ vendor/ui-ux-pro-max/
mv vendor/ui-ux-pro-max/SKILL.md vendor/ui-ux-pro-max/PROMAX.md
rm -rf vendor/ui-ux-pro-max/scripts/tests
git -C /tmp/uupm rev-parse HEAD > vendor/ui-ux-pro-max/UPSTREAM_COMMIT
```
