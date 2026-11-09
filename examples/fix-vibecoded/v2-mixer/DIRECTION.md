# Direction — Hermes run view, variant B ("Vision mixer")

Second-round fix of `before.html`, after David's verdict on `after.html`:
"lacks color and enough structure and the buttons and settings are vibecoded…
not good enough to flex". Variant A pushes the checklist concept; this variant
takes a far domain to find the edge.

Surface: **Operate** (secondary: Monitor). Playbook `agent-chat`.

Concept: **A run is a live broadcast, and you are the director at the switcher.**
Hermes stages every risky action on **Preview** (green tally). What is executing
is **Program**, on air (red tally). Nothing goes to air until you press **Take**.
**Cut** throws the staged action away (deny); **FTB** (fade to black) stops the
run. The screen is a multiviewer: framed monitors, each a source (run log,
staged action, sandbox output, diff), each with an under-monitor display (UMD)
naming it and showing its tally.

The concept changes behavior, not just paint: approval is a physical Take,
the staged action has its own monitor so you see exactly what goes to air, and
the step keys on the source bus double as an inspector (punch a source to put
its output on the output monitor).

## References

- **Blackmagic ATEM / Grass Valley Korona / Ross Acuity switcher panels** →
  rows of backlit square keys with short legends; lit = selected; Program bus
  keys glow red, Preview bus keys glow green; one big Take/Cut pair on the right.
  Signature: the Take key.
- **TSL tally and UMD protocol** → every monitor wears a label strip with tally
  lamps; red = on program, green = on preview. Color is a code the whole crew
  reads at a distance.
- **Multiviewer layouts (Program large, Preview beside it, sources tiled)** →
  structure: a visible grid of framed monitors with thin bezels; Program biggest.
- **Broadcast master-control rooms** → dark, matte, equipment-grey surfaces;
  color only from lamps and keys, so lit things are unmissable.
- **Production talkback panels** → the composer is talkback: you speak to the
  crew (Hermes) without stopping the show.

## System (rev 2: theme roles)

Colors now come only from theme roles (`themes/omni-themes.css`, presets
`studio` / `studio-daylight`, switchable in the panel; `?theme=` → saved
`hermes-theme` → OS preference). Mapping: Program tally = `active-*`,
Preview/done = `ok-*`, waiting for Take = `accent-*`, failures only = `danger-*`,
selected source / current page = inverted `text-1`. Every status has a tinted
ground + border + word (chips, grounded log rows, diff lines). Program vs.
failure is separated by form: the Program monitor wears a solid PGM / ON AIR
sign on its top edge; failures are grounded rows with ✕ + "failed".
Daylight: the preset's solid/on-solid pairs are under WCAG 2 AA for small
text, so lit keys/tags are grounded there and Take keeps its solid face with a
light legend plate.

The original literal palette below is kept for reference.


- Surfaces: room `#0e1012`, deck (control surface) `#181b1f`, monitor face `#121417`,
  bezel `#2e333a`, unlit key cap `#262a30`.
- Text: `#e4e7ea`; secondary `#c9ced4` (APCA ≥ 75 for sentences).
- Tally / lamp colors, each with one job:
  - Program / on air: red `#ff4b3e`
  - Preview / staged: green `#33d17a`
  - Needs you (staged and waiting for Take): amber `#ffb238`
  - Selected source / current page: warm white `#f2efe6` backlight
  - Failure text: `#ff8a80` with an ✕ (labels, never color alone)
- Type: IBM Plex Sans (content, key legends in title case), Plex Mono for
  commands, output and numbers. One tracked uppercase level: UMD labels.
- Shape: monitors have 2px bezels, 3px tally borders when on PGM/PVW; keys are
  near-square with 3px radius, a bevel and a lit face.
- Motion: one loop only, the red on-air lamp pulses while a step runs.
  Key presses depress 1px (80ms). Reduced motion removes the pulse.

## Ornament budget

1. The Take key (lit amber while something waits on Preview).
2. The lit Program / Preview step keys on the source bus.
3. Tally borders and UMD lamps on the Program and Preview monitors.

Everything else is matte: no glow on unlit keys, no glow on text.

## Not

- Not stock cyberpunk: no cyan/magenta, no scanlines, no brackets.
- No gradients, glass, emoji, hero, stat tiles, chat bubbles.
- No rounded kit buttons or plain text tabs: every control is a panel key.
- No color without a job: if it's lit, it means Program, Preview, Needs you, or Selected.
- Not a toy: transcript and output stay plain, readable text.
