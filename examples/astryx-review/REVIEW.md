# Review: what UI-MAX was missing, and where it doesn't click with Astryx

Method: instead of reasoning about Astryx from its docs, I built its real
`ai-chat` page template (React 19, `@astryxdesign/core` 0.7.11, neutral theme),
ran `omni check` / `omni plan` on it, then tried to put an OMNI theme on it.
Screenshots and the stat sheet are in this folder.

## A. Bugs this exposed in our own checker (fixed)

Our checker had only ever been run on pages we wrote. On a mature system it was wrong three ways:

| Symptom on stock Astryx | Cause | Fix |
|---|---|---|
| "Text contrast 1.00:1" on white text on a dark page | Translucent backgrounds (rgba overlays) were ignored and the page fell back to "white" | `audit.js` / `craft.js` composite every translucent layer down to the page canvas, and respect `color-scheme: dark` |
| Contrast and tap-target failures on 1×1px text | Screen-reader-only labels were measured as visible | sr-only elements skipped; drag separators exempt from target size |
| "219 raw color literals" | Token definitions scoped under `:where([data-astryx-media])` instead of `:root` were counted as hard-coded colors | Only literals in real properties count; custom-property declarations are the token layer wherever they live |

Score moved from **71 C to 80 B** with no change to the page. Our own pages kept their scores (tests 14/14).

Not yet verified: "no visible focus on the message input" may be a fourth false positive (the composer card may show focus via `:focus-within`).

## B. What stock Astryx gives you (measured)

- Access 86, States 100, Responsive 95, Originality 100: the hygiene is real, and it comes free.
- **Expression 35**: colorfulness 1.5, 0.1% of the first screen carries color. Stock Astryx is exactly "clean but not good enough to flex" (David's v1 verdict).
- Muted text passes Astryx's own bar (WCAG 2, 4.5:1) but not ours (APCA Lc 60): 45 elements.
- Template vs our agent-chat playbook: it has tool-call rows, an artifact panel, markdown and code. It has **no approval prompt, no stop control, no context meter, no empty or loading state**.

## C. Where the two don't click

1. **Attribute collision.** Astryx sets `data-theme="light|dark"` on `<html>` (its mode switch). OMNI uses `data-theme="<theme name>"`. Loaded together, they fight. The bridge keys off `data-astryx-theme` + `data-theme=light|dark` instead; OMNI should move to its own attribute (`data-omni-theme`).
2. **Different token vocabulary.** Astryx: `--color-background-body`, `--color-text-primary`, `--color-<status>` / `-muted` / `--color-on-<status>`, 56 data-viz variables, a type scale, control sizes, spacing, a radius multiplier, motion `tempo`/`character`. OMNI: `surface-0`, `text-1`, `ok-solid`… Now bridged for color with `omni themegen --astryx` (`themes/astryx/astryx-<family>.css`). Not bridged: type scale, control sizes, spacing, radius, motion, data viz, syntax.
3. **No `active` family in Astryx.** It has info / success / warning / error. OMNI's fifth status ("running / on air / current") has nowhere to go; exposed as `--omni-active-*` for our own compositions.
4. **Mode model.** An Astryx theme is one object with `[light, dark]` tuples plus `mode`, and contrast/motion are `adaptations`. OMNI ships separate named themes per mode. The research said the same thing: modes should be axes, not theme names.
5. **A palette is not the look.** The bridge worked (every mapped token changed) and the page looked almost the same: both are near-black neutrals. The flight-deck identity lives in *components* (tinted status rows, lit keys, zone edges, the master caution), not in the palette. To carry a concept into Astryx you need its `defineTheme({ components })` overrides and custom variants, or our own blocks composed from Astryx primitives. We have used neither.
6. **Opposite starting rules.** Astryx: "start every page from a template, keep its frame". UI-MAX: "write a direction, recompose". Our v2 pages are hand-written HTML with zero Astryx components, so the two were never actually combined.
7. **Different contrast standards.** Astryx guarantees WCAG 2; we gate on APCA as well. A stock Astryx page will always lose Craft points with us unless the theme raises secondary text.
8. **Stack.** Astryx is React 19 + StyleX. We still don't know what Hermes is built with.

## D. What I was missing overall

- **Calibration.** A checker tuned only on its own output is grading its own homework. It needs a reference set of good third-party pages (Astryx templates are now the first).
- **Components over tokens.** Rounds 3–4 went deep on the theme engine. David's complaints (structure, vibe-coded controls) were about components and composition, which tokens can't fix.
- **Real integration tests.** I recommended Astryx templates in every playbook without building one.
- **The playbook as a test.** Playbook must-haves (approval, stop, context meter, states) are a checklist a human reads. They should be checks that run against a page.
- **Still open from earlier rounds:** live streaming and stick-to-bottom, Ctrl+K palette, mode axes, colorblind simulation, baselines in CI, David's pick between the two concepts.

## E. Proposed next step

Build the flight-deck run view **on Astryx**: `ai-chat` template as the frame, the OMNI bridge for tokens, and the missing pieces (approval bar, master caution, grounded step rows, context meter, states) as Astryx `components` overrides and blocks. Then `omni diff` stock vs themed. That is the first real test of "Astryx for vocabulary, UI-MAX for judgment".
