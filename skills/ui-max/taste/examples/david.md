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

- **Sprinkled color**: colored text/lines floating on gray with hex values scattered through components. Color must be grounded in surfaces and roles. (2026-11-09, v2: "needs better theme management and colors… a little more grounding")

## Always

- Start from the real product: real screens, real data, the 5 most frequent tasks.
- One strong concept, taken from the world (film FUI, hardware, signage, instruments), not from other web UIs.
- Effects report real state (working, tool started, approval waiting, error, success). Constant ambient effects say nothing.
- Keep a plain mode one click away (Effects: Full / Subtle / Off).
- Show the result rendered, with the stat line, not a description of it.
- **Aim for flex-worthy**: impressive at first glance *and* usable. Clean-but-plain is a fail, the same as pretty-but-unusable. (2026-11-09: "not good enough to flex")
- **Color with a job, in quantity**: zones, states and controls carry color; not a single accent sprinkled on neutrals. (2026-11-09)
- **Visible structure**: clear regions, framed panels, a grid you can see; a document column with a sidebar isn't enough structure. (2026-11-09)
- **Grounded color**: status and accent colors come with their own tinted surface, border and solid variant; panels sit on a visible elevation ladder (inset wells, raised panels). (2026-11-09)
- **Managed themes**: every color is a semantic role from a generated theme (light + dark + high contrast), contrast-checked; components never hold raw hex. (2026-11-09)
- **Concept fits the use case**: pick the concept/theme from the use case (long agent runs ≠ high-stakes approvals ≠ dashboards), and say why. No single look for everything. (2026-11-09: "it depends on the use case")
- **Start from the Astryx frame** for app UI (accepted 2026-11-10); spend the design effort on theme, states and the 2–3 concept pieces, not on reinventing layout.
- **Controls designed from the concept** (physical-feeling keys, indicators, legends), never kit defaults. (2026-11-09)

## Open questions (ask when relevant, then move the answer up)

- Light vs dark default for tools: never stated. Hermes is dark today.
- How much stylization in daily-driver tools vs demos? "Productive, usable and alive" suggests restrained in tools, louder in demos.
- Preferred type families: unknown.

## Verdict log

Format: `date · artifact · verdict (his words) · rule it implies`

- 2026-11-10 · B6 depth study (Rajdhani everywhere, bezel + panel, fills, light, traces, ghost frame) · **keep** "now that is what im talking about that is what we like to see" · a stylized theme needs layered depth (atmosphere → bezel → filled panel → lit tiles → light) and one genre font for words and chrome alike.
- 2026-11-10 · B6 v3 Night City (type pass) · **revise** "font still needs work, the word style doesnt match … its basic in its depth, just a box around a word or a simple banner, no visual depth" · the reading text must speak the genre too (not a neutral corporate face); depth comes from layers, fills and light, not from outlines.
- 2026-11-10 · B6 v2 Night City · **4/5** "its a lot better theme wise but word font probably needs some work" · reference-driven genre rules work (red chrome, cyan = selected, yellow = needs you); typography is the next lever.
- 2026-11-10 · B6 v1 hazard label · **3/5** "the blue one is way too everywhere and the other stuff is kinda bland and does not fit cyberpunk" · one hue on every edge reads as noise; stylized themes must come from real genre references.

- 2026-11-10 · Astryx `ai-chat` template (stock, and with the flight-deck bridge) · "thats actually a pretty good UI i think were getting the hang of it" · Astryx's frame (transcript + artifact panel, real markdown/code, quiet chrome) is an accepted base. Build on it rather than hand-rolling layouts. Next ask: train/test on it, and benchmark **cyberpunk** as the hard case.

- 2026-11-09 · `v2-flightdeck` + `v2-mixer` · "good upgrade but it needs better theme management and colors and a little everywhere it just needs a little more grounding… it can work but it depends on usecase" · new: grounded color, managed themes, concept fits use case; Never: sprinkled color.
- 2026-11-09 · `examples/fix-vibecoded/after.html` (scored 100 S) · "somewhat of a improvement but it lacks color and enough structure and the buttons and settings are vibecoded… right track… not good enough to flex" · new Never: restraint without color, default-looking controls; new Always: flex-worthy, color with a job, visible structure, concept-designed controls. **The stat sheet said 100 S and David said no: the score measures hygiene, not impressiveness.**
- 2026-11-09 · `examples/fix-vibecoded/before.html` · "definitely vibe coded" · confirms the slop tells (34 F).

- 2026-11-06 · UIX Ultra `themes/cyberpunk/demo.html` · "looks too vibe coded" · see the five 2026-11-06 Never items. `omni check` now flags this file with tells 2, 11, 12, 13 (default accent, shouty labels, mono as texture, ornament everywhere).
