# Skeleton loaders

## When

- Content whose layout you know ahead of time (cards, lists, profiles, tables): **skeleton**.
- Actions with unknown duration on a single control: **inline spinner** in the control.
- Long jobs (> 10s, uploads, exports): **determinate progress bar** with text.
- Under ~150ms: **nothing**. Delay the skeleton so fast loads don't flash.

## Rules

1. **Same box as the real thing.** Same width, height, padding, gap, radius. Swapping skeleton → content must cause zero layout shift (CLS 0).
2. **Shape mirrors content**: circle for avatars, 16:9 block for media, 1em bars for text with the last line ~60% width, real button sizes.
3. **Use real count** when known (3 items cached last time → 3 skeletons), otherwise fill the viewport, not more.
4. **Static chrome is real**: headers, nav, labels, and buttons that don't depend on data render immediately; only the data is skeleton.
5. **Low contrast**: ~6% black on light, ~8% white on dark. Shimmer ~10–15%.
6. **Shimmer moves left → right** (reading direction; flip for RTL), 1.2–1.6s, ease-in-out.
7. **Accessibility**: container gets `aria-busy="true"` and `aria-live="polite"`; skeleton pieces get `aria-hidden="true"`. Set `aria-busy="false"` when done.
8. **Reduced motion**: no sweeping shimmer; a slow opacity pulse is fine.
9. **Swap in with a fade** (`duration-base`), stagger list items lightly.
10. **Errors replace skeletons**: never leave a skeleton spinning forever; time out to an error state with retry.

## Patterns

```html
<ul aria-busy="true" aria-live="polite">
  <li class="sk-card sk-delay" aria-hidden="true">
    <div class="sk sk-avatar"></div>
    <div class="sk sk-title"></div>
    <div class="sk sk-text"></div>
    <div class="sk sk-text"></div>
  </li>
</ul>
```

React: `scaffold/react/AsyncView.tsx` forces loading / empty / error / success
to be handled. With Suspense, put the skeleton in the `fallback` and keep it
next to the component it mirrors so they change together.
