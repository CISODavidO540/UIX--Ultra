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
