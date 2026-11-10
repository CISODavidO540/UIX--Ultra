# Token Architecture and Modes in Mature Design Systems (late 2026)

Research date: 2026-11-10. About 20 tool calls. Primary sources are preferred. Where only secondary sources were found, this is flagged.

## Token tiers: how Material 3, Primer, Atlassian, Carbon, Spectrum 2, Polaris, Radix and SLDS 2 organize tokens, and which tiers themes override

### Takeaway
Almost every system uses 2–3 tiers. The bottom tier holds raw primitives (palette or scale). The middle tier holds semantic (role) tokens, and this is the tier themes and modes swap. The top tier holds component or pattern tokens, which alias the semantic tier and usually stay the same across modes. Names follow a `category-property-role-emphasis-state` pattern and ship as prefixed CSS custom properties (`--md-sys-color-*`, `--fgColor-*`, `--ds-*`, `--cds-*`, `--spectrum-*`, `--p-*`, `--slds-g-*`).

### Cited Findings
**Material Design 3**
- Material 3 has three tiers. Reference tokens (`md.ref.palette.primary40`) hold raw values. System tokens (`md.sys.color.primary`) give a role and alias the reference tokens. Component tokens (`md.comp.button.filled.container.color`) alias the system tokens. In CSS these become `--md-ref-palette-primary40`, `--md-sys-color-primary` and `--md-comp-...`. Dark mode, dynamic color and brand variants "only need to swap the sys layer" — [Design Systems Collective (secondary)](https://www.designsystemscollective.com/the-token-structure-that-survives-five-products-google-uses-it-too-c480e864ef64); [material-web theming docs](https://material-web.dev/theming/material-theming)
- The Material Web docs make two points. Component tokens are *not* prefixed with `comp` in CSS: overrides go on custom properties per component, such as `--md-filled-button-container-color`. Older MWC versions did not support the `--md-ref-palette` tokens — [material-web theming README (unpkg)](https://unpkg.com/@material/web@1.0.1/docs/theming/README.md)
- **Count: 49 `md-sys-color` tokens** in @material/web 2.4.1. They are background, error, error-container, inverse-on-surface, inverse-primary, inverse-surface, on-background, on-error, on-error-container, on-primary, on-primary-container, on-primary-fixed, on-primary-fixed-variant, on-secondary(-container/-fixed/-fixed-variant), on-surface, on-surface-variant, on-tertiary(-container/-fixed/-fixed-variant), outline, outline-variant, primary, primary-container, primary-fixed, primary-fixed-dim, scrim, secondary(-container/-fixed/-fixed-dim), shadow, surface, surface-bright, surface-container(-lowest/-low/-high/-highest), surface-dim, surface-tint, surface-variant, tertiary(-container/-fixed/-fixed-dim). The functions `values-light()` and `values-dark()` emit the same token set with different values. Each value is wrapped as `var(--md-sys-color-<token>, <fallback>)` — [@material/web _md-sys-color.scss](https://cdn.jsdelivr.net/npm/@material/web@2.4.1/tokens/_md-sys-color.scss)

**GitHub Primer (primer/primitives)**
- Primer has two tiers: **base** (raw size, typography and motion values, plus color scales) and **functional** (semantic size, typography, `--space-*` and color themes). The CSS ships as `dist/css/base/{size,typography,motion}/*.css` and `dist/css/functional/{size/border,size/breakpoints,size/size,size/viewport,typography,spacing/space}.css`, plus one file per theme under `functional/themes/`. Style Dictionary builds it (`scripts/buildTokens.ts`). Token names are linted to camelCase or kebab-case — [primer/primitives README](https://raw.githubusercontent.com/primer/primitives/main/README.md)
- Functional names follow `--{category}-{role}-{variant}-{state}`, with camelCase properties: `--fgColor-accent`, `--bgColor-accent-emphasis`, `--borderColor-accent-muted`, `--shadow-floating-small`. Primer's docs call the component-like tokens "pattern" tokens: `--button-primary-bgColor-rest`, `--control-checked-bgColor-hover`, `--data-blue-color-emphasis`, `--focus-outlineColor`, `--overlay-backdrop-bgColor` — [Primer color primitives](https://primer.style/foundations/primitives/color)
- Override modes list only the tokens that differ from their parent mode. They live in `src/tokens/functional/color/[light|dark]/overrides/` and are registered in `themes.config.ts` — [primer/primitives README](https://raw.githubusercontent.com/primer/primitives/main/README.md)

**Atlassian Design System**
- Token names have 3 parts: **foundation** (color, elevation, space, ...), **property** (text, background, border, shadow, ...) and an optional **modifier** (role, emphasis, state). Examples are `color.text` and `color.icon.success`. The token categories are color (text, link, icon, background, border, blanket, chart, skeleton), elevation (surface plus shadow), opacity (`opacity.disabled`, `opacity.loading`), space, and typography (family, size, weight, line-height). A "theme" is defined as "a collection of token values". Non-color theme examples given are density (cozy, comfortable, compact), reduced motion and custom typography — [atlassian.design design tokens](https://atlassian.design/foundations/tokens/design-tokens)
- There is a single semantic tier in code. Product code is meant to use only these semantic names, accessed through `token('color.background.brand.bold')`, which emits `var(--ds-...)`. The primitive palette sits behind it — [Use tokens in code](https://atlassian.design/foundations/tokens/use-tokens-in-code). Note: the `--ds-` prefix and the "semantic-only" rule come from my background knowledge and that page; I did not fully re-fetch it.

**IBM Carbon**
- Carbon has 4 themes: **White** (default), **Gray 10**, **Gray 90** and **Gray 100**. Tokens are role-based (`$background`, `$layer-01`, `$text-primary`, `$border-strong`, `$icon-primary`, `$field-01`) and point at palette primitives. For example, `$interactive` maps to `$blue-60` in White. Token *names* "never change across themes"; only their values do. Customization uses Sass `@use ... with (...)`, which can override values or add custom tokens — [Carbon themes overview](https://carbondesignsystem.com/elements/themes/overview/)
- Sass `theme.$background` compiles to `var(--cds-background)`. Themes are emitted on `:root` or `[data-carbon-theme]` through the `themes.theme($g10)` mixin — [Carbon sass.md](https://github.com/carbon-design-system/carbon/blob/5fc4fb6311fe125c1fb92e2b57937ce727967783/packages/styles/docs/sass.md); [Carbon themes code](https://carbondesignsystem.com/elements/themes/code/)
- The token count was not given on the overview page, which links to the `@carbon/themes` source instead — [Carbon themes overview](https://carbondesignsystem.com/elements/themes/overview/)

**Adobe Spectrum 2**
- Semantic tokens point at different primitives per theme. For example, `--spectrum-background-base-color` maps to `--spectrum-gray-200` in light and to `--spectrum-gray-50` in dark. S2 ships **standalone** files: `light-vars.css`, `dark-vars.css`, `medium-vars.css` (desktop scale), `large-vars.css` (mobile/touch scale) and a global file. This replaces the older base-plus-override pattern used by Spectrum 1 and Express — [@spectrum-css/tokens README (via search)](https://unpkg.com/@spectrum-css/tokens@16.0.1/README.md); [SWC migrating to S2](https://opensource.adobe.com/spectrum-web-components/migrating-to-spectrum2)

**Shopify Polaris**
- CSS variables carry the `--p-` prefix, for example `--p-color-bg-surface`. Color names run element, then role, then prominence, then state, with states as suffixes: `--p-color-bg-surface-hover`, `--p-color-bg-surface-disabled`, `--p-color-bg-surface-inverse` — [polaris-tokens README](https://cdn.jsdelivr.net/npm/@shopify/polaris-tokens@9.4.2/README.md); [Polaris color tokens](https://polaris.shopify.com/design/colors/color-tokens)
- Polaris's dark theme was still labeled `dark-experimental` in the polaris-react release notes — [Polaris PR #12467](https://redirect.github.com/Shopify/polaris/pull/12467)

**Radix Themes**
- The token groups are Color, Typography, Spacing, Radius, Shadows and Cursors — [Radix Themes overview](https://www.radix-ui.com/themes/docs/theme/overview)
- The `<Theme>` component is the theming API. Its props are `appearance` (inherit | light | dark, default inherit), `accentColor` (default indigo), `grayColor` (default auto), `panelBackground` (solid | translucent, default translucent), `radius` (none | small | medium | large | full, default medium), `scaling` (90% | 95% | 100% | 105% | 110%, default 100%) and `hasBackground` (default true) — [Radix Theme component](https://www.radix-ui.com/themes/docs/components/theme)

**Salesforce SLDS 2 (Cosmos)**
- SLDS 2 "global styling hooks" are semantic CSS custom properties prefixed `--slds-g-`. Examples are `--slds-g-color-surface-1` (bottom-layer surfaces such as the app background), `--slds-g-color-surface-container-1..3` (elements sitting on a surface) and the paired `--slds-g-color-on-surface-1..3`. Hooks adapt to light and dark modes, and the SLDS 1 design tokens (e.g. `--lwc-colorBackground`) are deprecated — [SLDS new global styling hooks guidance](https://lightningdesignsystem.com/platforms/lightning/new-global-styling-hooks-guidance); [LWC: styling hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties.html); [Trailhead: dark-mode-ready components](https://trailhead.salesforce.com/content/learn/modules/dark-mode-ready-components-in-slds-2/activate-slds-2-and-preview-dark-mode)

### Inferences
- **Which tier do themes override?** Universally the semantic/system tier: Material sys, Primer functional, Carbon role tokens, Spectrum semantic, SLDS global hooks. Primitives usually stay fixed per brand, and dark palettes reuse the same primitive ramp read in reverse. Component tokens alias semantics and are rarely overridden per mode. A theme engine should therefore model a theme as a full assignment of semantic → primitive alias, plus an optional primitive palette swap for brands.
- **Naming pattern to adopt:** `{namespace}-{category}-{property/element}-{role}-{emphasis}-{state}`, e.g. `bgColor-accent-emphasis`, `color.background.brand.bold`, `color-bg-surface-hover`. Primer puts the property first (`fgColor`/`bgColor`/`borderColor`). Atlassian and Polaris put the category first (`color.background.*`).
- **Surface ladders** appear everywhere as numbered or level-named steps: M3 `surface-container-lowest…highest` (5 steps plus dim/bright), Carbon `layer-01..03`, SLDS `surface-container-1..3`. A tool should generate an elevation ladder of 3–5 steps, not a single "surface".
- Expected semantic color token counts are on the order of 50 (M3 sys color: 49) to a few hundred (Primer and Atlassian include pattern and data-viz tokens). These are rough figures; only the M3 count was verified.

### Gaps
- No verified totals for Primer, Atlassian, Carbon, Spectrum, Polaris or SLDS token counts. The m3.material.io token page returned 404, so M3 component-token naming is confirmed only through the material-web docs and secondary sources.
- The 2025–26 Polaris restructure (web components / "Polaris unified") and its current dark-theme status were not verified.

## Modes: how light, dark, high-contrast, colorblind, density and brand are modeled, and how many systems ship

### Takeaway
Color modes are the main axis: Primer ships 9 color themes, Carbon 4, Atlassian light/dark plus contrast, and Spectrum light/dark (plus wireframe in data). Density or scale is a second, independent axis (Spectrum desktop/mobile, Radix scaling, Atlassian spacing themes). Mature systems model each axis as an orthogonal set (DTCG "modifier", Spectrum "mode set", Figma variable collection) to avoid a combinatorial explosion. Override modes store only the deltas from a parent mode.

### Cited Findings
- **Primer: 9 color themes.** `light`, `light-tritanopia`, `light-high-contrast`, `light-colorblind`, `dark`, `dark-dimmed`, `dark-high-contrast`, `dark-tritanopia`, `dark-colorblind`. The "colorblind" themes are for protanopia/deuteranopia. Each is an override of light or dark that lists only the differing tokens — [primer/primitives README](https://raw.githubusercontent.com/primer/primitives/main/README.md)
- **Primer runtime selection** uses three attributes: `data-color-mode` (light | dark | auto), `data-light-theme` and `data-dark-theme`. They go on `<body>` or another high-level element, e.g. `data-color-mode="auto" data-light-theme="light" data-dark-theme="dark_dimmed"`. `auto` follows the OS setting. The CSS uses selectors such as `[data-color-mode=auto][data-light-theme=dark]` — [Primer primitives getting started](https://primer.style/foundations/primitives/getting-started); [primer.style product primitives](https://primer.style/product/primitives). Attribute values use underscores (`dark_dimmed`) while file names use hyphens.
- **Atlassian:** `setGlobalTheme({ light: 'light', dark: 'dark', colorMode: 'auto' })`, with a separate `contrastMode` option. The typography theme is on by default. The call writes `data-theme="light:light dark:dark spacing:spacing"` and `data-color-mode="light"` on `<html>`. This is a space-separated multi-axis theme string, with one entry per axis — [Atlassian use tokens in code](https://atlassian.design/tokens/use-tokens-in-code); [@atlaskit/tokens set-global-theme.d.ts](https://cdn.jsdelivr.net/npm/@atlaskit/tokens@13.0.4/dist/types/set-global-theme.d.ts)
- Atlassian color themes are light, dark and high-contrast. Density (cozy/comfortable/compact), reduced motion and typography are given as non-color theme examples — [atlassian.design design tokens](https://atlassian.design/foundations/tokens/design-tokens)
- **Carbon: 4 themes**, 2 light (White, G10) and 2 dark (G90, G100), with theme zones via `.cds--white/.cds--g10/.cds--g90/.cds--g100`. Inline zones rely on layer tokens to reset the layer level — [Carbon themes overview](https://carbondesignsystem.com/elements/themes/overview/); [@carbon/styles _zone.scss](https://cdn.jsdelivr.net/npm/@carbon/styles@1.105.0/scss/_zone.scss)
- **Spectrum design data defines 3 mode sets:** `colorScheme` (light, dark, wireframe; default light), `scale` (desktop, mobile; "desktop = medium, mobile = large") and `contrast` (regular, high; iOS "increased" is an alias). Each set is JSON validated by `mode-set.schema.json` with `name`, `modes[]` and `default`. Platforms can `addMode`/`removeMode`/`setDefault` — [Spectrum Design Data: mode sets](https://opensource.adobe.com/spectrum-design-data/spec/mode-sets/)
- In Spectrum CSS, classes compose orthogonally: `class="spectrum spectrum--medium spectrum--light"`. In Web Components, `<sp-theme system="spectrum-two" color="light" scale="medium">` does the same. The legacy colors `lightest`/`darkest` are deprecated — [SWC theme](https://opensource.adobe.com/spectrum-web-components/tools/theme); [SWC migrating to S2](https://opensource.adobe.com/spectrum-web-components/migrating-to-spectrum2)
- **Material 3 contrast:** Android 15 added standard, medium and high contrast levels. Dynamic color handles them automatically, and static themes must supply them. In Material Color Utilities, contrast is a continuous number from -1 to 1, with 0 as standard — [jwill.dev (secondary)](https://jwill.dev/blog/2024/06/05/How-I-Teach-Material.html); [material-color-utilities dynamic_scheme.d.ts](https://cdn.jsdelivr.net/npm/@material/material-color-utilities@0.4.0/dynamiccolor/dynamic_scheme.d.ts). M3 Expressive uses dynamic color from seed colors in HCT — [Android Wear color system](https://developer.android.com/design/ui/wear/guides/styles/color/system)
- **Radix:** appearance (light/dark) is separate from accent, gray, radius and scaling. Nested `<Theme>` elements inherit the parent's props and override only the ones they set, e.g. a child sets `accentColor="cyan" radius="full"` and a grandchild sets only `accentColor="orange"` — [Radix Theme component](https://www.radix-ui.com/themes/docs/components/theme)
- **Figma variables:** each collection has modes, and the per-plan mode limit has reportedly risen to Professional 10 and Organization 20 (from 4). Enterprise "extended collections" allow unlimited modes for brand overlays: they inherit a parent collection and override values but cannot rename or rescope variables. This comes from one secondary source and conflicts with older figures (Starter 1 / Pro 4 / Enterprise 40) — [UX Collective](https://uxdesign.cc/what-do-figmas-updates-mean-for-design-systems-323fb0cc8495); [Figma help: modes](https://help.figma.com/hc/en-us/articles/15343816063383)

### Inferences
- **Why so many modes?** Accessibility (high contrast; color-vision-deficiency variants for red/green-safe diff and status colors), user preference (dimmed dark reduces glare) and platform ergonomics (touch scale). Primer's 9 themes = 2 base modes × {default, high-contrast, tritanopia, colorblind} + dimmed.
- **Recommended model for a tool:** independent axes, each with a default: `colorScheme` {light, dark}, `contrast` {standard, high}, `cvd` {none, protan-deutan, tritan}, `density`/`scale` {compact, default, comfortable | desktop, mobile} and `brand`. Use delta-only override files and resolve them through an ordered merge (see the DTCG resolver below). Primer's "light-high-contrast" is in effect a precomposed scheme × contrast pair.

### Gaps
- No primary-source confirmation of Figma's current mode limits.
- Atlassian `contrastMode` values were not retrieved; I believe they are 'more' | 'no-preference' | 'auto', but this is unverified.

## Standard format: DTCG 2025.10, resolvers and tooling

### Takeaway
DTCG published its **first stable version, 2025.10, on 2025-10-28**. It has a Format Module, a Color Module and a **Resolver Module** that standardizes theming and modes through `sets` + `modifiers` + `resolutionOrder`. It is a W3C Community Group Final Report, not a W3C Standard. Terrazzo 2.x implements the full 2025.10 spec including resolvers. Style Dictionary v5 reportedly adopted the 2025.10 format; its resolver support is unconfirmed.

### Cited Findings
- The 2025.10 spec was announced as the first stable version on 2025-10-28. It "is not a W3C Standard nor is it on the W3C Standards Track" — [W3C DTCG announcement](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/); [designtokens.org TR 2025.10](https://www.designtokens.org/tr/2025.10/)
- **Format Module:**
  - A token is an object with `$value`. Optional properties are `$type` (inheritable from a parent group; tools MUST NOT infer types), `$description`, `$extensions` (reverse-domain keys such as `org.example.tool-a`, which must be preserved) and `$deprecated` (boolean or string).
  - Groups are objects without `$value`. `$root` names a group's base token (`color.accent.$root`). `$extends` deep-merges another group, with local tokens winning and cycles invalid.
  - Aliases use `{colors.blue}` for a whole token, or JSON Pointer `$ref` (`"#/colors/blue/$value/components/0"`) for sub-values, which tools must support. Circular references are errors.
  - Media type is `application/design-tokens+json`; extensions are `.tokens` / `.tokens.json`.
  - Types: `color`, `dimension` (`{ "value": 16, "unit": "px" }`, px or rem), `fontFamily`, `fontWeight` (1–1000 or names like `bold`), `duration` (`{value, unit: ms|s}`), `cubicBezier` and `number`. Composite types are `strokeStyle`, `border`, `transition`, `shadow`, `gradient` and `typography`.
  - Colors use `{colorSpace, components, alpha?, hex?}` per the Color module.
  — [DTCG Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/)
- **Resolver Module:**
  - Root properties: `version: "2025.10"` (required), `resolutionOrder` (required, ordered; later entries win), `sets` (always-on `sources[]`), `modifiers` (each with `contexts` mapping a context name to sources, an optional `default` and `description`) and `$schema` (`https://www.designtokens.org/schemas/2025.10/resolver.json`).
  - The file extension is `.resolver.json`.
  - An input is `{ "theme": "dark", "brand": "brandB" }`, with string values and case-insensitive keys. Every modifier without a default must be given; unknown keys are errors.
  - The spec's own example has a theme modifier {light, dark} and a brand modifier {brandA, brandB}, giving 2×2 = 4 resolutions. It advises keeping modifiers orthogonal, i.e. each token set by only one modifier.
  - Some spec examples use the singular `context`, but the normative key is `contexts`.
  — [DTCG Resolver Module 2025.10](https://www.designtokens.org/tr/2025.10/resolver/); [W3C CG final report](https://www.w3.org/community/reports/design-tokens/CG-FINAL-resolver-20251028/)
- **Terrazzo:** the @terrazzo/parser 2.4.0 changelog claims "full support for the DTCG v2025.10 spec, including resolvers". Its 2.x migration guide moves legacy `$extensions.mode` modes to resolver contexts/modifiers — [@terrazzo/cli CHANGELOG](https://unpkg.com/@terrazzo/cli@2.4.0/CHANGELOG.md); [Terrazzo resolvers guide](https://terrazzo.app/docs/guides/resolvers/); [Terrazzo migrating v2](https://terrazzo.app/docs/guides/migrating-v2/)
- **Style Dictionary:** a zeroheight article claims SD v5 adopted 2025.10 as its base format, and that Figma and Tokens Studio read 2025.10. A Nov-2025 DTCG list post said SD support was still in progress. The two conflict on timing, and I found no confirmation of SD resolver support — [zeroheight help](https://help.zeroheight.com/hc/en-us/articles/48049028236187); [public-design-tokens-log Nov 2025](https://lists.w3.org/Archives/Public/public-design-tokens-log/2025Nov/0009.html)
- A separate proposal for first-class `$modes` on tokens (issue #348) was still under discussion in Nov 2025, an alternative to resolvers — [DTCG issue #348 log](https://lists.w3.org/Archives/Public/public-design-tokens-log/2025Nov/0002.html)
- Primer builds with Style Dictionary and exports Figma scopes through `$extensions`-style metadata (`figmaAttributes.ts`) — [primer/primitives README](https://raw.githubusercontent.com/primer/primitives/main/README.md)

### Inferences
- A 2026 tool should read and write DTCG 2025.10 `.tokens.json` plus a `.resolver.json`, keep tool-specific data under `$extensions` with a reverse-domain key, and map each resolver modifier to a CSS selector axis (e.g. `[data-theme]`, `[data-contrast]`, `[data-density]`).

### Gaps
- Not verified: Style Dictionary v5 resolver support; whether the Tokens Studio and Figma native DTCG import and export cover resolvers.

## CSS delivery: scoping, color-scheme, light-dark(), layers, @property, flash prevention, media queries, nested themes

### Takeaway
Every system ships themes as CSS custom properties scoped to a root selector, and all of them support subtree scoping: Primer `data-*` attributes, Atlassian `data-theme` + `data-color-mode` on `<html>`, Carbon `[data-carbon-theme]` / `.cds--g90` zones, Spectrum `.spectrum--dark` classes or `<sp-theme>`, Radix nested `<Theme>`. `light-dark()` (Baseline May 2024) with `color-scheme` is the modern single-declaration way to define light and dark values.

### Cited Findings
- `light-dark(<light>, <dark>)` accepts two colors or, per spec, two images. It only switches when the element's `color-scheme` includes both `light` and `dark` (`:root { color-scheme: light dark; }`). Setting `color-scheme: dark` on a subtree forces that scheme for the subtree. It has been Baseline 2024 since May 2024; image-argument support may lag and should be feature-detected with `@supports`. The spec is CSS Color 5 — [MDN light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark)
- Primer: attribute-scoped variables. `auto` mode is wired through selector combinations such as `[data-color-mode=auto][data-light-theme=...]`, which wrap `prefers-color-scheme` — [primer.style product primitives](https://primer.style/product/primitives); [Primer getting started](https://primer.style/foundations/primitives/getting-started)
- Atlassian writes `data-theme`/`data-color-mode` on `<html>` at runtime. A Bitbucket Server source sets `data-color-mode` manually because "setGlobalTheme takes too long", which works around a flash of the wrong theme. This is direct evidence that a pre-paint attribute is needed — [Bitbucket Server theme.js](https://docs.atlassian.com/bitbucket-server/docs/9.0.0/reference/javascript/theme_theme.js.html); [Atlassian use tokens in code](https://atlassian.design/tokens/use-tokens-in-code)
- Carbon: `@include theme.theme(themes.$g90)` inside any selector creates an inline theme zone. Zone classes set background and text from the theme and reset layer tokens — [@carbon/themes npm](https://npmjs.com/package/@carbon/themes); [@carbon/styles _zone.scss](https://cdn.jsdelivr.net/npm/@carbon/styles@1.105.0/scss/_zone.scss)
- Spectrum: composable theme classes. Color files and scale files are separate stylesheets, so one color option and one scale option are loaded together — [SWC migrating to S2](https://opensource.adobe.com/spectrum-web-components/migrating-to-spectrum2)
- Material Web wraps each token as `var(--md-sys-color-x, <fallback>)`, so components work even without a theme loaded — [@material/web _md-sys-color.scss](https://cdn.jsdelivr.net/npm/@material/web@2.4.1/tokens/_md-sys-color.scss)

### Inferences (standard platform practice; I did not re-fetch primary docs this session)
- **Flash prevention:** a small inline blocking `<script>` in `<head>` reads the stored preference (localStorage or cookie) and `matchMedia('(prefers-color-scheme: dark)')`, then sets `data-color-mode`/`data-theme` on `<html>` before first paint. Server-side rendering can set it from a cookie instead. Also set `<meta name="color-scheme" content="light dark">` so the UA canvas and scrollbars match before CSS loads.
- **Media queries to handle:** `prefers-color-scheme` (light/dark), `prefers-contrast: more` (map to the high-contrast context), `forced-colors: active` (Windows High Contrast: use system colors such as `CanvasText`, `ButtonText`, `Highlight`, and keep borders and focus outlines visible because backgrounds are stripped) and `prefers-reduced-motion` (set motion and duration tokens to 0).
- **Cascade layers:** put token definitions in a low-priority layer (e.g. `@layer tokens, base, components, utilities;`) so app overrides win without specificity fights.
- **`@property`:** registering color tokens (`syntax: '<color>'; inherits: true`) enables animated theme transitions and type checking. It costs performance at scale, so use it selectively.
- **Nested themes:** because custom properties inherit, any element carrying the theme selector re-scopes its subtree. Also set `color-scheme` and `background`/`color` on that element, as Carbon zones do, so the subtree's UA widgets and text match.

### Gaps
- MDN pages for `prefers-contrast`, `forced-colors`, `@property` and `@layer` were not fetched in this session. Not verified: per-browser support for `light-dark()` with images; the exact Primer and Atlassian pre-paint scripts.

## Which non-color categories are themable in practice

### Takeaway
Color is universally themable. Next most common are density/scale (Spectrum desktop/mobile, Radix scaling 90–110%, Atlassian spacing themes) and radius (Radix none…full). Typography is themable in Atlassian (typography theme) and Carbon (via Sass `with`). Shadows and elevation usually change with light and dark. Motion is themable mainly through reduced-motion. Border width and focus-ring tokens exist (Primer `--focus-outlineColor`, functional `size/border.css`) but are rarely a separate theme axis.

### Cited Findings
- Radix: `radius` (none/small/medium/large/full) and `scaling` (90%/95%/100%/105%/110%) are Theme-level props alongside color. Token groups include Typography, Spacing, Radius, Shadows and Cursors — [Radix Theme component](https://www.radix-ui.com/themes/docs/components/theme); [Radix overview](https://www.radix-ui.com/themes/docs/theme/overview)
- Spectrum: the `scale` mode set (desktop/medium vs mobile/large, with larger touch targets) changes dimension tokens. There is also a `contrast` mode set, and `motion`/`language` are listed as possible optional sets — [Spectrum mode sets](https://opensource.adobe.com/spectrum-design-data/spec/mode-sets/)
- Atlassian: `data-theme` includes `spacing:spacing` and a typography theme on by default. Density (cozy/comfortable/compact) and reduced motion are cited as non-color themes. Elevation and opacity are token categories — [@atlaskit/tokens / use tokens in code](https://atlassian.design/tokens/use-tokens-in-code); [atlassian.design tokens](https://atlassian.design/foundations/tokens/design-tokens)
- Carbon: type styles can be customized through tokens, and global tokens cover border width and layer usage. Spacing is a fixed scale and is not themed — [Carbon themes overview](https://carbondesignsystem.com/elements/themes/overview/)
- Primer: base size, typography and motion tokens, plus functional border, breakpoint, viewport and space tokens. Shadow tokens such as `--shadow-floating-small` and focus tokens such as `--focus-outlineColor` sit in the color themes, so shadows vary by theme — [primer/primitives README](https://raw.githubusercontent.com/primer/primitives/main/README.md); [Primer color](https://primer.style/foundations/primitives/color)
- DTCG gives first-class types for every category: dimension, fontFamily, fontWeight, duration, cubicBezier, shadow, border, strokeStyle, transition and typography — [DTCG Format 2025.10](https://www.designtokens.org/tr/2025.10/format/)

### Inferences
- A complete theme a tool should expose:
  - color (semantic roles plus a surface ladder)
  - shadow/elevation (per color scheme)
  - radius (one global multiplier or a named scale)
  - density/scaling (a single multiplier applied to space, size and type, à la Radix `--scaling`)
  - typography (families, plus a scale ratio)
  - motion (durations and easings, with a reduced-motion context)
  - border widths and a focus ring (color, width, offset)
- Of these, color, density, radius and typography are the axes users actually switch; the rest are usually brand-level constants.

### Gaps
- Radix's internal CSS variable names (`--radius-*`, `--scaling`, `--space-*`, the 12-step `--accent-1..12` scale) were not confirmed from docs in this session.
- Not checked: Material 3 shape and density tokens (`md.sys.shape.corner.*`, density -1…-3 for some components) and the M3 Expressive motion-physics tokens.
