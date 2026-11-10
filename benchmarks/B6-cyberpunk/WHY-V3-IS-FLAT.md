# Why Night City v3 still isn't right

David on v3: "font still needs work, the word style doesnt match … its basic in its depth, its just a box
around a word or its a simple banner, theres no visual depth to it".

This compares v3 against the 2077 menu references (Character, Skills, Crafting and Email screens; kept in the scratchpad, not committed).
Image: `depth-study-v3-v4.png`, with v3 on the left and a hand-built depth study on the right.

## 1. The words: why the font style doesn't match

| The reference does | v3 does | Effect |
|---|---|---|
| **One family for everything.** A narrow, square-shouldered tech sans sets the tabs, titles, numbers *and* the long email body | Two voices: Chakra Petch for chrome, IBM Plex Sans (a neutral corporate humanist face) for the words you actually read | The conversation looks like a different app pasted inside a cyberpunk frame |
| **Mostly mixed case** ("Security Update", "Crafted item will gain a random stat"). Caps only for short tab labels and stat units | Almost every styled word is ALL CAPS, bold 600, tracked | Every word reads as a stamped label. That's the "box around a word" |
| **Light to regular weights**, letting the glow carry emphasis | 600–700 weights | Heavy and flat, not lit |
| **Tinted text** (pale cyan body, red labels, yellow quest text) | Body is neutral off-white | No sense the text is emitted by a screen |
| **Big light numbers with a small unit on the same baseline** ("27 LEVEL", "315.2 DPS") | Numbers bold 28px, unit stacked below | Reads like a web stat card |

## 2. Depth: why it feels like a simple banner

The references stack 4–5 layers. v3 has one: dark background → 1px line → text.

| Layer in the reference | What it is | v3 |
|---|---|---|
| 0. Atmosphere | Vignette, faint dot grid, edge binary columns, scene light bleeding in | Only a flat gradient |
| 1. Bezel | Outer device frame with chamfered silhouette, a thick glowing spine bar on one side | None |
| 2. Panel | Translucent tinted fill with inner glow along the edge, inner rules between sections | Hairline border, no fill |
| 3. Content tiles | Filled cards: gradient wash from the category color, thick color bar on the left, notched corners, micro-data printed inside | Rows of text with a thin divider |
| 4. Light | Lit elements emit light: text-shadow bloom on titles and numbers, glowing lines, selected items glow, inactive items drop to 30–50% opacity | Nothing emits light. Every element sits at the same brightness, so nothing feels near or far |
| Connections | Traces join nodes; the header rule runs the full width and the selected tab breaks it | Boxes float separately |
| Doubling | Ghost frames offset behind a panel, tabs with a stepped notch, corner brackets detached from the box | Single outline everywhere |

## 3. What the study changes (right side of the image)
- **Type:** Rajdhani, the closest open font to the game's narrow square sans, for *everything*. Mixed case for titles and body, caps only for tab labels and units. Body is 18px (the face runs small) and tinted pale cyan with a slight bloom. Mono only for commands and IDs.
- **Bezel + spine + panel:** three nested depths with a chamfered outer silhouette.
- **Tool calls:** filled tiles with a gradient wash, a 4px glowing category bar, a notched corner, and a connector trace joining the steps, plus a tick progress bar.
- **Needs-you notice:** a ghost frame offset behind it, a lit yellow plate with an inner glow, a glowing diamond, and a micro-data line under the title.
- **Selected tab:** a stepped notch, an inner glow and a cyan fill. The full-width red rule glows.
- **Atmosphere:** vignette, dot grid and edge binary at low opacity.

## 4. Risks to manage in v4 (from research_notes/UI formats/app-guis.md)
- **Glow costs contrast.** Bloom has to be measured on the worst frame, and contrast checked against the fill behind the text, not the page.
- **Rajdhani at reading size.** It has a small x-height, so body text needs to be ≥ 17–18px. Ship a plain-font option (XAG 101). CDPR had to add "Larger fonts" and "Reduce HUD decorative elements" in patch 2.1.
- **Effects need an off switch.** Full / Subtle / Off: Subtle drops bloom and scanlines; Off is plain.
- **Ornament reports real state only.** The spine glows only while a run is live; the trace lights only up to the current step.
