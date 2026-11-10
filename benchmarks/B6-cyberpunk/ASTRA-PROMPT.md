# Prompt for Astra (GPT-6)

Attach: `depth-study-v3-v4.png` and 1–2 of the 2077 menu screenshots (Character, Crafting or Email).

---

I'm building a cyberpunk theme for an AI agent chat app (React + Meta's Astryx design system, web, dark only).
It's modeled on Cyberpunk 2077's menus: red chrome, cyan = selected/live, yellow = needs you, cut corners.
Left in the image is the current version; my reviewer says it is "basic in its depth, just a box around a word or a
simple banner, no visual depth", and that "the word style doesn't match". Right is a depth study.

Answer concretely, for a web UI that must stay readable and accessible (WCAG/APCA, keyboard, reduced motion):

1. **Typography.** Which open-licensed fonts (Google Fonts / OFL) best match the 2077 UI face for (a) chrome and labels, (b) long
   reading text in chat messages, (c) numbers? Is one family for everything right, or a pairing? Give sizes,
   weights, case and letter-spacing per role, and say how the game makes a narrow face readable at body size.
2. **Depth.** List the layering techniques the 2077 menus use to feel deep (bezel, panels, fills, light/bloom, ghost
   frames, traces, atmosphere, parallax?) in order of impact. For each, give the CSS approach (box-shadow, clip-path,
   masks, gradients, filters, SVG) and what it costs in performance or legibility.
3. **What the right-hand study still gets wrong** compared to the reference, and the 5 changes that would make
   the biggest difference.
4. **Motion that adds depth** without hurting a work tool: what moves, when, how long, and what reduced motion becomes.
5. **Anti-patterns** that make a cyberpunk UI look fan-made or "AI-generated" rather than designed.

Be specific (values, not adjectives). Say where you're unsure.
