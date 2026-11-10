# Presentation web pages: landing, product, pricing, docs, editorial, portfolio, slides, changelog

Research date: 2026-11-10. Scope: pages that present or explain rather than operate. This note extends `skills/ui-max/playbooks/landing-marketing.md` and `references/craft.md`. It does not repeat them: craft already sets 1.2/1.25/1.333 ratios and a 68ch measure, and the landing playbook already lists the slop tells. Sources are inline. Unmarked lines are synthesis or practitioner heuristics.

---

## 0. Typography system shared by every presentation format (the gap the user flagged)

**Fluid type must survive zoom. Most AI output fails this.**
- Viewport-only sizes (`5vw`) break WCAG 1.4.4 Resize Text (F94). With `clamp(1.5rem, 5vw, 3rem)`, text grew only 64px to 68px (+6%) at 200% zoom. [Roselli](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html)
- **Hard rule: in any `clamp(min, …, max)`, max ≤ 2.5 × min.** 16px to 40px passes. `clamp(16px, …, 48px)` fails between 1050 and 2100px viewports. [Barvian, Smashing 2023](https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/); same rule in [web.dev 2025](https://web.dev/articles/baseline-in-action-fluid-type)
- A hero at `clamp(2rem, 8vw, 6rem)` (3×) fails. So does "text-4xl → text-8xl" (36px to 96px, 2.67×).
- Hero display sizes therefore need a **larger min on mobile** (≈2.25–2.5rem), not a bigger max on desktop.
- Do not set a root size in px. Inherit the user default (`:root{font-size:100%}`), or use `html{font-size:clamp(1em, 17px + 0.24vw, 1.125em)}`. Keep em bounds and only a small vw term. [web.dev](https://web.dev/articles/baseline-in-action-fluid-type), [Suzanne/OddBird 2025](https://oddbird.net/2025/02/12/fluid-type/)
- Utopia's rem output assumes 1rem = 16px, so test it with zoom. [OddBird](https://oddbird.net/2025/02/12/fluid-type/)
- "Compressed fluid typography" damps the ratio when users raise their base size: ratio 1.125@320px → 1.333@1800px, compression 0.7. Even its author says large headings still can't reach 200% in Chrome. [Ott](https://matthiasott.com/notes/compressed-fluid-typography)
- Utopia defaults are a sane marketing/editorial starting point: 18px @360 with ratio 1.2, rising to 20px @1240 with ratio 1.25, 5 steps up and 2 down. [utopia.fyi](https://utopia.fyi/type/calculator/)

**Scale per format.** One ratio does not fit all.

| Format | Body | Ratio | Notes |
|---|---|---|---|
| Docs | 16–17px | 1.125–1.2 | h2–h4 are all used, so a small ratio keeps h4 above body and h1 sane. Code 0.875–0.9em. |
| Editorial / long-form | 18–21px | 1.25–1.333 | Few heading levels; dek ≈ 1.25× body. |
| Marketing / landing | 17–20px | 1.2–1.25 | Plus a **separate display tier** (hero 2.5–4× body) that is *not* on the geometric scale. Generating h1 as `base × r^7` gives absurd jumps. |
| Slides | see §7 | 1.333–1.5 | Two or three levels only. |

Butterick puts optimal web body text at 15–25px and print at 10–12pt. [Practical Typography](https://practicaltypography.com/point-size.html)

**Measure**
- 45–90 characters including spaces; "two to three alphabets" per line. [Butterick](https://practicaltypography.com/line-length.html)
- Targets by format: editorial 60–70ch; docs prose ≤ 75ch, but code blocks may run 80–100 columns, so the content column is wider than the prose max-width; marketing paragraphs 45–60ch; hero h1 ≤ ~20ch per line, ≤ 3 lines, with `text-wrap: balance`.

**Line height**
- 120–145% of size for most text, unitless. [Butterick](https://practicaltypography.com/line-spacing.html)
- Line height must fall as size rises: body 1.5–1.65 (long-form sans at 16–18px sits at the upper end), h2/h3 1.15–1.3, display ≥ 48px 0.95–1.1.
- Heuristic that does this automatically: `line-height: calc(1em + 0.5rem)` (or `rlh`/`lh` units for rhythm).
- Use `text-box: trim-both cap alphabetic` to align display type optically to its box.

**Tracking**
- Inter's published dynamic-metrics curve is `tracking = −0.0223 + 0.185·e^(−0.1745·px)` em. [rsms archive](https://d.rsms.me/inter-website/v3/dynmetrics/) Computed:

  | Size | 12px | 16px | 20px | 24px | 32px | 48px+ |
  |---|---|---|---|---|---|---|
  | Tracking (em) | 0 | −0.011 | −0.017 | −0.020 | −0.022 | −0.022 |

- This matches the −0.022em display tracking reverse-engineered from Linear. [Linear DESIGN.md extraction (unofficial)](https://cdn.jsdelivr.net/npm/oh-my-opencode@4.18.2/dist/skills/frontend/references/design/linear.app.md)
- So negative tracking saturates near −0.02em. AI output often uses `tracking-tighter` (−0.05em) on 72px heads, which is too tight. Applying it to body text is wrong outright.
- All caps and small caps need **+5–12%**. Lowercase body needs none. [Butterick](https://practicaltypography.com/letterspacing.html)
- Fonts with an `opsz` axis do this themselves, so don't double-apply.

**Display vs body pairing**
- Contrast on one axis (serif display + sans body, or a condensed or wide display + neutral text). Share x-height and era.
- Never pair two similar sans faces.
- Load real weights: a missing 600/700 weight gets synthesized, which shows up as faux bold or italic (`font-synthesis: none` reveals it).
- Marketing can afford 2 families. Docs: 1 sans + 1 mono. Editorial: a serif text face with true italics.
- Dark mode: light-on-dark reads heavier. Drop about 1 variable-weight step or use a `GRAD` axis.

**Font loading**
- `font-display: swap` for brand/display faces; `optional` (≤100ms block, skip if late) for body.
- WOFF2 only; subset with `unicode-range`; inline `@font-face` and critical CSS in `<head>`; preload one file at most. [web.dev font best practices](https://web.dev/articles/font-best-practices)
- Remove FOUT layout shift with a metric-matched fallback. Safari 17+ supports `size-adjust`; the overrides lacked stable Safari support when web.dev wrote this. [web.dev size-adjust](https://web.dev/articles/css-size-adjust)
  ```css
  @font-face{font-family:"Brand-fb";src:local("Arial");size-adjust:104%;ascent-override:92%;descent-override:24%;line-gap-override:0%}
  ```
- `font-size-adjust: ex-height from-font` evens out mono vs sans in docs.

---

## 1. Default webpage basics (header, nav, footer, sections)

**Anatomy**
1. Skip link
2. Header: logo links home; ≤ 7 nav items; current page marked with `aria-current`; one primary CTA on the right
3. `<main>` with a single h1
4. Sections, each with its own heading
5. Footer: sitemap columns, contact, legal, locale and theme switch

**Forgotten behaviors**
- Sticky header that condenses or hides on scroll-down and returns on scroll-up. Keep it ≤ 15–20% of viewport height on a 390×844 screen.
- `scroll-padding-top` equal to the header height, so anchor targets and focused elements aren't hidden. WCAG 2.4.11 lists sticky headers and footers as typical failures; technique C43 is scroll-padding. [W3C](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- Mobile menu: a real `<button aria-expanded>`, Esc closes it, focus is contained.
- Cookie banners must not fully cover the focused element. [W3C](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- Dark mode: `prefers-color-scheme` plus a toggle, persisted, applied by a tiny inline script before paint (no flash).
- Print stylesheet: hide nav, show link URLs, `break-inside: avoid` on figures and pre.
- 404:
  - return a real 404 status, not a soft 200
  - plain-language message
  - search box plus key links
  - keep it simple even when playful. [Eric Bailey](https://ericwbailey.design/writing/how-to-make-an-ineffective-404-page), [CMS design system](https://design.cms.gov/patterns/404-page-guidance/)

## 2. Landing / product / feature pages

**First screen** must answer four questions: what is it, for whom, why believe it, what to do next.
- NN/g: 57% of viewing time is above the fold, 74% within the first two screenfuls, 81% within three. Put key goals and the main CTA there. [NN/g 2018](https://www.nngroup.com/articles/scrolling-and-attention/)
- Avoid **false floors**. A 100vh hero with nothing peeking below creates an "illusion of completeness" that stops scrolling. Let the next section, or cut-off content, show. [NN/g](https://www.nngroup.com/articles/scrolling-and-attention/)
- Use `svh`, not `vh`, so the hero isn't cut by mobile browser chrome.
- The homepage is an elevator pitch. The hero carries a concrete value proposition, usually as a descriptive tagline. [NN/g](https://nngroup.com/articles/homepage-design-principles/)

**Order**
1. Hero: claim, sub-claim, CTA, product visual
2. Proof strip: real logos or a metric with a source
3. 3–5 feature or story sections that alternate media and text, each with one claim and one artifact
4. Deeper proof: case study or quote with name and role
5. Pricing teaser or integration list
6. FAQ
7. Final CTA
8. Footer

**Motion**
- Autoplaying hero video or carousels running more than 5 seconds need pause/stop controls (WCAG 2.2.2, Level A).
- Parallax and large page transitions trigger vestibular symptoms (WCAG 2.3.3).
- Gate all scroll-driven (`animation-timeline: view()`) and view-transition CSS behind `@media (prefers-reduced-motion: no-preference)` and `@supports`.
- The CSSWG declined to auto-disable scroll-linked animation, so the opt-out is the author's job. [W3C thread](https://lists.w3.org/Archives/Public/public-css-archive/2022Jun/0886.html)
- **Never make content's resting state `opacity:0` waiting for a reveal.** If JS fails or the API is unsupported, the content is gone, and print and screenshots come out blank.
- Cross-document view transitions take one rule, `@view-transition{navigation:auto}`, in Chrome/Edge 126+ and Safari 18.2+; Firefox does not support them. Avoid `blocking="render"` unless you have measured its CWV cost. [Chrome docs](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document)

**Imagery**
- Real product UI at legible scale, cropped to the feature being discussed.
- Give every image `width`/`height` or `aspect-ratio`; set `fetchpriority=high` on the LCP image only; lazy-load the rest.

## 3. Pricing

**Anatomy**
1. Billing toggle, a real radio group that shows the actual saving
2. 3–4 plan cards, each with who it's for, price (`tabular-nums`), the 3–5 differentiators, and a CTA
3. A recommended plan highlighted
4. Comparison table
5. Enterprise / contact sales
6. FAQ covering tax, currency, cancellation and trial

**Comparison table**
- Users read it in the "lawn-mower" pattern, row by row across columns, with occasional deep dives into one attribute. [Smashing, citing NN/g](https://smashingmagazine.com/2022/07/designing-better-pricing-page)
- So make the plan header row sticky, group rows, and use ✓/— with text alternatives.
- On mobile, use a plan switcher instead of a side-scrolling 4-column table.

**Forgotten:** the annual price shown as the per-month equivalent alongside the billed total; whether prices include tax; currency detection; and a CTA that keeps its state after the toggle changes.

## 4. Documentation sites

**Information architecture:** Diátaxis splits docs into four forms: tutorials, how-to guides, reference, and explanation. Each serves a distinct need, so don't mix them on one page. Organize navigation around those needs. [diataxis.fr](https://diataxis.fr/)

**Anatomy (three panes)**
- **Top bar:** logo, product/version switcher, search (⌘K or `/`), theme toggle, repo link.
- **Left nav:** sections, current page highlighted, collapsible groups.
- **Content:** breadcrumb, h1, one-sentence lede, prerequisites, body.
- **Right rail:** "On this page" TOC.
- **Footer:** previous/next, "Edit this page", last updated, "Was this helpful?".

**TOC rules** [NN/g](https://nngroup.com/articles/table-of-contents)
- Sticky only in a rail. A sticky TOC inside the body gets mistaken for global nav.
- Highlight the current section (scroll-spy).
- Label it "On this page".
- List every heading, with link text identical to the headings.
- Use smooth scrolling and back-to-top links.
- On mobile, a collapsible sticky TOC was often unnoticed in testing.
- Skip the TOC on short pages, or when there are fewer than two links. [NN/g](https://www.nngroup.com/articles/in-page-links-content-navigation/), [USWDS](https://designsystem.digital.gov/components/in-page-navigation)

**Forgotten states**
- Hover-revealed `#` anchor links on headings that copy the URL
- Code copy button: accessible name, "Copied" announced via `aria-live`
- Language/package-manager tabs that sync across the page and persist
- Line highlighting
- Banner on old versions pointing to latest
- Search: empty, no-results and keyboard states; Esc returns focus
- Long code wraps in print
- Callout types distinguished by icon and label, not by color alone

## 5. Blog / editorial / long-form

**Anatomy**
1. Kicker or section
2. Headline
3. Dek
4. Byline, published `<time>`, separate *updated* date, reading time
5. Lead figure with caption and credit
6. Body with h2s every ~300–500 words, pull quotes, figures that break the measure (wide/full-bleed)
7. Footnotes or sidenotes (Tufte-style margin notes on wide screens, inline toggles on mobile)
8. Author box, related posts, subscribe

**Typography specifics**
- `hyphens:auto` only works with `lang` set.
- Use true italics, old-style figures in prose (`onum`), and real quotes and apostrophes.
- `hanging-punctuation` is Safari-only; treat it as progressive enhancement.
- Pull quotes use the display face at 1.5–2× body. Drop caps use `initial-letter` (Safari/Chrome).

**Forgotten:** OG image and meta, print styles, footnote backlinks (↩), and reading progress that is not a fake fixed bar covering content.

## 6. Portfolio / case study, and changelog

**Case study order**
1. One-line outcome in the hero
2. Role, team, timeline, tools
3. Problem and constraints
4. Process, shown only where decisions happened
5. Solution with real screens
6. Measured result with a baseline
7. Reflection

Make it skimmable through bold claim-headings. The grid lets imagery go wide while text stays at ≤ 70ch.

**Changelog**
- Keep a Changelog principles: written for humans, an entry for every version, grouped by type (Added / Changed / Deprecated / Removed / Fixed / Security), linkable versions and sections, newest first. [keepachangelog.com](https://keepachangelog.com/en/1.0.0/)
- Linear-style entries are short, visual, and say what changed *for the user*, often with embedded video. [Mintlify](https://mintlify.com/blog/five-changelog-principles-from-best-developer-brands), [incident.io](https://incident.io/blog/four-years-of-weekly-changelogs)
- Also: `<time datetime>`, a permalink per entry, an RSS/Atom `rel=alternate` link, filtering by product area, and "new since your last visit".

## 7. Slide decks and presentation mode on the web

**Anatomy**
1. Title
2. Agenda (optional)
3. Section dividers
4. Content slides, one idea each
5. Summary or CTA
6. Contact

**Behaviors** (reveal.js as reference)
- Fixed authoring canvas of 960×700 by default, margin 0.04, scale 0.2–2.0, uniformly scaled. [revealjs.com/presentation-size](https://revealjs.com/presentation-size/)
- Progress bar on by default. Slide numbers and URL hash are off by default; turn on `hash` for deep links.
- `?` opens a keyboard help overlay; touch navigation is supported. [config](https://revealjs.com/config/)
- Speaker view (**S**): notes in `aside.notes`, next-slide preview, elapsed and wall-clock time, and a pacing timer (`defaultTiming` 120s/slide; green, red, blue). [speaker-view](https://revealjs.com/speaker-view/)
- Notes print only with `showNotes`.
- Scroll view (v5+, `?view=scroll`) activates automatically on mobile widths and offers `scrollSnap` and `scrollProgress`. A web deck must be readable as a scrolling page on a phone. [scroll-view](https://revealjs.com/scroll-view/)
- Gamma-style decks are responsive cards by nature, Pitch/Keynote-style decks are fixed canvas. Decide which one you are building.
- Auto-animate (default 1.0s) must respect reduced motion.
- Announce slide changes to screen readers (`aria-live` on a title region).

**Typography for slides**
- Accessibility guides converge on **24pt minimum body and ~36pt headings**. "30pt" is a pitch heuristic (Kawasaki 10/20/30), not a standard. [IU](https://accessibility.iu.edu/creating-content/documents/powerpoint/index.html), [UC Merced](https://accessibility.ucmerced.edu/node/321), [NYC MOPD](https://www.nyc.gov/assets/mopd/downloads/pdf/Slidedecks-and-Presentations-Checklist-November-2019.pdf)
- **Convert the rule to the web.** A 16:9 PowerPoint slide is 7.5in = 540pt tall, so 24pt = **4.4% of slide height**. That is ≈31px on reveal's 700px canvas and 48px at 1080p. 36pt = 6.7%, and the 18pt absolute floor for footnotes = 3.3%.
- Express slide type in `cqh`/`cqi` of the slide container (`font-size: max(4.4cqh, 1rem)`), or check it as a ratio.
- Keep it to ≤ 6 lines and ~40 words per slide.
- Projectors wash out contrast, so aim for 7:1, not 4.5:1.
- Line-height 1.1–1.3, since slide lines are short.

## 8. What vibe-coded presentation pages get wrong (beyond the existing tell list)

- **Stepped, not fluid, type.** `text-5xl md:text-7xl` jumps at breakpoints, and max/min ratios above 2.5× fail 1.4.4.
- **h1 at 72px+ on desktop with a 320px-wide overflow.** No mobile min was set, so the h1 breaks mid-word or scrolls sideways.
- **`tracking-tighter` everywhere**, including body. Or the opposite: leading-1.5 on a 3-line display head, so it reads as three separate lines.
- **No measure.** `max-w-7xl` paragraphs run at 140ch.
- **Uniform section rhythm.** Every section is `py-24` with a centered heading and a 3-up grid, with no change in density or alignment.
- **Weights and features missing.** One family at 400/600/700, faux bold, no `tabular-nums` on prices or stats, no `text-wrap` (orphans).
- **Content hidden until a reveal fires.** Fade-ups gate visibility; there is no reduced-motion branch; the hero video autoplays with no pause control.
- **Fake proof.** Invented logos and testimonials, round-number stats. Bento sprawl used to dodge deciding emphasis. [aismells](https://aismells.pages.dev/bento-box-sprawl.html), [Anthropic](https://claude.com/blog/improving-frontend-design-through-skills)
- **Docs-specific:** no right-rail TOC, anchors land under the sticky header, no copy buttons, search is a decorative input.

## 9. Playwright-auditable checks

**All formats**
- **Zoom (1.4.4):** for each text node, find a zoom z ∈ {2, 3, 4, 5} with `z · fs(viewport/z) ≥ 2 · fs(viewport)`. Simulate zoom by setting the viewport to W/z at DPR z. Also parse each `clamp()` to confirm max/min ≤ 2.5.
- **Reflow (1.4.10):** at 320px, `documentElement.scrollWidth ≤ clientWidth`.
- **Text spacing (1.4.12):** inject line-height 1.5, letter-spacing .12em, word-spacing .16em, paragraph spacing 2em. Flag any element with `overflow:hidden` and `scrollHeight > clientHeight`.
- **Measure:** build a Range over each `p` in `main`, take `getClientRects()` lines, and compute characters per line. Editorial 45–75, docs ≤ 80, marketing ≤ 65; flag a median above 90.
- **Leading:** lineHeight/fontSize must be 1.4–1.75 for text ≤ 20px, ≤ 1.3 for 32–47px, and ≤ 1.15 for ≥ 48px.
- **Tracking:** ≤ 0 for ≥ 32px; between −0.03 and +0.01em for body; ≥ +0.04em when `text-transform: uppercase` or `font-variant-caps` is set.
- **Scale hygiene:** ≤ 8 distinct font sizes in `main`. Flag adjacent sizes with a ratio below 1.08 (near-duplicates). Hero h1 must be ≤ 3 lines at 390px.
- **Fonts:**
  - every computed `font-weight`/`style` has a matching loaded `FontFace` (faux-bold check)
  - `font-display` is not `block`/`auto`
  - CLS < 0.1 measured through `layout-shift` entries during font swap
  - ≤ 4 font files on first load
- **Sticky chrome:** header height ≤ 20% of viewport at 390×844. After clicking every `a[href^="#"]`, the target's top must be ≥ the header's bottom. Tab through the page and check the focused rect isn't fully covered (`elementFromPoint` at its corners).
- **Motion:** `emulateMedia({reducedMotion:'reduce'})`, then no running `document.getAnimations()` longer than 0.5s and no element left at `opacity: 0`. With JS disabled, the main text is still visible. Autoplay video has a pause control.
- **Dark and print:** emulate dark mode and re-run contrast. Emulate print: nav hidden, background not dark, `pre` not clipped.
- **404:** `GET /__nope__` returns status 404, and the page has a search box or a home link.

**Landing**
- Exactly one h1, visible in the first viewport at 390 and 1440 widths, along with a primary CTA.
- LCP < 2.5s; the LCP image has dimensions and is not lazy-loaded.
- Next section's top < 100svh (no false floor).
- No `background-clip:text` gradient on the h1.

**Pricing**
- `font-variant-numeric` includes `tabular-nums` on prices.
- The toggle is a radiogroup or switch role.
- The comparison table has `th[scope]` and a sticky header.

**Docs**
- Every h2/h3 has an `id` and an anchor link.
- Scroll-spy: scrolling to each heading sets `aria-current` on the matching TOC link.
- Every `pre` has a copy button with a name, and clicking it fills the clipboard and announces the copy.
- ⌘K or `/` opens search with focus in the input; Esc restores focus.

**Editorial**
- `html[lang]` is set; `time[datetime]` is present; images sit in `figure` with `figcaption`; every image has an aspect ratio.

**Changelog**
- Entries have `id` and `time`, are in descending date order, and the page links an RSS/Atom `link[rel=alternate]`.

**Slides**
- Arrow keys change the hash and slide.
- `min(fontSize)/slideHeight ≥ 0.033`, and body text ≥ 0.044.
- ≤ 40 words per slide.
- Text contrast ≥ 7:1.
- `aside.notes` is hidden in the audience view.
- `?print-pdf` produces one page per slide.
- At 390px width, the deck falls back to the scroll view.
