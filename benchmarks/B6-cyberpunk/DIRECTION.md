# Direction — B6 Cyberpunk agent console ("Hazard label")

Brief: make the Hermes agent chat cyberpunk **without** it reading as vibe coded
(David's verdict on the first attempt, 2026-11-06). Frame: Astryx `ai-chat`
(accepted 2026-11-10). Playbooks: `agent-chat` + `game-fui`.

Surface: **Operate**.

Concept: **the netrunner's deck is industrial equipment, and it is labeled like
it.** Cyberpunk's world is corporate hardware, warning plates and street
signage, not glowing gradients. So the UI borrows the visual language of
hazard labeling: one hazard yellow with black ink that always means *operator
action*, signal red for failure, a cold cyan for live data, and condensed
plate lettering. Everything else is matte black equipment.

## References (none are web UIs)

- **ISO 7010 / ANSI Z535 safety signs and hazard tape** → yellow + black is
  reserved for "attention: you must act"; the diagonal tape stripe marks a
  boundary you cross on purpose. Signature: a tape edge on the one thing that
  needs authorization.
- **Equipment data plates (stamped aluminum, DIN 1451 lettering)** → condensed
  caps for designators only, values in mono, a hairline frame, a serial line.
- **Japanese construction and rail signage** → dense, color-coded, calm: color
  is a code people rely on.
- **Akira / Ghost in the Shell 1995 interface cels** → flat ink colors on dark,
  no bloom; information density over effects.
- **Mike Pondsmith's Cyberpunk 2020 rulebook layouts** → black, one spot color,
  ruled boxes: print discipline, which is where the genre's look began.

## System

- Theme: `themes/presets/netrunner.json` (+ `netrunner-day`), generated with
  `omni themegen`, bridged to Astryx with `--astryx`. Zero raw colors in the app.
- Yellow (`accent`, bright fill with black legend in both modes) = operator
  action: send, authorize, the pending decision. Nothing else is yellow.
- Red `danger` = failed. Cyan `active` = live/running. Blue `info` = links, the
  agent's voice. Green `ok` = done.
- Type: Barlow Condensed 600 (DIN-like, from highway signage) for plate labels
  and headings only; IBM Plex Sans for reading; Plex Mono for commands and values.
- Shape: sharp (2/3/6px). Hairline frames. No glow, no gradients, no scanlines.
- Motion: snappy (90/160/240ms); one loop only, the running indicator.

## Ornament budget (3)

1. **Authorization bar**: hazard-tape left edge + yellow AUTHORIZE key.
2. **Deck plate** (top strip): designator lettering, serial line, status lamps.
3. **Running step**: cyan live edge while a tool executes.

## Not

- No cyan `#00e5ff` + magenta `#ff2bd6`, no neon glow, no scanlines, no
  glitch, no grid backgrounds, no brackets on every panel.
- No uppercase monospace as the UI font; caps only on plate labels.
- No tape stripes as decoration: tape appears only where authorization is required.
- No chat bubbles restyled as "holograms"; reading surfaces stay plain.

## The benchmark

Three variants of the same page, scored the same way:

| Variant | What it is |
|---|---|
| `stock` | Astryx `ai-chat`, neutral theme, untouched (baseline) |
| `naive` | Same page + the palette-swap a one-shot prompt produces: cyan/magenta, glow, uppercase mono, scanlines (the control that should fail) |
| `directed` | This direction: netrunner theme via the bridge + the agent pieces the template lacks (authorization bar, deck plate with context meter, stop, empty/loading/error states) |

Pass = gate PASS, no slop tells, Expression ≥ 70, and David ≥ 4/5.
