# Measurable UI Quality: Craft Fundamentals and How Tools Can Detect or Enforce Them

Scope: the systematic, quantifiable side of polish (typography, spacing, color, hierarchy, consistency metrics, automated aesthetic evaluation). Written for a tool that captures computed styles and screenshots, then audits and scaffolds. Research date: Nov 2026. Where a source is secondary (book summaries, third-party token dumps), that is flagged.

## Typography: scales, line-height, line length, counts, tracking, numerals

### Takeaway
The numbers are well established and easy to check from computed styles: body text 15–25px on the web, line-height 120–145% for body, line length 45–90 characters (45–75 is the stricter common target), all-caps tracking +5–12%, a small fixed set of sizes. Fluid scales (Utopia) use a smaller ratio on mobile (about 1.2) and a larger one on desktop (about 1.333). Refactoring UI argues for a hand-picked size set over a strict modular scale.

### Cited Findings
- Butterick's key rules: body point size 15–25px on the web (10–12pt print); line spacing 120–145% of point size; average line length 45–90 characters including spaces; all caps and small caps get 5–12% extra letterspacing; all caps acceptable only for less than one line of text; paragraph spacing 4–10pt *or* first-line indent 1–4× point size, never both. The "four most important" body-text factors are point size, line spacing, line length and font. Butterick gives no maximum font count. — [Practical Typography, Summary of key rules](https://practicaltypography.com/summary-of-key-rules.html)
- Utopia fluid type: define one type scale for a small viewport and one for a large viewport, then interpolate by viewport width instead of using breakpoints. The worked example uses about 320px to 1500px, with a 1.2 ratio at the small end and 1.333 at the large end. The calculator URL defaults visible on the site use 360/1240 viewports and 18/20px base sizes with a 1.25 ratio (inferred from URL parameters, not stated in the text). — [Utopia, Designing with fluid type scales](https://utopia.fyi/blog/designing-with-fluid-type-scales/)
- Refactoring UI (via third-party summaries; the book itself was not fetched): pick a hand-crafted type scale rather than a calculated modular one, because modular scales give too few usable values and fractional pixels. A commonly cited set is 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72px. Summaries also suggest 2–3 sizes per component at most, and treat relying on size alone for hierarchy as an anti-pattern. — [Refactoring UI summary (jsdelivr skill file)](https://cdn.jsdelivr.net/npm/claude-code-skills@0.5.0/data/skills/ux-ui-design-system/references/refactoring-ui.md); [rjseymour66 Refactoring UI notes](https://rjseymour66.github.io/webdev/refactoring-ui/). One summary instead says "use a modular type scale", which contradicts the hand-crafted reading. — [playbooks.com refactoring-ui skill](https://playbooks.com/skills/wondelai/skills/refactoring-ui)
- Material 3 baseline: displayLarge is 57sp size / 64sp line height (official Compose reference). — [Android Developers, material3 Typography](https://developer.android.com/reference/kotlin/androidx/compose/material3/Typography). Body Large 16px / 24px line height / 0.5px tracking, and Display Large tracking −0.25px, come from third-party token dumps only (m3.material.io would not render to the fetcher). — [Material 3 typography skill (third-party)](https://skills.sh/shelbeely/shelbeely-agent-skills/material-design-3-typography); [M3 typography cheatsheet](https://astordev.github.io/articles/material-typography). The newer M3 Expressive scale has 21 styles. — [Wear OS type scale tokens](https://developer.android.com/design/ui/wear/guides/styles/typography/type-scale-tokens)
- Apple iOS Dynamic Type defaults (Large setting), consistent across secondary sources: Large Title 34pt, Title 1 28, Title 2 22, Title 3 20, Headline 17 semibold, Body 17, Callout 16, Subhead 15, Footnote 13, Caption 1 12, Caption 2 11. SF Pro Text is used at 19pt and below, SF Pro Display at 20pt and above. Tracking values and Large Title weight conflict across sources. — [Axiom typography ref](https://charleswiltgen.github.io/Axiom/reference/typography-ref); [uxcel SF font lesson](https://uxcel.com/lessons/system-typography-sf-font-963). The official HIG page rendered without content, so these could not be checked against [Apple HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography).
- The pattern of tighter tracking on large display type (M3 Display Large −0.25px) and looser tracking on caps (Butterick +5–12%) runs through all these systems. — sources above.

### Inferences
- Candidate checks from computed styles:
  - `body-size`: font-size of the main text blocks is between 15 and 25px (warn below 16px on content pages).
  - `line-height-ratio`: line-height/font-size is 1.2–1.45 for body text (allow 1.5–1.6 for small UI text, as M3 Body Large is 1.5). Headings at 32px or more should run tighter, about 1.0–1.25. A heading with line-height 1.5 or more is a common amateur tell.
  - `measure`: compute the paragraph's content-box width / (font-size × about 0.5) as approximate characters per line, or measure it directly from the rendered text. Flag below 45 or above 90 (warn above 75).
  - `caps-tracking`: elements with `text-transform: uppercase` (or all-caps text) and letter-spacing ≤ 0 → flag, expecting about 0.05–0.12em.
  - `display-tracking`: font-size ≥ 32px with letter-spacing > 0 → warn, expecting 0 down to about −0.02em.
  - `type-scale-fit`: cluster the unique font sizes and check each one against a scale (hand-picked list or ratio from 1.125 to 1.333). Flag near-duplicates such as 15 vs 16px or 13 vs 14px.
- Polished systems use roughly 8–15 type styles: M3 baseline has 15 roles, iOS 11, and the Refactoring UI list 11 sizes. Fewer than about 10 distinct sizes on a single page is a reasonable "tight" target. This is inferred from the role counts, not a published threshold.
- The tool can generate rules from Utopia-style clamp() between two ratios. Recommended defaults: 1.2 on mobile and 1.25–1.333 on desktop.

### Gaps
- Could not fetch official m3.material.io or Apple HIG text (JS-rendered). M3 tracking/line-height for all roles and HIG tracking tables need verification.
- No authoritative source found for "number of font weights a polished UI uses." Common practice is 2–3 weights (regular, medium/semibold, bold), but that is unsourced here.
- Tabular numerals (`font-variant-numeric: tabular-nums` for tables, prices and timers) and font pairing were not covered by any fetched source. This is standard practice but unsourced in these notes.

## Spacing and layout: grids, proximity, distinct values, density

### Takeaway
Modern systems derive spacing from one base unit. Tailwind v4 uses `--spacing: 0.25rem` (4px) multiplied by any integer. Tools can check that measured margins, paddings and gaps snap to 4px multiples and come from a small set, and that spacing inside a group is smaller than spacing between groups.

### Cited Findings
- Tailwind v4 derives all spacing utilities (`px-*`, `mt-*`, `w-*`, `h-*`) from a single variable, `--spacing: 0.25rem`, e.g. `.mt-8 { margin-top: calc(var(--spacing) * 8) }`. Any multiplier works without configuration. — [Tailwind CSS v4.0 blog](https://tailwindcss.com/blog/tailwindcss-v4)
- Refactoring UI (summaries): define spacing, font size, color and shadow scales up front, and treat arbitrary spacing values as an anti-pattern. — [Refactoring UI summary](https://cdn.jsdelivr.net/npm/claude-code-skills@0.5.0/data/skills/ux-ui-design-system/references/refactoring-ui.md); [designproject.io spacing system](https://designproject.io/resources/downloads/create-spacing-system.md)
- Apple's 44×44pt minimum tap target (secondary source). — [superdesign Apple design system](https://www.superdesign.dev/blog/apple-design-system)

### Inferences
- Candidate checks:
  - `grid-snap`: share of padding/margin/gap values (px) divisible by 4. Target ≥ 90%. Allow 1–2px for borders and hairlines.
  - `spacing-palette`: count unique non-zero spacing values. Fewer than about 12 is tight and more than about 20 suggests ad hoc values. Tailwind's commonly used steps (1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24) are 12 values, so these thresholds are inferred from that.
  - `proximity`: for siblings in a container, compare the gap between a label and its control (or heading and body) with the gap to the next group. Flag when internal spacing ≥ external spacing, or when the heading sits closer to the previous section than to its own content. This can be derived from bounding boxes in the DOM capture.
  - `alignment`: cluster the left x-edges of text blocks in each column. Many distinct left edges a few px apart (for example 3+ edges within 8px) signal misalignment.
  - `tap-target`: interactive elements under 44×44 CSS px on touch viewports → warn (WCAG 2.2 AA minimum is 24×24; from general knowledge, not fetched here).
- Density: give the tool a density knob, a multiplier on the base unit (compact ≈ 0.75×, comfortable 1×, spacious 1.25–1.5×), rather than separate scales.

### Gaps
- No source fetched gives empirical counts of distinct spacing values on well-built sites. Thresholds above are inferred.
- No fetched source for the 8pt grid specifically; the 4px base is sourced via Tailwind.

## Color: OKLCH/LCH palettes, perceptual steps, contrast (APCA vs WCAG 2), neutrals, dark mode

### Takeaway
Build palettes in a perceptual space (OKLCH/LCH), where equal L means equal perceived lightness across hues. Structure each hue as a role-based scale (Radix's 12 steps) and validate text with APCA Lc thresholds by use case, keeping WCAG 2 ratios for compliance. Linear reduced 98 theme variables to 3 inputs (base, accent, contrast) using LCH.

### Cited Findings
- OKLCH (Evil Martians): L is perceptual, so changing it keeps contrast predictable ("All backgrounds with L≥87% have good contrast with black text"). HSL lightness is "not consistent across hue axes" ("Adding 10% lightness will have different results for blue and purple"). OKLCH keeps hue stable as chroma drops, whereas LCH blue drifts toward purple. sRGB renders about 35% of visible colors and OKLCH can encode P3 and beyond. The article recommends an sRGB fallback plus OKLCH in `@media (color-gamut: p3)`. Relative colors allow a single rule such as `oklch(from var(--c) calc(l + 0.1) c h)` for hover. Caveat in the changelog: "Developers should use APCA to detect contrast. Just OKLCH is not enough." — [Evil Martians, OKLCH in CSS](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- Tailwind v4 moved its whole default palette from rgb to oklch to use the wider gamut, while keeping v3's balance between colors (e.g. `--color-avocado-500: oklch(0.84 0.18 117.33)`). — [Tailwind v4 blog](https://tailwindcss.com/blog/tailwindcss-v4)
- Radix Colors 12-step roles: 1 app background; 2 subtle background (cards, sidebars); 3 UI element background; 4 hover; 5 active/selected; 6 subtle borders/separators; 7 interactive borders; 8 strong borders/focus rings; 9 solid background (highest chroma; most hues take white text, Sky/Mint/Lime/Yellow/Amber take dark text); 10 hovered solid; 11 low-contrast text (guaranteed APCA Lc 60 on step 2); 12 high-contrast text (guaranteed APCA Lc 90 on step 2). — [Radix Colors, Understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)
- APCA Lc thresholds (reference font Helvetica/Arial):
  - Lc 90: preferred for body text (14px/400, 18px/300).
  - Lc 75: minimum for body columns (18px/400, 16px/500, 14px/700, 24px/300).
  - Lc 60: minimum for other content text (24px/400, 16px/700, 18px/600).
  - Lc 45: large or heavy headlines and fine icons (36px regular, 24px bold).
  - Lc 30: placeholder and disabled text, large solid icons.
  - Lc 15: minimum for discernible non-text such as dividers and focus outlines; anything below is effectively invisible.
  - Adding 15 gives the AAA-equivalent level. WCAG 2 overstates contrast for dark colors, so 4.5:1 can be hard to read near black and is unreliable for dark mode. APCA is polarity- and size/weight-aware.
  — [APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html)
- Linear's redesign generates themes in LCH from 3 inputs (base color, accent color, contrast), replacing 98 hand-set variables per theme. Contrast is a slider (examples at 30 and 100) that enables high-contrast accessibility themes, and LCH is used to manage elevation across background, panels, dialogs and modals. — [Linear, How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui)
- Adobe Leonardo generates colors by *target contrast ratio* against a background (e.g. 3, 4.5, 7) rather than by lightness value. It outputs CSS custom properties and W3C-format design tokens annotated with each swatch's contrast. — [leonardocolor.io](https://leonardocolor.io/); [Tokens Studio Leonardo Theme node](https://documentation.tokens.studio/graph-engine/available-nodes/design-tokens/leonardo-theme); [Nate Baldwin, Medium](https://medium.com/@NateBaldwin/accessible-color-for-design-systems-just-got-easier-40e8420a8371)

### Inferences
- Candidate checks:
  - `contrast-wcag`: every text node's fg/bg ratio is ≥ 4.5 (≥ 3 for at least 24px, or at least 18.66px bold). Required for compliance.
  - `contrast-apca`: compute Lc and grade against the size/weight table above. This is better for dark mode and thin fonts. Report both.
  - `nontext-contrast`: borders, dividers and focus rings need |Lc| ≥ 15 (WCAG 2 non-text needs 3:1 for UI components).
  - `palette-perceptual`: convert every unique color to OKLCH, cluster by hue, and check the L steps are monotonic and roughly even. Flag near-duplicates (ΔE OK below about 0.02) as "color aliases", the same idea as Project Wallace's alias detection.
  - `neutral-tint`: gray chroma in OKLCH. Pure neutrals (C = 0) are fine, but a mix of tinted and untinted grays, or grays with different hues, signals inconsistency. Tinted neutrals usually carry C of about 0.005–0.02 toward the brand hue (inferred practice, not sourced).
  - `accent-share`: from the screenshot, the share of pixels at high chroma (OKLCH C above about 0.1). Flag when more than roughly 10–15% of the viewport is saturated accent outside imagery (a heuristic, not sourced).
- Generation rule: emit Radix-style 12-step scales per hue in OKLCH (fixed L targets per step, chroma peaking at step 9, hue held constant or slightly rotated). Validate step 11 and 12 text against step 2 at Lc ≥ 60 and ≥ 90. Generate dark mode by re-solving L targets, not by inverting.
- Theme generation à la Linear: expose base, accent and contrast as the only user inputs.

### Gaps
- Exact Radix L/C values per step and Tailwind's per-step OKLCH L targets were not retrieved.
- Leonardo's default contrast algorithm (WCAG 2 vs APCA) was not confirmed from official docs.
- APCA is still not normative in WCAG 3 drafts (general knowledge, not verified here). Treat it as advisory.

## Hierarchy: weight/color before size, de-emphasis, squint/blur test

### Takeaway
Polished UIs build hierarchy mostly with weight and color (or contrast level), and de-emphasize secondary content rather than enlarging primary content. A squint test can be automated by blurring or downsampling the screenshot and checking that the intended primary element remains the most salient.

### Cited Findings
- Refactoring UI (summaries): relying on font size alone for hierarchy is an anti-pattern. Use weight and color first; weight creates hierarchy more subtly than size. — [Refactoring UI summary](https://cdn.jsdelivr.net/npm/claude-code-skills@0.5.0/data/skills/ux-ui-design-system/references/refactoring-ui.md); [playbooks.com summary](https://playbooks.com/skills/wondelai/skills/refactoring-ui). The primary Refactoring UI Medium article returned 403.
- Radix encodes two text-emphasis levels as tokens: step 12 (Lc 90, primary) and step 11 (Lc 60, secondary). That is a concrete "de-emphasize with color" system. — [Radix Colors](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)
- APCA's Lc 30 tier exists specifically for de-emphasized placeholder and disabled text. — [APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html)
- Feature Congestion (Rosenholtz et al., MIT) quantifies clutter from saliency modeling of color, orientation and luminance contrast. It predicted relative clutter rankings of maps well. — [Rosenholtz et al., Feature Congestion](https://typeset.io/pdf/feature-congestion-a-measure-of-display-clutter-1ed72kfuy1.pdf)

### Inferences
- Candidate checks:
  - `emphasis-levels`: count distinct (weight, text-color-Lc) combinations on text. Target 2–3 color levels (primary, secondary, tertiary/disabled) and 2–3 weights.
  - `size-only-hierarchy`: headings that differ from body only by size (same weight and color) and use a size ratio above 2.5× → suggest a smaller size with heavier weight.
  - `squint`: apply a Gaussian blur (for example σ ≈ 8–12px at 1x) or downsample to about 1/8 of the screenshot. Run a saliency model or luminance-contrast map and check that the top-salient region overlaps the primary CTA or H1 bounding box. Flag pages where several regions tie for top salience.
  - `competing-ctas`: more than one solid (step 9 style) button per view section → warn.

### Gaps
- No fetched source for a validated, published squint-test algorithm. The blur-plus-saliency approach is an inference.
- Did not retrieve specific saliency models for UIs, such as UMSI (Fosco et al., UIST 2020) or UEyes (CHI 2023). These are known in the literature but were not fetched or verified here.

## Consistency metrics: unique-value counts as a design-debt signal

### Takeaway
Counting unique colors, font sizes, families, radii, shadows and z-indexes is an established audit approach (CSS Stats, Project Wallace, Gromit/Constyble thresholds in CI). No published benchmark gives "good" thresholds. Real-world examples show bloated sites at 100+ unique colors or 70+ font sizes, while designs typically call for about 10 sizes.

### Cited Findings
- CSS Stats reports unique colors, background colors, font sizes, font families and a specificity graph. Its API supports diffs between snapshots. — [CSS Stats API](https://api.cssstats.com/); [Tuts+, Understanding CSS Stats](https://webdesign.tutsplus.com/understanding-css-stats-how-to-make-the-most-of-the-numbers--cms-22756t)
- Interpretive heuristic: "if you are loading in 30 font sizes and your design calls for 10", you likely have bloated or inconsistent styles. High counts can be legitimate, for example product colors in a store. — [Tuts+](https://webdesign.tutsplus.com/understanding-css-stats-how-to-make-the-most-of-the-numbers--cms-22756t)
- CSS-Tricks 2019 redesign: unique colors and unique font sizes went from 175 each to 137 each, and font families from 7 to 8. — [Project Wallace, CSS-Tricks redesign in numbers](https://www.projectwallace.com/blog/the-css-tricks-redesign-in-numbers)
- Other examples: CSS-Tricks at 101 unique colors / 115 background colors; GitLab with more than 70 unique font sizes; Stack Overflow with four ways of writing white. — [CSS-Tricks, A quick CSS audit](https://css-tricks.com/a-quick-css-audit-and-general-notes-about-design-systems/). Facebook was cited at more than 650 unique colors, while a handbook cites 38 unique text colors (these measure different things). — [Design Systems Handbook](https://uploads-ssl.webflow.com/609ce44d3dfdab98b5019cf9/614360ea598313b1789c3d1d_DesignSystemsHandbook.pdf)
- Project Wallace tooling: color-alias detection (same color in several notations), color sorting, a CSS complexity analyzer described as "like Lighthouse, but for CSS", Gromit/Constyble to fail builds when stats exceed user-set thresholds (no default values published), and a design-tokens page (2025). — [Project Wallace blog index](https://www.projectwallace.com/blog); [Detecting color aliases](https://projectwallace.com/blog/detecting-color-aliases); [Introducing Gromit](https://projectwallace.com/blog/introducing-gromit)
- Real-world audits show the pattern: one project had 22 distinct font sizes with text as small as 9px. — [GitHub issue example](https://github.com/dambhore-web/mhtcet-cap-analysis/issues/100)

### Inferences
- Measure from *computed styles on rendered pages*, not stylesheets. CSS-level counts include dead code, while rendered counts reflect what users see. Report both if the CLI has CSS access.
- Suggested per-page or per-app "polish budgets", derived from design-system role counts (M3 has 15 type roles, iOS 11, Radix 12 steps × a few hues). These are inferred targets, not published norms:
  - Font sizes: ≤ 10 (good), 11–15 (ok), > 20 (debt)
  - Font families: ≤ 2 (+1 mono)
  - Font weights: ≤ 3–4
  - Text colors: ≤ 4–6 (after alias merging)
  - All unique colors (after alias merging): ≤ 24 for an app shell; flag > 50
  - Border radii: ≤ 3–4 (plus 9999px pill and 50%)
  - Box shadows: ≤ 3–5 elevation levels
  - z-index values: ≤ 6–8 named layers; flag values like 9999 or 99999
  - Spacing values: ≤ 12–16
- Normalize before counting: merge color aliases (hex/rgb/hsl, rounding), merge sizes within 0.5px, and ignore values inside third-party embeds.
- Also report "near-miss" pairs (for example 14 and 15px, #333 and #343434, radius 6 and 8px). These are more actionable than raw counts.

### Gaps
- No public dataset of unique-value counts across well-built sites was found, so the thresholds above are not empirically validated.
- stylelint plugins for design-token enforcement (e.g. stylelint-declaration-strict-value) were not fetched in this pass.

## Automated evaluation of UI aesthetics and quality

### Takeaway
Classic computational aesthetics (Reinecke 2013) shows low-level image metrics, mainly visual complexity and colorfulness, explain about half the variance in 500ms first-impression appeal. Learned models (UIClip) beat general VLMs at pairwise UI preference. General VLM-as-judge setups are better at ranking than at absolute scoring and miss fine layout and text defects. Deterministic checks should therefore drive the audit, with VLMs used for pairwise comparison or critique rather than as the sole numeric score.

### Cited Findings
- Reinecke et al. (CHI 2013) collected ratings of 450 websites from 548 volunteers. The colorfulness model fit R² = .78 (adj .77) and the complexity model R² = .65 (adj .64). Together with demographics (age, education) they explained 48% of variance in appeal (adj. R² = .48) after 500ms exposure. Complexity mattered much more than colorfulness. Metrics included:
  - colorfulness (Hasler–Süsstrunk and a saturation-based measure)
  - number of quadtree leaves (space-based and entropy-based decomposition)
  - number of image areas
  - number of text groups
  - text vs non-text area
  - symmetry, balance and equilibrium of the quadtree leaves
  More quadtree leaves meant higher perceived complexity. — [Reinecke et al. 2013 PDF](https://kgajos.seas.harvard.edu/papers/reinecke13aesthetics.pdf); [Harvard project page](https://www.eecs.harvard.edu/~kgajos/papers/2013/reinecke13predicting.shtml)
- Reinecke & Gajos (2014) with about 40,000 participants and 430 screenshots: preferred colorfulness and complexity vary by demographic group, and the public dataset was released. — [Reinecke & Gajos 2014](https://kgajos.seas.harvard.edu/papers/reinecke14visual.pdf)
- Miniukovich & De Angeli: automatic metrics for visual clutter, symmetry and color variability on 140 webpage screenshots. They reportedly explained 40% of variation in subjective complexity and 36% of variation in aesthetics (the snippet did not make clear which paper the figures come from). "Computation of Interface Aesthetics" (CHI 2015, honorable mention). — [Quantification of Interface Visual Complexity](https://www.academia.edu/11396872/Quantification_of_Interface_Visual_Complexity); [Trento thesis](https://iris.unitn.it/retrieve/4428babf-9533-4673-b270-55d7adbd29f9/aesthetics_thesis_v1.2.12_final_1.pdf)
- UIClip (Wu et al., UIST 2024): a CLIP B/32 model fine-tuned on about 2.3M UI screenshots with quality-annotated descriptions. It reached 75.12% accuracy at picking the preferred UI in a pair, vs GPT-4V 52.9% and Claude-3-Opus 60.3% (figures from a secondary summary). — [UIClip arXiv 2404.12500 summary](https://arxiv.deeppaper.ai/papers/2404.12500v1)
- UICrit (Duan et al., UIST 2024): 3,059 critiques with bounding boxes plus aesthetics, usability and overall quality ratings for 983 mobile UIs from 7 experienced designers. Few-shot and visual prompting with it gave a 55% gain in LLM-generated UI feedback quality. The dataset is at github.com/google-research-datasets/uicrit. — [UICrit arXiv 2407.08850](https://arxiv.org/abs/2407.08850)
- VLM-as-judge reliability:
  - UI2Code^N's VLM evaluator on Design2Code-HARD: 82.3% agreement with humans, Cohen's κ = 0.41, and model ordering preserved. — [UI2Code^N arXiv 2511.08195](https://arxiv.org/pdf/2511.08195)
  - On web-agent screenshots, GPT-4o matched human pairwise labels 68% of the time. — [BrowserArena arXiv 2510.02418](https://arxiv.org/pdf/2510.02418)
  - "VLM Judges Can Rank but Cannot Score" finds pairwise ranking more reliable than absolute scores. — [arXiv 2604.25235](https://arxiv.org/html/2604.25235v1)
  - VLM judges under-penalize unreadable text, boundary glitches and misaligned layouts. — [ImagenWorld arXiv 2603.27862](https://arxiv.org/pdf/2603.27862)
  - SOTA VLM judges reach about 32–34% exact agreement on 5-point scales (MLLM-as-a-Judge). — [VLM-as-a-Judge overview](https://www.emergentmind.com/topics/vlm-as-a-judge)
- Visual regression tooling:
  - Playwright `toHaveScreenshot` uses pixelmatch, with `threshold` (examples use 0.2), `maxDiffPixels` and `maxDiffPixelRatio` (e.g. 0.01 for full pages).
  - Chromatic is Storybook-centric with per-story `diffThreshold`.
  - Percy (BrowserStack) uses AI/anti-aliasing-aware diffing.
  - Pixel diffs are cheap but noisy and AI diffs are accurate but expensive. Mask dynamic regions and freeze animations either way.
  - Lost Pixel reportedly joined Figma and is being discontinued (April 2026, single source, unverified).
  — [Argos, best visual regression tools 2026](https://argos-ci.com/blog/best-visual-regression-testing-tools); [helpmetest Playwright VRT](https://helpmetest.com/blog/playwright-visual-regression-testing/); [testdino Playwright vs Percy](https://testdino.com/blog/playwright-vs-percy)

### Inferences
- Screenshot metrics worth implementing (cheap, interpretable, research-backed):
  - quadtree leaf count (complexity)
  - Hasler–Süsstrunk colorfulness
  - text-area ratio and number of text groups
  - left-right and top-bottom symmetry and balance of visual mass
  - Feature Congestion or edge density for clutter
  Report these as percentiles against a reference corpus (e.g. the Reinecke/LabintheWild dataset, or a curated set of polished sites) rather than as absolute pass/fail, since preferred levels vary by audience.
- VLM-as-judge design:
  - Use pairwise comparisons (before vs after scaffold, or vs a reference) instead of 1–10 scores.
  - Use rubric items tied to the deterministic checks.
  - Use region-grounded critiques (UICrit-style bounding boxes) and few-shot examples.
  - Use multiple samples or majority vote.
  - Never let the VLM override measured contrast, spacing or alignment facts. It should judge things the metrics cannot, such as tone, brand fit and "generic-ness".
- Use visual regression (pixelmatch with masks) as the CLI's "did the fix change only what it should" guard after automated edits.

### Gaps
- Could not retrieve Miniukovich & De Angeli 2015 formulas or the UIClip paper's primary numbers. UIClip figures come from a secondary summary.
- No 2025–2026 benchmark validating VLM judges specifically on web UI aesthetics against expert designers was found, beyond UICrit (mobile) and UI2Code^N (code fidelity).
- Saliency models trained on UIs (UMSI, UEyes) were not verified in this pass.
