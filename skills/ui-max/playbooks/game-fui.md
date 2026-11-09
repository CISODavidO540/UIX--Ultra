---
id: game-fui
title: Stylized / sci-fi / game-like UI
surface: any (themed)
keywords: cyberpunk, sci-fi, fui, hud, game, retro, terminal theme, neon, futuristic, stylized, themed
---
# Stylized / FUI

Read `references/stylized-themes.md` first. Rule: animate the chrome, never the work; every effect reports real state.

**Must exist:** Effects Full / Subtle / Off; sound off by default; focus that survives clip-path and forced-colors; reading surfaces plain; one ambient loop max while live.

**Slop risks:** cyan + magenta on near-black (now a recognized AI tell), `// LABEL` uppercase mono everywhere, brackets and scanlines on every panel. Derive the look from a concept and non-web references (instrument panels, signage, film FUI), per `references/direction.md`.

**Concepts & themes**
- Concept-first (see direction.md), then a preset from the concept's material. `flight-deck-*` and `studio` are worked examples of stylized-but-usable.
- Always ship a plain/high-contrast theme next to the stylized one.

**Astryx:** any template + a custom theme (CSS variable overrides; `astryx init --features theme` writes `theme.template.ts`; see `theme-showcase`). Keep Astryx's structure; put ornament in a separate pseudo-element layer so `data-fx="off"` returns plain Astryx.