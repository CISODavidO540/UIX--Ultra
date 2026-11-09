# Direction — B1 Agent run console ("Strip bay")

Surface: **Operate** (secondary: Monitor). The user steers a running agent,
approves risky steps, and reads output. No hero, no stat tiles.

Concept: **Tool calls are flight strips in a bay. Hermes is the pilot; David is
the controller who issues clearances.** A step that needs you physically
sticks out of the bay, the way controllers "cock" a paper strip to flag it.

Top tasks (in order of frequency):
1. Read what Hermes is doing / did (transcript + current step)
2. Approve or deny a risky command, knowing its blast radius
3. Stop the run without losing work (Esc)
4. Open one step's output (especially a failure)
5. Queue the next message while it runs

Real content: steps are the actual tool calls from the 2026-11-08 session that
built UI-MAX (`gh` missing → recovered via the GitHub API, vendoring Pro Max,
calibrating `omni check` against the old cyberpunk theme). The approval is the
real `rm -rf` that Hermes' smart approval flagged.

## References

- **Paper flight progress strips + strip bays (NATS/FAA tower ops)** → palette: buff
  card strips on a dark bay; type: condensed printed designators, handwritten
  marks; shape: fixed-column boxes per strip; signature: the *cocked strip*
  (offset out of line = needs attention).
- **Electronic strip systems (NATS EFPS, Frequentis smartStrips)** → keep the
  paper metaphor on a screen: light strips on dark, columns that never move,
  one highlight color for "needs action".
- **SBB / Swiss railway signage** → restraint: neutrals everywhere, one signal
  color for the single thing that matters.
- **Teenage Engineering hardware (OP-1, field series)** → 1px keylines, small
  radii (2–4px), small sentence-case labels outside the control.
- **Rubber "CLEARED" stamps on paper forms** → the done mark: a small ink
  stamp that lands once (160ms), never loops.

## System

- Bay (bg): warm graphite `oklch(0.2 0.008 75)`; transcript text off-white `oklch(0.92 0.01 85)`.
- Strip paper: buff `oklch(0.93 0.028 85)`; ink `oklch(0.25 0.012 70)`.
- **Accent: signal amber = "needs your clearance"**, used nowhere else.
  `oklch(0.8 0.15 72)` on dark, `oklch(0.52 0.13 62)` as text on paper.
- Status only for status: failed `oklch(0.52 0.17 28)`, cleared = ink stamp (no green).
- Type: **Barlow** (content; highway-signage heritage, open counters) 400/500/600;
  **Barlow Semi Condensed** 600 for strip designators only (the one uppercase level);
  **IBM Plex Mono** for commands, paths, numbers. Scale 1.2: 12 / 13 / 15 / 18 / 22.
- Radius 3px (strips), 6px (controls). 1px keylines. 4px spacing grid.
- Motion: 120ms feedback, 200ms strip enter, 240ms cock, 160ms stamp. ease-out
  `cubic-bezier(.2,.8,.2,1)`. Keyboard actions don't animate.

## Ornament budget

1. The cocked strip awaiting clearance (offset + amber hold box) — the one thing that needs David.
2. The running strip's progress line — the one ambient loop, only while live.
3. The cleared stamp — lands once per step.

Everything else is plain type on plain surfaces.

## Not

- No cyan/magenta, no glow, no scanlines, no chamfers, no grid background.
- No uppercase-mono labels; mono only for commands/paths/numbers.
- No stat tiles or vanity counters; the context meter is the only gauge, because it changes behavior (compaction).
- No sidebar of fake sessions.
