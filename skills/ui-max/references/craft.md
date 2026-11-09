# Craft: the details that make it feel finished

"Intricate" doesn't mean more decoration. It means many small correct
decisions that users feel without seeing. Work through this list during build.

## Type

- **Scale with a ratio.** Pick 1.2 (dense tools) or 1.25 (apps) or 1.333 (editorial). 5–7 sizes total. `omni check` Craft drops above 9.
- **Weight carries hierarchy before size and color.** Typical tool: 400 body, 500 labels/buttons, 600 headings. Avoid 700+ in dense UI.
- **Line height by size**: body 1.5, UI labels 1.25–1.35, headings 1.1–1.2, big display ≤1.05.
- **Tracking by size**: small caps/labels +0.04–0.08em; body 0; headings ≥32px −0.01 to −0.02em.
- **Numbers**: `font-variant-numeric: tabular-nums` wherever numbers update or align (timers, tokens, costs, tables). Slashed zero in mono for IDs.
- **Measure**: 60–75 characters for prose (`max-width: 68ch`). Chat bubbles included.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.
- Truncate with `text-overflow: ellipsis` + `title` attribute; never truncate the identifying part (keep the end of file paths: `…/src/check.js`).

## Color

- Define colors in **OKLCH**; ramps keep perceived lightness steady across hues.
- **Tint the neutrals** toward the concept's material (warm paper, cool steel). Pure gray reads as unchosen.
- **Dark UI elevation = lighter surface**, not bigger shadow. Surfaces step +3–5% L each level.
- Borders: 1px, low-alpha of the text color (`oklch(from var(--text) l c h / 0.12)`), so they adapt to any surface.
- Text tokens: text (≥ 7:1 ideally), muted (≥ 4.5:1), faint/disabled (≥ 3:1 and never carrying info alone).
- Status colors only for status. If the accent is amber, warning must look different (icon + label).
- Never `#fff` on `#000`.

## Space and alignment

- 4px base. Common steps: 4, 8, 12, 16, 24, 32, 48, 64.
- **Proximity encodes grouping**: space inside a group < space between groups (e.g. 8 vs 24).
- One left edge per column. Icons optically aligned with text cap height, not box top.
- Density modes for tools: `--row-h: 32px` compact / 40px comfortable.
- Padding of a control ≈ 0.75× its font size vertically, 1–1.5× horizontally.

## Controls

- Hit area ≥ 24px (44px touch). Extend with padding or `::after` inset, not bigger visuals.
- **Press feedback within 100ms**: `transform: translateY(1px)` or `scale(.98)` on `:active`, no transition on the press.
- Focus: `:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px }`. Keep a real outline (forced-colors safe).
- Disabled: lower contrast + `cursor: not-allowed` + explain why (tooltip or helper text). Prefer `aria-disabled` so it stays focusable.
- Primary action: one per view. Secondary is quieter, not just a different color.
- Keyboard hints in UI (`kbd` chips) for the 2–3 most frequent actions.

## Surfaces and depth

- Pick borders **or** shadows as the main separator. Mixing both everywhere is noise.
- Shadows: two layers (ambient + key), low opacity, tinted toward bg. Two or three levels only.
- Scroll containers: edge fade or 1px border when content is cut; sticky headers get a border only when stuck.
- Radius: nested radius = outer − padding. Same radius family everywhere.

## Motion (see motion.md)

- 100–150ms feedback, 200–300ms panels, ≤ 500ms anything. Exits ~70% of entrances.
- Ease-out for entering, ease-in for leaving, `cubic-bezier(.2,.8,.2,1)` as a good default.
- Animate only `transform` and `opacity`. Never `width/height/top/left/box-shadow` on many nodes.
- Stagger lists ≤ 30ms per item, ≤ 6 items, then all at once.
- Skeleton delay 150–300ms; once shown keep ≥ 300ms.

## Content

- Copy is UI. Buttons are verbs ("Approve command", not "OK"). Errors say what happened + what to do.
- Empty states: why it's empty + the one action that fills it.
- Timestamps relative under 24h ("3m ago") with absolute in `title`.
- Units, counts and plurals correct ("1 step", "2 steps").
- Real data at real density. Test the longest name, the 0 case, the 1,000 case.

## Finish checklist

- [ ] Type sizes ≤ 7, weights ≤ 3, families ≤ 2 (+mono)
- [ ] Numbers tabular where they align or update
- [ ] Every text token passes contrast on every surface it appears on
- [ ] Grouping readable when squinting (spacing, not boxes)
- [ ] Focus ring visible on every control, in order
- [ ] Longest real string doesn't break layout at 390px
- [ ] Empty, error, loading copy written and visible via state switcher
- [ ] Ornament only on the budgeted elements
