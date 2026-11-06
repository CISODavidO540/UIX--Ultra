# Stylized themes that stay usable (cyberpunk, sci-fi FUI, retro, etc.)

Full research: `reports/Stylized UI that stays usable.md`. Working example:
`themes/cyberpunk/` (`omni theme cyberpunk`).

## The one rule

**Animate the chrome, never the work. Every effect must report something real.**

A flat copy of a stylized look feels stiff because its glow and scanlines are
always on, so they tell the user nothing. Don't fix that by adding more ambient
animation. Tie effects to real state: the agent is streaming, a tool started,
approval is waiting, the connection dropped, an action succeeded.

## Map events to effects

| Event | Effect | Rule |
|---|---|---|
| Hover / press | glow pseudo-element fades in, cursor spotlight, 1px press | 80–150ms, opacity/transform only |
| Keyboard nav, palette open, session switch | **none** | keyboard actions never animate |
| Tool call starts | frame draws in, short label decodes, LED pulses | 200–350ms; decode only < 40 chars |
| Agent working | ONE ambient signal (conic border on the active step, or LED pulse) | loops only while live, stops on completion |
| Success / error | LED to steady color + icon + text; one ping or one glitch | glitch < 300ms, never loops, hue shift not red flash |
| Approval needed | steady warn frame, exact action text, focus moves to Allow | no looping attention grabber |
| First launch | boot / assemble sequence | ≤ 1.2s, skippable, once |

## No-effect zones

Message text, markdown, code blocks, diffs, the composer, inputs, dense tables,
long lists and error *words*. These get static frames at most. Readability wins.

## Budgets

- One ambient effect per view. At most ~3 decorative animations at once.
- Glow lives on a pseudo-element; animate its `opacity`, never `box-shadow`/`filter` on many nodes.
- No animated `backdrop-filter`. Blur ≤ 20px, static, with a solid fallback.
- `@property` conic borders: one or two live elements, paused when idle.
- Flash safety (WCAG 2.3.1): < 3 flashes/s, avoid saturated-red flicker.

## Legibility

- Tinted near-black backgrounds (`#0b0f14`–`#121212`), off-white text (`#d6dee8`–`#e0e0e0`). Never pure white on pure black (halation).
- Desaturated chrome; spend saturated color only on accent and status. If everything glows, nothing has hierarchy.
- Readable sans for content, monospace for data/labels, display/condensed fonts only at large sizes.
- Check *every* text token (muted, placeholder, disabled, timestamps) at 4.5:1, including on textured or blurred surfaces.
- Status is never color alone: LED + text label + icon.

## Clip-path and focus

Chamfered `clip-path` cuts off outlines and shadows. Either put the ring inside
the clip (`outline-offset: -5px`) or on an unclipped wrapper. Keep a real
`outline` (transparent when idle) so Windows High Contrast still shows focus.
Under `@media (forced-colors: active)` remove clip-paths and use system colors.

## User control (required)

- **Effects: Full / Subtle / Off**, defaulting from `prefers-reduced-motion` (and `prefers-reduced-transparency` where supported). "Off" is the clean flat theme, so the plain look is always one click away.
- **Sound: Off by default.** Short synthesized Web Audio blips on click/success/error, throttled, silent when the tab is hidden, `AudioContext` resumed only after a gesture.
- Reduced motion still keeps 100–150ms opacity/color feedback so state changes are acknowledged.

## Agent-app specifics

- Step cards with an explicit state machine: pending → running → awaiting approval → done | error | denied, with elapsed time and collapsible output. Errors auto-expand.
- Stick-to-bottom only while the user is at the bottom; otherwise show a "New output" pill.
- `Esc` stops and keeps work, `Ctrl/Cmd+Enter` sends, `Ctrl/Cmd+K` command palette.
- Context meter that changes color at 70% / 90%.
- Approval prompts show the exact command and can't scroll out of reach.

## Measure, don't trust compliments

The aesthetic-usability effect means users will praise a stylish theme that is
slowing them down. Compare task times (send, approve, stop, find a session),
INP, and scroll frame drops on a low-end machine between the styled theme and the flat one.

## QA checklist for a reskin

- [ ] `omni audit` with no serious findings, run in each effect level
- [ ] Every component × state matrix (incl. empty, error, offline, streaming)
- [ ] Keyboard-only pass; focus visible everywhere, including inside clipped shapes
- [ ] Forced-colors mode (Chrome DevTools → Rendering → forced-colors)
- [ ] Reduced motion on: nothing moves, feedback still visible
- [ ] Grep for raw hex/rgb outside the token file
- [ ] 390px wide: no horizontal scroll, ≥ 24px targets
- [ ] Profile scroll on a long session with 4× CPU throttle
