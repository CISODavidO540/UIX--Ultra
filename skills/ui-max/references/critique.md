# Critique: look at your own screenshots

Run after `omni check`. Load `desktop-fold.png` and `mobile-full.png` with
`vision_analyze`. Ask specific questions; "does it look good?" gets flattery.

## Questions to send with the screenshot

Use this prompt (adapt the task names):

> You are a harsh senior product designer reviewing a screenshot. Do not praise.
> 1. In 3 seconds, what does the eye land on first, second, third? Is that the right order for the task "<top task>"?
> 2. Squint: which groups are visible? Is any group unclear or are two groups merged?
> 3. List every element that looks like generic AI/template UI, and why.
> 4. Alignment: list any element off the main left edges or baseline.
> 5. Is any text hard to read (size, contrast, line length)?
> 6. What looks unfinished (inconsistent radius, cramped padding, orphan words, misaligned icons, empty space with no reason)?
> 7. Name the three worst problems, most severe first, each with a concrete fix in CSS terms.

Zoom into dense regions with `region=[x1,y1,x2,y2]` for small text and icon alignment.

## Score (write it down)

| Dimension | 0–2 | Check |
|---|---|---|
| Point of view | | Could you guess the concept from the screenshot alone? |
| Hierarchy | | First thing seen = most important thing? |
| Grouping | | Squint test passes without borders doing all the work? |
| Typography | | Scale visible, mono only for data, ≤ 1 shouty level? |
| Color discipline | | One accent, with meaning; status only for status? |
| Finish | | Alignment, radii, padding consistent; no orphans? |
| States | | Empty/error/loading screenshots also look designed? |

**12–14**: show it. **9–11**: fix the three worst, then show. **≤ 8**: the
direction or the surface is wrong. Go back to step 2/3; don't polish.

## Fix in the register the problem is in

- Hierarchy/grouping/surface problem → change layout and spacing. Don't recolor.
- Palette/type problem → change tokens. Don't add decoration.
- Decoration problem → remove it; let scale, weight and space do the work.

## Rules

- Critique before fixing. Write the three worst problems first, then edit.
- One round of critique per iteration; max three iterations.
- Don't tell David it looks great. Tell him the stat line and what you'd still change.
