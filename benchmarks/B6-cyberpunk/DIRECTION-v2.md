# Direction — B6 v2 "Night City"

Why v2: David on v1 (hazard label): **3/5**, "the blue one is way too everywhere
and the other stuff is kinda bland and does not fit cyberpunk".

## What the references showed (looked at, not copied; images not in the repo)

Cyberpunk 2077 menu screens (crafting, perks, in-world email) via
interfaceingame.com's critique and HUDS+GUIS:

| Observed | Rule we took |
|---|---|
| Every frame, label and tab is coral-red on red-tinted near-black | **Red is the chrome**, not a status. New `brand` family in the theme engine (themes need an identity color that isn't an error) |
| Cyan appears only on the selected tab, selected item, cursor | **Cyan = selected or live**, nothing else (open document, agent, running) |
| Yellow on quest notices and "!" markers | **Yellow = needs you**, nothing else (authorization, the "1 needs you" readout, send) |
| Rarity colors as thin left bars on item cards | Category color as edge bars, *only* for real categories (we tried bars on messages; the checker flagged them as decoration, correctly) |
| 1px frames with one cut corner; slanted tab ends | Cut corner on frames, keys, the notice and the *selected* tab only |
| "MODEL LINE 1.2001A", binary columns at the edges | One line of micro-data at the deck's edge, decorative (`aria-hidden`) |
| Condensed caps headers; title-case readable body; big numbers + small units | Barlow Condensed for plates and headers, Plex for reading, "18.4 K / CONTEXT" readouts |
| The in-world email: long text stays plain light text in a framed panel | Reading surfaces stay plain |

Not taken: the game's typeface, icons, art, or exact colors.

## System
- Theme: `themes/presets/night-city.json` (dark only, like Astryx's Gothic): base hue 18
  (red-black), brand 24 (coral), accent 98 (notice yellow, bright), active 196 (cyan),
  danger 340 (pushed toward magenta so a failure never reads as chrome), no blue.
- Same Astryx `ai-chat` frame and same agent pieces as v1.

## Scores
v1 88 A (David 3/5) → v2 93 A, Expression 55 → 100, 0 slop tells.
v2 graded **4/5** by David: "a lot better theme wise but word font probably needs some work".

## v3: type pass
The probe found three things wrong. Reading text was Astryx's dense default (14px / 1.43). Barlow Condensed was being used for 11–13px caps.
Caps tracking came in six different values. Rules now (`skills/ui-max/references/type-by-format.md`):

| Role | Face | Sizes |
|---|---|---|
| Chrome: mark, tabs, keys, plates, stat numbers, caps labels | Chakra Petch (chamfered letters, the same shape language as the cut corners) | 13 label · 15 key · 20 h · 28 stat · 32 display |
| Reading: messages, notice body, doc | IBM Plex Sans | 15 / 24, bubbles ≤ 68ch |
| Data: code, commands, timestamps, kbd | IBM Plex Mono | 12–14, tabular |

There is one caps tracking value (0.08em) and nothing in caps below 13px. The reading tokens are set on `[data-astryx-theme]`, because Astryx
re-declares them there. Result: 94 A, craft 72 → 77, and the type probe is clean. `compare-v2-v3.png`, `runs/nightcity-v2/`.
