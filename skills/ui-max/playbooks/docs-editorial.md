---
id: docs-editorial
title: Docs, blog, editorial, changelog
surface: Present
keywords: docs, documentation, reference, guide, tutorial, blog, article, editorial, long-form, essay, newsletter, changelog, release notes, knowledge base, case study
---
# Docs and editorial pages

**Core tasks:** find the page (search, nav) · read without friction · copy code · jump within a page · know if it's current.

**Must exist**
- Docs: three panes (nav · content · "On this page" rail). The TOC is sticky only in the rail, never in the body (NN/g). Use Diátaxis and don't mix a tutorial with reference on one page.
- Heading `#` anchors; code copy with an accessible name and "Copied" announced through `aria-live`; package-manager tabs that sync across the page; an old-version banner; search with empty, no-results and Esc states; prev/next; "last updated" in a `<time>`.
- Editorial order: kicker → headline → dek → byline + published/updated `<time>` → lead figure with caption → body with an h2 every 300–500 words → footnotes with ↩ backlinks.
- Changelog per Keep a Changelog: newest first, grouped Added/Changed/Fixed/Security, a permalink per entry, an RSS link, and each change said in terms of what it means for the user.
- Print styles. Long code wraps in print.

**Type** (`references/type-by-format.md`): docs body 16–17px with ratio 1.125–1.2 (h2–h4 all get used); editorial body 18–21px with ratio 1.25–1.333 and a serif with true italics; prose ≤ 75ch while code blocks may run 80–100 columns; one sans + one mono from the same family.

**Slop risks:** a hero on a docs page; a 36px weight-800 h1 from Tailwind `prose`; a fake reading-progress bar covering content; content hidden at `opacity:0` until a scroll reveal.

**Astryx (0.7.11, verified):** `documentation` (catalog landing), `documentation-technical` (numbered steps + code), `documentation-design` (prose + live examples + props table). Blocks: `Outline` (TOC, `useOutlineFromMarkdown`), `Markdown*`, `CodeBlock*`, `Citation*`. No blog/editorial or changelog template: `astryx build "blog article"` and `"changelog"` fall back to the app shell.
