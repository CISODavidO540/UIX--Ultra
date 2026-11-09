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

## System
- Bezel `#11161b`, display glass `#090c10`, keylines `#26303a`.
- Text white `#e8ecef`, dim `#b4bec8`. Code: green `#7ee39a` done, amber
  `#ffbf47` needs you, red `#ff8a80` failed, magenta `#f08cf0` active.
- IBM Plex Sans (content), Plex Mono (lines, values). One tracked uppercase
  level: bezel labels and key legends.
- Shape: 3px radius, 1px keylines, keys with inner bevel.
- Motion: master caution blinks twice when lit (once, not looping), the
  active node pulses only while running; reduced motion removes both.

## Ornament budget
1. Master caution annunciator (lit only when approval pending).
2. Magenta active line + synoptic node.
3. Lit bars on keys that are armed.

## Not
- No hero, stat tiles, gradients, glass blur, emoji, chat bubbles.
- No stock cyan/magenta neon (`#00e5ff`/`#ff2bd6`), no scanlines, no brackets.
- No kit buttons: every control is a key or an annunciator.
