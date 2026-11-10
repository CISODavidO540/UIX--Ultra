# Theme specimen report

| theme | missing roles | APCA fails | a11y |
|---|---|---|---|
| flight-deck-day | 21: state-hover, state-pressed, state-selected, state-disabled-opacity, viz-1, viz-2… | 1/106 | 95 |
| flight-deck-hc | 21: state-hover, state-pressed, state-selected, state-disabled-opacity, viz-1, viz-2… | 0/106 | 99 |
| flight-deck-night | 21: state-hover, state-pressed, state-selected, state-disabled-opacity, viz-1, viz-2… | 2/106 | 99 |
| ledger | 21: state-hover, state-pressed, state-selected, state-disabled-opacity, viz-1, viz-2… | 1/106 | 95 |
| master-control | 21: state-hover, state-pressed, state-selected, state-disabled-opacity, viz-1, viz-2… | 2/106 | 99 |
| studio-daylight | 21: state-hover, state-pressed, state-selected, state-disabled-opacity, viz-1, viz-2… | 1/106 | 95 |
| studio | 21: state-hover, state-pressed, state-selected, state-disabled-opacity, viz-1, viz-2… | 2/106 | 99 |

![grid](grid.png)

## flight-deck-day
- APCA Lc 58 < 60: `<span.c> // retry reads new token`
- contrast: Text contrast 3.61:1, needs 4.5:1
- contrast: Text contrast 4.28:1, needs 4.5:1
- landmark: No <main> landmark

## flight-deck-hc
- landmark: No <main> landmark

## flight-deck-night
- APCA Lc 54 < 60: `<p> text-3 · Placeholder and disabled only.`
- APCA Lc 55 < 60: `<span.c> // retry reads new token`
- landmark: No <main> landmark

## ledger
- APCA Lc 58 < 60: `<span.c> // retry reads new token`
- contrast: Text contrast 3.60:1, needs 4.5:1
- contrast: Text contrast 4.28:1, needs 4.5:1
- landmark: No <main> landmark

## master-control
- APCA Lc 52 < 60: `<p> text-3 · Placeholder and disabled only.`
- APCA Lc 53 < 60: `<span.c> // retry reads new token`
- landmark: No <main> landmark

## studio-daylight
- APCA Lc 58 < 60: `<span.c> // retry reads new token`
- contrast: Text contrast 3.60:1, needs 4.5:1
- contrast: Text contrast 4.29:1, needs 4.5:1
- landmark: No <main> landmark

## studio
- APCA Lc 53 < 60: `<p> text-3 · Placeholder and disabled only.`
- APCA Lc 54 < 60: `<span.c> // retry reads new token`
- landmark: No <main> landmark
