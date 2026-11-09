# Direction — Hermes run view v2-A ("Flight deck")

Why v2: David on v1 (`after.html`, 100 S): "lacks color and enough structure and
the buttons and settings are vibecoded… not good enough to flex". v1 took the
cockpit *checklist* but left out the cockpit: the color system, the display
units, the physical controls.

Surface: **Operate + Monitor**. Playbook `agent-chat`.

Concept: **Hermes flies, you are the captain.** The run is shown the way a glass
cockpit shows a flight: framed display units, each with one job; colors that are
a code, not a mood; a master caution that lights when the crew is needed; keys
you press, not links you click.

## References
- **Boeing 787 glass cockpit (ECL, EICAS, ND)** → *magenta = the active thing*
  (active waypoint → active checklist line); white boxed current item; display
  units with labels on the bezel.
- **Airbus ECAM color code** → green normal/done, amber caution/needs crew,
  red warning/failed, white text. Status is always color + word.
- **System synoptic pages (ECAM HYD/ELEC)** → a mimic diagram of the run:
  deps → test → edit → test → push, nodes colored by state, flow lines.
- **Glareshield annunciators (MASTER CAUTION, push-to-reset)** → the one control
  that lights when you're needed; pressing it takes you to the decision.
- **Airbus FCU / Boeing MCP keys** → backlit rectangular keys with a legend and
  a lit bar; pressed = travels 1px. Replaces every kit button.

## System (round 3: on managed themes)

David on round 2: "needs better theme management and colors… a little more
grounding… it depends on use case". So the palette moved out of the page:

- Colors come from `themes/presets/flight-deck-{night,day,hc}.json` via
  `omni themegen` → `themes/omni-themes.css`. The page holds **zero** raw colors.
- ECAM code as roles: done = `ok-*`, needs crew = `accent-*` (amber), failed =
  `danger-*`, active/current = `active-*` (Boeing magenta), Hermes voice = `info-fg`.
- Grounding: every status row/area uses its `-bg` tint + `-solid` inset bar +
  icon + word; output lines that matter are tinted, not just recolored.
  Screens are `surface-inset` wells inside `surface-1` display units; display
  units carry a zone color on their top edge.
- Theme keys in the glareshield: Night / Day / High contrast; `?theme=` wins,
  then saved choice, then OS contrast/color-scheme.
- IBM Plex Sans (content), Plex Mono (lines, values). One tracked uppercase
  level: lamps, status words.
- Motion: master caution blinks twice when it lights (not looping); the active
  step pulses only while running; reduced motion removes both.

## Ornament budget
1. Master caution annunciator (lit only when approval pending).
2. Magenta active line + synoptic node.
3. Lit bars on keys that are armed.

## Not
- No hero, stat tiles, gradients, glass blur, emoji, chat bubbles.
- No stock cyan/magenta neon (`#00e5ff`/`#ff2bd6`), no scanlines, no brackets.
- No kit buttons: every control is a key or an annunciator.
