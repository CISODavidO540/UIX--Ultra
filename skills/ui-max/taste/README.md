# Taste profiles

UI-MAX keeps one taste profile per person. It starts from `starter.md` (seed
rules that are a decent default, so nobody starts from zero) and grows from
that person's own verdicts, in their own words.

| Command | MCP | Does |
|---|---|---|
| `omni taste show` | `ui_taste` | Print the profile (created from the starter on first use) |
| `omni verdict <page> keep\|reject "<words>" --property p` | `ui_verdict` | Log a reaction in the verdict log (and the evidence log) |
| `omni taste rule never\|always "<rule>" --from "<words>"` | `ui_taste_rule` | Add a rule the user's words imply |
| `omni taste init --project` | | Start a per-project profile at `.omni/taste.md` |
| `omni taste init --from david` | | Start from an example profile instead of the starter |
| `omni taste path` | | Where the active profile lives |

Where it lives (first match wins): `$UI_MAX_TASTE`, `<project>/.omni/taste.md`,
`~/.config/ui-max/taste.md`. Profiles are personal and never committed to this repo.

`examples/david.md` is a real profile after two weeks of use: verdicts, the
rules they produced, and the moments the score and the person disagreed. The
seed rules in `starter.md` were generalized from it and from the research in `reports/`.
