---
id: slides-presentation
title: Slides / presentation mode
surface: Present
keywords: slides, slide deck, deck, presentation, pitch, keynote, talk, reveal, speaker notes, presenter
---
# Slides and presentation pages

**Core tasks:** present one idea per slide · move forward and back from keyboard, clicker or touch · see notes and time (presenter) · read it later on a phone.

**Must exist:** decide between a fixed canvas (Keynote/Pitch, scaled uniformly) and responsive cards (Gamma); arrow/space/PageDown keys; progress; deep link per slide (URL hash); `?` key help; presenter view (notes, next slide, elapsed time and clock); slide changes announced to screen readers through a title live region; a scroll view at phone widths (reveal.js does this automatically); print/PDF with notes optional.

**Type:** 24pt body is the accessibility floor and headings are ~36pt. On the web that is **4.4% / 6.7% of slide height** (31px / 47px on a 700px canvas, 48px / 72px at 1080p). Write it as `font-size: max(4.4cqh, 1rem)` on the slide container. Use ≤ 6 lines and ~40 words per slide, line-height 1.1–1.3, ratio 1.333–1.5 with only 2–3 levels, and aim for 7:1 contrast because projectors wash out color.

**Motion:** auto-animate only between slides that share elements, and turn it off under reduced motion.

**Slop risks:** a gradient title slide; ten bullets in 18px; every slide fading in letter by letter.

**Astryx:** no slide template (`astryx build "slide deck"` → app shell). Build the slide frame yourself; use Astryx `Heading type="display-*"`, `Kbd`, `ProgressBar`, `Timer`, `Markdown`, `CodeBlock` inside it.
