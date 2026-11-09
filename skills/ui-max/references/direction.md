# Direction: one idea, from the world

A direction is a decision you can say in one sentence and defend with
references. Without it, the model averages every UI it has seen, which is
exactly what "vibe coded" looks like.

## 1. Find the concept in what the product does

Ask: what real-world activity is this UI an instrument for? Then borrow that
activity's mature interface vocabulary. People have been designing for those
activities for decades.

| Product does | Real-world analog | What it lends |
|---|---|---|
| An agent runs steps you approve | Air-traffic flight strips; railway signal box; surgical checklist | Strips that move through bays, "cocked" strip = needs attention, clearances, read-back |
| Monitors a homelab | Broadcast master-control room; power-plant mimic diagram | Mimic lines showing flow, tally lights, grouped alarms, acknowledge vs clear |
| Logs food / training | Lab notebook; chronograph; nutrition label | Ruled grids, tabular numerals, one bold total |
| Manages files / sessions | Library card catalog; tape archive | Spines, call numbers, check-out state |
| Security findings | Field incident report; aviation NOTAM | Severity codes, terse fixed-format lines, timestamps first |
| Chat / writing | Editorial print, manuscript | Measure, margins, marginalia, quiet chrome |

The concept must change **behavior and layout**, not just colors. "Flight
strips" means steps physically shift when they need you. "Cyberpunk" alone
changes nothing but paint.

## 2. Gather 3–5 references, not web UIs

Good sources: Territory Studio / Perception film FUI breakdowns, Dead Space
diegetic UI, Teenage Engineering hardware, Braun/Dieter Rams, Swiss railway
signage (SBB), NASA/aviation cockpit displays, Massimo Vignelli's NYC subway
manual, Bloomberg Terminal, Elektron/Roland panels, Japanese train signage,
IBM 1970s design guidelines, Vitsœ, Muji, Leica. Search
`site:behance.net` or film-UI archives (`hudsandguis.com`) for FUI.

For each reference write what you take:

- **Palette**: e.g. "SBB: white, black, one red for the only thing that matters"
- **Type**: e.g. "strip printers: condensed caps for designators only; numbers are big, tabular"
- **Shape**: e.g. "Teenage Engineering: 1px keylines, small radius, labels outside the control"
- **Motion**: e.g. "split-flap boards: change is a discrete click, not a fade"
- **Signature detail**: one thing that makes this unmistakable

Never take a brand's logo, exact layout or copy. Take principles.

## 3. Derive the system from the concept

- **Palette**: start from the reference's material (paper, phosphor, anodized aluminum, signal lamps). Neutrals tinted toward that material. One accent = the thing the concept says matters most. Status colors keep their universal meaning.
- **Type**: one content face chosen for a reason (legibility at density, numerals, heritage). A display or condensed face only where the reference uses one, at one level. Mono for data.
- **Shape**: radius, line weight and corner treatment from the reference. Choose one and hold it.
- **Motion**: the reference's physics. Strips slide; tally lights snap on; paper doesn't glow.

## 4. Ornament budget

Pick the 2–3 elements that carry the most important state on this screen
(the step that needs approval, the live connection, the active run). Only
they get ornament (glow, frame, motion, the signature detail). Write the list
in `DIRECTION.md`. `omni check` tell 13 fires when ornament exceeds the budget.

## 5. Write what it is not

List 3–5 tropes you refuse for this artifact, from `taste.md` Never plus
anything specific. This is the anti-default prompt: exclusions paired with the
positive concept above.

## Variants

When exploring, the three variants differ in concept:

1. **Conservative**: the product's existing language, tightened.
2. **Strong-fit**: the best concept from the table above.
3. **Divergent**: a concept from a far domain, to find David's taste edge.

Color swaps are not variants.

## DIRECTION.md template

```markdown
# Direction — <artifact>
Surface: <Operate|Monitor|…> (secondary: …)
Concept: <one sentence>
Top tasks: 1. … 2. … 3. …
References:
- <ref> → palette/type/shape/motion: …
- …
System: accent <oklch> = <meaning>; type <faces + ratio>; radius <n>; motion <ms + easing>
Ornament budget: <element> (why), <element> (why)
Not: <trope>, <trope>, <trope>
```
