# Productive UI Principles for Power-User / Tool-Heavy Software (with numbers)

Scope: what separates productive UIs (dev tools, AI chat/agent apps, dashboards) from merely attractive ones. Research date: 2026-11-06. Primary sources fetched where possible; secondary sources are flagged.

## What do usability research and HCI laws say, with numbers?

### Takeaway
Latency is the most quantified lever: about 100 ms feels instant, under 400 ms keeps users in flow (Doherty), 1 s keeps the train of thought, and 10 s is where attention breaks and a percent-done indicator plus cancel become mandatory. Choice count (Hick), target size/distance (Fitts), and working-memory limits (chunking) set the structure. Attractiveness raises *perceived* usability, which also hides real usability problems in testing.

### Cited Findings
**Response-time limits**
- 0.1 s: the system feels like it is "reacting instantaneously," and no feedback beyond the result is needed. 1.0 s: the user's train of thought stays uninterrupted, but they "lose the feeling of working directly on the data." 10 s: the limit for keeping attention on the dialogue. Source: Nielsen, *Usability Engineering* ch. 5 (1993), based on Miller 1968 and Card et al. 1991. — [NN/g: Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/)
- 2014 web-app update: at 0.1 s users feel they are directly manipulating objects (e.g. sorting a table should feel that fast). Past 1 s, signal that the computer is working. "Anything slower than 10 seconds needs a percent-done indicator" and a clearly marked way to interrupt. For 2–10 s, a full percent-done bar may be excessive, and a busy indicator with a changing counter is suggested. For work of unknown size, show absolute running progress (name each item as it is processed). A generic spinner is the last resort. — [NN/g](https://www.nngroup.com/articles/response-times-3-important-limits/)
- Doherty Threshold: productivity rises when system response is under **400 ms**, so that neither the user nor the computer waits on the other. Doherty & Thadani, *IBM Systems Journal*, 1982, replacing the previous 2 s standard. Sub-400 ms apps were described as "addicting." Laws of UX adds: use perceived-performance techniques, animation during background work, and progress bars even when imprecise. A deliberate delay can sometimes raise perceived value and trust. — [Laws of UX: Doherty Threshold](https://lawsofux.com/doherty-threshold/)

**Choice and motor laws**
- Hick's (Hick–Hyman) Law, 1952: decision time grows with the number and complexity of choices. Takeaways: reduce options when response time is critical, split complex tasks, highlight recommended options, onboard progressively, and do not oversimplify into abstraction. — [Laws of UX: Hick's Law](https://lawsofux.com/hicks-law/)
- Fitts's Law, 1954: movement time depends on distance to the target and falls as the target grows. Faster movements to small targets produce more errors (speed–accuracy trade-off). Takeaways: make targets large enough, space them apart, and place them close to the user's current focus. — [Laws of UX: Fitts's Law](https://lawsofux.com/fittss-law/)
- Screen edges and corners act as "magic corners" with effectively infinite target depth, which is why the Apple menu sits in a corner. Radial menus put every item at equal distance, so muscle memory can reduce selection to direction alone. — [Rauno Freiberg, Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design)

**Memory and perception**
- Miller's Law (1956): immediate memory span and absolute judgment are limited to about 7 items. Laws of UX explicitly warns: "Don't use the 'magical number seven' to justify unnecessary design limitations." Chunk content instead. Capacity varies with prior knowledge. Cowan's "Magical Mystery Four" is listed as further reading. — [Laws of UX: Miller's Law](https://lawsofux.com/millers-law/)
- Laws of UX definitions:
  - Jakob's Law: users expect your product to work like the others they already use.
  - Cognitive load: the mental effort an interface demands.
  - Tesler's Law: some complexity cannot be removed, only moved.
  - Postel's Law: be liberal in what you accept and conservative in what you send.
  - Peak-End rule.
  - Gestalt grouping: proximity, similarity, common region, uniform connectedness.
  - Goal-gradient and Zeigarnik effects.
  - [Laws of UX index](https://lawsofux.com/)

**Aesthetics**
- Aesthetic-Usability Effect: Kurosu & Kashimura (Hitachi Design Center, 1995) tested 26 ATM UI variants with 252 participants. Aesthetic appeal correlated more strongly with *perceived* ease of use than with actual ease of use. Caveats: the effect masks usability problems in testing, because users who struggle may still praise the look. It buys forgiveness for minor issues, not major ones, so watch behavior rather than relying on what users say. — [NN/g: Aesthetic-Usability Effect (2024, reviewed 2026)](https://www.nngroup.com/articles/aesthetic-usability-effect/)

### Inferences
- A practical latency budget for a power tool: **≤100 ms** for direct manipulation (typing, selection, toggles, sorting, opening the command palette), **≤400 ms** for navigation and view switches, **≤1 s** before showing any busy indicator, and **>10 s** shows determinate progress plus Cancel. For AI agents, stream tokens and step names instead of using a spinner, following NN/g's advice to show absolute progress by naming items as they process.
- Hick's Law favors a command palette (type to filter, so the visible choice set collapses) over large menus. Fitts's Law favors placing frequent actions near the cursor or focus (context menus, inline actions) and using screen edges.
- Because of the aesthetic-usability effect, a heavily stylized theme will test well on "feel" while hiding friction. Measure task time and error rates, not just satisfaction ratings.
- The commonly cited Shannon formulation, MT = a + b·log2(D/W + 1) (MacKenzie), was not on the fetched pages. Treat it as standard textbook knowledge.

### Gaps
- I did not fetch the original Doherty & Thadani paper. The 400 ms figure is via Laws of UX.
- I did not fetch Cowan's (2001) "4±1" chunk figure directly. Cite it with care.
- I did not retrieve NN/g's Jakob's Law or Gestalt primary articles. Only the Laws of UX one-liners are cited.

## What do best-in-class productivity tools do?

### Takeaway
The best tools treat speed as the product: local data plus optimistic writes (Linear), a hard 100 ms budget with a 50 ms target (Superhuman), keyboard-first navigation with discoverable shortcuts and Cmd+K, minimal or no animation on high-frequency actions, and undo or rollback instead of blocking confirmations.

### Cited Findings
- **Superhuman:**
  - Every interaction should take <100 ms. 100 ms is the maximum, and the target is <50 ms where possible.
  - The 100 ms "feels instantaneous" threshold is attributed to Paul Buchheit (Gmail).
  - A newer renderer shows emails in 1–2 Chrome frames (<32 ms).
  - Techniques: a local email database (works offline), preloading/prerendering of threads the user is likely to open, minimal animation, and keyboard-first design ("faster than a mouse in almost all cases").
  - Shortcut hints are shown in the UI, and Cmd+K opens a command library.
  - Process: "measure everything you want to make fast," then make it fast.
  - Business cost cited secondhand: Amazon found each 100 ms of latency cost about 1% of sales, and Google found +500 ms dropped search traffic by 20%. Superhuman cites these without primary links.
  - [Superhuman blog: Superhuman is built for speed](https://blog.superhuman.com/superhuman-is-built-for-speed/)
- **Linear (secondary sources, unverified against Linear's own writing):**
  - The browser holds a local replica of the workspace in IndexedDB, so reads hit local data.
  - Writes update the local observable synchronously, then queue for background sync.
  - Server rejection reverts the change and shows a toast.
  - Custom sync engine with server-ordered sync IDs and last-write-wins (no CRDT/OT).
  - Tuomas Artman reportedly said only about 15 places in the codebase needed manual error handling.
  - [performance.dev: How is Linear so fast](https://performance.dev/how-is-linear-so-fast-a-technical-breakdown); [performance.dev: What makes Linear feel instant](https://performance.dev/what-makes-linear-feel-instant); [DEV: Why Linear feels fast](https://dev.to/0xgosu/why-linear-feels-fast-local-data-small-updates-and-product-discipline-1m53)
- **Linear UI redesign (primary):**
  - Goal: "reduce visual noise, maintain visual alignment, and increase the hierarchy and density of navigation elements."
  - Chrome color (blue) was limited, giving a more neutral palette.
  - Alignment work is "something you'll feel after a few minutes" rather than notice.
  - Themes moved from HSL to perceptually uniform **LCH**: themes went from 98 hand-set variables to **3 inputs** (base, accent, contrast), and LCH also generates elevation surfaces.
  - The contrast variable (compared at 30 vs 100) enables high-contrast accessibility themes.
  - Text and neutral icons were made darker in light mode and lighter in dark mode.
  - Inter Display for headings, Inter for everything else.
  - Densities were tested from "very condensed to more spacious."
  - Rolled out gradually, a percentage of workspaces per day.
  - [Linear: How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui)
- **Frequency vs. animation:**
  - High-frequency actions should animate less. Removing motion from a bookmarking tool's core interactions made it feel faster. macOS context menus and Cmd-Tab appear without animation.
  - Small confirmations still help: the menu fades out and the selected item briefly flashes the accent color.
  - [Rauno Freiberg](https://rauno.me/craft/interaction-design)
  - "Don't animate keyboard-initiated actions," since they repeat hundreds of times a day. — [Emil Kowalski: Great animations](https://emilkowal.ski/ui/great-animations)
- **Trigger timing by reversibility:**
  - Lightweight reversible actions can fire mid-gesture so the user can peek and back out.
  - Destructive actions fire only when the gesture ends.
  - [Rauno Freiberg](https://rauno.me/craft/interaction-design)
- **Undo over confirm:**
  - "Optimistic updates: on failure, show an error and roll back or offer Undo."
  - "Destructive actions: require confirmation or offer Undo within a safe window."
  - [Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/README.md)
- **Spatial consistency:**
  - Elements should enter from their source, e.g. apps launched from the Dynamic Island slide out of it. Entry direction encodes position in the stack.
  - [Rauno Freiberg](https://rauno.me/craft/interaction-design)
- **Links and navigation:**
  - Use real `<a>`/`<Link>` for navigation so Cmd/Ctrl+click and middle-click work.
  - In textareas, Cmd/Ctrl+Enter submits and Enter adds a newline.
  - Enter submits a single-input form.
  - Autofocus only on desktop with a single primary input.
  - [Vercel WIG](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/README.md)

### Inferences
- Pattern for AI chat/agent apps:
  - Cmd+K palette, plus Cmd/Ctrl+Enter to send in multi-line composers.
  - Optimistic insertion of the user's message.
  - Streaming output as the default "progress indicator."
  - Undo/rollback for agent actions instead of modal confirmations, keeping confirmation only for irreversible external side effects.
  - No entry animation on high-frequency keyboard actions.
- Local-first data (cached threads and sessions) is how Superhuman and Linear get under 50–100 ms, and a CSS/visual layer cannot fake it.

### Gaps
- Raycast, Arc, Figma, Notion, and VS Code primary engineering posts were not fetched within the tool budget. Claims about them (e.g. VS Code's command palette, Figma multiplayer/WebGL performance) are not cited here.
- Bloomberg's "How Bloomberg Terminal UX designers conceal complexity" returned HTTP 403, so no cited Bloomberg specifics.
- Linear's sync-engine details come only from secondary write-ups.

## Information density vs clarity

### Takeaway
Pro tools get density through alignment, neutral chrome, hierarchy by contrast and weight, tabular numerals, and perceptually uniform color, not by shrinking everything. Color is never the only status signal.

### Cited Findings
- Use `font-variant-numeric: tabular-nums` (or monospace) when numbers are compared. Use numerals for counts ("8 deployments"). Currency shows 0 or 2 decimals, consistently within a context. Use `&nbsp;` between number and unit ("10 MB"). — [Vercel WIG](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/README.md)
- "Don't rely on color alone for status. Pair it with text." Icon-only buttons need `aria-label`. — [Vercel WIG](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/README.md)
- Hover, active, and focus states need more contrast than the rest state. Prefer APCA over WCAG 2 for contrast measurement. Optical alignment adjustments are about ±1 px. A child border radius should be ≤ its parent's and concentric. Use at least two shadow layers (ambient plus direct). — [Vercel WIG](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/README.md)
- Linear: density and hierarchy of navigation increased while noise fell. Chroma was reduced in chrome, LCH gives equal perceived lightness across hues, and alignment of labels, icons, and buttons was tuned on both axes. — [Linear](https://linear.app/now/how-we-redesigned-the-linear-ui)
- Gestalt proximity, similarity, and common region drive grouping, so spacing and containers can replace separators and labels. — [Laws of UX](https://lawsofux.com/)
- Virtualize large lists or use `content-visibility: auto`. — [Vercel WIG](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/README.md)

### Inferences
- For a stylized (e.g. neon/cyberpunk) theme, keep chrome desaturated and spend chroma on status and accent only, as Linear does. Generate palettes in LCH/OKLCH from a few inputs, with a contrast knob for an accessible high-contrast mode.
- Offer a density toggle (compact/comfortable) instead of one fixed size. Linear explicitly tested a range.

### Gaps
- I found no fetched primary source giving numeric row heights or font sizes for "compact" density (e.g. Linear or Bloomberg). Do not cite specific px values without sourcing them.

## Perceived performance: optimistic UI, skeletons vs spinners, streaming, preloading

### Takeaway
Under 1 s, show nothing. Delay spinners about 150–300 ms and hold them at least 300–500 ms to avoid flashing. Use skeletons only for full-page loads under 10 s, spinners for single modules at 2–10 s, and determinate progress beyond 10 s. Get rid of most waits entirely with optimistic writes and intent-based preloading.

### Cited Findings
- NN/g (Tankala, 2023, reviewed Sept 2026):
  - <1 s needs no skeleton or spinner, and a flashing skeleton annoys.
  - Spinners suit roughly 2–10 s for single modules (a card, a video).
  - Skeletons are for full-page loads under 10 s.
  - Progress bars are for >10 s, with a duration estimate.
  - Process tasks (upload, convert) use progress bars, not skeletons.
  - Animated shimmer skeletons can distract or cause accessibility issues.
  - "Frame-display" skeletons (header/footer only) are not recommended.
  - Cites Mejtoft, Långström & Söderström (2018).
  - [NN/g: Skeleton Screens 101](https://www.nngroup.com/articles/skeleton-screens/)
- Spinners and skeletons: add a show-delay of about 150–300 ms and a minimum visible time of about 300–500 ms. Skeletons must mirror the final content dimensions exactly. — [Vercel WIG](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/README.md)
- POST/PATCH/DELETE should complete in <500 ms. Keep submit enabled until submission starts, then disable it, show a spinner, and send an idempotency key. — [Vercel WIG](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/README.md)
- Preloading and prerendering likely-next threads, plus a local cache: [Superhuman](https://blog.superhuman.com/superhuman-is-built-for-speed/). Optimistic local write, background sync, revert and toast on rejection: [performance.dev on Linear (secondary)](https://performance.dev/how-is-linear-so-fast-a-technical-breakdown).
- For unknown-length work, show absolute running progress by naming items as they process. A spinner is the last resort. — [NN/g](https://www.nngroup.com/articles/response-times-3-important-limits/)

### Inferences
- In an AI agent UI, token streaming plus a live step list ("Reading file X… Running tests…") is the NN/g-recommended "absolute progress" pattern. A shimmer on the pending assistant bubble should honor the 150–300 ms show-delay.
- Prefetch on hover or focus (pointer intent) for routes and records is consistent with Superhuman's predictive preloading. I found no fetched quantitative study of hover-prefetch gains.

### Gaps
- I did not fetch the findings of Mejtoft et al. (2018) or other controlled skeleton-vs-spinner studies. NN/g does not summarize their effect size.

## Measurable quality signals: Core Web Vitals and WCAG 2.2 AA

### Takeaway
Pass at the 75th percentile: LCP ≤2.5 s, INP ≤200 ms (poor >500 ms), CLS ≤0.1. WCAG 2.2 (Oct 2023) adds AA criteria that matter for dense tool UIs: 24×24 px targets, focus not obscured, and drag alternatives.

### Cited Findings
- "Good" Core Web Vitals: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1, measured at the 75th percentile of page loads and segmented by mobile and desktop. INP became stable in 2024, replacing FID. — [web.dev: Web Vitals](https://web.dev/articles/vitals)
- INP: good ≤200 ms, needs improvement 200–500 ms, poor >500 ms. It measures the time from a click, tap, or key press to the next paint, and reports the worst interaction (ignoring one highest per 50 interactions). Scroll, hover, and zoom are excluded. — [web.dev: INP](https://web.dev/articles/inp)
- WCAG 2.2 became a W3C Recommendation on 5 Oct 2023. It adds 9 SCs, and 4.1.1 Parsing was removed.
  - New AA criteria:
    - **2.4.11 Focus Not Obscured (Minimum):** focused items must be at least partly visible.
    - **2.5.7 Dragging Movements:** a single-pointer alternative is required.
    - **2.5.8 Target Size (Minimum):** **24×24 CSS px**, or a 24 px spacing circle that does not intersect other targets.
    - **3.3.8 Accessible Authentication (Minimum).**
  - New A criteria: 3.2.6 Consistent Help and 3.3.7 Redundant Entry.
  - New AAA criteria: 2.4.13 Focus Appearance (≥2 CSS px perimeter, 3:1 contrast between focused and unfocused states), 2.4.12, and 3.3.9.
  - [W3C: What's new in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- Vercel: hit area ≥24 px on desktop and ≥44 px on mobile. Mobile `<input>` font ≥16 px to prevent iOS zoom. Auto-playing motion >5 s needs pause/stop/hide. Use polite `aria-live` for toasts and inline validation. Never disable paste. — [Vercel WIG](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/README.md)

### Inferences
- Compact density modes in pro tools must still meet 24×24 px targets (or the spacing exception). Icon buttons at 16 px need padded hit areas.
- Sticky headers, toolbars, and chat composers can violate 2.4.11 by covering the focused row. Use `scroll-margin`/`scroll-padding` (Vercel recommends `scroll-margin-top` for anchors).
- INP ≤200 ms is a looser floor than the 100 ms "instant" target power tools aim for. Treat 200 ms as the minimum bar, not the goal.

### Gaps
- The WCAG 2.x contrast minimums (1.4.3: 4.5:1 normal text, 3:1 large; 1.4.11: 3:1 non-text) were not on the fetched "new in 2.2" page, though they remain AA. Verify against the [WCAG 2.2 spec](https://www.w3.org/TR/WCAG22/).
- I did not find web.dev's LCP/CLS "poor" thresholds in the fetched text. They are commonly LCP >4 s and CLS >0.25, but verify.

## Craft details that make UIs feel polished

### Takeaway
Polish comes from short (<300 ms), ease-out, interruptible animation on transform and opacity only. Reduce motion on frequent actions, honor `prefers-reduced-motion`, keep entries spatially consistent, and add many small form, keyboard, and typography details.

### Cited Findings
- Emil Kowalski:
  - Animations should usually be **<300 ms**. A 500 ms enter animation frustrates frequent users.
  - Use `ease-out` for snappy UI. Sonner deliberately uses `ease`, slightly slower, for an elegant feel.
  - Target 60 fps and animate only `transform` and `opacity`.
  - Animations must be interruptible (CSS transitions retarget).
  - Respect `prefers-reduced-motion`.
  - Only animate where motion adds information (state change, modal enter/exit).
  - [Emil Kowalski: Great animations](https://emilkowal.ski/ui/great-animations)
- Vercel WIG:
  - Never use `transition: all`.
  - Implementation preference: CSS, then WAAPI, then JS.
  - Animations must be interruptible.
  - Delay the first tooltip in a group, with no delay for subsequent peers.
  - Use `inert` and disable text selection during drag.
  - Set `overscroll-behavior: none` on desktop fine pointers.
  - Set `color-scheme: dark` and a matching `theme-color`.
  - Typography: curly quotes and a single `…` character.
  - Forms:
    - Don't pre-disable submit.
    - Focus the first error on submit.
    - Don't block keystrokes.
    - Placeholders show an example and end with "…".
  - [Vercel WIG](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/README.md)
- Rauno Freiberg:
  - Interruptibility: iOS Settings ignoring a mid-animation back-swipe feels sluggish.
  - Kinetic physics: preserve momentum and throw angle. Lighter objects bounce less than heavy ones.
  - Apply gesture deltas immediately, then animate past a threshold.
  - Keep drags active when the pointer leaves a small control.
  - Treat context as implicit input.
  - [Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design)

### Inferences
- Concrete defaults for a themed tool UI:
  - 120–200 ms ease-out for hovers, popovers, and menus.
  - ≤300 ms for modals and panels.
  - 0 ms for palette open/close and keyboard navigation.
  - Glow, scanline, or "glitch" effects only on low-frequency events, gated behind `prefers-reduced-motion`.
  - Looping ambient effects >5 s need a pause control.
  - These are inferences synthesized from the sources above, not numbers any single source states.

### Gaps
- Material 3 motion duration and easing tokens: the m3.material.io page rendered without content (JS-only), so no cited values. Apple HIG (e.g. the 44×44 pt minimum touch target) was not fetched. The 44 px figure is cited only via Vercel's mobile guideline.
