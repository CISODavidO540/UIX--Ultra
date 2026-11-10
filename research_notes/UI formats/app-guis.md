# Application GUIs and non-page interface types

Research notes for UI-MAX (2026-11). Each type below gets anatomy, forgotten states, typography, interaction, failures, and checks an auditor can run. The shared typography numbers come first in §1, since the last round of feedback was about typography.

## 0. Gaps in the current toolkit

- **Missing playbooks:** desktop/IDE multi-pane tools, native desktop conventions, canvas/node editors, kanban/calendar, TUI/CLI, TV/10-foot, kiosk, and e-commerce product pages/checkout.
- **Misroutes in `src/route.js`:** keyword matching sends requests to the wrong playbook.
  - "terminal" goes to `agent-chat`.
  - "product page" goes to `landing-marketing`.
  - "inventory" goes to `data-table-admin`, including game inventories.
  - "checkout" goes to `forms-settings`, which has no guidance on cart or total cost.
  - "game" goes to `game-fui`, which covers *styling* only. It has nothing on input glyphs, safe zones or subtitles.
- **`references/stylized-themes.md:44`** says "display/condensed fonts only at large sizes" but gives no numbers. §1 supplies them.

## 1. Shared typography numbers

| Context | Default | Floor | Source |
|---|---|---|---|
| iOS/iPadOS · macOS · tvOS | 17 · 13 · 29 pt | 11 · 10 · 23 pt | [Apple HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography) |
| Windows (Fluent 2) | Body 14/20 px | Caption 12/16 px | [Fluent 2](https://fluent2.microsoft.design/typography) |
| Console/TV game | — | **26 px @1080p** (52 @4K) | [XAG 101](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/101) |
| PC/VR game | — | **18 px @1080p** (36 @4K) | same |
| Mobile/streaming game | — | 18 px @100 DPI → 72 px @400 DPI | same |
| 10-foot UI | — | 28 px @1080p, "a minimum rather than a target" | [Fire TV](https://developer.amazon.com/docs/fire-tv/design-and-user-experience-guidelines.html), [GAG](https://gameaccessibilityguidelines.com/use-an-easily-readable-default-font-size/) |
| Game subtitles | — | **46 px @1080p**, ≤40 chars/line, 2 lines, backdrop | [GAG subtitles](https://gameaccessibilityguidelines.com/if-any-subtitles-captions-are-used-present-them-in-a-clear-easy-to-read-way/) |

- **XAG measures body height, not CSS font-size.** Body height runs from the top of the highest ascender to the bottom of the lowest descender ("hg"). Outline pixels count only if they are ≥2:1 against the background.
  - In a typical sans, body height is about 0.9–1.0 em, so 26 px body height needs roughly 27–29 px font-size.
  - Condensed display faces with short descenders fail at the same font-size.
  - Glyphs inside button prompts must meet the same floor. An "X" drawn at 13 px inside an 18 px button glyph fails.
  - Text and icons must scale to 200% without two-axis scrolling. OS magnifiers don't count as a fix.
- **"Large text" means much larger at 10 feet.** [XAG 102](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/102) sets the contrast bars:
  - The 3:1 exemption starts at **52 px @1080p on console** (36 px on PC). A 24 px "large" web heading is body text on a couch.
  - Everything smaller needs 4.5:1.
  - Inactive text needs 3:1.
  - High-contrast mode needs **7:1** everywhere.
  - Text over gameplay or gradients is measured against the *lowest-contrast area* behind it.
- **Stylized fonts must have a plain escape hatch.** Per XAG 101:
  - Offer at least one sans option, and a non-stylized alternative to any stylistic font.
  - Fonts need complete character sets for every supported language.
  - Lines of text should be offered in sentence case. 1–2-word labels are exempt, so all-caps short labels are fine.
  - Blocks longer than 2 lines need ≤80 chars/line (40 for CJK), 1.5 line spacing, 0.12 em letter spacing and 0.16 em word spacing, unless the player can configure them.
  - GAG: readability beats art direction. Where they conflict, offer a choice.
- **Avoid thin and decorative faces.**
  - Apple says to avoid Ultralight/Thin/Light. A thin custom face needs sizes *above* the floors.
  - Android TV: "thinner lines are not instantly recognisable", "personable fonts are best suited to bigger size text", and avoid fonts "that can't function as body text" ([Android TV type](https://developer.android.com/design/ui/tv/guides/styles/typography)).
  - Fluent and GNOME both ban all-caps for emphasis.
  - [GNOME](https://developer.gnome.org/hig/guidelines/typography.html) also avoids italics. It asks for × for dimensions, … for ellipses, en dash for ranges, and **U+202F narrow no-break space** between a number and its unit.
- **Condensed and display faces: where they help and where they hurt.**
  - They help with short, glanceable numerals and ≤2-word labels at large size: ammo, speed, timers, hero KPIs.
  - They hurt in sentences, menus, tooltips and subtitles.
  - They hurt near the size floor, where condensed counters fill in.
  - They hurt in localized builds. German typically runs 30–40% longer ([translated.com](https://translated.com/resources/text-expansion-ui-translation)), and CJK fallback fonts rarely have condensed widths.
  - They hurt under glitch, chromatic-aberration or scanline effects.
  - **Precedent:** Cyberpunk 2077 patch 2.1 had to add "Larger Fonts", "Larger HUD Elements", "Remove HUD Visual Effects" (chromatic-aberration ghosting), "Reduce HUD Decorative Elements" and "Remove HUD Lens Distortion" ([CDPR](https://www.cyberpunk.net/en/news/49591/update-2-1-accessibility-features)). That is direct support for the repo's Effects Full/Subtle/Off.
- **Translucency hurts legibility.** NN/g on iOS 26 Liquid Glass: text over content-dependent translucency is "an illegible mess", and "Motion for motion's sake is not usability" ([NN/g](https://www.nngroup.com/articles/liquid-glass/)). Glass or holographic FUI panels need a solid fallback and a contrast check against the *worst* frame behind them.
- **Numerals and mono.**
  - Use `font-variant-numeric: tabular-nums` for anything that updates or aligns: clocks, counters, tables, prices, HUD stats.
  - Add `slashed-zero` for IDs and codes ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric)).
  - Use mono for code, hashes, paths and fixed-width data only, never for labels or prose.

## 2. Dashboards / analytics

- **Anatomy:**
  - Time range and refresh control
  - KPI row with value, delta and comparison period
  - Trend chart, breakdowns, and a drill-down table
  - "Last updated" stamp and data source
- **Operational vs analytical:** operational dashboards are live and time-critical. Analytical ones flag what to investigate. Both must be glanceable: "their goal is not to facilitate exploration" ([NN/g](https://www.nngroup.com/articles/dashboards-preattentive/)).
- **Forgotten states:**
  - Stale data, or partial data when some sources fail
  - No data vs a true zero
  - Timezone and DST boundaries
  - A delta against an empty prior period (÷0)
  - Per-widget loading
  - Metrics hidden by permissions
- **Typography:**
  - Tabular lining figures, right-aligned numeric columns, and fixed precision per metric.
  - Units lighter in weight, joined with U+202F.
  - Hero KPIs may use a display face at ≥32 px.
  - Axis ticks ≥11–12 px in the UI sans.
- **Failures:**
  - Pies, donuts, radial gauges and 3D charts. NN/g prefers bars, lines and bullet charts.
  - Encoding magnitude with color.
  - KPI digits that jitter in width on every refresh.
- **Checks:**
  1. `.kpi-value, td.num, [data-metric]` compute `tabular-nums`, and numeric cells are `text-align: right|end`.
  2. Measured with `canvas.measureText`, "0000" and "1111" have equal width in the KPI font.
  3. Every chart region contains text matching `/updated|as of/i`.
  4. With an empty dataset stubbed via `page.route`, every widget shows an empty or zero message, not a blank SVG.

## 3. Desktop productivity and IDE-style tools (VS Code, Figma, Linear, Raycast)

- **Anatomy:**
  - Activity bar or nav rail, and a resizable sidebar or tree
  - Tabbed editor groups or a canvas
  - Inspector, bottom panel and status bar
  - Command palette and quick-open
  - Context menus
- **Palette rules** ([Superhuman](https://blog.superhuman.com/how-to-build-a-remarkable-command-palette/)):
  - One shortcut everywhere. Pressing it again closes the palette and restores the previous focus.
  - Every action has a command, and the palette teaches its shortcut.
  - Fuzzy matching plus aliases, with the matched alias shown, e.g. "Mark Done (Archive)".
  - A curated empty-query list.
  - Context boosts results rather than hiding them.
  - Caveat: GitHub planned to deprecate its palette in July 2025 for "low usage", then paused within a day after pushback ([changelog](https://github.blog/changelog/2025-07-15-upcoming-deprecation-of-github-command-palette-feature-preview)). The palette is an accelerator, never the only path.
- **Forgotten states:**
  - Inactive window
  - Collapsed panes and minimum widths
  - Dirty tabs, and close confirmation for them
  - Tab overflow
  - Long names, which need middle-ellipsis
  - Sync conflicts
  - Background tasks shown in the status bar
  - Focus cycling between panes (F6)
  - Restoring the layout on relaunch
- **Typography:**
  - Chrome at 12–13 px.
  - Mono for the editor, terminal and diffs.
  - `<kbd>` hints at caption size, with platform glyphs (⌘⇧ vs Ctrl+Shift).
- **Response time** ([NN/g](https://www.nngroup.com/articles/response-times-3-important-limits/)):
  - 0.1 s feels instant.
  - 1 s keeps the user's flow.
  - Past 10 s you need a percent-done indicator and a cancel control.
- **Checks:**
  1. Ctrl/Meta+K opens a `role=dialog` with a focused combobox. Escape closes it and returns focus to the previous element.
  2. Splitters are `role=separator` with `aria-valuenow`, and the arrow keys resize them.
  3. No chrome text is below 11 px.
  4. Toolbar buttons have accessible names and expose their shortcuts.

## 4. Native desktop conventions

- **macOS:**
  - Menu order: App, File, Edit, Format, View, app-specific menus, Window, Help ([HIG](https://developer.apple.com/design/human-interface-guidelines/the-menu-bar)).
  - Disable unavailable items instead of hiding them. Use an ellipsis when an item needs more input.
  - Always include a Window menu.
  - Reserved shortcuts: ⌘, ⌘W ⌘Q ⌘. ⌘? ⌘`. ⇧⌘Z means redo only ([HIG keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)).
  - Inactive windows get gray traffic lights and no vibrancy ([HIG windows](https://developer.apple.com/design/human-interface-guidelines/windows)).
- **Windows** ([title bar](https://learn.microsoft.com/en-us/windows/apps/design/basics/titlebar-design)):
  - Title bar is 32 px, or **48 px** when it holds search or an account picture.
  - Icon is 16 px, placed 16 px from the edge.
  - Title uses the Caption style.
  - All empty title-bar space is draggable. Right-click opens the system menu, and double-click maximizes.
  - Elements go semi-transparent when the window is inactive.
  - Mica backdrop.
  - Spacing in epx: 8 between buttons, 12 between areas, 16 from the edge ([spacing](https://learn.microsoft.com/en-us/windows/apps/design/style/spacing)).
- **GNOME** ([keyboard](https://developer.gnome.org/hig/guidelines/keyboard.html)):
  - No Alt or Super shortcuts.
  - Ctrl+letter, with Shift+Ctrl for the inverse action.
  - F10 opens the primary menu, Shift+F10 the context menu, and Esc closes transients.
  - Give every labelled control an access key. Avoid i/l and descender letters, and re-check access keys in each translation.
- **Failures:**
  - Hamburger menus in desktop apps.
  - Custom title bars that break dragging or Snap.
  - Shortcuts labeled for the wrong platform.
- **Checks (Electron/Tauri):**
  1. Title-bar gaps are `-webkit-app-region: drag` and its controls are `no-drag`.
  2. With `emulateMedia({forcedColors:'active'})`, the title bar and focus stay visible.
  3. A simulated blur applies inactive styling.
  4. Shortcut labels match `navigator.platform`.

## 5. Mobile apps

- **iOS:**
  - Tab bars hold ≤5 tabs, are for navigation only, and stay visible except under modals ([HIG](https://developer.apple.com/design/human-interface-guidelines/tab-bars)).
  - Sheets use medium and large detents plus a grabber, and close with swipe-down ([HIG sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)).
  - Targets are 44 pt, with a 28 pt floor ([HIG games](https://developer.apple.com/design/human-interface-guidelines/designing-for-games)). Material uses 48 dp.
- **Android window classes** ([Android](https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes)):
  - Width: <600 / 600–840 / 840–1200 / 1200–1600 / ≥1600 dp, which picks bar → rail → drawer and the pane count.
  - A landscape phone has *compact height*.
- **Forgotten states:**
  - Largest accessibility type size
  - Keyboard covering inputs
  - Landscape insets
  - Offline, and denied permissions
  - Restore after backgrounding
  - Content clipped at the medium detent
- **Typography:**
  - Use system text styles (iOS Body 17 pt; M3 Body Large 16 sp, Label Small 11 sp) so Dynamic Type works.
  - Custom fonts must implement Bold Text and Dynamic Type themselves.
  - Web inputs below 16 px trigger iOS zoom-on-focus.
- **Lesson from Liquid Glass:** floating translucent bars cost legibility.
- **Checks:**
  1. At 390×844 with `hasTouch`, targets are ≥44 px (or ≥24 px with spacing, per WCAG 2.5.8).
  2. Bottom nav has 3–5 items.
  3. At 200% root font-size, no text clips and nothing scrolls horizontally.
  4. Inputs are ≥16 px.

## 6. Canvas, creative and node editors (Figma, tldraw, Blender, n8n)

- **Anatomy:**
  - Infinite canvas with zoom, pan and fit
  - Tools, layers tree and inspector (numeric X/Y/W/H)
  - Minimap
  - Typed ports and edges
  - Undo history
  - Presence cursors
- **Forgotten states:**
  - Empty canvas, with a first-action hint
  - Multi-select showing "Mixed" values
  - Zoom extremes
  - Labels at far zoom: hide them (level of detail) rather than drawing 4 px text
  - Invalid or cyclic connections
  - Running, errored and stale node outputs
  - Collaboration conflicts
  - Huge documents
- **Typography:**
  - Chrome at 11–12 px.
  - Inspector numbers in tabular figures.
  - Canvas labels need a minimum *screen* size, not a document size.
- **Interaction:** every drag needs a single-pointer alternative ([WCAG 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)):
  - Corner-click selection
  - Arrow and numeric nudges
  - Click a port, then click another port to connect
  - Pan buttons
- **Failures:**
  - A bare `<canvas>` with no DOM or ARIA mirror
  - Ports that only appear on hover
- **Checks:**
  1. The canvas is labelled and has an offscreen object list.
  2. Select an object, press ArrowRight, and the inspector X changes by 1 (10 with Shift).
  3. Zoom and fit buttons have names.
  4. No label renders below 9 px at minimum zoom.

## 7. Kanban, boards and calendars

- **Anatomy:**
  - Boards: columns with count and WIP limit, cards, swimlanes, quick-add, and "Move to…".
  - Calendars: day, week, month and agenda views; time gutter; all-day row; now-line; timezone label; overlap layout.
- **Forgotten states:**
  - Empty column, and a column over its WIP limit
  - Drag placeholder, and a rejected drop
  - Optimistic move that fails on the server
  - Events of ≤15 minutes, and overlaps
  - Multi-day spans
  - 23 h and 25 h DST days
  - 12 h vs 24 h locales
  - Recurring edits ("this event or all")
- **Typography:**
  - Tabular figures for gutters and counts.
  - Truncated titles keep a full accessible name.
  - Short events drop the time before they drop the title.
- **Interaction:** WCAG 2.5.7's own examples are a kanban card moved through a menu and a sortable list with up/down buttons. Keyboard: Space to lift, arrows to move, Space to drop, with each move announced live.
- **Checks:**
  1. Every card has a move control that doesn't require dragging.
  2. Moving a card updates an `aria-live` region.
  3. Truncated events carry the full text in a `title` or accessible name.
  4. At 1280 px, 30-minute events are ≥20 px tall.

## 8. TUIs and CLIs (ratatui, Charm, lazygit)

- **Typography constraints:**
  - The app controls neither font nor size, because the user's terminal does.
  - Hierarchy has to come from bold, dim, reverse, underline, color, case, box-drawing and position. Italic is unreliable.
  - Wide and Ambiguous East Asian characters ([UAX #11](https://www.unicode.org/reports/tr11/)) and emoji can take 2 cells. Nerd Font glyphs need ASCII fallbacks.
  - Users theme the 16 ANSI colors, so use them for semantics and reserve truecolor for decoration.
  - Lip Gloss downsamples TrueColor → 256 → 16 → 1-bit, strips color when output isn't a TTY, and detects dark backgrounds ([Lip Gloss](https://github.com/charmbracelet/lipgloss)).
- **Anatomy (lazygit):**
  - Numbered panels and a main view.
  - A one-line key-hint bar.
  - Standard keys: `?` for all keys, `/` to filter, `z/Z` for undo/redo, `esc`, `q` ([lazygit](https://github.com/jesseduffield/lazygit/blob/master/docs/keybindings/Keybindings_en.md)).
  - Bubbles' `help` builds its text from the `key` bindings, so the hints can't drift from the real keys ([Bubbles](https://github.com/charmbracelet/bubbles)).
  - Ratatui is immediate-mode, so never block the render loop ([ratatui](https://ratatui.rs/concepts/rendering/)).
- **CLI rules** ([clig.dev](https://clig.dev/)):
  - Turn color off when output isn't a TTY, `NO_COLOR` is non-empty, `TERM=dumb`, or `--no-color` is passed.
  - Offer `--json` and `--plain`.
  - Data goes to stdout, logs to stderr.
  - "Print something to the user in <100ms".
  - No animation when output isn't a TTY.
  - Prompt only when stdin is a TTY, and support `--no-input`.
  - Put the key information last.
- **Forgotten states:**
  - Terminal resized too small ("need 80×24")
  - Light background, and monochrome
  - Piped output
  - SIGINT: restore the cursor and leave the alternate screen
- **Checks:** Playwright can't drive a TUI unless it runs in xterm.js. Use a pty harness (`script`/`pexpect`) instead:
  1. At 80×24 and 60×20, no line exceeds the width, measured with `wcwidth`.
  2. With `NO_COLOR=1` and output piped through `| cat`, the output contains zero `\x1b[` sequences.
  3. Golden snapshots match: ratatui `TestBackend`, Bubble Tea `teatest`, or [VHS](https://github.com/charmbracelet/vhs) tapes diffed as PNG.
  4. The help output lists every bound key.

## 9. Game HUDs, FUI and in-game menus

- **Anatomy:**
  - HUD: health and resources, ammo, minimap or compass, objective tracker, prompts with glyphs for the current device, damage direction.
  - Menus: front-end, pause, settings (with an Accessibility tab), inventory, map, loading tips.
  - Element layers: diegetic, non-diegetic, spatial and meta (Fagerholt & Lorentzon, "Beyond the HUD").
  - Reference: [Game UI Database](https://www.gameuidatabase.com/), 55k+ screens filterable by HUD element ([Game Developer](https://gamedeveloper.com/design/game-ui-database-relaunches-with-new-features-video-support-and-over-55-000-screenshots)).
- **Forgotten states:**
  - Prompt glyphs switching between keyboard and pad
  - Controller disconnect, which should auto-pause
  - Subtitles colliding with the HUD
  - HUD scale, safe zone and HUD opacity (Destiny 2 is the GAG example)
  - Colorblind presets and custom colors (Battlefield 2042 in XAG 102)
  - Reading the OS high-contrast setting at launch
  - Localized text overflow
  - Locked items, which need 3:1 contrast
- **Typography:**
  - Use the §1 floors, and keep subtitles on a backplate.
  - Outline or backplate any text over gameplay, ideally with player-adjustable opacity.
  - Condensed faces for numerals and ≤2-word labels only.
  - Sentence-case body text, with a plain-font option.
  - No text baked into images, except logos.
- **Motion:**
  - HUD elements are static when idle.
  - Glitch, chromatic aberration and lens distortion each need their own toggle (the CDPR precedent).
- **Checks (web-rendered):**
  1. At 1920×1080 and DPR 1, set `ctx.font` from the computed style and compute `measureText('hg'+text)` ascent + descent. It must be ≥26 (TV/console) or ≥18 (PC).
  2. Screenshot each text box with its text transparent and find the worst sampled pixel. Contrast must be ≥4.5:1, or ≥3:1 if body height is ≥52 px.
  3. With `data-fx="off"` and 2× text scale, nothing overflows and nothing goes off-screen.
  4. Labels inside prompt glyphs meet the same floor.

## 10. TV / 10-foot and kiosks

- **TV:**
  - Viewing distance is about 3 m ([Android TV](https://developer.android.com/design/ui/tv/guides/foundations/design-for-tv)), or 8 ft or more for [tvOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-tvos).
  - Design at 960×540 dp with 1080p assets.
  - 5% overscan margins: 48/27 dp (the 58/28 dp layout). Backgrounds bleed past them.
  - 12 columns of 52 dp with 20 dp gutters ([layouts](https://developer.android.com/design/ui/tv/guides/styles/layouts)).
  - Fire TV: keep focus and text in the inner 90%, and prefer less saturated, cool colors.
  - Fire TV: show a clear focus state and a brief selected state, and wrap 1-D lists.
  - tvOS buttons are 66 pt by default, with a 56 pt floor.
  - Never move focus without user input ([HIG focus](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection)).
  - Leave room for a focused card to grow.
- **Kiosk:**
  - Attract loop.
  - Idle warning with "Need more time?", giving ≥20 s to extend (WCAG 2.2.1).
  - A reset that clears personal data.
  - Audio and lowered-UI accessibility modes.
  - Printer and card-reader error states.
  - The EU Accessibility Act has covered self-service terminals and e-commerce since 28 June 2025, against EN 301 549 ([NDA](https://nda.ie/eaa)). The US Access Board's kiosk rule has stalled since its 2022 ANPRM ([Access Board](https://www.access-board.gov/sstms/)).
- **Typography:**
  - TV text is ≥28 px at 1080p, Medium weight or heavier.
  - Kiosk body text around 20–24 px is a heuristic for standing at arm's length.
- **Checks:**
  1. At 1920×1080, the smallest font is ≥28 px.
  2. Pressing arrow keys from the first focusable eventually reaches every focusable, and each focus change produces an outline or shadow at ≥3:1.
  3. Every focusable sits within a 5% inset.
  4. Using `page.clock`, a warning appears before the kiosk resets, and the extend control works.

## 11. E-commerce: product pages and checkout

- **Baymard data:**
  - Average abandonment is **70.22%**.
  - Excluding people just browsing, the reasons are: extra costs **40%**, slow delivery 20%, trust 19%, forced account **18%**, complexity 17%, returns policy 13%, no upfront total 12%, card declined 10%, too few payment methods 9% ([Baymard](https://baymard.com/lists/cart-abandonment-rate)).
  - The average checkout had 11.3 fields in 2024, against about 8 needed ([Baymard](https://baymard.com/blog/checkout-flow-average-form-fields)).
  - 25% of sites have insufficient product images ([Baymard PDP](https://baymard.com/blog/current-state-ecommerce-product-page-ux)).
- **PDP anatomy:**
  - Zoomable gallery, including in-use and in-scale images
  - Price, unit price, and a sale price with accessible "was" text
  - Variant pickers with per-option stock that doesn't rely on color alone
  - Delivery date and cost
  - Returns summary
  - A sticky add-to-cart on mobile
  - Reviews with a rating distribution
  - Specs table
- **Checkout anatomy:**
  - Guest checkout first
  - Address autocomplete
  - Dated shipping options
  - Wallets and card payment
  - The full total shown *before* the pay button
- **Forgotten states:**
  - Out of stock or low stock
  - Price changed since the item was added to the cart
  - Invalid promo code
  - Declined card, and 3-D Secure (3-DS) challenges
  - Address suggestions
  - Session timeout that keeps the cart
  - Double-submit
- **Typography:**
  - Tabular figures in price lists.
  - Format prices with `Intl.NumberFormat`.
  - No display face that confuses 1 with 7 or 0 with 8.
  - Strikethrough needs text, not just `<s>`.
- **Checks:**
  1. A guest path reaches payment without ever showing a password field.
  2. There are ≤12 visible required inputs.
  3. The total, including shipping and tax, is visible on the step with the pay button.
  4. Address and card fields have the correct `autocomplete` tokens.
