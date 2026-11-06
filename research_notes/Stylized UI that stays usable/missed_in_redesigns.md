# What Reskins and Redesigns Routinely Miss (and How to Check)

Scope: what gets dropped or broken when an app is redesigned, re-themed or reskinned (for example, copying a "cyberpunk" look onto an existing product), why it matters, how to QA it, and real case studies. Research date: Nov 2026. Sources are a mix of standards (W3C/WAI), NN/g, browser-vendor docs, tech press, and practitioner blogs. Each source's weight is noted where it matters.

---

## 1. Which states get dropped in reskins?

### Takeaway
Reskins usually restyle only the "happy path" default state. Hover, focus, active, disabled, loading, empty, error, success and selected states are what get forgotten. Practitioners handle this with a per-component state matrix, plus testing under real conditions: an empty account, a slow network, a forced failure, and the longest string.

### Cited Findings
- Design-systems practitioners report that designers typically build only the happy path. Hover, click, keyboard focus, loading wait, errors and empty states are the commonly missed ones. They recommend a dedicated Figma "States" page with one row per state category, with Disabled, Read-only and Loading grouped as "special states". — [Design Systems Collective, "The State Problem"](https://www.designsystemscollective.com/the-state-problem-how-to-design-and-build-components-that-change-3a0e49e8a0a0)
- An 8-state minimum for any interactive component: Default, Hover, Focus, Active, Disabled, Loading, Error, Success. The same checklist forbids border-width or box-sizing changes between states, to avoid layout shift. It also requires focus rings of at least 2px with at least 3:1 contrast, `aria-disabled`, `aria-invalid` on error, and `aria-busy` on loading containers. (Practitioner/open-source guide, not a standard.) — [Hallmark 8-state checklist](https://instagit.com/Nutlope/hallmark/hallmark-8-state-checklist-interactive-components/)
- A government accessibility guide gives a component-by-state matrix:
  - Buttons: hover, focus, active, disabled.
  - Text inputs: hover, focus, disabled, error (no active).
  - Checkboxes and radios: the full set plus selected.
  - It cites WCAG 2.2 SC 1.4.11 for focus contrast.
  
  — [Texas DIR, Interaction States](https://qat.dir.texas.gov/accessibility/interaction-states/)
- Empty states should explain why there is no content and point to the next action, not just show a blank area. — [Framer glossary: State](https://www.framer.com/dictionary/state)
- Test states with real conditions: an empty account, a slow network, a forced failure, and the longest possible string. — [design-the-states skill (practitioner)](https://claudskills.com/skills/design-the-states/SKILL.md)

### Inferences
- Use a concrete "state inventory" for a reskin QA, crossing components against states:
  - **Interaction:** default / hover / focus-visible / active (pressed) / disabled / read-only.
  - **Selection:** selected / indeterminate / current-page (`aria-current`).
  - **Validation:** invalid / warning / success.
  - **Async:** loading (skeleton vs spinner) / partial / stale / offline / retrying.
  - **Content:** empty-first-run / empty-filtered / empty-error / overflow (long text, many items) / very large data (virtualized lists, 10k rows).
  - **Drag and drop:** drag source / drop target / invalid drop.
- Stylized themes (neon, glow, glitch) tend to over-design default and hover and under-design disabled and error. Disabled usually becomes "low-opacity neon", which can be indistinguishable from the enabled state on a dark background.
- Layout shift between states is a common reskin regression. Typical causes are adding a border on hover or focus, bolding text on selection, or swapping fonts with different metrics.

### Gaps
- I found no peer-reviewed study quantifying which states are most often dropped. The evidence is practitioner consensus only.
- I did not find authoritative sources specific to drag/drop or offline states in reskins. These are listed from best practice, not from cited research.

---

## 2. Theming-specific failures (contrast, color-only meaning, glow/blur, focus rings, forced colors, motion and transparency preferences, token architecture)

### Takeaway
The highest-risk theming failures are:
- focus indicators that disappear, because they rely on `box-shadow` (which forced-colors mode strips) or have too little contrast against busy, glowing backgrounds;
- sticky or translucent chrome that covers focused elements;
- unvetted neon-on-black contrast and halation;
- hard-coded colors that bypass semantic tokens, so the theme only applies "mostly";
- ignoring `prefers-reduced-motion`, plus `prefers-reduced-transparency` where it is supported.

### Cited Findings
**Focus visibility (WCAG 2.2)**
- WCAG 2.2 AA has three focus-related criteria: 2.4.7 Focus Visible, 1.4.11 Non-text Contrast (3:1 against adjacent colors), and 2.4.11 Focus Not Obscured (Minimum). The size and appearance rules moved to 2.4.13 Focus Appearance, which is AAA. Several vendor pages still mislabel 2.4.11 as "Focus Appearance" from a draft, so check against W3C text. — [Level Access](https://www.levelaccess.com/blog/focus-indicators-wcag-requirements-and-best-practices/); draft-era confusion noted in [Hidde de Vries](https://hidde.blog/focus-appearance-too-complex/)
- 2.4.11 (AA) requires that a focused component is not entirely hidden by author-created content. Sticky headers and footers, cookie banners and non-modal dialogs are the classic failures. Fixes include CSS scroll padding and closing notifications on focus loss. W3C notes that semi-transparent or blurring overlays may not fully hide focus, but they can still fail 1.4.11 if the indicator becomes hard to see. This applies directly to frosted-glass and neon HUD chrome. — [W3C Understanding 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)

**Forced colors / Windows High Contrast**
- Forced-colors mode sets `box-shadow` to none, so a focus ring drawn only with box-shadow vanishes. WordPress admin hit exactly this. The recommended pattern:
  - Never remove the `outline`. Set `outline-color: transparent` in normal mode, then layer the decorative box-shadow ring on top.
  - Or, under `@media (forced-colors: active)`, set `box-shadow: none` and use `outline: 2px solid` with a system color such as `LinkText`.
  
  — [Cssence: Forced Colors Mode strategies](https://cssence.com/2024/forced-colors-mode-strategies); [WordPress Trac #41286](https://lists.wordpress.org/pipermail/wp-trac/2017-July/334746.html); [Piccalilli: transparent borders/outlines](https://www.piccalil.li/blog/use-transparent-borders-and-outlines-to-assist-with-high-contrast-mode); [tempertemper](https://tempertemper.net/blog/windows-high-contrast-mode-and-focus-outlines); [Craft CMS](https://craftcms.com/blog/custom-focus-indicators-with-css-variables)
- Transparent borders and outlines become visible in forced-colors mode. That is why a transparent border on buttons and cards keeps component boundaries visible when backgrounds and shadows are stripped. — [Piccalilli](https://www.piccalil.li/blog/use-transparent-borders-and-outlines-to-assist-with-high-contrast-mode)

**Reduced motion / reduced transparency**
- `prefers-reduced-motion` is broadly supported: Chrome 74+, Firefox 63+, Safari 10.1+, Edge 79+. — [codelucky guide (secondary)](https://codelucky.com/css-prefers-reduced-motion/)
- `prefers-reduced-transparency` shipped in Chrome/Edge 118 (Media Queries Level 5). At the time of those docs, Firefox had it behind a flag and Safari had no support. MDN marks it as not Baseline. One 2026 secondary source claims "good support in Safari and Chrome"; this is unverified and conflicts with MDN. — [Chrome for Developers](https://developer.chrome.com/blog/css-prefers-reduced-transparency); [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency); conflicting: [UI/UX Atlas](https://uiux-atlas.pages.dev/lessons/responsive/user-preference-media-features)

**Dark and neon contrast**
- Light text on very dark backgrounds can cause "halation" (glow or bleed at letter edges), which is reported as worse for people with astigmatism; prevalence is cited at roughly 30–33%. Pure white on pure black (21:1) is described as harsh for extended reading. The common mitigation is dark gray backgrounds (about RGB 30–40) with off-white text (about RGB 220). These sources are blogs and newsletters, not controlled studies, and some sources disagree. — [a11y with Diana](https://a11ywithdiana.substack.com/p/and); [bushe.co](https://bushe.co/blog/dark-mode-hurts-eyes-how-to-fix/)

**Theme token architecture**
- Primitive tokens are the raw palette and should not be used directly in components. Semantic tokens map palette values to UI roles. A dark or alternate theme then only changes semantic token values, and components remain unchanged. Teams adopting tokens must replace hard-coded hex values and pixel sizes in components with token variables. (Practitioner and vendor sources, not a standard.) — [Verpex: Design Tokens](https://verpex.com/blog/design-tokens-the-foundation-of-scalable-and-consistent-design-systems); [Incode tokens reference (light/dark)](https://developer.incode.com/docs/tokens-reference)

### Inferences
- Glow is not an indicator. A text-shadow or box-shadow glow does not reliably reach 3:1 against the adjacent colors (1.4.11), and forced-colors mode removes it entirely. A stylized focus ring should be a real `outline`, which can be decorated with glow on top.
- Neon-on-black palettes often pass 4.5:1 for primary text but fail for the "secondary" dim neon used in captions, placeholders, disabled text and chart gridlines. Audit every text-role token, not just the body color.
- Never convey meaning by color alone, for example red/green neon status. Pair it with an icon, text, or a pattern (WCAG 1.4.1; I did not refetch it this session, but it is a well-known criterion).
- Reskins that grep-replace colors miss the long tail: inline SVG fills, canvas and chart libraries, third-party widgets, email templates, favicon/OG images, and `color-scheme`/scrollbar/form-control native styling. A "token coverage" audit (searching for raw hex/rgb literals outside the token file) is a cheap, high-yield check.
- Scanline overlays, noise textures and blur backdrops behind text all reduce effective contrast, and contrast checkers cannot measure them automatically. They need manual or screenshot-based checks.

### Gaps
- I did not fetch WCAG 2.4.13's exact text this session. The details (2px perimeter, 3:1 change-of-contrast) come from secondary sources that conflict on 1px vs 2px, so verify against W3C.
- There is no rigorous study on readability of glow or neon text specifically.
- The APCA / WCAG 3 contrast model was not researched here. It may matter for dark themes, where WCAG 2's ratio is known to be less accurate.

---

## 3. Interaction "feel" lost in reskins

### Takeaway
A visual reskin can preserve layout and still lose the affordances that tell users what is clickable and what just happened. NN/g's eyetracking work found weak or absent signifiers slowed people down by about 22%. Transitions, press feedback, focus management and keyboard paths are frequently lost when components are rebuilt to look different.

### Cited Findings
- In NN/g's eyetracking study, pages with weak clickability signifiers (links styled like plain text, ghost buttons) took about 22% longer than strong-signifier versions. They drew more fixations and a broader gaze spread, and the reverse pattern was never seen. NN/g notes it did not measure misclicks, and that "flat design isn't the enemy — weak or absent signifiers are." — [NN/g: Flat UI Elements Attract Less Attention and Cause Uncertainty](https://nngroup.com/articles/flat-ui-less-attention-cause-uncertainty); [NN/g video](https://www.nngroup.com/videos/flat-ui-elements-lack-clickability-clues-and-cause-confusion/)
- The negative effect of weak signifiers was smaller on low-density pages with consistent, traditional layouts. — [i-programmer summary (secondary)](https://www.i-programmer.info/news/146-ui-ux/11106-flat-ui-is-slower.html)
- Properly built modal dialogs pass 2.4.11 because they take focus. Persistent user-opened panels (for example, chat windows) need an Escape route so focus is not trapped behind them. — [W3C Understanding 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- Skype's 2017 redesign made calling, the core task, "harder to execute," according to Microsoft's director of design. The 2018 rollback reduced navigation to three explicit buttons (Chats, Calls, Contacts). — [TechCrunch](https://techcrunch.com/2018/09/03/skype-rolls-back-its-redesign-by-ditching-stories-squiggles-and-over-the-top-color)
- In Nielsen's 12-user Windows 8 test, hidden gesture-invoked UI (Charms) failed because "users often forgot to summon them, even when they needed them." — [Computerworld](https://www.computerworld.com/article/1488168/interface-design-guru-windows-8-is-weak-on-tablets-terrible-for-pcs.html); [Computing](https://www.computing.co.uk/news/2226006/ui-guru-jakob-nielsen-slams-windows-8-interface-following-user-testing)

### Inferences
Checks for "feel" parity:
- Every clickable element still has a strong signifier in the new skin.
- A pressed or active state appears within about 100ms. This is a common heuristic and was not sourced this session.
- Hover intent delays on menus are preserved.
- State transitions animate opacity or transform only, and respect reduced motion.
- No layout jump when loading content replaces skeletons.
- Scroll position, scroll restoration and `scroll-padding` (for sticky headers) are preserved.
- Modals and drawers trap focus, restore it to the trigger on close, and close on Escape.
- Keyboard shortcuts and access keys still work and are still discoverable.
- Sound and haptics are opt-in and respect system settings.

"Theatrical" themes, such as cyberpunk glitch or typing-out text effects, risk delaying feedback and content. Effects should never gate interaction or readability.

### Gaps
- I found no authoritative source quantifying the cost of missing transitions or press feedback in reskins specifically.
- Sound and haptics guidance was not researched in this pass.

---

## 4. Content and system aspects (responsive, i18n/RTL, typography with display fonts, icons, z-index, effect performance)

### Takeaway
Stylized themes often adopt display or monospace fonts, fixed-width "panels", and heavy GPU effects. Those choices break under:
- text expansion, where short labels can grow 200–300% in translation;
- small-size legibility, as iOS 7's thin type showed;
- low-end hardware, where `backdrop-filter` and large blurs cause jank.

### Cited Findings
**Text expansion and i18n**
- W3C i18n, citing IBM guidelines: translated text length differs systematically, and short source strings expand the most. Strings of up to 10 characters can expand 200–300%. Recommendation: avoid small fixed-width containers and let text reflow. — [W3C: Text size in translation](https://www.w3.org/International/articles/article-text-size/index.en)
- A secondary checklist claims German and Dutch run about 30% longer than English, and Finnish and Hungarian about 50%. It recommends pseudo-localization and `min-inline-size` instead of fixed `inline-size`. I could not confirm these percentages in the W3C article. — [Front-End Checklist: text expansion](https://frontendchecklist.io/rules/i18n/text-expansion); [ServiceTitan Anvil: international design](https://anvil.servicetitan.com/foundations/international-design/)

**Thin and stylized type at small sizes**
- At iOS 7 (2013), type designer Thomas Phinney called the preview typography "horrible": low contrast plus light-weight Helvetica was "trending illegible." Commenters noted thin weights read well large but poorly small. Apple's accessibility workaround was settings like "Bold Text"/"Enhance legibility". Claims that Apple thickened weights in later betas and iOS 8 are anecdotal. — [Stockholms Typografiska Gille: Beyond Helvetica](https://stockholmstypografiskagille.se/typonyheter/beyond-helvetica-the-real-story-behind-fonts-in-ios-7/); [MacPerformanceGuide](https://MacPerformanceGuide.com/blog/2013/20130923_2-Apple-iOS7-dynamic-type.html)

**Effect performance**
- `backdrop-filter` requires the compositor to re-sample and re-blur everything behind the element whenever it or its backdrop changes. Cost scales with blur radius and element size.
- A Mozilla bug documented stutter on older Adreno and Mali GPUs (Galaxy S5, Nexus 5) that disappeared when the property was disabled. Mozilla engineers said the cost was largely unavoidable and their patches still fell short of 60fps. This is the strongest source.
- Common mitigations:
  - cap blur at about 20px;
  - avoid animating blur;
  - provide solid or semi-transparent fallbacks;
  - use a "performance mode" that swaps the live blur for a static tint.
  
  — [Mozilla Bugzilla 1828248](https://bugzilla.mozilla.org/show_bug.cgi?id=1828248); [21st.dev liquid glass](https://21st.dev/blog/liquid-glass-react-components); [devbytes](https://devbytes.co.in/news/how-the-css-backdrop-filter-can-slow-down-your-website); [vvk_ui_kit performance mode](https://pub.dev/documentation/vvk_ui_kit/1.1.0/vvk_ui_kit/UIGlassPerformanceMode.html)

**Icons**
- Nielsen's Windows 8 study found that flat icons were often misunderstood, and that busy live tiles made it hard for users to tell which app each tile represented. — [Computerworld](https://www.computerworld.com/article/1488168/interface-design-guru-windows-8-is-weak-on-tablets-terrible-for-pcs.html)

### Inferences
- **Display and monospace sci-fi fonts:** restrict them to headings, labels and numerals at large sizes. Keep body and small UI text in a highly legible face. Test at the smallest size used (often 11–12px for captions, badges and table cells). For data, use tabular numerals (`font-variant-numeric: tabular-nums`) so numbers don't jitter while updating. Check that 0/O and 1/l/I are distinguishable.
- **Swapping fonts changes metrics** (x-height, line-height, advance width). Truncation, button widths, wrapping and vertical rhythm need re-checking at every breakpoint and with longer translated strings. Test RTL as well: mirrored icons, chevrons, progress direction, and "angled corner" clip-paths that assume LTR.
- **Z-index and layering:** new decorative layers (scanline overlays, noise canvases, glow pseudo-elements, sticky HUD bars) can intercept pointer events, cover focused elements (2.4.11), or sit above toasts and modals. Overlays need `pointer-events: none` and a documented z-index scale.
- **Performance:** stacked large `box-shadow` glows, `filter: blur/drop-shadow`, animated gradients, and full-screen canvas "rain" or particles should be budgeted. Profile on a low-end Android device. Pause animations when off-screen or when the tab is hidden, and degrade under `prefers-reduced-motion` / `prefers-reduced-transparency`.

### Gaps
- No measured cross-device benchmark for `box-shadow`/`filter` costs was found. The evidence is anecdotal plus one browser bug.
- No authoritative source on monospace or sci-fi font legibility at small sizes was found this session.
- Responsive-breakpoint regressions in reskins were not specifically sourced.

---

## 5. Case studies of redesigns that backfired

### Takeaway
The recurring lessons:
- removing or burying core tasks and features hurts more than visual change does;
- forcing all users over at once, without an opt-out or staged rollout, amplifies backlash;
- the long tail of real configurations (old devices, big libraries, custom CSS, accessibility tech) is where redesigns break;
- legibility and signifiers sacrificed for style get walked back later.

### Cited Findings
**Sonos app (May 2024)**
- A full rewrite was shipped, reportedly rushed to coincide with the Sonos Ace headphone launch. Features users relied on went missing, despite Sonos having said functionality would remain. There were bugs testing missed, and slower responsiveness that one analysis attributes to a move to a JavaScript-based cross-platform UI. Replacing SSDP with mDNS reportedly caused speakers to drop off networks.
- Sonos's own words: "our execution – my execution – fell short." CEO Patrick Spence estimated $20–30M in short-term costs and stepped down in January 2025.
- Sonos published seven commitments, including a larger beta team, a quality ombudsman, and a customer advisory board.
- Reported stock and revenue impacts vary by source (a 13% vs 25% stock decline), so verify against filings.

— [LeadDev: What went wrong at Sonos](https://leaddev.com/technical-direction/what-went-wrong-at-sonos); [MacRumors](https://www.macrumors.com/2025/01/13/sonos-ceo-steps-down-after-app-redesign); [Fast Company](https://www.fastcompany.com/91259432/sonos-ceo-steps-down-following-a-disastrous-app-redesign); [TechSpot](https://www.techspot.com/news/104400-sonos-struggles-layoffs-delays-after-disastrous-app-redesign.html)

**Snapchat (2018)**
- The redesign mixed friends' content and publisher content in new places. Snap said it disrupted user behavior and unsettled advertisers. Shares fell about 17% after Q1 disclosure.
- Daily active users fell from 191M to 188M in Q2 2018, Snap's first-ever decline. Spiegel attributed this to lower frequency of use caused by the redesign's disruption, although retention among users over 35 rose more than 8%.
- Snap later scaled back some changes.

— [MacRumors](https://www.macrumors.com/2018/08/07/snapchat-redesign-millions-of-lost-users/); [BBC](https://bbc.in/2w8bnze); [The Drum](https://www.thedrum.com/news/2018/05/02/snapchat-redesign-blamed-march-audience-reversal); [eMarketer](https://www.emarketer.com/content/snapchat-losing-uk-users-as-redesign-takes-toll)

**Digg v4 (Aug 25, 2010)**
- The redesign removed core features: bury, favorites, friend submissions, upcoming pages, history search.
- It shifted the front page toward publishers, which prompted "Quit Digg Day" (Aug 30, 2010) and a migration to Reddit.
- Traffic-loss percentages vary widely across secondary sources (one claims a single-day drop from a 42% to a 13% share). Kevin Rose left, staff were laid off, and Digg was sold in parts in 2012.

— [Know Your Meme: Digg v4](https://knowyourmeme.com/memes/events/digg-v4); [Harvard d3 post](https://d3.harvard.edu/platform-rctom/?p=19363); [dfarq: Digg v4 and lessons not learned](https://dfarq.homeip.net/digg-v4-and-lessons-not-learned/)

**Skype (2017 → 2018 rollback)**
- The June 2017 mobile redesign added Snapchat-like Highlights and heavy color, and app-store ratings "plummeted."
- In September 2018 Microsoft removed Highlights and Capture, cut navigation to Chats/Calls/Contacts, toned down color, and added a "Classic" blue theme.
- Microsoft's director of design said "calling became harder to execute and Highlights didn't resonate."

— [TechCrunch](https://techcrunch.com/2018/09/03/skype-rolls-back-its-redesign-by-ditching-stories-squiggles-and-over-the-top-color); [SiliconANGLE](https://siliconangle.com/2018/09/03/year-release-microsoft-reverts-skypes-controversial-redesign/)

**Windows 8 (2012)**
- Nielsen's study (12 experienced users, PC and Surface RT) called it "weak on tablets, terrible for PCs."
- Problems included dual environments (Start screen vs desktop), hidden Charms, no usable multi-window, busy live tiles, and misunderstood flat icons.
- Microsoft countered that usage data showed users adapting. This is a small qualitative study.

— [Computerworld](https://www.computerworld.com/article/1488168/interface-design-guru-windows-8-is-weak-on-tablets-terrible-for-pcs.html); [MIT Technology Review](https://www.technologyreview.com/2012/12/14/254335/microsoft-has-been-watching-and-it-says-youre-getting-used-to-windows-8/)

**Reddit (2018)**
- The redesign targeted new users, engagement and revenue. Early tests showed new users preferred the card view and old users preferred the classic view.
- Reddit kept old.reddit available.
- The redesign broke communities' custom CSS layouts (e.g., r/CFB), and staff later said new features would mostly go only to the new site.

— [VentureBeat](https://venturebeat.com/business/reddit-ceo-huffman-on-the-sites-redesign-coming-in-q1-2018); [TNW](https://thenextweb.com/news/reddits-designers-and-users-arent-seeing-eye-to-eye-over-sites-new-look); [Fast Company](https://www.fastcompany.com/90166641/3-insights-from-reddits-big-redesign)

**iOS 7 (2013)**
- Ultra-thin Helvetica Neue weights and low-contrast type drew legibility criticism from type professionals.
- Apple added accessibility toggles (Bold Text, Increase Contrast / Reduce Transparency).

— [Stockholms Typografiska Gille](https://stockholmstypografiskagille.se/typonyheter/beyond-helvetica-the-real-story-behind-fonts-in-ios-7/)

### Inferences
These cases point to five lessons:
1. Run a feature-parity audit before shipping (Sonos, Digg).
2. Protect the core task path (Skype calling, Snapchat friend content).
3. Use a staged rollout with an opt-out or "classic" theme (Reddit's old.reddit, Skype's Classic theme).
4. Test the long tail of configurations: big libraries, old devices, customizations and assistive tech (Sonos, Reddit custom CSS).
5. Don't trade legibility or signifiers for style (iOS 7, Windows 8 flat icons).

For a stylized reskin, lesson 3 maps to shipping the stylized theme as optional and user-selectable, alongside a plain or high-contrast theme.

### Gaps
- Sonos accessibility regressions (for example, VoiceOver support and other specific dropped features such as sleep timers and queue editing) were widely reported in press. The LeadDev article I fetched did not cover them, so they are not cited here.
- NN/g has no specific iOS 7 article in my results.
- I found no primary source for Digg traffic figures.

---

## 6. Checklists and frameworks practitioners use to QA a redesign

### Takeaway
Practitioners combine:
- a component × state matrix (inventory);
- accessibility checks (contrast per token, focus visible/not obscured, forced colors, reduced motion/transparency, keyboard-only pass);
- real-condition testing (empty, slow, error, longest string, pseudo-localization);
- staged rollout with beta testing and rollback.

Visual regression snapshots across themes, states and breakpoints catch unintended changes.

### Cited Findings
- **State matrix:** a States page in Figma, organized by category rows. — [Design Systems Collective](https://www.designsystemscollective.com/the-state-problem-how-to-design-and-build-components-that-change-3a0e49e8a0a0); [Texas DIR matrix](https://qat.dir.texas.gov/accessibility/interaction-states/)
- **Per-state checklist:** 8 required states, no layout shift between states, focus ring of at least 2px with at least 3:1 contrast, and ARIA state attributes. — [Hallmark checklist](https://instagit.com/Nutlope/hallmark/hallmark-8-state-checklist-interactive-components/)
- **Test focus with the keyboard in Windows High Contrast / forced colors.** — [Cssence](https://cssence.com/2024/forced-colors-mode-strategies); [tempertemper](https://tempertemper.net/blog/windows-high-contrast-mode-and-focus-outlines)
- **Pseudo-localization:** inflate strings before real translations exist. — [Front-End Checklist](https://frontendchecklist.io/rules/i18n/text-expansion)
- **Release process lessons from Sonos:** wide-scale beta across diverse environments, canary releases, feature flags, automated rollback, avoiding all-or-nothing rewrites, and an engineer speak-up culture. — [LeadDev](https://leaddev.com/technical-direction/what-went-wrong-at-sonos)

### Inferences — Prioritized reskin QA checklist (synthesized)
**P0 (blockers)**
1. Feature and task parity: every function in the old UI is reachable in the new one, and core tasks are not slower.
2. Focus visible on every interactive element, using an `outline` (not glow or box-shadow only), at 3:1 against adjacent colors. It is not obscured by sticky or translucent chrome (use `scroll-padding`).
3. Text contrast is 4.5:1 for body and small text and 3:1 for large text and UI boundaries. Check every text-role token, including secondary, disabled, placeholder and chart text, against every surface, including blurred and textured ones.
4. Forced-colors pass: boundaries, focus, selected and checked states, and icons remain visible.
5. Keyboard-only pass: tab order, modal and drawer focus trap and restore, Escape to close, shortcuts intact.
6. No color-only meaning in status, validation or charts.

**P1**
7. Full state matrix restyled for every component: hover, active, disabled, read-only, selected, loading, empty (first-run, filtered, error), error, success, and offline where relevant.
8. `prefers-reduced-motion` disables glitch, flicker, parallax and large motion. Under `prefers-reduced-transparency`, blur and translucency become solid surfaces.
9. Performance on low-end hardware: blur ≤ about 20px, no animated blur, cap glow layers, pause off-screen animation. Profile frame rate while scrolling.
10. Typography: display or monospace fonts limited to large sizes, `tabular-nums` for data, small sizes tested, line-height and truncation re-checked.
11. No layout shift between states, or when fonts load (match fallback metrics).

**P2**
12. Text expansion and RTL via pseudo-localization, plus mirrored icons and clip-path shapes.
13. Very long text, very large datasets and overflow handling.
14. Z-index scale, and decorative overlays set to `pointer-events: none`.
15. Token coverage audit: no raw hex/rgb literals outside the token files. Third-party widgets, SVGs, canvas and charts are themed too.
16. Visual regression snapshots per theme × state × breakpoint. Staged rollout with a classic or plain theme toggle.

### Gaps
- I did not fetch specific visual-regression tool documentation (Chromatic, Percy, Playwright `toHaveScreenshot`) this session. The P2 item 16 recommendation rests on general practice, not a cited source.
- I did not fetch design-system docs (Material, Carbon, Polaris, Primer, Spectrum) on state and token guidance within the 15-call budget. They should be consulted to corroborate the state matrix and the semantic-token claims.
