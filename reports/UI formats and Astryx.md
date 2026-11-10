# UI formats, typography, and what Astryx covers

*2026-11-10. Asked after Night City v2 was graded 4/5: "a lot better theme wise but word font probably
needs some work … study different UI formats like chatboxes, default webpages for presentation and other
types of UI and GUIs … is Astryx doing anything in these".*

Sources: three research notes in `research_notes/UI formats/` (chat.md, presentation-web.md,
app-guis.md, about 9,500 words with inline citations), plus the Astryx 0.7.11 CLI queried directly
(`astryx template --list`, `astryx build "<format>"`, `astryx docs typography/*`).

## 1. The short answer

- **Every format has its own typography.** A chat wants 15–16px body text. Docs want a tight scale (1.125–1.2) because
  they use h2–h4. Editorial wants 18–21px and a serif. Slides want type sized as a fraction of the slide
  (≥ 4.4% of its height). Game and TV text floors are glyph *height* (26px at 1080p on console), and a terminal
  app can't pick its font at all. The full table is in `skills/ui-max/references/type-by-format.md`.
- **Astryx covers app formats well and presentation formats poorly.** It ships 57 page templates and 711
  blocks. Chat, dashboards, tables, forms, settings, detail pages, IDE, canvas, kanban, login and
  commerce all have real templates. Slides, blog/editorial, changelog, portfolio, onboarding, calendar, mobile
  tab-bar apps, game HUDs, TV, TUIs and 404 pages have none: `astryx build` falls back to the bare
  app shell.
- **The Night City font problem was a reading-text problem, not only a display-font problem.** Body text was
  Astryx's dense default of 14px at a 1.43 line height. The condensed display face was being used for 11–13px caps labels,
  and there were six different caps tracking values. v3 fixes all three, and `omni check` now measures them.

## 2. Formats at a glance

| Format | What matters most | Reading type | Astryx template(s) | UI-MAX playbook |
|---|---|---|---|---|
| AI chat / agent | streaming, approval, stop, history | 15–16 / 1.5–1.6, ≤ 70ch, headings ≤ 1.5× body | `ai-chat`, `ai-chat-landing` | agent-chat |
| Human messaging | threads, unread, presence | 15–16 / 1.45 (Slack 15/22, Discord 16/22) | `messaging-shell` (router misses it) | agent-chat |
| Support widget | launcher, handoff to a human, offline | 14–15 | none (`build` → `ai-chat`) | agent-chat |
| Landing / product marketing | first screen answers *what, for whom, why now* | 17–20 + separate display tier | `centered-hero`, `gallery-hero`, `side-gallery` | landing-marketing |
| Pricing | comparison, honest totals | 16–17, tabular | none (`RadioListPricingTier` block, `table-comparison`) | landing-marketing |
| Docs | find, read, copy code | 16–17, ratio 1.125–1.2, ≤ 75ch | `documentation`, `documentation-technical`, `documentation-design` | **docs-editorial** (new) |
| Blog / editorial / changelog | reading, dates, permalinks | 18–21, ratio 1.25–1.333 | none | **docs-editorial** (new) |
| Slides / presentation | one idea per slide, presenter view | ≥ 4.4% of slide height | none | **slides-presentation** (new) |
| Dashboards | glance, compare, drill in | 13–14 chrome, tabular | 7 `dashboard*` variants | monitor-dashboard |
| Tables / admin | find, filter, bulk-act | 13–14, tabular | 9 `table*` variants | data-table-admin |
| Forms / settings / login | finish without errors | 15–16 | 7 form, 3 settings, 4 login | forms-settings |
| IDE / editors / canvas / boards | panes, palette, never lose work | chrome 12–13 (11 floor) | `ide`, `canvas-editor`, `editor`, `file-explorer`, `kanban-board`, `incident-console` | **workspace-tool** (new) |
| Calendar | DST, overlaps, short events | tabular gutters | none (`Calendar` blocks only) | **workspace-tool** (new) |
| Commerce | total and delivery date up front, guest checkout | tabular prices | `product-detail`, `product-gallery`, `payment-form`, `checkout-wizard` | **commerce** (new) |
| Mobile app | thumb reach, sheets, back | iOS 17pt / Android 14–16sp | none (`MobileNav`, `BottomSheet` blocks) | mobile-app |
| Game HUD / FUI | glanceable, effects off switch | glyph height ≥ 26px @1080p console | none | game-fui |
| TV / kiosk | focus visible at 3 m, overscan | ≥ 28px @1080p | none | (game-fui / mobile-app notes) |
| Terminal UI / CLI | keys, piping, NO_COLOR | the user's font; bold/dim/reverse | n/a | **terminal-tui** (new) |

