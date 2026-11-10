# Type by format

Typography changes with the format. A chat, a docs page, a slide and a HUD need different sizes,
ratios and measures. Sources and longer notes: `research_notes/UI formats/` and
`reports/UI formats and Astryx.md`. `omni check` measures the starred (★) rules (craft → "Type system").

## The numbers

| Format | Reading text | Scale ratio | Measure | Notes |
|---|---|---|---|---|
| AI / human chat | 15–16px, lh 1.5–1.6 ★ | headings in answers ≤ 1.5× body | paragraphs ≤ ~70ch, code full column | composer ≥ 16px (iOS zoom); tabular timestamps |
| Docs | 16–17px | 1.125–1.2 | prose ≤ 75ch ★ (85ch flagged), code 80–100 col | 1 sans + 1 mono, same family when possible |
| Editorial / blog | 18–21px | 1.25–1.333 | 60–70ch | serif with true italics; `hyphens:auto` needs `lang` |
| Marketing / landing | 17–20px | 1.2–1.25 + a separate display tier | 45–60ch; hero ≤ ~20ch/line | `clamp()` max ≤ 2.5× min or zoom fails WCAG 1.4.4 |
| Slides | ≥ 4.4% of slide height (24pt) | 1.333–1.5, 2–3 levels | ≤ 6 lines, ~40 words | headings ≈ 6.7%; aim for 7:1 contrast (projectors) |
| Dashboard / tool chrome | 13–14px; chrome 12–13 (11 floor) | 1.125 | n/a | tabular numbers everywhere data updates |
| Mobile | iOS 17pt body (11 floor), Android 14–16sp | 1.2 | full width minus margins | Dynamic Type / font scale to 200% |
| TV / 10-foot | ≥ 28px @1080p | 1.25 | short | tvOS body 29pt |
| Game HUD / menus | **glyph height** ≥ 26px @1080p console, 18px PC | n/a | ≤ 80 chars, sentence case for > 2 lines | "large text" contrast exemption only from 52px (console) |
| Terminal UI | the user's font | n/a | 80 cols | hierarchy by bold, dim, reverse, color and position |

## Rules that hold everywhere

- **Line height drops as size rises:** body 1.5–1.65, subheads 1.15–1.3, display ≥ 48px 0.95–1.1.
- **Tracking:** lowercase body 0; negative tracking levels off near −0.02em for display (Inter curve; `tracking-tighter` −0.05em is too tight). **All caps need +5–12%** ★. Use one caps tracking value for the whole UI.
- **No caps below 12px** ★. Caps labels look best at ≥ 13px.
- **Condensed and display faces are for display sizes** ★ (flagged under 14px): numbers, ≤ 2-word labels, plates. They hurt in sentences, near the size floor, in German (+30–40% length), with CJK fallbacks, and under glitch effects.
- **≤ 3 families** ★: display, reading, mono. Give each one job.
- **Tabular numbers** for anything that updates or aligns; add `slashed-zero` for IDs.
- **Load real weights.** Faux bold or italic shows up with `font-synthesis: none`. Use `swap` for display and `optional` for body, plus a metric-matched fallback (`size-adjust`) to stop layout shift.
- **Light on dark reads heavier.** Drop one weight step for body in dark themes if the face allows.

## Stylized themes (cyberpunk, sci-fi, game)

Put the flavor in the **chrome face** and keep the **reading face** plain. Night City v3
(B6 benchmark) after David's 4/5 "word font needs work":

| Role | Face | Sizes |
|---|---|---|
| Chrome (mark, tabs, keys, plates, stat numbers, caps labels) | Chakra Petch: its chamfered letters echo the cut-corner frames | 13 caps label · 15 key/tab · 20 heading · 28 stat · 32 display |
| Reading (messages, notice text, docs) | IBM Plex Sans | 15 / 24, ≤ 68ch |
| Data (code, commands, timestamps, kbd) | IBM Plex Mono | 12–14 |

What changed from v2: the body went from 14/20 (1.43) to 15/24 (1.6); Barlow Condensed is no longer used at
11–13px; one caps tracking value (0.08em) replaced six different ones; and the stat labels dropped to
lowercase on mobile so they stop wrapping. Pick the chrome face from the genre's **shape language**
(chamfers, stencils, plates), not from "looks techy".

Always ship a plain-font option next to a stylized face (XAG 101).

## Astryx

- Its scale is geometric: `defineTheme({typography: {base, ratio}})`. Astryx's own advice is base 16 / ratio 1.25 for
  editorial and 12 / 1.125 for dense UI. Change base and ratio, not single sizes.
- Line heights snap to a 4px grid (1.5 for text under 20px, 1.4 for 20–31px, 1.25 at 32px and up).
- Text types: `body · large · label · supporting · code · display-1..3`. Use `<Heading level={1} type="display-1">` for a display h1.
- Its default body is **14px / 1.43**, a dense-app default. For chat or reading surfaces raise it.
- **Gotcha (found in B6):** Astryx re-declares `--text-*` tokens on the `[data-astryx-theme]` element,
  so overrides on `html` or `:root` do nothing. Put them on `[data-astryx-theme]`, or use `defineTheme`.
