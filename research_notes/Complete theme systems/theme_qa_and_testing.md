# Theme QA and Testing: Specimen Pages, Visual Regression Across Modes, Automated Audits, Common Bugs, Rollout

Research date: 2026-11-10. Sources are mostly primary docs (Playwright, Chromatic, Storybook, Deque, web.dev, GitHub Docs/Blog, Atlassian, Slack Engineering). Practitioner blogs are labelled as such.

## 1. Specimen / kitchen-sink pages: how design systems render every component x state x theme

### Takeaway
The tools that exist are live theme playgrounds with a control panel (Radix Themes Playground + ThemePanel) and Storybook theme toolbars (`@storybook/addon-themes`). GitHub previews new palettes by installing pre-release token packages into the real product, not by using a dedicated specimen page. None of the sources I fetched give a canonical list of components and states. Build that matrix yourself, and turn it into Chromatic/Playwright modes so that every page reviewers look at is also a page CI snapshots.

### Cited Findings
- The Radix Themes Playground has a Theme Panel with controls for accent color, gray color, appearance (light/dark), radius, scaling and panel background. ⌘C shows or hides the panel and ⌘D toggles dark mode. — [Radix Themes Playground](https://www.radix-ui.com/themes/playground)
- Radix ships `ThemePanel` as a drop-in component, so apps can preview theme changes in real time inside their own UI. — [Radix Theme docs](https://www.radix-ui.com/themes/docs/components/theme)
- A secondary source says the playground shows every component and how it reacts to theme changes live. The official docs only say it shows the effect of each option. — [LogRocket Radix adoption guide](https://blog.logrocket.com/radix-ui-adoption-guide/) (secondary)
- `@storybook/addon-themes` (Storybook 7+) adds a toolbar to switch themes in the preview. It has recipes for Emotion, MUI, Bootstrap, PostCSS, styled-components, Tailwind and Vuetify, plus a "custom decorator" API. A story or a whole file can pin a theme by setting `globals.theme` in its exports. — [Storybook addon-themes](https://storybook.js.org/addons/@storybook/addon-themes)
- Chromatic's modes example uses `withThemeByClassName` from addon-themes with `light`/`dark` themes and a `defaultTheme`. — [Chromatic Modes](https://www.chromatic.com/docs/modes/)
- GitHub/Primer: palettes are made in Primer Prism (an experimental tool that works in HSLuv, edits lightness curves and checks WCAG 2 contrast) and exported as JSON into Primer Primitives. Pre-release builds of the package are used to try palettes on GitHub.com itself. At that time, visual testing happened outside Prism, in Figma or in production apps. Before Prism, the original dark mode was made in a Figma file with more than 370,000 layers. — [GitHub Blog: Accelerating theme creation with color tooling](https://github.blog/news-insights/product-news/accelerating-github-theme-creation-with-color-tooling/)
- Primer Primitives ships nine theme CSS files: light, light-tritanopia, light-high-contrast, light-colorblind, dark, dark-colorblind, dark-dimmed, dark-high-contrast and dark-tritanopia. Every component therefore has to be reviewed in nine themes. — [@primer/primitives README (unpkg)](https://app.unpkg.com/@primer/primitives@11.10.0/files/README.md); [Primer themes docs](https://primer.style/foundations/color/base-scales)

### Inferences
- Recommended specimen matrix. This is a synthesis; no single source gives it. Rows are components: buttons (every variant), links, inputs/select/checkbox/radio/switch, textarea, tooltip, popover/menu, dialog/drawer, toast/banner, badges/labels/status colors, tables, tabs/nav, avatars, code blocks, charts, illustrations/logos and empty states. Columns are states: default, hover, active, focus-visible, disabled, selected/checked, invalid/error, loading, read-only. Repeat the grid for every theme (light, dark, dimmed, high-contrast, CVD variants), plus forced-colors and reduced-motion.
- Use one story per component that renders all its states at once (an "all states" grid). Interactive states can be forced with pseudo-state addons or `:hover` classes. Each grid then costs one snapshot per mode instead of one per state.
- Put two themes side by side in one story (for example, render the grid twice, wrapped in `[data-theme=light]` and `[data-theme=dark]`) so designers can review them together. Nothing I fetched documents this as a feature; it is a pattern teams build themselves.

### Gaps
- I found no primary documentation for Material Theme Builder's preview/export QA flow, Carbon's Storybook theme switcher (white/g10/g90/g100), or Polaris's specimen pages. I could not verify which components and states they include.
- I could not fetch Primer's internal Storybook or its visual-regression setup.

## 2. Visual regression across themes and modes

### Takeaway
Chromatic "modes" turn each story into one snapshot per named set of Storybook globals (theme, viewport, background). Each mode is billed as its own snapshot and has its own baseline, keyed by the mode's name. Playwright does the same at page level: one project per color scheme or forced-colors/contrast/reduced-motion setting, with `toHaveScreenshot` defaults that already disable animations and hide the caret. Baselines must be generated in the same OS/browser environment they are compared in. Lost Pixel was sunset in April 2026, so Chromatic, Percy, Argos and self-hosted Playwright/BackstopJS are the remaining options.

### Cited Findings
**Chromatic modes**
- Modes are named combinations of Storybook globals (viewport, theme, backgrounds). Chromatic takes one snapshot per mode applied to a story. Modes are defined in `.storybook/modes.ts` (the docs use an `allModes` object), and stories reference them through the `chromatic.modes` parameter, e.g. `allModes['dark desktop']`. Modes require Storybook 6.0+. The viewport `options` object requires Storybook 9. — [Chromatic Modes](https://www.chromatic.com/docs/modes/)
- A mode can set both `theme: 'dark'` and a matching background, and can set a raw width (`'1200px': { viewport: 1200 }`). — [Chromatic Modes](https://www.chromatic.com/docs/modes/)
- Modes can be set at project (`preview.ts`), component and story level. They stack rather than replace each other. To exclude an inherited mode, set `disable: true`. — [Chromatic Modes](https://www.chromatic.com/docs/modes/)
- Baselines are keyed by the mode's name, not its values. Changing a mode's globals keeps the baseline; renaming the mode creates a new one. Each mode is a separate test: 2 stories x 2 modes = 4 tests/snapshots. — [Chromatic Modes](https://www.chromatic.com/docs/modes/)

**Playwright**
- Emulation options can be set under `use` in config, per test with `test.use`, per context, or per page with `page.emulateMedia(...)`:
  - `colorScheme: 'light' | 'dark' | 'no-preference'`
  - `reducedMotion: 'reduce' | 'no-preference'`
  - `forcedColors: 'active' | 'none'`
  - `contrast: 'more' | 'no-preference'` (emulates `prefers-contrast`)
  
  Example: `await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active', contrast: 'more' })`. — [Playwright Emulation](https://playwright.dev/docs/emulation)
- `toHaveScreenshot` defaults: `animations: "disabled"`, `caret: "hide"`, `scale: "css"`, `threshold: 0.2` (per-pixel YIQ tolerance from 0 to 1), `maskColor: "#FF00FF"`, `fullPage: false`. `maxDiffPixels` and `maxDiffPixelRatio` default through `TestConfig.expect`. `mask` takes locators, and `stylePath` injects CSS to hide volatile content. — [Playwright PageAssertions API](https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1)
- Baseline file names include browser and platform (e.g. `example-test-1-chromium-darwin.png`). In multi-project configs the project name replaces the browser name, so a project per theme (`chromium-dark`, `chromium-forced-colors`) gives each theme its own baseline. Rendering varies with "host OS, version, settings, hardware, power source … headless mode", so generate and compare in the same environment (in practice, the CI Docker image). — [Playwright Visual comparisons](https://playwright.dev/docs/test-snapshots)
- Ways to reduce flakiness: move the mouse away (`page.mouse.move(-1,-1)`) so no hover state is captured; hide dynamic content with `stylePath`; set shared `threshold`/`maxDiffPixels` defaults in config; commit `-snapshots` directories and review them in PRs; update baselines with `npx playwright test --update-snapshots`. — [Playwright Visual comparisons](https://playwright.dev/docs/test-snapshots)

**Vendor landscape (late 2026)**
- Lost Pixel: the team announced on 22 April 2026 that it is joining Figma and sunsetting the product. The repository is archived and there is no migration guide. — [Argos: Lost Pixel alternatives](https://argos-ci.com/blog/lost-pixel-alternatives) (vendor source, a competitor)
- Argos is open source and works with existing Playwright/Storybook screenshots. It is free up to 5,000 screenshots per month, then $100/month with 35,000 included (as of July 2026). One comparison says self-hosting is not supported. — [Argos comparison](https://argos-ci.com/blog/percy-vs-chromatic-vs-argos) (vendor); [Cloudzy comparison](https://cloudzy.com/th/blog/argos-vs-lost-pixel-vs-backstopjs-compared/)
- According to an Argos comparison (prices checked October 2026), Percy's overage per screenshot (~$0.036) is about 9 times Argos's. I found no news of Percy being shut down. — [Argos: Percy vs Chromatic vs Argos](https://argos-ci.com/blog/percy-vs-chromatic-vs-argos) (vendor; biased)
- Chromatic is the usual choice for Storybook-first teams. BackstopJS is the self-hosted alternative. — [Argos: best visual regression tools 2026](https://argos-ci.com/blog/best-visual-regression-testing-tools) (vendor)

### Inferences
- Snapshot cost grows as stories x modes, so a 300-story library with 9 Primer-style themes x 2 viewports is about 5,400 snapshots per build. Practical approaches: (a) run every theme only on "all-states" grid stories and foundation stories, and run only default light and dark on composite/page stories; (b) put CVD/HC themes on a nightly or main-branch run.
- Playwright recipe: create `projects` such as `{name:'light', use:{colorScheme:'light'}}`, `{name:'dark', use:{colorScheme:'dark'}}`, `{name:'hc', use:{colorScheme:'dark', contrast:'more'}}` and `{name:'forced', use:{forcedColors:'active'}}`, plus `reducedMotion:'reduce'` in the shared `use`. If the app themes by attribute rather than by media query, set `data-theme` in a fixture (or through `addInitScript` writing localStorage) as well.
- Common flake sources and fixes: web fonts not loaded (await `document.fonts.ready` before capture); CSS transitions on theme switch (disabled by `animations: 'disabled'`, or add a `* { transition: none !important }` stylePath); timestamps, avatars and charts (`mask`); OS font rendering (run in pinned Docker).

### Gaps
- I did not fetch exact Chromatic per-snapshot pricing, TurboSnap behaviour with modes, or Chromatic's diff threshold/anti-aliasing settings.
- Percy's current per-theme browser/mode configuration (e.g. `percyCSS`, multiple widths) was not verified.

## 3. Automated audits: contrast matrices, axe per theme, token linting

### Takeaway
GitHub's Primer shows the reference approach. Declare foreground/background pairs with a required ratio for each, compute every pair in every theme (after flattening alpha against the background) in a script that runs in seconds, and gate PRs on it with a GitHub Action. Also run axe at the rendered-story level in every theme (it cannot see backgrounds that are images or gradients). Lint so that only tokens can be used for color (stylelint strict-value, Atlassian's ESLint rules, Mozilla's use-design-tokens).

### Cited Findings
**Token-pair contrast matrix (Primer)**
- Primer audited primitives across every theme, which came to "hundreds of variations". They defined 100+ foreground/background pairs with a required ratio for each (e.g. 4.5:1 for text on backgrounds, 3:1 for links vs. secondary text). They change tokens in code and run a script that checks every pair in every theme and prints a CLI table of ratio, minimum and pass/fail. It runs in seconds. — [GitHub Blog: Primer color system inclusive](https://github.blog/engineering/user-experience/unlocking-inclusive-design-how-primers-color-system-is-making-github-com-more-inclusive/)
- For semi-transparent tokens, the script first blends the color against the page background to get a solid color, then checks the pair. — same source
- The script runs as a GitHub Action on every Primer PR to catch contrast regressions before release. Hundreds of contrast issues were fixed across more than 1,000 use cases. Because colors are shared between pairs, fixing one pair can break another, which is why the full table is checked every time. — same source
- The primer/primitives README shows an a11y-contrast workflow badge. A PR mentions the script name `validate:contrast` (docs had referred to a non-existent `check:contrast`), so the script name varies by version. — [@primer/primitives README](https://cdn.jsdelivr.net/npm/@primer/primitives@11.9.0/README.md); search summary of primer/primitives PR #1361 (unverified)

**axe-core per theme**
- axe `color-contrast` checks all text against the background behind it at WCAG 2 AA: 4.5:1 for normal text, 3:1 for large text (≥24px, or ≥18.66px/14pt bold). It does not report text with a `background-image`, images of text, or obscured text. 1:1 pairs are returned as "incomplete" for manual review. Gradients, pseudo-element backgrounds and foreground transparency are listed as hard to detect. — [Deque: color-contrast rule](https://dequeuniversity.com/rules/axe/4.10/color-contrast)
- Storybook `addon-a11y` runs axe-core with Violations, Passes and Incomplete tabs, and `addon-vitest` runs those checks with component tests. `parameters.a11y.test` is `'off' | 'todo' | 'error'`, and CI only fails when it is `'error'`. Default rulesets are WCAG 2.0/2.1 A and AA plus best practices. To add AAA (`wcag2aaa`, i.e. color-contrast-enhanced at 7:1), re-list the defaults in `runOnly`. The `region` rule is off by default. Recommended rollout: set `'error'` globally, mark known-failing stories `'todo'`, and fix them starting from foundation components like Button. — [Storybook Accessibility testing](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- Storybook's docs do not describe running a11y per theme. — same source

**Token linting / no hard-coded colors**
- `stylelint-declaration-strict-value` (rule `scale-unlimited/declaration-strict-value`) requires variables, functions or allowed keywords for chosen properties. A regex like `/color$/` covers every color property. `ignoreValues` allows `transparent`, `inherit` and `currentColor`, and raw hex such as `#FFF` is flagged. Latest version is v1.11.x. — [npm: stylelint-declaration-strict-value](https://npmjs.com/package/stylelint-declaration-strict-value); [README](https://unpkg.com/stylelint-declaration-strict-value@1.11.1/README.md)
- Mozilla's `stylelint-plugin-mozilla` has rules `use-design-tokens` (color), `use-text-color-tokens`, `use-background-color-tokens` and `use-border-color-tokens`. These enforce token variables per property family. — [Firefox source docs: use-design-tokens/color](https://firefox-source-docs.mozilla.org/code-quality/lint/linters/stylelint-plugin-mozilla/rules/use-design-tokens/color.html); [use-text-color-tokens](https://firefox-source-docs.mozilla.org/code-quality/lint/linters/stylelint-plugin-mozilla/rules/use-text-color-tokens.html)
- Atlassian's `@atlaskit/eslint-plugin-design-system` has `ensure-design-token-usage`, which can be scoped by domain (color, spacing) and has a `shouldEnforceFallbacks` option. Guidance: during migration, call `token()` without fallbacks. After migration, enable `no-unsafe-design-token-usage` with `fallbackUsage: 'none'` so no new fallbacks appear. There is also `@atlaskit/stylelint-design-system`. — [Atlassian ESLint: ensure-design-token-usage](https://atlassian.design/components/eslint-plugin-design-system/ensure-design-token-usage); [no-unsafe-design-token-usage](https://atlassian.design/components/eslint-plugin-design-system/no-unsafe-design-token-usage); [Use tokens in code](https://atlassian.design/tokens/use-tokens-in-code)
- Slack verified its dark-mode refactor by diffing webpack's generated CSS before and after the change, so it would not introduce regressions. They also audited features for one-off styles that bypassed the core color variables. The shared Slack Kit library covered "about 90%" of the work. — [Slack Engineering: Building Dark Mode on Desktop](https://slack.engineering/building-dark-mode-on-desktop/)

### Inferences
- A complete audit pipeline:
  1. Token-level pair matrix (every declared pair x every theme, alpha flattened). WCAG 2 ratio as the gate, with APCA Lc reported as advisory if desired.
  2. Story-level axe in every theme mode (run the Storybook test-runner or Vitest once per theme global, or call `@axe-core/playwright` inside each Playwright theme project).
  3. Lint: no raw color literals outside token source files, covering CSS, CSS-in-JS and SVG `fill`/`stroke` attributes in JSX.
  4. Token usage report: grep the build output for every `var(--token)` reference and diff it against the token list. That gives unused tokens (defined, never referenced) and missing tokens (referenced, undefined in some theme). For the missing case, compare the set of keys in each theme file; every theme must define the same set.
- axe "incomplete" results are where theme bugs hide (gradients, image backgrounds, overlays). Send them to manual review rather than ignoring them.

### Gaps
- I did not fetch primary APCA documentation (e.g. apca-w3 / Myndex) or WCAG 3 draft status. Treat APCA as advisory, not a compliance gate, but that framing is not verified here.
- I found no off-the-shelf "unused/missing token" detector beyond custom scripts. Style Dictionary-based checks were not verified.
- Atlassian ESLint plugin versions conflict between sources (npm shows 10.x, unpkg 16.13.x). Check the current docs before pinning.

## 4. Common theme bugs

### Takeaway
The bugs that come up again and again are: colors that never went through tokens (third-party widgets, inline SVG, illustrations, charts, syntax highlighting), elevation that relied on shadows, focus rings drawn with box-shadow or removed with `outline:none` (they disappear in forced-colors), a missing `color-scheme` (light scrollbars and form controls in dark mode), and a flash of the wrong theme from SSR/static HTML. Most of the evidence is practitioner writing, but the `color-scheme`, FOUC and forced-colors behaviours come from primary sources.

### Cited Findings
**`color-scheme` not set**
- `color-scheme` (CSS property or `<meta name="color-scheme">`) opts the page into the UA's theme-specific form controls, scrollbars and CSS system colors. On `:root` it also sets the canvas background and initial text color. Values are `normal` or an ordered list of `light`/`dark`. — [web.dev: color-scheme](https://web.dev/articles/color-scheme)
- The meta tag lets the browser paint the canvas in the right scheme before the CSS is downloaded and parsed, which avoids a white flash. The CSS property has the same effect but applies later. — same source
- Default UA colors can fail contrast: WebKit's `-webkit-link` blue is only 2.23:1 on black. — same source

**Flash of wrong theme (SSR/SSG)**
- Pre-rendered HTML cannot know the stored or OS preference, so the default theme shows briefly before hydration. Fix: a blocking inline script in `<head>`, before the content, reads localStorage and `matchMedia('(prefers-color-scheme: dark)')` and sets CSS variables or the theme attribute before first paint. Supply a default `<style>` for no-JS visitors. — [Josh Comeau: The Quest for the Perfect Dark Mode](https://www.joshwcomeau.com/react/dark-mode/)
- Related gotchas: the theme toggle renders wrong on the server (render nothing until mount); initial React state must match the SSR output; the toggle must update state, localStorage and CSS variables together; the inline script cannot import token modules, so generate it from the tokens to avoid drift. — same source
- Atlassian: apps that used DS components without migrating their own CSS rendered in "an incomplete mix of light and dark themes" after tokens 1.0. This is the mixed-theme bug class. — [Atlassian community: tokens 1.0.0 changes](https://community.developer.atlassian.com/t/upcoming-changes-in-design-tokens-1-0-0-action-required-soon-edit-now-live/66243)

**Forced-colors / Windows contrast themes**
- Focus becomes invisible in Windows HCM when stylesheets set `outline: none`. — [Mozilla Bug 1893730](https://bugzilla.mozilla.org/show_bug.cgi?id=1893730)
- Focus rings drawn with `box-shadow` lose their color in forced-colors. Use `outline` (kept by the browser) or a `@media (forced-colors: active)` fallback that uses system colors (CanvasText, Canvas, LinkText, Highlight). — [Tempertemper: WHCM and focus outlines](https://www.tempertemper.net/blog/windows-high-contrast-mode-and-focus-outlines); [WWU forced colors guide](https://marcom.wwu.edu/accessibility/guide/support-forced-colors)
- Use `border: <width> solid transparent` in base styles so a component's shape still shows in forced-colors when its background is removed. — [WWU forced colors guide](https://marcom.wwu.edu/accessibility/guide/support-forced-colors)
- GOV.UK Frontend changed radio/checkbox focus to use the `Highlight` system color so it matches native controls. — [alphagov/govuk-frontend PR #2264](https://github.com/alphagov/govuk-frontend/pull/2264)
- Gradients collapse to flat colors or vanish, and icons/SVGs can become invisible. These bugs appear only on Windows, not with macOS/Linux increased-contrast settings, so test on Windows or with Playwright `forcedColors: 'active'`. — [designsystemproblems: Forced Colors Mode](https://designsystemproblems.pages.dev/accessibility-compliance/forced-colors-mode) (practitioner); [WWU guide](https://marcom.wwu.edu/accessibility/guide/support-forced-colors)

**Shadows, images, SVG, charts, syntax highlighting (practitioner consensus)**
- Shadows mostly disappear on dark surfaces. Show elevation with lighter surface tones or subtle light borders (e.g. `1px solid rgba(255,255,255,0.08)`). — [Ekolsoft dark mode guide](https://ekolsoft.com/en/b/dark-mode-design-best-practices-guide?format=llm); [Codercops 2026 guide](https://blog.codercops.com/blog/dark-mode-implementation-guide-2026)
- Logos and icons designed for white backgrounds lose their edges on dark. Inline SVGs should use `currentColor` for fill/stroke. For diagrams, two versions (one per mode) worked better than dynamic CSS variables. — [Bellog: dark mode traps](https://bellog.vercel.app/en/posts/dark-mode-implementation-traps); [dev.to: dark mode turned into a refactor](https://dev.to/marshateo/i-thought-dark-mode-was-a-30-minute-task-it-turned-into-a-full-refactor-5bk5)
- Chart axis labels become low contrast and chart palettes need re-checking on dark backgrounds. Status colors (red/green/yellow) can fail on dark, so pair them with icons or labels. — [dev.to: dark mode forced fixes](https://dev.to/howard_shaw_3c36a3a6cb900/i-finally-added-dark-mode-and-it-forced-me-to-fix-more-than-colors-2n84); [Codercops](https://blog.codercops.com/blog/dark-mode-implementation-guide-2026)
- Syntax highlighting: light code themes become unreadable in dark mode and dark ones look washed out in light. Ship paired light/dark themes (e.g. Shiki dual themes switched by CSS variables). — [Codercops](https://blog.codercops.com/blog/dark-mode-implementation-guide-2026)
- Third-party widgets need to stay in sync with the theme, and the theme should follow live changes to the system setting. — [Codercops](https://blog.codercops.com/blog/dark-mode-implementation-guide-2026)
- Slack stored color variables as RGB triplets (`26, 29, 33` rather than `#1a1d21`) so that LESS could apply alpha at runtime to colors backed by CSS variables. This shows how translucent overlays break when a theme's tokens are opaque hex. — [Slack Engineering](https://slack.engineering/building-dark-mode-on-desktop/)

### Inferences
- Theme-bug checklist (for PR review and QA):
  - [ ] `<meta name="color-scheme" content="light dark">` and `:root{color-scheme: …}` set for each theme, including dark HC variants. Check scrollbars, `<select>`, date pickers and autofill.
  - [ ] Blocking head script sets the theme attribute before paint. Test a cold load with throttling in both stored preferences and with JS disabled.
  - [ ] No raw colors (lint passes), including SVG `fill`/`stroke`, canvas/chart configs, inline styles in JS, and third-party CSS overrides (date pickers, rich-text editors, maps, embeds, Stripe/iframes).
  - [ ] Elevation is visible in dark (surface steps or borders, not only shadows). Overlays, scrims and backdrops are tokenized per theme.
  - [ ] Focus-visible is visible in every theme and in forced-colors (outline-based, not box-shadow only).
  - [ ] Forced-colors: borders present on buttons, inputs and cards; icons use `currentColor`; selected/checked states don't rely on background color alone.
  - [ ] Images: transparent PNG logos have dark variants (`<picture>` with `prefers-color-scheme`, or theme-aware src); illustrations reviewed; user content images get no filter.
  - [ ] Charts, sparklines, maps and code highlighting each have a dark palette and pass contrast against the dark surface.
  - [ ] `::selection`, `caret-color`, `accent-color`, placeholder text and disabled states are checked in each theme.
  - [ ] Emails, PDF/print exports and OG images either force light or are explicitly themed (`@media print` resets to light).

### Gaps
- I found no primary sources on emails/PDF exports and themes, or on `::selection`/`caret-color` bugs specifically. Those checklist items come from general knowledge and are not cited.
- I did not fetch Linear's engineering blog on theming (its LCH-based theme generator).

## 5. Rollout practice: betas, switcher UX, feedback, token deprecation

### Takeaway
Mature teams ship themes in stages: feature flag, then internal/staff dogfooding while collecting feedback, then a public "feature preview" or opt-in, then GA. They offer a switcher with "single theme" vs "sync with system" and a separate day theme and night theme. Token migrations go through lint-enforced stages, and incompletely migrated apps are the main source of mixed-theme bugs.

### Cited Findings
- Primer contrast changes went out behind a feature flag. The team observed colleagues using the flag in user interviews, then turned it on for all staff and monitored feedback for a few weeks, then documented guidelines. Scope was limited to accessibility fixes, and brand-affecting changes were tracked separately. — [GitHub Blog: Primer color system](https://github.blog/engineering/user-experience/unlocking-inclusive-design-how-primers-color-system-is-making-github-com-more-inclusive/)
- GitHub's Appearance settings offer "Theme mode": a single theme, or sync with system, in which case the user picks one day theme and one night theme. Options include light, dark, high-contrast and colorblind themes. Some themes are in public preview and must be enabled through Feature preview first. The theme can also be switched from the command palette. — [GitHub Docs: Managing your theme settings](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-personal-account-settings/managing-your-theme-settings)
- Primer Prism took feedback through GitHub issues and discussions on its repo. — [GitHub Blog: color tooling](https://github.blog/news-insights/product-news/accelerating-github-theme-creation-with-color-tooling/)
- Atlassian switches themes with `data-color-mode` (`light | dark | auto`), and `setGlobalTheme({ colorMode: 'auto' })` follows the OS. Developers were invited to "try dark theme in Jira Cloud" before GA, which was targeted for Q2 2023. Tokens 1.0.0 was a breaking change ("action required") with deprecations; unmigrated apps showed mixed light/dark themes. — [Atlassian community: try dark theme](https://community.developer.atlassian.com/t/start-using-design-tokens-in-your-apps-and-try-dark-theme-in-jira-cloud/64147/5); [Introducing design tokens & dark mode](https://community.developer.atlassian.com/t/introducing-design-tokens-new-colour-foundations-and-dark-mode/62258); [Tokens 1.0.0 changes](https://community.developer.atlassian.com/t/upcoming-changes-in-design-tokens-1-0-0-action-required-soon-edit-now-live/66243)
- Atlassian deprecation path: lint `ensure-design-token-usage` during migration, then `no-unsafe-design-token-usage` with `fallbackUsage: 'none'` once migration is done. — [Atlassian ESLint docs](https://atlassian.design/components/eslint-plugin-design-system/no-unsafe-design-token-usage)
- Slack desktop dark mode (September 2019) was device-specific and needed a minimum app version (4.0.3 Mac, 4.0.2 Windows/Linux). Swapping the theme was a body class (`.sk-client-theme--dark`) that redefined all variables, set by the root React component. — [Slack blog: Dark mode comes to desktop](https://slack.com/blog/productivity/dark-mode-for-slack-desktop); [Slack Engineering](https://slack.engineering/building-dark-mode-on-desktop/)

### Inferences
- Rollout checklist:
  1. Token PRs gated by the pair-contrast script, lint and visual snapshots in every theme.
  2. Ship the new theme behind a flag; staff dogfood for 2–4 weeks with a feedback channel (issue template or in-product link).
  3. Public opt-in ("feature preview" or beta label).
  4. GA, with the default set to "sync with system".
- Switcher UX: offer System / Light / Dark, plus HC and CVD as separate choices or as day/night pairs. Persist server-side for signed-in users and in localStorage/cookie for SSR, so the head script can avoid a flash. Make the switch reachable from the command palette or menu.
- Token deprecation: mark tokens deprecated in source metadata, warn through lint, codemod the renames, then remove in a major version. Diff each theme's token key set so no theme loses a token another still defines.
- Telemetry: record which theme is selected (system vs explicit, and which variant) to decide where to put QA effort. No source I fetched publishes such numbers.

### Gaps
- I found no public telemetry figures on theme adoption (e.g. % dark-mode users) from GitHub, Slack or Atlassian.
- I found no primary source on Linear's or Polaris's rollout practice for themes.