## 3. What Astryx does in these formats

**Strong.** These have real, opinionated templates with state:
- AI chat: transcript + tool calls + artifact panel, plus a zero-state landing. It also has 30+ chat blocks (composer
  with slash commands and mentions, dictation, scroll-to-latest button, system messages, tool-call statuses).
- Analytics: seven dashboard layouts (alert rail, cohort/funnel, scorecard with a prose rail…).
- Tables: inbox split-pane, tree, grouped, comparison, filter.
- Workspace tools: IDE, canvas editor, page editor, file explorer, kanban, incident console.
- Forms, settings, login, commerce checkout.

**Weak or missing**, and `astryx build` says so ("No template matched" → `shell-top-nav`):
- Slides, blog/editorial, changelog, portfolio, onboarding, TV, 404.
- Calendar, mobile tab-bar app and game HUD aren't flagged as misses, but the build still lands on the app shell.

**Router misses** to know about: `"team messaging app"` → app shell although `messaging-shell` exists;
`"e-commerce checkout"` → app shell although `checkout-wizard` exists; `"admin data table"` →
`table-collapsible` (usually you want `table`). Name the template directly when you know it.

**Typography in Astryx:**
- **Scale.** Geometric (`defineTheme({typography: {base, ratio}})`). The docs suggest base 16 / ratio 1.25
  for editorial and 12 / 1.125 for dense UI. Line heights snap to a 4px grid.
- **Default body is 14px / 1.43.** That suits dense apps but is small for reading-heavy chat, and Night City v2
  inherited it.
- **Overrides on `html` do nothing.** Astryx re-declares its `--text-*` tokens on `[data-astryx-theme]`,
  so overrides set higher up are ignored. Now noted in `references/astryx.md` and type-by-format.md.
- **No display or chrome face role.** `--font-family-heading` exists, but there is no separate "plate/label" face,
  so stylized themes add their own.

## 4. Night City v3 (typography pass)

| | v2 (graded 4/5) | v3 |
|---|---|---|
| Chrome face | Barlow Condensed | **Chakra Petch**: its chamfered letters match the cut-corner frames |
| Reading text | Plex Sans 14 / 20 (1.43) | Plex Sans **15 / 24 (1.6)**, bubbles ≤ 68ch |
| Caps labels | 11–13px, condensed, 6 different trackings | ≥ 13px, one tracking (0.08em) |
| Stat labels | 11px mono caps | 13px chrome caps; lowercase on mobile so they don't wrap |
| Timestamps | 12px sans | 12px mono, tabular |
| Type ramp | ad hoc | 12 meta · 13 label · 15 body/key · 20 heading · 28 stat · 32 display |
| `omni check` | 93 A, craft 72 | **94 A, craft 77**; type probe: 0 tiny caps, 0 small condensed |

Compare image: `benchmarks/B6-cyberpunk/compare-v2-v3.png`. v2's run is kept in `runs/nightcity-v2/`.

## 5. What changed in the toolkit

- **Type-system probe.** It's part of `omni check` craft and reports:
  - The dominant reading style. Below 14px, or below 16px with a line height under 1.5, costs −4.
  - Caps text under 12px.
  - Condensed faces under 14px.
  - Paragraphs over ~85ch.
  - Family count (budget 3) and distinct text-style count.

  Calibration on the same screen: v2 → craft 56 with three type findings, v3 → 77 and clean.
- **Five new playbooks:**
  - docs-editorial
  - slides-presentation
  - workspace-tool
  - terminal-tui
  - commerce

  Each has Astryx mappings that were checked against the CLI. The router was fixed too: "terminal" no longer sends a TUI to agent-chat, and "product page" now goes to commerce.
- **New reference: `references/type-by-format.md`.** It's linked from SKILL.md. The agent-chat and game-fui playbooks gained a **Type** line.

## 6. Open

- Slides and editorial have playbooks but no benchmark yet. Good next benchmarks: a docs page (B7) and a web deck (B8).
- The research suggests checks we haven't built yet:
  - glyph-height measurement for game/TV text (`measureText('hg')`)
  - `clamp()` max ≤ 2.5× min
  - slide type as a percentage of slide height
  - a pty harness for TUIs
