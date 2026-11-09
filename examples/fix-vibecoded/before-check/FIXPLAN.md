# Fix plan — before.html

Now: **34 F**, gate **FAIL**, 9 slop tells, a11y 53/100.

Use case: **AI chat / agent console** (playbook `agent-chat`, matched: agent, chat, hermes, tool call).

Work top to bottom. After each block, re-run `omni check` and look at the screenshots.

## P0 — blocks use / fails the gate

1. **a11y:contrast** — Text contrast 2.36:1, needs 4.5:1 — <footer> © 2026 Hermes AI. Made with 💜 and AI.  
   _verify: omni audit shows no critical/serious_
2. **a11y:input-label** — Form field has no label (placeholder is not a label) — <input>   
   _verify: omni audit shows no critical/serious_
3. **a11y:tap-target** — Target is 72×17px (min 24, ideal 44) — <a> Dashboard  
   _verify: omni audit shows no critical/serious_
4. **a11y:tap-target** — Target is 47×17px (min 24, ideal 44) — <a> Agents  
   _verify: omni audit shows no critical/serious_
5. **a11y:tap-target** — Target is 54×17px (min 24, ideal 44) — <a> Settings  
   _verify: omni audit shows no critical/serious_
6. **a11y:tap-target** — Target is 34×17px (min 24, ideal 44) — <a> Docs  
   _verify: omni audit shows no critical/serious_
7. **a11y:tap-target** — Target is 20×20px (min 24, ideal 44) — <button.icon-btn> 📎  
   _verify: omni audit shows no critical/serious_
8. **a11y:focus-visible** — Keyboard focus has no visible indicator (outline/box-shadow) — <input>   
   _verify: omni audit shows no critical/serious_
9. **responsive** — Horizontal scroll at 390px (810px). Offenders: <div.container> right=1200, <nav> right=1180, <div.nav-links> right=1180, <a> right=956  
   _verify: mobile-full.png has no sideways scroll_

## P1 — why it reads as vibe coded

1. **slop:Feature-tile grid** — Re-layout: rank the items. Give the most important one more space, or turn them into a list/table with real content. Evidence: <div.features> 🤖 Smart Agents Deploy intelligent agent  
   _verify: tell no longer fires_
2. **slop:Center stack** — Re-layout: commit to a grid with a left edge. Centering everything means no composition was chosen. Evidence: 5/8 text blocks centered  
   _verify: tell no longer fires_
3. **state:focusVisible** — Add :focus-visible rings (2px outline, offset 2px, 3:1 contrast) to every focusable element.  
   _verify: check shows focusVisible ✔; force it with ?state= and screenshot_
4. **state:active** — Add :active / pressed feedback (≤80ms).  
   _verify: check shows active ✔; force it with ?state= and screenshot_
5. **state:disabled** — Style :disabled / [aria-disabled] distinctly from enabled (and explain why where useful).  
   _verify: check shows disabled ✔; force it with ?state= and screenshot_
6. **state:loading** — Add loading UI: skeletons that match the final layout (aria-busy), button busy state that blocks double submit.  
   _verify: check shows loading ✔; force it with ?state= and screenshot_
7. **state:empty** — Design the empty state: why it is empty + the one next action.  
   _verify: check shows empty ✔; force it with ?state= and screenshot_
8. **state:error** — Design error states: plain cause + retry, keep user input, role="alert".  
   _verify: check shows error ✔; force it with ?state= and screenshot_
9. **slop:Tech gradient** — Recolor: drop the blue/violet gradient; use a flat surface and spend color on one meaningful element. Evidence: <div.logo> ✨ Hermes AI; <section.hero> Your AI Agent, Supercharged 🚀 Hermes au  
   _verify: tell no longer fires_
10. **slop:Default accent hue** — Recolor: derive the accent from the concept/brand. Framework default swatches and indigo/violet read as unchosen. Evidence: #22c55e (Tailwind green-500) ×1  
   _verify: tell no longer fires_
11. **slop:Unearned blur** — Remove: keep blur only on one real overlay (modal/sheet). Solid surfaces for everything else. Evidence: <div.stat> 99.9% Uptime; <div.stat> 10x Faster Workflows  
   _verify: tell no longer fires_
12. **slop:Monument stat** — Remove: big numbers that nobody acts on. Keep a number only if it is real and drives a decision; size it as data, not decoration. Evidence: <div.num> 99.9%; <div.num> 10x  
   _verify: tell no longer fires_
13. **slop:Default type** — Re-typeset: pick a face for a reason (concept, density, numerals). Inter/system is fine only when it is a stated decision. Evidence: primary face: Inter  
   _verify: tell no longer fires_
14. **slop:Ornament everywhere** — Remove: reserve glow/brackets/chamfers for 2–3 elements that carry state (active step, approval, connection). Everything else plain. Evidence: 7 ornamented elements (6 glow boxes, 0 glow text, 1 brackets/chamfers/patterns) of 52; <section.hero> Your AI Agent, Supercharged 🚀 Hermes au  
   _verify: tell no longer fires_
15. **slop:Emoji icons** — Remove: use one consistent SVG icon set, or no icons. Evidence: <h1> Your AI Agent, Supercharged 🚀; <h2> Powerful Features ⚡  
   _verify: tell no longer fires_
16. **motion** — 3 infinite animations (<button.btn> glow, <div.icon> float, <div.dot> pulse). Keep at most one, and only while something is actually working.  
   _verify: one or zero loops_
17. **motion** — Animates but ignores prefers-reduced-motion. Add a reduce block that removes movement (keep opacity/color feedback).  
   _verify: check shows reduced motion: yes_

## P2 — craft and polish

1. **craft** — 12 text elements below APCA target (−20)  
   _verify: craft note gone_
2. **craft** — 6 unique radii (budget 4) (−4)  
   _verify: craft note gone_
3. **contrast** — Lc 15 < 60: <footer> © 2026 Hermes AI. Made with 💜 and AI.. Raise the text token (muted/secondary) rather than per element.  
   _verify: APCA fails drop_
4. **contrast** — Lc 28 < 60: <div.label> Uptime. Raise the text token (muted/secondary) rather than per element.  
   _verify: APCA fails drop_
5. **contrast** — Lc 28 < 60: <div.label> Faster Workflows. Raise the text token (muted/secondary) rather than per element.  
   _verify: APCA fails drop_
6. **motion** — Layout/paint-heavy transitions: all. Animate transform/opacity only; never transition: all.  
   _verify: no heavy transitions_
7. **a11y** — No forced-colors handling: make sure focus uses outline (not only box-shadow) and borders stay visible in High Contrast.  
   _verify: test with DevTools → Rendering → forced-colors_
8. **type** — 11 font sizes in use. Collapse to a scale of ~6–8.  
   _verify: fontSizes ≤ 9_
9. **type** — Numbers without tabular-nums: add font-variant-numeric: tabular-nums to data.  
   _verify: tabular numerals on numeric nodes_

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
