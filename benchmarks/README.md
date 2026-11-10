# UI-MAX benchmarks

Fixed briefs, run the same way each time, so "is the skill getting better?"
has an answer. Each run produces one HTML artifact in `benchmarks/runs/<date>-<id>/`
with `DIRECTION.md`, `index.html`, and the `omni check` output. Append one line
per run to `results.csv`.

## Scoring a run

1. `omni check benchmarks/runs/<run>/index.html --out benchmarks/runs/<run>/check`
2. Critique score (0–14) from `skills/ui-max/references/critique.md`, written by the agent.
3. **David's verdict** (1–5, plus his words) when he looks at it. This is the number that matters; the rest predict it.

`results.csv` columns: `date,brief,run,overall,rank,pass,access,originality,states,motion,responsive,craft,critique,david,notes`

The skill is "maxed" when five consecutive runs across different briefs get
gate PASS, rank A or better, and David ≥ 4.

## Briefs

### B1 · Agent run console (Operate)
Hermes is running a multi-step task on David's homelab. Show the transcript,
the tool steps (pending, running, awaiting approval, done, error, denied), an
approval for a risky command with its blast radius, a context meter, and the
composer. Use real Hermes tool names and real commands. Must stay usable at
390px.

### B2 · Model provider settings (Configure)
Harvis settings page to add and test a bring-your-own model server (OpenAI-
compatible URL, key, model list fetch, test connection, default model). States:
untested, testing, connected, auth error, unreachable, no models.

### B3 · Homelab status (Monitor)
One screen for pve and its VMs/containers (vault-box, hermes-pop, pihole,
jellyfin, radarr, sonarr, prowlarr, qbittorrent): up/down, CPU/RAM, last
backup, alerts. The pihole being down matters more than anything else (whole
house DNS). Glanceable from across the room.

### B4 · Harvis landing page (Decide/Learn)
Open-source, self-hosted alternative to Open WebUI and Claude Desktop. FastAPI
+ Postgres/pgvector, bring-your-own model server, Docker installer, k3s LAN
mode. One page that makes a self-hoster want to try it. No fake testimonials
or stats.

### B5 · Cut tracker (mobile, Operate)
A phone-first food log for a cut: log a meal fast, see remaining calories and
protein for today, weekly trend. Includes the quesadilla rule: weigh half,
multiply by two. 390px is the primary viewport.

### B6 · Cyberpunk agent console (Operate, stylized)
The hard case: make the Hermes agent chat cyberpunk without it reading as vibe
coded. Frame: Astryx `ai-chat`. Three variants scored the same way: `stock`
(baseline), `naive` (the palette-swap control, which must fail), `directed`
(a written direction + generated theme + the agent pieces the template lacks).
See `B6-cyberpunk/`.
