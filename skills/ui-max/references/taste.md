# David's taste log

Read before designing. Append after every verdict. Newest first in the log.
The **Never** and **Always** lists are distilled from the log; update them when
a verdict implies a new rule. A rule needs one clear verdict to get in, and a
contrary verdict to get out.

## Who it's for

David builds Harvis (self-hosted AI workbench, Hermes desktop UI frontend) and
runs a Proxmox homelab. He's a cybersecurity student. He likes Cyberpunk:
Edgerunners and stylized sci-fi, but he rejects *generic* stylized. He wants UI
that is productive, usable and alive, and he judges by looking, fast.

## Never

- **Stock cyberpunk**: cyan `#00e5ff` + magenta `#ff2bd6` + yellow on near-black. (2026-11-06, "looks too vibe coded")
- **Uppercase monospace with letter-spacing on every label**, `//` prefixes as decoration. (2026-11-06)
- **Uniform decoration**: corner brackets, chamfers, grid backgrounds, radial glows and scanlines applied everywhere. (2026-11-06)
- **The stock AI-app shell** as a default: sidebar / chat / right panel with filler stat rows. Earn the layout from tasks. (2026-11-06)
- **Fake content**: scripted mock data that was never tested against real density. (2026-11-06)
- Generic AI-slop tells: blue/violet gradients, indigo default accent, icon-topped feature-tile grids, glass everywhere, giant vanity numbers, everything centered. (claude-design ten tells)

- **Restraint without color**: graphite + one accent used only for status reads unfinished, not "clean". (2026-11-09, fix-vibecoded after.html: "lacks color")
- **Default-looking controls**: rounded outline buttons, plain text tabs, stock textarea + Send/Stop. If the controls could come from any component kit, they read vibe coded. (2026-11-09: "the buttons and settings are vibecoded")

## Always

- Start from the real product: real screens, real data, the 5 most frequent tasks.
- One strong concept, taken from the world (film FUI, hardware, signage, instruments), not from other web UIs.
- Effects report real state (working, tool started, approval waiting, error, success). Constant ambient effects say nothing.
- Keep a plain mode one click away (Effects: Full / Subtle / Off).
- Show the result rendered, with the stat line, not a description of it.
- **Aim for flex-worthy**: impressive at first glance *and* usable. Clean-but-plain is a fail, the same as pretty-but-unusable. (2026-11-09: "not good enough to flex")
- **Color with a job, in quantity**: zones, states and controls carry color; not a single accent sprinkled on neutrals. (2026-11-09)
- **Visible structure**: clear regions, framed panels, a grid you can see; a document column with a sidebar isn't enough structure. (2026-11-09)
- **Controls designed from the concept** (physical-feeling keys, indicators, legends), never kit defaults. (2026-11-09)

## Open questions (ask when relevant, then move the answer up)

- Light vs dark default for tools: never stated. Hermes is dark today.
- How much stylization in daily-driver tools vs demos? "Productive, usable and alive" suggests restrained in tools, louder in demos.
- Preferred type families: unknown.

## Verdict log

Format: `date · artifact · verdict (his words) · rule it implies`

- 2026-11-09 · `examples/fix-vibecoded/after.html` (scored 100 S) · "somewhat of a improvement but it lacks color and enough structure and the buttons and settings are vibecoded… right track… not good enough to flex" · new Never: restraint without color, default-looking controls; new Always: flex-worthy, color with a job, visible structure, concept-designed controls. **The stat sheet said 100 S and David said no: the score measures hygiene, not impressiveness.**
- 2026-11-09 · `examples/fix-vibecoded/before.html` · "definitely vibe coded" · confirms the slop tells (34 F).

- 2026-11-06 · UIX Ultra `themes/cyberpunk/demo.html` · "looks too vibe coded" · see the five 2026-11-06 Never items. `omni check` now flags this file with tells 2, 11, 12, 13 (default accent, shouty labels, mono as texture, ornament everywhere).
