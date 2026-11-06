# Interactive Cyberpunk / Sci-Fi FUI: Making Stylized Themes Alive Yet Usable

Scope: the design language, motion techniques, libraries, guardrails and CSS/JS recipes for a cyberpunk/FUI theme in productivity software (an AI chat/agent app). Researched Nov 2026. Some reference pages could not be fetched: arwes.dev and next.arwes.dev returned HTTP 503, and GDC Vault talks are paywalled. Those gaps are flagged below. The code recipes are implementation synthesis, so they sit under Inferences unless a source is cited.

## Q1. What defines the cyberpunk/FUI visual language beyond neon colors, and who are the reference designers?

### Takeaway
Film FUI exists to tell a story at a glance. Its look is grid-led, dense, widget-based and strict: chamfered and bracketed frames, monospace and condensed readouts, status lights, scanlines and other display artifacts. Game UI (Dead Space, Cyberpunk 2077) shows that the look has to "feel right for the world" without engineering accuracy, and that heavy reliance on saturated color hurts readability. For a productivity app, borrow the structure (grid, frames, readouts, hierarchy) and keep the decoration on the chrome around the content.

### Cited Findings
- Mark Coleran is widely credited with coining the term "FUI". He says he uses the same composition principles as the rest of the visual arts: light, shape, form, movement and sound, used to draw attention to the right place. — [Pushing Pixels, Mark Coleran interview](https://www.pushing-pixels.org/?p=18414)
- Territory Studio (David Sheldon-Hicks) says the balance between looking good and working functionally is set by each project. Film screen graphics serve story and world-building, which is a different brief from games. — [Interface in Game, interview with David Sheldon-Hicks](https://interfaceingame.com/articles/interview-with-david-sheldon-hicks)
- Territory's core is motion design: applying movement and narrative to design problems. Moving between consumer products and film/TV lets the studio carry lessons both ways. — [Interface in Game](https://interfaceingame.com/articles/interview-with-david-sheldon-hicks)
- Territory treats design as storytelling (a simple map can convey a whole scene) and asks how a broad audience can understand an interface while still being entertained. — [VFX Voice](https://vfxvoice.com/?p=13143400)
- Territory artists describe dense screens where "everything needs to be based on a strong grid", and say grid-based design pushes toward a widget-based approach, a shortcut for designing many screens quickly. Sci-fi UI "needs to be very strict" and should support the story without distracting the eye. — [Pushing Pixels, Ryan Jefferson Hays](https://www.pushing-pixels.org/?p=13908); [Pushing Pixels FUI category / Peter Eszenyi interview](https://www.pushing-pixels.org/category/fui/page/14)
- Jayse Hansen's Iron Man HUD (The Avengers): research with real experts, including an A-10 fighter pilot; three notebooks of sketches; continuity with earlier HUDs with "amplified sophistication and detail"; and making story points clear to the audience. — [ProVideo Coalition](https://www.provideocoalition.com/marvels_the_avengers_taking_the_hud_to_new_heights/); [The Next Web](https://thenextweb.com/news/jayse-hansen-on-creating-tools-the-avengers-use-to-fight-evil-touch-interfaces-and-project-glass); [Pushing Pixels, Hansen conversation](https://www.pushing-pixels.org/?p=7447)
- Dead Space (Dino Ignacio, GDC 2013, "Crafting Destruction: The Evolution of the Dead Space User Interface"): the UI should feel right for the world rather than be engineered accurately. For example, scanlines wouldn't actually appear on futuristic monitors, but they read as "screen". The team "wrap[ped] typical game conventions like loading screens and save points into believable world elements." — [GDC Vault](https://gdcvault.com/play/1017723/Crafting-Destruction-The-Evolution-of); [VRroom archive](https://archive.vrroom.studio/?p=30438); [HUDS+GUIS, Dead Space 2 diegetic interface](https://www.hudsandguis.com/2012/08/22/dead-space-2-diegetic-interface-design)
- Ignacio: "The problem is that most games design thinking they'll have dropdown menus." — [Kill Screen](https://www.killscreen.com/how-dead-space-3-pulled-dieter-rams-and-instagram/)
- Cyberpunk 2077 UI: CD Projekt Red's GDC Showcase 2023 talk (Arkadiusz Antonik, "User Interface in Cyberpunk 2077: Challenges and Optimizations") covers the pipelines and tricks for fitting the UI into performance budgets. It is engineering-focused and aimed at UI and gameplay programmers. — [GDC Vault](https://gdcvault.com/play/1034160/User-Interface-in-Cyberpunk-2077); [GDC news](https://expo.gdconline.com/news/learn-how-cyberpunk-2077-built-its-impressive-ui-gdc-showcase-session)
- Critiques of Cyberpunk 2077's readability:
  - The HUD splits into 4 fixed areas outside combat, players can hide any area, and the red color coding should be rethought. — [Super Jump / Medium UX analysis](https://medium.com/super-jump/a-ux-analysis-of-cyberpunk-2077s-hud-f74afe6b9961)
  - Default red text on red layouts is hard to read. — [Pixso](https://pixso.net/tips/cyberpunk-ui/)
  - The UI relies heavily on red, blue and yellow. — [Can I Play That](https://caniplaythat.com/2020/07/02/cyberpunk-2077-accessibility-analysis-so-far-2020/)
- Deus Ex: Human Revolution art direction (Jonathan Jacques-Belletête) mixed baroque and renaissance elements with cyberpunk, drew on contemporary Japanese and Scandinavian architecture, and aimed for "its own distinctive aesthetic flair". The black and gold palette is the signature. I found no UI-specific readability interview. — [Shacknews](https://www.shacknews.com/article/69171/deus-ex-art-influences-changes); [Game Developer, visual design](https://www.gamedeveloper.com/design/past-and-future-tension-the-visual-design-of-i-deus-ex-human-revolution-i-)
- augmented-ui exists to make "cyberpunk and sci-fi inspired ui for any size element" with clipped corners, scoops and tabs, plus border and inlay layers. That makes chamfered geometry a core, codified part of the web vocabulary. — [augmented-ui docs](https://augmented-ui.com/docs/)

### Inferences
- A visual vocabulary checklist (synthesized from the sources above and common FUI practice):
  - Geometry: chamfered/clipped corners (45°, typically 6–16px), notched tabs, corner brackets (L-shaped 1–2px strokes at the corners only), segmented or dashed frame lines, a hairline 1px grid, tick marks and rulers.
  - Typography: monospace for data, IDs, timestamps and token counts; condensed or technical sans for labels, often uppercase with +0.05–0.15em tracking. A humanist sans or readable mono for body text in a productivity app. Tabular numerals (`font-variant-numeric: tabular-nums`) so live numbers don't jitter.
  - Readouts: tiny metadata labels (e.g. `SYS//AGENT-03 · LAT 212ms`), status LEDs (6–8px dots, with pulse reserved for "live"), progress bars made of segments, and sparkline tickers.
  - Display artifacts: scanlines, noise/grain, chromatic aberration (RGB split), flicker, holographic translucency with backdrop blur. Following Ignacio, these are signifiers of "screen", not literal technology. Use them as seasoning.
  - Color: one dominant accent (cyan, magenta or acid yellow) plus one warning/alert hue and neutral blue-greys. Avoid encoding state in red/blue/yellow hue alone, which was the 2077 accessibility critique.
- For an agent app, the "diegetic" lesson maps to wrapping app conventions (loading, tool calls, thinking, errors) in themed metaphors: "uplink established", a tool call as a "subroutine" panel. The labels must stay plain and accessible (`aria-label` uses normal words).

### Gaps
- Could not access the Cyberpunk 2077 GDC talk content (paywalled) or CDPR's own statements on readability rules. The Behance case study by a CDPR UI artist ([Behance](https://www.behance.net/gallery/133185623/Cyberpunk-2077User-Interface-%28Part-2%29)) was found but not read.
- Found no first-party sources for Perception, Blade Runner 2049 (Territory) or Ghost in the Shell interface rationale in this pass.

## Q2. What makes these interfaces feel "alive" in motion, and how do games keep them readable and fast?

### Takeaway
Liveness comes from orchestrated enter and exit sequences (frames draw, then content decodes in), micro-reactions to input (cursor-tracked glow, hover flicker, sound "bleeps"), and low-amplitude ambient motion that signals live state. Usability comes from short durations (100–300ms for interactive feedback, under 500ms), shorter exits than entries, and less motion on things users see often. Boot sequences belong to rare events only.

### Cited Findings
- Arwes models motion as a tree of "animator" nodes, similar to the DOM. Each node is a finite state machine that manages a group of UI elements. `AnimatorGeneralProvider` sets default durations, and `BleepsOnAnimator` plays sounds declaratively on animator state changes (`continuous` keeps a bleep playing past the change). — [Arwes React Animators](https://next.arwes.dev/docs/develop/react/animators); [Arwes Motion Fundamentals](https://next.arwes.dev/docs/develop/fundamentals/motion); [Arwes React Bleeps](https://next.arwes.dev/docs/develop/react/bleeps). These are search snippets; the pages returned 503 on fetch.
- NN/g durations:
  - About 100ms for simple feedback (toggles, checkboxes).
  - 200–300ms for larger changes such as modals; about 400ms for big movements across large screens.
  - Avoid going past 500ms.
  - Entering needs slightly longer than exiting, e.g. 300ms in and 200–250ms out.
  - The more often users see an animation, the shorter and subtler it should be. Use "the shortest time that an animation can take without being jarring". Animations are far more often too long than too short.
  — [NN/g, Executing UX Animations: Duration and Motion Characteristics](https://www.nngroup.com/articles/animation-duration/)
- Text decode/scramble is a standard sci-fi effect. Justin Windle's `TextScramble` class (CodePen, mirrored as a gist) uses a `.dud` class for unresolved glyphs. GSAP's ScrambleTextPlugin and anime.js v4 `scrambleText` give library versions. — [Gist mirror of Windle's pen](https://gist.github.com/Marty-f13/b1fdcf9d9f92600ce0c6903c57fd1971); [Cruip tutorial](https://dev.to/cruip_com/making-a-text-scramble-animation-with-javascript-2nb3); [GSAP ScrambleText docs](https://greensock.com/docs/Plugins/ScrambleTextPlugin/)
- Coleran: movement and sound are tools for drawing attention to the right place, not decoration. — [Pushing Pixels](https://www.pushing-pixels.org/?p=18414)
- Cyberpunk 2077 HUD lets players hide each HUD area. Customizable density is part of its usability answer. — [Super Jump](https://medium.com/super-jump/a-ux-analysis-of-cyberpunk-2077s-hud-f74afe6b9961)

### Inferences
- Motion timing table for a productivity FUI (derived from NN/g plus the Arwes model):
  - Hover/press feedback: 80–150ms, ease-out.
  - Panel or frame line draw-in: 200–350ms using `stroke-dashoffset` or `scaleX` on a pseudo-element. Stagger children 30–60ms, capped at about 6 staggered items (beyond that, fade the group).
  - Text decode: 250–600ms total, and only on short strings (titles, labels, under ~40 chars, or the first line of an agent status). Never on message bodies, which should stream in plainly.
  - Appear flicker: 2–3 opacity steps (e.g. 0 → 0.6 → 0.3 → 1) over about 120–180ms. Keep it well under 3 flashes per second (see Q4).
  - Exit: about 60–75% of the enter duration.
  - Full "boot" sequence: only on first launch or session start, 600–1200ms total, skippable on any key or click. Under reduced motion it is replaced with a 150ms fade.
- Map Arwes's entering/entered/exiting/exited model onto app states: the agent turn is "entering" while streaming and "entered" when done. Tool-call panels draw their frame on start, and the LED changes from amber pulse to steady cyan on success.
- Ambient idle motion:
  - At most one ambient element per view, such as a slow 4–8s pulse on a "live" LED or a 20–60s background grid drift at about 2–4% opacity.
  - Pause it when the tab is hidden (`document.visibilityState`) or the element is offscreen (IntersectionObserver).
  - Stop it after the agent finishes, so motion means "something is happening".
- Cursor-tracked glow and magnetic borders give "responsiveness" at nearly no cost when implemented as a custom-property-driven radial gradient on a pseudo-element (recipe in Q5).
- Sound: short (30–120ms) synthesized blips for send, tool start, completion and error. Default muted, opt-in, with a global volume around 0.2–0.3 gain.

### Gaps
- Could not fetch Arwes' default duration values: the docs were 503. Other sources give Arwes enter/exit defaults around 0.4s, but that is unverified, so treat it as a gap.
- Found no primary source on how Destiny or Halo HUD teams quantify readability. Not covered.

## Q3. Existing web frameworks and libraries: what do they do well and poorly?

### Takeaway
Arwes has the most complete conceptual model (animator tree, bleeps, frames), but its repo now says it is unmaintained and it does not support React Strict Mode or RSC. Borrow its architecture rather than depend on it. augmented-ui is a solid, dependency-free CSS geometry layer (clip-path mixins, borders, inlays) under BSD-2 with some tooling quirks. GSAP is now 100% free, including ScrambleText and SplitText, which makes it a viable orchestration engine. Motion (Framer Motion) and the native View Transitions API are lighter choices for React state transitions.

### Cited Findings
- Arwes:
  - Describes itself as a "futuristic sci-fi UI web framework" with sci-fi designs, animations and sound effects.
  - Packages: a Vanilla core with few dependencies and low-level APIs that need detailed setup, plus React packages for React 18 with SSR.
  - Does not work with React Strict Mode or React Server Components.
  - README: "no longer maintained and currently outdated but it is still functional and operational". Forks are invited.
  - About 7.6k stars and no releases listed.
  — [GitHub arwes/arwes](https://github.com/arwes/arwes)
- augmented-ui v2:
  - Activated with the `data-augmented-ui` attribute and a mixin list (e.g. `tl-clip tr-scoop b-clip-x both`).
  - Over 150 `--aug-*` custom properties built on the CSS "Space Toggle" technique; core properties can respond to `:hover`.
  - Shapes are made with clip-path. Borders and inlays are enabled via `border`/`inlay`/`both` and styled with `--aug-border-bg` / `--aug-inlay-bg`.
  - Each of 8 regions takes a shape: 35 mixins per corner region, 15 per edge region.
  - Limitations: nested augmented elements need `data-augmented-ui-reset`; overrides need class-level specificity; the leading comma in custom properties breaks some linters and build tools (CRA, VS Code, some Sass); no fallbacks beyond `-webkit-clip-path`.
  - BSD 2-Clause license.
  — [augmented-ui docs](https://augmented-ui.com/docs/)
- GSAP: Webflow made GSAP "100% free to all users", including formerly Club plugins, and free for commercial use (GSAP 3.13). The SplitText rewrite added 14 new features. — [Webflow blog](https://webflow.com/blog/gsap-becomes-free); [GSAP 3.13 notes](https://gsap.com/blog/3-13/)
- anime.js v4 includes a `scrambleText` helper. — [search result summary of a CodePen example; unverified detail]

### Inferences
- Recommendation for an AI chat/agent app:
  - Implement the FUI look as a theme layer of CSS tokens, `@layer theme.fui`, and pseudo-element decorations, not as a component framework. The same components then render clean or FUI.
  - Use augmented-ui-style clip-path geometry, or a small set of hand-written `clip-path: polygon()` utilities.
  - Use a tiny "animator" state hook (entering/entered/exiting/exited, with stagger) inspired by Arwes.
  - Use Motion or View Transitions for layout changes, and the Web Audio API directly for bleeps (about 1KB of code, no assets).
- Arwes drawbacks for production: maintenance status, no Strict Mode, and heavy coupling of visuals to animation lifecycle, which makes accessible static rendering harder.
- augmented-ui drawback: clip-path clips focus outlines and box-shadows. Glow and focus rings must be drawn inside the clip, or on an unclipped wrapper or pseudo-element behind it.

### Gaps
- Did not verify current status of "cyberpunk-css" or "Cyberpunk 2077 CSS" community projects, or Motion's latest API. Not assessed.

## Q4. Usability guardrails

### Takeaway
Effects go on the chrome (frames, headers, status, empty states, transitions), never on reading or typing surfaces. Glitch and flicker must stay under WCAG 2.3.1 (no more than 3 flashes per second, and small area). Neon-on-pure-black worsens halation, so use tinted near-black backgrounds and slightly dimmed text. Respect reduced-motion and reduced-transparency. Animate only transform and opacity on many elements, and keep blur and shadow effects static or on few elements.

### Cited Findings
- WCAG 2.3.1 Three Flashes or Below Threshold:
  - Content must not contain "anything that flashes more than three times in any one second period" unless it is below the general and red flash thresholds.
  - A general flash is "a pair of opposing changes in relative luminance of 10% or more of the maximum relative luminance" where the darker state is below 0.80.
  - Area threshold: no more than 0.006 sr in total, which is "25% of any 10 degree visual field", approximated as "a 341 x 256 pixel rectangle anywhere on the displayed screen area when the content is viewed at 1024 x 768 pixels".
  - A red flash involves saturated red, defined as R/(R+G+B) ≥ 0.8.
  — [W3C Understanding SC 2.3.1](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html)
- Halation:
  - Dark mode can cause halation (blurry glow around text) for people with astigmatism, and it is worse for light-on-black than the reverse. — [Trimble Modus dark mode](https://modus-v1.trimble.com/foundations/dark-mode/); [Trimble styles](https://styles.trimble.com/foundations/dark-mode/)
  - Pure white on pure black (21:1) maximizes halation. Suggested: dark grey like #121212 with off-white text like #E0E0E0. — [Ezud](https://ezud.com/dark-mode-accessibility-feature/)
  - The APCA discussion proposes capping dark-mode text contrast around Lc -85 to -90. — [Myndex APCA discussion #111](https://www.github.com/Myndex/SAPC-APCA/discussions/111)
  - Caveat: astigmatism prevalence figures vary across sources (about 30–60%), and the evidence is partly blog-level.
- `prefers-reduced-transparency` takes the values `no-preference` and `reduce`. It maps to the Windows "Transparency effects" setting, macOS "Reduce transparency" and iOS "Reduce Transparency". MDN marks it experimental, limited availability and not Baseline, so use it as progressive enhancement. — [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency)
- Performance:
  - Animate `transform` and `opacity`, and "avoid any property that triggers layout or paint unless it's absolutely necessary". Blur effects such as shadows take longer to paint.
  - Use `will-change` sparingly and only just before the change.
  - Aim for about 99% of frames not dropped.
  — [web.dev animations guide](https://web.dev/articles/animations-guide)
- Rapidly animating `clip-path` forces continuous repaints and can drop frames. This is the tradeoff of clip-path glitch effects. — [Glitch tutorial roundup](https://alvarotrigo.com/fullPage/css-glitch-effect/); [Codrops CSS Glitch Effect](https://tympanus.net/codrops/2017/12/21/css-glitch-effect/)
- Web Audio: an `AudioContext` created before a user gesture starts "suspended" and must `resume()` after one (or be created inside the gesture handler). Check `AudioContext.state`. — [Chrome autoplay policy](https://developer.chrome.com/blog/autoplay)
- The Cyberpunk 2077 readability critiques (red-on-red, color reliance) are a cautionary example. — [Pixso](https://pixso.net/tips/cyberpunk-ui/); [Can I Play That](https://caniplaythat.com/2020/07/02/cyberpunk-2077-accessibility-analysis-so-far-2020/)

### Inferences
- **No-effect zones**:
  - Message bodies, markdown and code blocks: no glow, no scanlines over text, no scramble, no chromatic aberration.
  - Text inputs and the composer textarea: a static frame only. The caret and selection stay standard or themed solid colors.
  - Dense tables and diff views, plus any scrolling list longer than about 20 items.
  - Error message text: shake or glitch the frame or icon, never the words.
- **Effect budget**:
  - One "hero" ambient effect per view.
  - Interaction effects only on the focused or hovered element.
  - No more than about 3 simultaneously animating decorative elements.
  - Glitch fires only on events (error, disconnect, theme switch), is at most 300ms long, and never loops.
- **Flash-safe glitch**:
  - Keep luminance change small: shift hue or offset position rather than toggling between dark and bright.
  - Keep any flashing area under 341×256 CSS px at 1024×768 (scale proportionally), with at most 2 flicker cycles per event.
  - Never use saturated red (R/(R+G+B) ≥ 0.8) for flicker.
- **Color tokens**:
  - Background around #0B0F14–#11161D (blue-tinted near-black, not #000).
  - Body text about #D6DEE8 (not #FFF). Neon accent used for borders, icons and small labels at ≥4.5:1 if it carries text, and ≥3:1 for UI component boundaries (WCAG 1.4.11).
  - Glow at reduced alpha (20–45%) so the glyph core stays crisp.
  - Never put text-shadow glow on text below about 16px. If glow is used on headings, the first shadow layer should be tight (0–2px blur), with wide layers at ≤30% alpha.
- **Scanline overlay**:
  - Opacity 0.03–0.08, `pointer-events: none`, static (not scrolling).
  - Off on content panes, or apply it only to the background layer under content.
  - Disabled under `prefers-contrast: more`.
- **Reduced motion**:
  - `@media (prefers-reduced-motion: reduce)` disables decode, flicker, glitch, parallax, ambient drift and the boot sequence.
  - Keep 100–150ms opacity fades and color changes, since state feedback is still needed. Text appears instantly.
- **Reduced transparency**: make glass/holo panels opaque (alpha ≥0.92) and drop `backdrop-filter`.
- **Forced colors**: under `@media (forced-colors: active)`, chamfered clip-path backgrounds vanish. Provide `border: 1px solid CanvasText` and ensure the outline focus ring is not clipped.
- **Focus**:
  - A themed focus ring that is unclipped: `outline: 2px solid var(--accent); outline-offset: 2px`, or a pseudo-element bracket drawn outside the clip-path.
  - `:focus-visible` only.
  - Never animate the ring in a way that delays its appearance (≤100ms).
- **User controls**: settings for "Effects: Full / Subtle / Off" and "Sound: Off (default) / On", stored per user. Pair them with the OS media queries as defaults. This mirrors Cyberpunk 2077's hideable HUD areas.
- **Performance**:
  - No animated `box-shadow`, `filter` or `backdrop-filter` on list items. Put glow in a pseudo-element with a static shadow and animate its `opacity`.
  - `@property` angle animations on conic gradients repaint the element. Limit them to 1–2 elements (the active agent card, the send button while streaming) and pause them when idle.
  - Canvas or WebGL backgrounds: cap at 30fps, pause when hidden, use DPR ≤1.5, and skip them on low-power devices (`navigator.hardwareConcurrency <= 4` or a `saveData` hint).

### Gaps
- No authoritative quantitative study of neon glow vs legibility was found. The glow alpha numbers above are practitioner judgment, not research.
- Did not verify the current browser list for `prefers-reduced-transparency`. MDN says limited and not Baseline as of the fetch.

## Q5. Concrete technique recipes

### Takeaway
Everything can be built from a few primitives: clip-path chamfers with a pseudo-element border, layered text-shadow and box-shadow glow tinted via `color-mix`, a static `repeating-linear-gradient` scanline, clip-path glitch keyframes on pseudo-elements, a `requestAnimationFrame` text scramble, a pointer-tracked radial-gradient spotlight driven by CSS variables, a conic-gradient border rotated through a registered `@property` angle, and a muted-by-default Web Audio blip synth.

### Cited Findings
- Animated gradient border recipe:
  - Register an angle with `@property` so the browser can interpolate it, then spin a `conic-gradient` on a background layer behind a transparent border (`background-origin`/`background-clip`).
  - It can start paused and run on hover.
  - Glow variant: a `::after` copy with `filter: blur()`, rotated over about 4s.
  - Sources differ on `inherits: true` vs `false`; `false` is typical.
  — [Learn with Jason](https://learnwithjason.dev/blog/animated-css-gradient-border); [Simon Bittok, dev.to](https://dev.to/bittokks/create-animated-borders-using-only-css-3id3); [css-tip glowing border](https://css-tip.com/glowing-border/)
- Glitch recipe: pseudo-elements duplicate the text (`content: attr(data-text)`), are offset ±2px with contrasting red/blue text-shadows or backgrounds for chromatic aberration, and have their `clip-path: inset()` (or `polygon()`) animated across keyframes to slice them. Another variant uses `mix-blend-mode: hard-light`. — [Codrops](https://tympanus.net/codrops/2017/12/21/css-glitch-effect/); [Alvaro Trigo glitch tutorial](https://alvarotrigo.com/fullPage/css-glitch-effect/); [Creative Bloq](https://creativebloq.com/how-to/how-to-create-glitch-text-and-image-effects-in-css)
- Text scramble: a class that, for each character, picks a random start and end frame. Before the end frame it shows a random glyph from a set (wrapped in a `.dud` span for dimmer styling), then the final char. It is driven by `requestAnimationFrame` and returns a promise. — [Windle gist mirror](https://gist.github.com/Marty-f13/b1fdcf9d9f92600ce0c6903c57fd1971)
- Chamfer and border geometry via clip-path mixins and `--aug-border-bg`/`--aug-inlay-bg`. — [augmented-ui docs](https://augmented-ui.com/docs/)
- Web Audio requires a gesture to resume. — [Chrome autoplay](https://developer.chrome.com/blog/autoplay)

### Inferences (implementation recipes — synthesized, not copied from a single source)

**Tokens**
```css
:root{
  --bg:#0b0f14; --panel:#0f151c; --text:#d6dee8; --muted:#8a97a8;
  --accent:#28e0ff; --accent-2:#ff3ea5; --warn:#ffcf3a;
  --line:color-mix(in oklab,var(--accent) 35%,transparent);
  --glow-sm:0 0 1px var(--accent),0 0 6px color-mix(in oklab,var(--accent) 45%,transparent);
  --glow-lg:0 0 2px var(--accent),0 0 12px color-mix(in oklab,var(--accent) 35%,transparent),0 0 28px color-mix(in oklab,var(--accent) 18%,transparent);
  --cut:12px; --dur-fast:120ms; --dur-med:240ms; --ease-out:cubic-bezier(.2,.8,.2,1);
}
```

**Chamfered panel with a 1px border (clip-path border trick)**
```css
.panel{position:relative;background:var(--line);padding:1px; /* border color */
  clip-path:polygon(var(--cut) 0,100% 0,100% calc(100% - var(--cut)),calc(100% - var(--cut)) 100%,0 100%,0 var(--cut));}
.panel>.inner{background:var(--panel);clip-path:inherit;height:100%}
/* focus ring cannot live inside clip: put it on an unclipped wrapper */
.panel-wrap:focus-within{outline:2px solid var(--accent);outline-offset:3px}
```
SVG alternative: an absolutely positioned `<svg>` with a `<path>` stroke and `vector-effect: non-scaling-stroke`. It allows dashed segments and `stroke-dashoffset` draw-in, which clip-path cannot do.

**Corner brackets (no clip, cheap)**
```css
.bracketed{--b:10px;background:
 linear-gradient(var(--accent) 0 0) top left/var(--b) 1px no-repeat,
 linear-gradient(var(--accent) 0 0) top left/1px var(--b) no-repeat,
 linear-gradient(var(--accent) 0 0) bottom right/var(--b) 1px no-repeat,
 linear-gradient(var(--accent) 0 0) bottom right/1px var(--b) no-repeat;}
```

**Frame draw-in on enter**
```css
.panel::before{content:"";position:absolute;inset:0 auto auto 0;height:1px;width:100%;
  background:var(--accent);transform-origin:left;transform:scaleX(0);
  animation:draw var(--dur-med) var(--ease-out) forwards}
@keyframes draw{to{transform:scaleX(1)}}
```

**Glow on headings only, with glow via an opacity-animated pseudo-element for hover**
```css
.btn{position:relative}
.btn::after{content:"";position:absolute;inset:0;box-shadow:var(--glow-lg);opacity:0;
  transition:opacity var(--dur-fast) var(--ease-out);pointer-events:none}
.btn:hover::after,.btn:focus-visible::after{opacity:1}
```

**Static scanlines (background layer only)**
```css
.app::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.05;
  background:repeating-linear-gradient(to bottom,#fff 0 1px,transparent 1px 3px)}
@media (prefers-contrast:more),(prefers-reduced-motion:reduce){.app::before{display:none}}
```

**Event-only glitch (≤300ms, 2 slices, flash-safe)**
```css
.glitch{position:relative}
.glitch.is-glitching::before,.glitch.is-glitching::after{content:attr(data-text);position:absolute;inset:0}
.glitch.is-glitching::before{color:var(--accent-2);transform:translateX(-2px);animation:slice 280ms steps(2) 1}
.glitch.is-glitching::after{color:var(--accent);transform:translateX(2px);animation:slice 280ms steps(2) reverse 1}
@keyframes slice{0%{clip-path:inset(20% 0 60% 0)}50%{clip-path:inset(65% 0 10% 0)}100%{clip-path:inset(0 0 100% 0)}}
```
Add the class from JS on error or disconnect and remove it on `animationend`. Use it only on short labels with `aria-hidden` pseudo text, which is not read by screen readers.

**Cursor-tracked highlight (one listener, CSS vars)**
```js
document.addEventListener('pointermove',e=>{
  const el=e.target.closest('[data-spot]'); if(!el) return;
  const r=el.getBoundingClientRect();
  el.style.setProperty('--mx',`${e.clientX-r.left}px`); el.style.setProperty('--my',`${e.clientY-r.top}px`);
},{passive:true});
```
```css
[data-spot]::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity 150ms;
  background:radial-gradient(240px circle at var(--mx) var(--my),color-mix(in oklab,var(--accent) 14%,transparent),transparent 60%)}
[data-spot]:hover::before{opacity:1}
```
Border-only variant: the same gradient on a masked pseudo-element (`mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)`) with `padding: 1px`, so only the edge lights up near the cursor ("magnetic border").

**Animated conic border (streaming/active state only)**
```css
@property --a{syntax:"<angle>";initial-value:0deg;inherits:false}
.active-agent{border:1px solid transparent;
  background:linear-gradient(var(--panel),var(--panel)) padding-box,
             conic-gradient(from var(--a),transparent 0 70%,var(--accent) 85%,transparent) border-box;
  animation:spin 3s linear infinite}
@keyframes spin{to{--a:360deg}}
@media (prefers-reduced-motion:reduce){.active-agent{animation:none}}
```

**Text scramble (decode in, short strings only)**
```js
export function scramble(el,final,{dur=450,chars='!<>-_\\/[]{}=+*^?#01'}={}){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=final;return;}
  el.setAttribute('aria-label',final); // screen readers get final text
  const start=performance.now(), q=[...final].map((c,i)=>({c,t:dur*(0.3+0.7*Math.random())*(i/final.length+0.3)}));
  (function f(now){const t=now-start;
    el.textContent=q.map(o=>t>=o.t||o.c===' '?o.c:chars[(Math.random()*chars.length)|0]).join('');
    if(t<dur*1.3) requestAnimationFrame(f); else el.textContent=final;})(start);
}
```
Use a monospace font, or reserve the width, so the line doesn't reflow while scrambling.

**Web Audio bleeps (muted by default, synthesized)**
```js
let ctx, enabled=false; // enabled via settings toggle
export function bleep(freq=880,ms=60,type='square',gain=0.04){
  if(!enabled) return; ctx ??= new AudioContext(); if(ctx.state==='suspended') ctx.resume();
  const o=ctx.createOscillator(), g=ctx.createGain(), t=ctx.currentTime;
  o.type=type; o.frequency.setValueAtTime(freq,t); o.frequency.exponentialRampToValueAtTime(freq*1.5,t+ms/1000);
  g.gain.setValueAtTime(gain,t); g.gain.exponentialRampToValueAtTime(0.0001,t+ms/1000);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t+ms/1000+0.02);
}
```
Map sounds to semantic events (send, tool start, success, error), with no sound on hover. Rate-limit to about 1 per 80ms, and stay silent while `document.hidden`.

**Status LED**
```css
.led{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:var(--glow-sm)}
.led[data-state=live]{animation:pulse 1.6s ease-in-out infinite}
@keyframes pulse{50%{opacity:.45}}
```
The 1.6s cycle is far below 3 Hz, the area is tiny, and the luminance swing is soft, so it is flash-safe. Pair it with a text label ("Running"), not color alone.

### Gaps
- Did not benchmark the cost of `@property` conic animations or the cursor spotlight. The performance claims are inferred from web.dev's general guidance on paint costs.
- The CSS-Tricks–specific glitch and neon articles were not retrieved. The glitch recipe is based on Codrops and other tutorials.
