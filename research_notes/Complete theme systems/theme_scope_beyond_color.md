# Theme Scope Beyond Color: What a Complete UI Theme Must Define and How Leading Systems Generate It

Research date: 2026-11-10. Primary sources were token source files (material-web, Flutter gen_defaults, material-color-utilities, Fluent UI, Leonardo) and official design-system docs (Carbon, Atlassian, Primer, Radix, Linear). Many m3.material.io pages render client-side and could not be fetched directly, so M3 numbers come from Google's own token source files (material-web, Flutter), which are generated from the same token database.

## Interaction states (hover / focus / pressed / dragged / selected / disabled)

### Takeaway
Two models exist. Overlay systems (M3) draw a translucent "state layer" in the content (on-) color over the container: hover 8%, focus 10%, pressed 10%, dragged 16% in the current token set (older sets used 12% for focus and pressed). Explicit-token systems (Primer, Radix, Atlassian) name a separate color for each state, e.g. `-rest/-hover/-active/-disabled/-selected` suffixes or dedicated scale steps. A generator should support both: compute overlays, then optionally bake them into explicit tokens.

### Cited Findings
- **M3 state layer opacities (current):** Flutter's M3 token file v6_1_0 lists `md.sys.state.hover.state-layer-opacity: 0.08`, `focus: 0.1`, `pressed: 0.1`, `dragged: 0.16`. — [Flutter gen_defaults state.json](https://raw.githubusercontent.com/flutter/flutter/master/dev/tools/gen_defaults/data/state.json)
- **M3 state layer opacities (older token set):** material-web token version v0_192 lists hover 0.08, focus **0.12**, pressed **0.12**, dragged 0.16. So focus and pressed moved from 12% to 10% between token versions. This is why sources disagree. — [material-web _md-sys-state.scss v0_192](https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-state.scss); a secondary article gives the range as "Focus / Pressed: +10–12%" — [Design Systems Collective](https://www.designsystemscollective.com/from-color-shades-to-state-layers-cefe2f28bf97)
- **Radix explicit state steps (12-step scale):** step 3 = UI element background (normal); step 4 = hovered UI element background; step 5 = active/selected UI element background; step 7 = interactive component border; step 8 = stronger border, focus rings, and hovered borders; step 9 = solid background; step 10 = hovered solid background. Each state is a separate scale step, not an overlay. — [Radix Colors: Understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)
- **Primer explicit state tokens:** button tokens use the state suffixes `-rest`, `-hover`, `-active`, `-disabled`, `-selected` (e.g. `--button-primary-bgColor-hover`, `--button-default-bgColor-selected`); there are 68 button tokens across the variants danger, default, inactive, invisible, outline, primary and star. Control tokens include `--control-bgColor-active`, `--control-bgColor-selected`, `--control-checked-bgColor-hover` and `--control-transparent-bgColor-disabled`. There is one focus token, `--focus-outlineColor`. — [Primer color primitives](https://primer.style/product/primitives/color/)
- **Atlassian explicit state tokens on surfaces:** `elevation.surface.hovered`, `elevation.surface.pressed`, `elevation.surface.raised.hovered/pressed`, `elevation.surface.overlay.hovered/pressed`; dragged UI uses the overlay elevation. `color.background.neutral` is transparent, darkening in light mode and lightening in dark mode, so it acts like an overlay that adapts to whatever elevation sits beneath it. — [Atlassian elevation](https://atlassian.design/foundations/elevation)

### Inferences
- Recommended generator default: state layer color = the role's `on-` color, with alpha hover 0.08, focus 0.10, pressed 0.10, dragged 0.16. Expose these as tokens (`state.hover.opacity` etc.) and also emit pre-composited solid colors for systems that need opaque values (Primer/Radix style).
- Radix's step-based approach gives a simple rule for explicit tokens: hover = one step darker or lighter than rest (3→4, 9→10), pressed/selected = two steps (3→5).
- Carbon follows the explicit-token model too (`$layer-hover`, `$layer-active`, `$layer-selected` are commonly used), but I did not verify Carbon state tokens this session (see Gaps).

### Gaps
- **M3 disabled values (38% content / 12% container):** These are widely reproduced and appear in M3 component tokens (e.g. `disabled-label-text-opacity: 0.38`, `disabled-container-opacity: 0.12`), but I did not fetch a primary token file confirming them this session. Treat as high-confidence but unverified here.
- Carbon hover/active/selected token values and Fluent state tokens were not fetched.
- I could not fetch the m3.material.io states page (client-side rendering), so I could not confirm whether the public docs currently say 10% or 12%. The newest token file (Flutter v6_1_0) says 10%.

## Elevation (shadows, tonal surfaces, dark mode)

### Takeaway
Modern systems express elevation in two channels: a shadow scale, and surface color, which matters most in dark mode where shadows are barely visible. M3 has 6 levels (0, 1, 3, 6, 8, 12 dp) plus 5 tonal "surface container" roles (lowest→highest), all derived from the neutral palette by tone. Atlassian has 4 semantic levels (sunken, default, raised, overlay). Primer has 8 shadow tokens in resting, floating and inset groups.

### Cited Findings
- **M3 elevation levels:** level0 = 0, level1 = 1, level2 = 3, level3 = 6, level4 = 8, level5 = 12 (dp). — [material-web _md-sys-elevation.scss](https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-elevation.scss)
- **M3 tonal surface roles (Material Color Utilities, 2021 spec), as tones of the neutral palette.** Where a ContrastCurve appears, the four values are for contrast levels low/standard/medium/high:
  - Light: surface 98; surfaceDim (87, 87, 80, 75); surfaceBright 98; surfaceContainerLowest 100; surfaceContainerLow (96, 96, 96, 95); surfaceContainer (94, 94, 92, 90); surfaceContainerHigh (92, 92, 88, 85); surfaceContainerHighest (90, 90, 84, 80); surfaceVariant 90; inverseSurface 20.
  - Dark: surface 6; surfaceDim 6; surfaceBright (24, 24, 29, 34); surfaceContainerLowest (4, 4, 2, 0); surfaceContainerLow (10, 10, 11, 12); surfaceContainer (12, 12, 16, 20); surfaceContainerHigh (17, 17, 21, 25); surfaceContainerHighest (22, 22, 26, 30); surfaceVariant 30; inverseSurface 90.
  — [MCU color_spec_2021.ts](https://raw.githubusercontent.com/material-foundation/material-color-utilities/main/typescript/dynamiccolor/color_spec_2021.ts)
- **MCU full surface role list:** background, surface, surfaceDim, surfaceBright, surfaceContainerLowest/Low/Container/High/Highest, onSurface, surfaceVariant, onSurfaceVariant, inverseSurface, inverseOnSurface, outline, outlineVariant, shadow, scrim, surfaceTint. — [MCU dynamic_scheme.ts](https://raw.githubusercontent.com/material-foundation/material-color-utilities/main/typescript/dynamiccolor/dynamic_scheme.ts)
- **Atlassian levels:** sunken (`elevation.surface.sunken`, e.g. Kanban column backdrops) → default (`elevation.surface`) → raised (`elevation.surface.raised` + `elevation.shadow.raised`, e.g. movable cards) → overlay (`elevation.surface.overlay` + `elevation.shadow.overlay`, for modals, dropdowns and floating toolbars; overlays can stack). Overflow scroll shadows use `elevation.shadow.overflow.spread/perimeter`. In dark mode "shadows are harder to see," so higher elevations use lighter surfaces, still paired with shadows. Sunken is opaque and darkens in both modes. Z-index ladder: 100 (none), 200 (navigation), 300 (inline dialog), 400 (popup), 500 (blanket), 510 (modal), 600 (flag), 700 (spotlight), 800 (tooltip). — [Atlassian elevation](https://atlassian.design/foundations/elevation)
- **Primer shadows (8 tokens):** `--shadow-resting-xsmall`, `-resting-small`, `-resting-medium`, `--shadow-floating-small`, `-floating-medium`, `-floating-large`, `-floating-xlarge`, `--shadow-inset`. Overlay tokens: `--overlay-bgColor`, `--overlay-borderColor`, `--overlay-backdrop-bgColor`. — [Primer color primitives](https://primer.style/product/primitives/color/)
- **Linear:** the generator handles surface elevation (background, foreground, panels, dialogs, modals) and generates aliases for surfaces, text, icons and controls. LCH was first used for "elevated and translucent parts of the app." — [Linear: How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui)

### Inferences
- In dark mode, each step up the M3 container ladder is about +2 to +5 tone (4 → 10 → 12 → 17 → 22). In light mode each step is about −2 tone (100 → 96 → 94 → 92 → 90). A generator can reproduce this with any perceptual-lightness space (HCT tone, OKLCH L).
- Higher contrast levels widen the gaps between surface containers (dark surfaceContainerHighest goes 22 → 30 at high contrast), so elevation separation should scale with the theme's contrast setting.
- Minimum viable elevation set: 4 to 6 levels, each a (surface color, shadow) pair, plus scrim/backdrop and a z-index ladder.

### Gaps
- Numeric box-shadow values for Primer, Atlassian and Carbon were not retrieved (the pages list names only).
- M3 2025 "Expressive" spec changes to surfaces (spec 2025/2026 in MCU) were not examined in detail.

## Typography as theme

### Takeaway
M3 defines 15 type roles (display, headline, title, body and label, each in large, medium and small), each with size, line height, weight and tracking, and two typeface roles ("brand" and "plain") that a theme can swap. That is the clearest model of fonts as theme parameters.

### Cited Findings
- **M3 typeface roles:** `brand: Roboto`, `plain: Roboto`, weights regular 400, medium 500, bold 700. Display, headline and title-large use the brand face; the others use plain. Themes swap fonts by changing these two refs. — [material-web _md-ref-typeface.scss](https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-ref-typeface.scss)
- **M3 type scale (rem; ×16 = px).** Sizes in px: display-large 57, display-medium 45, display-small 36, headline-large 32, headline-medium 28, headline-small 24, title-large 22, title-medium 16, title-small 14, body-large 16, body-medium 14, body-small 12, label-large 14, label-medium 12, label-small 11.

  | Role | Size | Line height | Weight | Tracking (rem) |
  |---|---|---|---|---|
  | display-large | 3.5625 | 4 | 400 | −0.015625 (−0.25px) |
  | display-medium | 2.8125 | 3.25 | 400 | 0 |
  | display-small | 2.25 | 2.75 | 400 | 0 |
  | headline-large | 2 | 2.5 | 400 | 0 |
  | headline-medium | 1.75 | 2.25 | 400 | 0 |
  | headline-small | 1.5 | 2 | 400 | 0 |
  | title-large | 1.375 | 1.75 | 400 | 0 |
  | title-medium | 1 | 1.5 | 500 | 0.009375 (0.15px) |
  | title-small | 0.875 | 1.25 | 500 | 0.00625 (0.1px) |
  | body-large | 1 | 1.5 | 400 | 0.03125 (0.5px) |
  | body-medium | 0.875 | 1.25 | 400 | 0.015625 (0.25px) |
  | body-small | 0.75 | 1 | 400 | 0.025 (0.4px) |
  | label-large | 0.875 | 1.25 | 500 | 0.00625 (0.1px) |
  | label-medium | 0.75 | 1 | 500 | 0.03125 (0.5px) |
  | label-small | 0.6875 | 1 | 500 | 0.03125 (0.5px) |

  — [material-web _md-sys-typescale.scss](https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-typescale.scss)
- **Radix Themes scaling:** a global `scaling` prop of "90%", "95%", "100%" (default), "105%" or "110%" scales the type, spacing and size tokens together. — [Radix Themes: Theme component](https://www.radix-ui.com/themes/docs/components/theme)

### Inferences
- Tracking pattern: large display text gets negative or zero tracking, and small text gets positive tracking (+0.1 to +0.5px). Line-height ratio falls from about 1.5 at body sizes to about 1.12 at display sizes (64/57). A generator can derive line height as roughly size + 4 to 8px, snapped to a 4px grid. Every M3 line height is a multiple of 4px.
- Minimum theme typography surface: 2 to 3 font-family roles (brand/display, plain/body, mono), 3 weights, and about 15 role tokens, each with size, line height, weight and tracking.

### Gaps
- Carbon productive vs. expressive type sets (fixed vs. fluid headings) and Primer's type scale were not fetched this session.
- No source was checked on whether Primer, Atlassian or Carbon themes swap fonts. M3 is the only verified case of font-swapping via theme refs.

## Spacing, radius, density, borders, focus ring

### Takeaway
Spacing is near-universally a 4px-based scale with a few 2px fine steps (Carbon: 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 160). Radius is a semantic scale (M3: none 0, xs 4, sm 8, md 12, lg 16, xl 28, full 9999). Radix exposes radius and scaling as one-word theme switches. Density is a global multiplier or offset on component heights.

### Cited Findings
- **Carbon spacing:** spacing-01 = 2px, 02 = 4, 03 = 8, 04 = 12, 05 = 16, 06 = 24, 07 = 32, 08 = 40, 09 = 48, 10 = 64, 11 = 80, 12 = 96, 13 = 160. Built on multiples of 2, 4 and 8. Tokens are fixed across breakpoints, but designers step down the scale at smaller widths (e.g. spacing-05 at 1440px becomes spacing-03 at 768px). — [Carbon spacing](https://carbondesignsystem.com/elements/spacing/overview/)
- **M3 shape scale:** corner-none 0, extra-small 4px, small 8px, medium 12px, large 16px, extra-large 28px, full 9999px. It also has directional variants: extra-small-top (4 4 0 0), large-top (16 16 0 0), large-start (16 0 0 16), large-end (0 16 16 0) and extra-large-top (28 28 0 0). — [material-web _md-sys-shape.scss](https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-shape.scss)
- **Radix Themes:** `radius` = none, small, medium (default), large or full; `scaling` = 90% to 110% in 5% steps; `panelBackground` = solid or translucent (default translucent); `appearance` = inherit, light or dark; `accentColor` default indigo; `grayColor` default auto. — [Radix Themes: Theme](https://www.radix-ui.com/themes/docs/components/theme)
- **Focus ring color:** Radix uses step 8 for focus rings. Primer uses a single `--focus-outlineColor` token. — [Radix scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale); [Primer](https://primer.style/product/primitives/color/)

### Inferences
- The Radix "radius" switch implies a generator design: the component radius tokens (`radius-1..6`) are derived from one theme-level factor, with `full` forcing pill shapes on buttons and inputs.
- Focus ring tokens to define: color (accent step 8, or a dedicated focus color), width (commonly 2px), offset (commonly 2px), and style. Choose the color so it reaches ≥3:1 non-text contrast (WCAG 2.4.13 / 1.4.11) against adjacent surfaces.

### Gaps
- M3 density scale (0, −1, −2, −3, each step −4px of component height) and Carbon's compact/normal densities and component heights (sm 32, md 40, lg 48) are commonly cited, but I did not verify them from primary sources this session.
- Border-width and focus-ring width/offset tokens from Primer, Atlassian and Carbon were not retrieved.

## Motion tokens

### Takeaway
Systems define 6 to 16 duration steps and 3 to 10 easing curves, grouped by intent (standard, enter/decelerate, exit/accelerate) and sometimes by personality (Carbon productive vs. expressive; M3 emphasized vs. standard). Reduced-motion handling is guidance (provide a no-motion setting and static alternatives) rather than a separate token set in the sources checked.

### Cited Findings
- **M3 durations (16):** short1-4 = 50/100/150/200ms; medium1-4 = 250/300/350/400ms; long1-4 = 450/500/550/600ms; extra-long1-4 = 700/800/900/1000ms. — [material-web _md-sys-motion.scss](https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-motion.scss)
- **M3 easings:** emphasized `cubic-bezier(0.2, 0, 0, 1)`; emphasized-decelerate `(0.05, 0.7, 0.1, 1)`; emphasized-accelerate `(0.3, 0, 0.8, 0.15)`; standard `(0.2, 0, 0, 1)`; standard-decelerate `(0, 0, 0, 1)`; standard-accelerate `(0.3, 0, 1, 1)`; legacy `(0.4, 0, 0.2, 1)`; legacy-decelerate `(0, 0, 0.2, 1)`; legacy-accelerate `(0.4, 0, 1, 1)`; linear `(0, 0, 1, 1)`. — [same file](https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-motion.scss)
- **Carbon durations:** fast-01 70ms (buttons, toggles), fast-02 110ms (fades), moderate-01 150ms (small expansion), moderate-02 240ms (expansion, toasts), slow-01 400ms (large expansion, important notifications), slow-02 700ms (background dimming). — [Carbon motion](https://carbondesignsystem.com/elements/motion/overview/)
- **Carbon easings:**

  | Curve | Productive | Expressive |
  |---|---|---|
  | Standard | `(0.2, 0, 0.38, 0.9)` | `(0.4, 0.14, 0.3, 1)` |
  | Entrance | `(0, 0, 0.38, 0.9)` | `(0, 0, 0.3, 1)` |
  | Exit | `(0.2, 0, 1, 0.9)` | `(0.4, 0.14, 1, 1)` |

  Carbon advises providing alternatives for state transitions, considering reduced motion on mobile and tablet, and making sure messages can always be communicated statically. — [Carbon motion](https://carbondesignsystem.com/elements/motion/overview/)
- **Fluent 2 durations (8):** 50, 100, 150, 200, 250, 300, 400, 500ms (Fluent token names are durationUltraFast…durationUltraSlow; the names were not shown in the fetched file). — [Fluent UI tokens durations.ts](https://raw.githubusercontent.com/microsoft/fluentui/master/packages/tokens/src/global/durations.ts)
- **Fluent reduced motion:** provide a "no motion" setting (per WCAG), keep durations short, avoid flashes and sudden movement (seizure and vestibular risk), limit motion to the focused element, and use ARIA live regions as non-motion alternatives. — [Fluent 2 motion](https://fluent2.microsoft.design/motion)

### Inferences
- Theme motion personality can be one switch: productive/standard (short durations, about 70 to 250ms, gentle curves) vs. expressive/emphasized (longer durations, overshoot-free curves with a strong decelerate tail).
- Reduced-motion variant for a generator: under `prefers-reduced-motion: reduce`, map spatial transitions to opacity-only fades, or set durations to 0 to 1ms, and keep the duration tokens so code paths are unchanged. This is an implementation inference, not a token set published by these systems.

### Gaps
- Fluent easing curve values (curveAccelerateMax, curveDecelerateMid, curveEasyEase, etc.) were not retrieved.
- M3 Expressive (2025) spring-based motion tokens (spatial/effects springs with damping and stiffness) were not examined.

## Data-visualization palettes

### Takeaway
A complete theme needs categorical (about 8 to 14 colors, strictly ordered), sequential (single-hue, 10 steps) and diverging (two hues, about 8 steps per side) palettes, plus status/alert colors. Dark mode handling: categorical palettes get separate dark values, sequential palettes reverse which end means "more," and diverging palettes can stay the same.

### Cited Findings
- **Carbon categorical:** 14 colors, applied strictly in a fixed order (starting Purple 70, Cyan 50, Teal 70, Magenta 70… ending Purple 50), ordered to maximize contrast between neighboring colors. Light and dark values are listed separately. Monochromatic 1-color groups (Purple, Blue, Cyan, Teal) are offered for predictable category counts. — [Carbon data-viz color palettes](https://carbondesignsystem.com/data-visualization/color-palettes/)
- **Carbon sequential:** 4 hues (Blue, Purple, Cyan, Teal), 10 steps each (10 to 100). In light theme the darkest step marks the largest value; in dark theme the lightest step does. — [same](https://carbondesignsystem.com/data-visualization/color-palettes/)
- **Carbon diverging:** 2 palettes with 16 steps each (8 per side): red–cyan for temperature-like data, purple–teal for everything else. They are unchanged between light and dark themes. — [same](https://carbondesignsystem.com/data-visualization/color-palettes/)
- **Carbon alert palette:** Red 60 #da1e28 (danger), Orange 40 #ff832b (serious warning), Yellow 30 #f1c21b (warning), Green 60 #198038 (success). Gradients are not supported in Carbon Charts. The page gives no explicit colorblind simulation guidance. — [same](https://carbondesignsystem.com/data-visualization/color-palettes/)
- **Primer data-viz:** 17 hues, each with `-emphasis` and `-muted` variants (34 tokens, e.g. `--data-blue-color-emphasis`). — [Primer color primitives](https://primer.style/product/primitives/color/)
- **d3 categorical schemes and sizes:** Category10 (10), Tableau10 (10), Observable10 (10), Accent (8), Dark2 (8), Paired (12), Pastel1 (9), Pastel2 (8), Set1 (9), Set2 (8), Set3 (12). Most d3 schemes derive from ColorBrewer, and continuous versions are built with uniform B-spline interpolation. — [d3-scale-chromatic categorical](https://d3js.org/d3-scale-chromatic/categorical); [d3-scale-chromatic README](https://raw.githubusercontent.com/d3/d3-scale-chromatic/main/README.md)

### Inferences
- Practical limits: 8 to 10 categorical hues is the common ceiling (Tableau, Observable, Category10). Carbon's 14 relies on strict ordering. Beyond about 10 series, use grouping or "other" rather than more hues.
- Theming rule for a generator: categorical colors need re-derived dark-mode variants so they keep contrast against the dark surface (≥3:1 for graphical objects). Sequential ramps should be reversed in dark mode so "more" is always the higher-contrast end against the background.

### Gaps
- **Okabe-Ito:** the 8-color CVD-safe palette (black, orange, sky blue, bluish green, yellow, blue, vermillion, reddish purple; commonly given as #000000, #E69F00, #56B4E9, #009E73, #F0E442, #0072B2, #D55E00, #CC79A7) was not fetched from a primary source this session. The hex values come from general knowledge and should be verified before use.
- Tableau10 and Observable10 hex arrays were not retrieved (they are in d3 source files `src/categorical/Tableau10.js` and `observable10.js`).
- Atlassian data-viz palette counts were not retrieved.

## Color generation algorithms and contrast guarantees

### Takeaway
Leading generators work in a perceptual-lightness space (HCT tone, CIELCH, OKLCH, CAM02) and assign colors by target lightness or target contrast, not by mixing:
- **Material Color Utilities:** builds tonal palettes 0 to 100 in HCT, assigns roles to tones per scheme variant, and enforces per-role contrast ratios that vary with a continuous `contrastLevel` from −1 to 1.
- **Radix:** hand-tuned 12 steps with APCA guarantees for the text steps.
- **Leonardo:** solves directly for target contrast ratios against a background.
- **Linear:** derives the whole theme (previously 98 variables) from 3 LCH inputs: base, accent and contrast.

### Cited Findings
- **MCU DynamicScheme inputs:** source color(s) as HCT, `variant`, `contrastLevel` (−1 = minimum, 0 = standard, 1 = maximum; the code defines only the range and anchors), `isDark`, `platform` ('phone' default or 'watch'), and `specVersion` ('2021' default, '2025', and '2026' referenced with fallbacks). Palettes can be overridden individually. The error palette falls back to hue 25, chroma 84. — [MCU dynamic_scheme.ts](https://raw.githubusercontent.com/material-foundation/material-color-utilities/main/typescript/dynamiccolor/dynamic_scheme.ts)
- **MCU variants (10):** MONOCHROME, NEUTRAL, TONAL_SPOT, VIBRANT, EXPRESSIVE, FIDELITY, CONTENT, RAINBOW, FRUIT_SALAD, CMF. — [MCU variant.ts](https://raw.githubusercontent.com/material-foundation/material-color-utilities/main/typescript/dynamiccolor/variant.ts)
- **MCU role tones (2021 spec):** primary tone 40 (light) / 80 (dark); primaryContainer 90 / 30; primaryFixed 90, primaryFixedDim 80. Monochrome uses primary 0 / 100. Fidelity and Content keep the source color's tone for primaryContainer and fix "disliked" tertiary hues via DislikeAnalyzer. — [MCU color_spec_2021.ts](https://raw.githubusercontent.com/material-foundation/material-color-utilities/main/typescript/dynamiccolor/color_spec_2021.ts)
- **MCU contrast curves (minimum WCAG ratio against the role's background at contrast levels low/standard/medium/high):**
  - primary, secondary, tertiary, error, inversePrimary: (3, 4.5, 7, 7)
  - onPrimary and the other on-accents: (4.5, 7, 11, 21)
  - containers: (1, 1, 3, 4.5)
  - onContainers: (3, 4.5, 7, 11)
  - onSurface: (4.5, 7, 11, 21)
  - onSurfaceVariant: (3, 4.5, 7, 11)
  - outline: (1.5, 3, 4.5, 7)
  - outlineVariant: (1, 1, 3, 4.5)
  - onBackground: (3, 3, 4.5, 7)

  Medium and high correspond to contrastLevel 0.5 and 1.0 by convention. — [MCU color_spec_2021.ts](https://raw.githubusercontent.com/material-foundation/material-color-utilities/main/typescript/dynamiccolor/color_spec_2021.ts)
- **MCU role inventory** (about 50 roles per scheme): primary, onPrimary, primaryContainer, onPrimaryContainer, primaryFixed, primaryFixedDim, onPrimaryFixed, onPrimaryFixedVariant, inversePrimary (and the same set for secondary and tertiary); error, onError, errorContainer, onErrorContainer; the surface family listed above. The `*Dim` roles exist only for spec 2025+. — [MCU dynamic_scheme.ts](https://raw.githubusercontent.com/material-foundation/material-color-utilities/main/typescript/dynamiccolor/dynamic_scheme.ts)
- **Radix 12-step scale:** step 11 is guaranteed APCA Lc 60 and step 12 Lc 90 on step 2 of the same scale. Step 9 has no numeric guarantee and is designed for white text, except Sky, Mint, Lime, Yellow and Amber, which take dark text. — [Radix scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)
- **Adobe Leonardo:**
  - `Color` takes `colorKeys` (key colors to interpolate), `colorspace` (LCH, LAB, CAM02, HSL, HSLuv, HSV, RGB), `ratios` (target contrast ratios as an array, or an object for named outputs such as `'blue--largeText': 3`) and `smooth` (bezier smoothing, default false).
  - `Theme` takes a required single `BackgroundColor`, `lightness` (0 to 100, sets the background's lightness), `contrast` (a multiplier on all ratios, default 1), `saturation` (0 to 100, default 100) and `output` (HEX default; RGB, HSL, HSV, HSLuv, LAB, LCH, CAM02, CAM02p).
  - Array ratios are auto-named in steps of 100 (gray100, gray200…). Negative ratios produce colors on the other side of the background.
  - The README fetched did not document a WCAG 2 vs. APCA formula switch. The docs also have a `colorspace`/`colorSpace` spelling inconsistency.

  — [Leonardo contrast-colors README](https://raw.githubusercontent.com/adobe/leonardo/main/packages/contrast-colors/README.md)
- **Linear:** each theme is defined by 3 variables (base color, accent color, contrast), down from 98 separate variables per theme. It uses LCH because its lightness is perceptually uniform. The contrast variable enables high-contrast accessibility themes, and a custom theme generator is exposed to users. — [Linear redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
- **Primer token tiers and counts (visible portion):** 92 foundational color variables (20 fg, 34 bg, 30 border, 8 shadow) plus 144 pattern variables (68 button, 38 control, 34 data-viz, 1 focus, 3 overlay), about 236 in total. The fetched page showed only light and dark. Primer's other themes (dark dimmed, high contrast, colorblind and tritanopia variants) were not visible on that page. — [Primer color primitives](https://primer.style/product/primitives/color/)

### Inferences
- Two ways to guarantee contrast:
  1. **Tone-gap rule (MCU/HCT, OKLCH):** in HCT, a tone difference of 40 or more gives ≥3:1 and 50 or more gives ≥4.5:1 (MCU's documented design principle; not re-verified this session). Assign roles at fixed tones, then nudge the tone until the contrast curve's ratio is met.
  2. **Direct solve (Leonardo):** binary-search lightness along the interpolated key-color curve until the WCAG or APCA target is hit against the actual background.

  A robust generator can combine them: start from tone targets, then verify and solve to the per-role ratio for the chosen contrast level.
- A "contrast" theme input (Linear, Leonardo `contrast` multiplier, MCU `contrastLevel`) is now standard and should be a first-class generator parameter. It should affect surface separation and outline strength, not only text.
- OKLCH-based approaches are analogous to HCT tone. Radix's own scales are hand-tuned, but its custom palette tool exists. No primary source on OKLCH generators (e.g. Tailwind v4 palette, Evil Martians' Harmonizer) was fetched this session.

### Gaps
- MCU per-variant palette chroma values (e.g. TonalSpot primary chroma 36, secondary 16, tertiary hue +60°; neutral chroma 6, neutral variant 8) were not in the fetched file. These are commonly cited and should be verified from `scheme_tonal_spot.ts` / `color_spec_2025.ts`.
- Atlassian's color generation method and Primer's generation pipeline (Primer Primitives build) were not documented in fetched sources.
- Radix custom-palette algorithm details (its "Create a custom palette" tool) were not retrieved.
- m3.material.io pages (color roles, contrast levels UI) could not be fetched because they render client-side.
