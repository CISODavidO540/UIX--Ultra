# Fix plan — examples/fix-vibecoded/v2-flightdeck/index.html

Now: **95 S**, gate **PASS**, 0 slop tells, a11y 94/100.

Use case: **AI chat / agent console** (playbook `agent-chat`, matched: agent, chat, hermes, tool call).

Work top to bottom. After each block, re-run `omni check` and look at the screenshots.

## P1 — why it reads as vibe coded

1. **expression** — colorfulness 22.7 (low; 25+ wanted). Give color a job (zones, states, controls) and make regions visible — see taste.md 2026-11-09.  
   _verify: expression ≥ 70_

## P2 — craft and polish

1. **craft** — 9 unique shadows (budget 4) (−6)  
   _verify: craft note gone_

## Use-case must-haves (not machine-checkable — confirm by hand)

- [ ] Step card state machine: pending → running → awaiting approval → done | error | denied, with elapsed time; errors auto-expand.
- [ ] Approval prompt with the exact command, pinned so it can't scroll away; focus moves to it.
- [ ] Stick-to-bottom only while the user is at the bottom; otherwise a "New output" pill.
- [ ] Esc stops (keeps work), Ctrl/Cmd+Enter sends, Ctrl/Cmd+K palette, queued messages.
- [ ] Streaming markdown that closes unfinished fences; code blocks with copy.
- [ ] Context/token meter that warns at ~70% / 90%; per-message cost on hover.
- [ ] States: empty session, first-run, thinking (label + elapsed), disconnected/retrying, rate-limited, long output (collapse), very long session (virtualize).

## Before rebuilding

- If more than two P1 slop tells fire, patching won't fix it: write DIRECTION.md (concept, 3–5 non-web references, ornament budget) and recompose. See `skills/ui-max/references/direction.md`.
- Keep what works: real content, working logic, any states that already exist.
- Prove it: `omni diff before after` must show no regressions.
