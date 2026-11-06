# Motion spec

Motion should explain what changed, where something came from, and that the
app heard you. If it does none of those, cut it.

## Durations

| Token | Value | Use |
|---|---|---|
| instant | 80ms | press feedback, color on hover |
| fast | 120–160ms | small elements, exits, toggles, tooltips |
| base | 200–240ms | cards, dropdowns, content swap |
| slow | 300–400ms | modals, drawers, page-level transitions |
| skeleton | 1200–1600ms | shimmer loop |

Bigger distance or bigger element means slightly longer. Mobile can be ~20% faster
than desktop. Nothing interactive should be over 400ms.

## Easing

| Token | Curve | Use |
|---|---|---|
| standard | `cubic-bezier(0.2, 0, 0, 1)` | moving between two on-screen states |
| enter | `cubic-bezier(0, 0, 0.2, 1)` (decelerate) | things arriving |
| exit | `cubic-bezier(0.4, 0, 1, 1)` (accelerate) | things leaving |
| spring | `cubic-bezier(0.34, 1.56, 0.64, 1)` | small playful pops only (badges, success checks) |

Never `linear` except for spinners and shimmer.

## Choreography

- **Exits are faster than entrances** (about 70% of enter duration).
- **Stagger** lists by 30–50ms per item, cap total stagger at ~300ms.
- **Animate transform and opacity only.** Avoid animating width/height/top/left (use `grid-template-rows: 0fr → 1fr` for collapse, or FLIP).
- **Origin matters**: menus scale from their trigger; drawers slide from their edge; toasts from where they live.
- **Interruptible**: hovering out mid-animation should reverse smoothly (CSS transitions do this; keyframe animations don't).
- **Skeleton → content**: fade content in over `base`; don't animate layout.
- **Shared elements**: use the View Transitions API (`document.startViewTransition`, `view-transition-name`) for list → detail.

## Reduced motion

Always ship:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

Reduced motion means remove movement, not feedback: keep opacity fades and color
changes, swap shimmer for a gentle pulse, remove parallax, autoplay and large
slides.

## Performance

- Use `will-change` only during the animation, never globally.
- Check for jank in DevTools Performance with 4× CPU throttle.
- Don't trigger layout in scroll handlers; use `IntersectionObserver` for reveal-on-scroll, and reveal once.
