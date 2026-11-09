# Direction — Hermes run view (fix of `before.html`)

Written after `omni plan` scored the vibe-coded page **34 F** with 9 slop tells.
More than two P1 tells fired, so per the plan this is a recomposition, not a patch.

Surface: **Operate** (secondary: Monitor). Routed to playbook `agent-chat`.
The before page was a tool wearing a landing-page hero (tell 10's cousin): a
marketing headline, vanity stats and feature cards sat above the only part that
does anything, the chat. All of that goes.

Concept: **A run is an electronic checklist.** Like a cockpit ECL, every tool
call is a checklist line that reads `ITEM ........ STATE`; completed lines turn
quiet, the open line is bright, and a line that needs the operator's action is
the only amber thing on the screen. The user reads the run top to bottom, the
way a crew reads a checklist.

Top tasks (from the playbook, in order):
1. See what Hermes is doing and what it did (transcript + checklist)
2. Approve or deny the one risky action, knowing exactly what it runs
3. Stop without losing work (Esc)
4. Open a failed step's output
5. Send or queue the next message

Real content kept from the before page: the test-suite conversation
(46 passed, 1 failed in `session.test.ts`, the token-refresh 401, the cache-write
fix), the nav (Runs, Agents, Settings, Docs). Vanity stats ("10x", "99.9%") are
replaced by facts that drive decisions: context used, elapsed time, tool calls.

## References

- **Boeing 777/787 electronic checklist (ECL)** → leader-dot lines `ITEM .... STATE`;
  completed items go green and recede; the current item is boxed; "closed-loop"
  items tick themselves when the system senses completion. Signature detail:
  leader dots and the boxed current line.
- **Airbus ECAM colour philosophy** → colour is a status code, never decoration:
  green = done/normal, amber = needs crew attention, red = failure, white = text.
- **IBM 1970s design guidelines / Plex** → IBM Plex Sans for content (engineered
  for screens, clear numerals), Plex Mono only for commands and output.
- **Swiss railway (SBB) signage** → restraint: neutrals everywhere, one signal.
- **Ink stamp on a paper checklist** → a done mark lands once, never loops.

## System

- Display (bg): blue-black graphite `#14181d`; panel `#1a1f25`; keyline `#2b333c`.
- Text: off-white `#e3e7eb`; secondary `#cad1d7` (raised from #b9c1c9 so 14px secondary sentences reach APCA Lc 75).
- Status, ECAM rules: done `#94d4a3` (muted green), attention `#f2b552` (amber, the only accent),
  failure `#ff9a91`. Lightened after the first check: the darker reds/greens failed APCA (Lc 40–59) on the dark panel. No blue/violet anywhere.
- Type: IBM Plex Sans 14/16/20; Plex Mono 13 for commands, output, numbers.
  Sentence case. One uppercase level (checklist state words), tracked 0.06em.
- Shape: 1px keylines, 4px radius, no shadows except the approval card.
- Motion: one loop only, the running line's indicator, only while running.
  State changes 120–160ms on color/opacity. Reduced motion removes the loop.

## Ornament budget

1. The approval line (amber frame, the only raised element).
2. The running step indicator (the only animation).
3. Leader dots on checklist lines (the signature, functional: they connect item to state).

## Not

- No hero, no headline, no feature cards, no stat tiles.
- No gradients, glass, glow, emoji icons.
- No cyan/magenta, no uppercase-mono on every label, no brackets or scanlines.
- No chat bubbles: the transcript is a document with a left edge.
