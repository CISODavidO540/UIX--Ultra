# Developing UI Taste and Running Critique (for developers who are not trained designers)

Evidence labels used below: **[Practitioner opinion]** = a respected practitioner's own advice, anecdotal; **[Secondary summary]** = an aggregator or third party paraphrasing someone; **[Empirical]** = a peer-reviewed or controlled study; **[Method doc]** = a published method or guideline from an established organization.

## 1. How respected designers and design engineers describe building taste, and which exercises they recommend

### Takeaway
Practitioners agree that taste is trained, not innate. The loop is: expose yourself to excellent work, turn each gut reaction into an articulated "why", rebuild or prototype what you study, and produce a large volume of your own work while your taste runs ahead of your skill (the Ira Glass "gap"). The most concrete exercises come from design engineers: slow-motion replay of recordings, recreating interactions in code, tracing gestures back to physical-world analogs, and treating your own daily frustrations as design prompts.

### Cited Findings
**Emil Kowalski (design engineer, Sonner/Vaul; ex-Vercel/Linear) [Practitioner opinion]**
- Seven methods from his essay "developing taste": (1) surround yourself with great work and keep a curated list of practitioners whose apps and writing you study; (2) ask *why* you like something, turn gut reactions into explanations and look for recurring patterns; (3) study rather than consume, analysing why an interaction feels right; (4) look past first impressions; (5) create regularly, since judgment comes from making; (6) get feedback from skilled people, which is faster than trial and error; (7) expect your early work to look weak, which means your taste is working. — [emilkowal.ski/ui/developing-taste](https://emilkowal.ski/ui/developing-taste)
- He advises against sorting work into simply good or bad: "don't label things as good or bad." Articulate the reasons instead. He also quotes Steve Jobs: "expose yourself to the best things that humans have done." — [emilkowal.ski](https://emilkowal.ski/ui/developing-taste)
- His public agent skill ("emil-design-eng", emilkowalski/skills repo) describes taste as a trained skill. It tells the agent to reverse-engineer animations and inspect interactions, and gives specific rules such as avoiding ease-in curves for UI feedback because they feel sluggish. Sourced from third-party descriptions of the skill, not read directly. — [instagit summary (secondary)](https://instagit.com/emilkowalski/skills/what-is-emil-kowalskis-design-engineering-philosophy/)

**Rauno Freiberg (design engineer, Vercel) [Practitioner opinion]**, from "Invisible Details of Interaction Design":
- **Slow-motion deconstruction:** replay screen recordings slowly to see how a gesture starts, moves and resolves, because intent and timing are hard to see at full speed. — [rauno.me/craft/interaction-design](https://rauno.me/craft/interaction-design)
- **Recreate interfaces** to build intuition and a shared vocabulary. — [rauno.me](https://rauno.me/craft/interaction-design)
- **Ask "why" of everyday interactions:** when should a swipe commit, does a gesture keep its momentum, what happens when a finger covers content? — [rauno.me](https://rauno.me/craft/interaction-design)
- **Trace interactions to physical analogs:** page turns come from books, card throws from playing cards, pinch from picking up small objects. "Great interaction design rewards learning by reusing metaphors." — [rauno.me](https://rauno.me/craft/interaction-design)
- "Analyzing and making sense of design details beyond just 'it feels nice' helps nurture taste." Insights come from making something and then stepping away, for example on a walk, and not from "sitting down and just thinking hard." — [rauno.me](https://rauno.me/craft/interaction-design)
- **Treat your own frustrations as prompts.** A lost scroll position led him to prototype a scroll landmark. Prototyping in code surfaces behaviour that thinking alone misses. — [rauno.me](https://rauno.me/craft/interaction-design)
- **Question your own motion:** removing an animation from a frequently used keyboard-shortcut menu made it feel faster. — [rauno.me](https://rauno.me/craft/interaction-design)
- From "Contrasting Aesthetics," on avoiding generic UI: use contrast deliberately, so one element differs for a reason; give every deviation a purpose ("authoring intent, purpose, and a sense of iteration"); remix styles from unrelated disciplines to widen the inspiration pool; hold one element constant while the style varies; match the intensity to the context (surprise suits first impressions and brand, not productivity tools). He notes that pure minimalism "often fails to surprise or force a moment of pause to ponder." — [rauno.me/craft/contrasting-aesthetics](https://rauno.me/craft/contrasting-aesthetics)
- His craft page doubles as a public swipe-file and copywork log: dozens of small interaction experiments (Exclusion Tabs, Radial Menu, Gooey Tooltip and others), each linked to a prototype. — [rauno.me/craft](https://rauno.me/craft)

**Karri Saarinen (Linear co-founder/CEO) [Practitioner opinion, via Figma summary]**
- Ten rules, including: treat the spec as the baseline and not the goal; "quality is not perfection" (start rough, but nothing ships below the bar); "the best design is opinionated," designed for a specific person rather than flexible for everyone; "the simplest way to increase quality is to reduce scope"; no handoff, because everyone owns implementation quality; "data can be a crutch," so Linear does not decide by A/B test and "to design with craft, you must develop and trust your intuition." — [Figma blog](https://www.figma.com/blog/karri-saarinens-10-rules-for-crafting-products-that-stand-out/)
- Linear does not use OKRs; it centralizes on strategic goals, which leaves room for quality and taste. — [First Round Review (secondary)](https://review.firstround.com/stripe-square-linear-product-taste)
- One framing from a Config talk summary: craft is knowing how to build a better-quality product, and taste is knowing how to make it distinctive. This is the newsletter author's interpretation. — [Genesys Growth newsletter (secondary)](https://newsletter.genesysgrowth.com/p/craft-taste-and-quality)

**Ira Glass, "the gap" [Practitioner opinion]**
- Beginners have taste good enough to see that their work falls short. The cure is volume: "It's only by actually going through a volume of work that you're going to catch up and close that gap." Transcripts differ slightly in wording, so check the original before quoting exactly. — [rsms.me transcript copy](https://d.rsms.me/stuff/ira-glass-taste.txt); [Writers HQ](https://writershq.co.uk/the-taste-gap-by-ira-glass/)
- Commentary: the gap can *widen* as taste improves, so it behaves like a moving horizon. — [Matt Rickard, "The Taste Gap"](https://blog.matt-rickard.com/p/the-taste-gap)
- Designer Alex Cornell says the same thing: you enter design because your taste is good enough, "the problem when you start is you're terrible!" — [Peter Yang / Behind the Craft](https://creatoreconomy.so/p/alex-cornell-best-designer-i-ever-worked-with)

**Dieter Rams, ten principles of good design [Method doc / canonical]**
- Innovative, useful, aesthetic, understandable, unobtrusive, honest, long-lasting, thorough ("nothing should be arbitrary or left to chance"), environmentally friendly, and "as little design as possible" ("less, but better"). — [Vitsœ](https://www.vitsoe.com/us/about/good-design)

**Julius Tarng (design engineer at Linear; ex-Facebook design tools, Origami)**
- Known for prototyping-led work and for arguing that design engineering is currently a "missed opportunity." I found no source in which he recommends copywork specifically. — [Dive Club podcast notes](https://metacast.app/podcast/dive-club/mGBcbC8Q/julius-tarng---dissolving-the-line-between-design-and-engineering/v65W3K8K)

### Inferences
- A developer-friendly taste regimen built from these sources: (a) keep a swipe file of 20-50 interfaces and interactions, each with a written one-line *why*, not just a screenshot; (b) once a week, recreate one admired component in code (copywork) and diff it against the original; (c) screen-record admired apps and step through them frame by frame; (d) ship many small experiments publicly, as on Rauno's craft page; (e) get critique from a few people who are better than you.
- "Opinionated defaults" and "design for someone in particular" (Saarinen) are the antidote to generic UI that comes up most often. Rauno's "purposeful contrast" offers a concrete mechanism: one deliberate deviation per surface, with a reason behind it.
- Rams' "thorough" principle and Vercel's guidelines (Section 3) turn taste into checkable details. This is the most adoptable layer for engineers.

### Gaps
- Jony Ive, Paco Coursey, Jordan Singer and Steve Schoger primary quotes on *how* to build taste were not retrieved: paco.me/writing/taste returned 404, and the remaining searches ran out of budget. Do not attribute specific exercises to them without sourcing.
- Physical-product study as a method appears only implicitly, through Rauno's physical analogs and Rams. I found no dedicated source for it.

## 2. Structured critique methods

### Takeaway
Run critique against stated goals rather than personal preference. NN/g's format (presenter, critiquers, a rotating facilitator, objectives agreed in advance, round-robin or quota prompts, reframing opinions as goal-linked questions) fits a small dev team. Pair it with an independent heuristic evaluation by 3-5 evaluators, then add fast perceptual checks: squint/blur, grayscale, 50% zoom, and empty, dense and error states.

### Cited Findings
- **NN/g design critique format [Method doc]:** a critique is a conversation about whether the design meets its objectives, not a judgment of the work. Roles are presenter, critiquers and a facilitator; rotate the facilitator so no single voice dominates. The facilitator shares scope, goals and the work in advance, picks a cross-disciplinary group, keeps time, takes shared notes and follows up with action items. — [NN/g, Design Critiques](https://www.nngroup.com/articles/design-critiques/)
- **Facilitation techniques:** *round robin*, where everyone speaks in turn, and *quotas*, for example two strengths and one improvement per person, used only to get discussion started. Reframe directive comments as goal-linked questions: "Yikes… that layout!" becomes a question about how the layout helps the user finish the task efficiently. — [NN/g](https://www.nngroup.com/articles/design-critiques/)
- **Presenter practice:** restate goals, personas and pain points first; tell the design as a story of decisions and inspirations; ask for specific kinds of feedback. Rules: don't take feedback personally, don't solve problems in the room, don't dwell only on negatives. Start small, with 30 minutes a week on one person's current work. — [NN/g](https://www.nngroup.com/articles/design-critiques/)
- **Heuristic evaluation procedure [Method doc]:** 3-5 people evaluate independently against Nielsen's 10 heuristics without seeing each other's findings, timeboxed to 1-2 hours. Pass 1 learns the flow; pass 2 logs violations and recommendations. Then cluster findings (affinity diagram) and prioritize as a team. A violation is not automatically a bug; it depends on context. — [NN/g, How to Conduct a Heuristic Evaluation](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/)
- **Kowalski's critique principle:** feedback from the *right* (skilled) people speeds growth; replace good/bad labels with reasons. — [emilkowal.ski](https://emilkowal.ski/ui/developing-taste)
- **Grayscale and squint tests (Refactoring UI lineage) [Secondary summary]:** design in grayscale first so that hierarchy has to come from spacing, contrast and size, then layer on colour. Pre-launch checks include the *squint test* (does the hierarchy survive blurring?) and the *grayscale test* (does it work without colour?). One skill listing argues against grayscale-first; it is an outlier. — [playbooks.com Refactoring UI skill summary](https://playbooks.com/skills/wondelai/skills/refactoring-ui); [Liferay design diary](https://liferay.design/articles/2021/diary-of-a-first-year-designer-refactoring-ui/); [DEV review](https://dev.to/updivision/book-review-refactoring-ui-by-adam-wathan-steve-schoger-2f7m)
- **Zoom/viewport check [Method doc]:** Vercel's guidelines tell you to check layouts on mobile, laptop and ultra-wide screens, and to zoom out to 50% to simulate ultra-wide. They also say to design empty, sparse, dense and error states, not just the happy path. — [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines)
- **Critique and parallel work [Empirical]:** in Dow et al. (ACM TOCHI 2010), nearly half of serial-condition participants reacted negatively to critiques of their work; no parallel-condition participant did. Having alternatives makes critique easier to absorb. — [Stanford/UCSD ProtoLab](https://protolab.ucsd.edu/?p=3561)

### Inferences
- A lightweight critique ritual for a dev team: (1) the author writes a 3-line goal statement; (2) everyone silently runs the squint, grayscale, 50%-zoom and state checks; (3) a round robin of "what's the goal / what works / what doesn't, as a question"; (4) the author picks the actions to take. This combines the NN/g, Refactoring UI and Vercel sources.
- Bring 2-3 alternatives to critique rather than one design; the Dow finding suggests this reduces defensiveness.

### Gaps
- The NN/g five-second-test article URL returned 404, so the 5-second test is unsourced here. Cognitive walkthrough was not fetched either. Both are standard methods but need citations before they are reported.
- NN/g's oft-cited figure (single evaluators find about 35% of problems; 5 evaluators about 75%) was not on the fetched page and is not verified here.
- I found no authoritative primary source for the "squint test" origin.

## 3. How skilled designers deconstruct why a UI feels good

### Takeaway
Experts make "feels nice" concrete by measuring and naming things: frame-by-frame motion analysis, physical metaphors, commit thresholds, which properties are animated, spacing and type in devtools, and an explicit checklist of "invisible details." Vercel's public guidelines are a ready-made deconstruction lens.

### Cited Findings
- **Motion and gesture deconstruction (Rauno) [Practitioner opinion]:** slow-motion replay; deciding *when an action commits* (light, reversible actions can fire mid-gesture, destructive ones should wait for release); continuous direct feedback during input (for example, scale during a pinch), with animation reserved for crossing thresholds; questioning animation on high-frequency actions. — [rauno.me](https://rauno.me/craft/interaction-design)
- **Vercel Web Interface Guidelines [Method doc]:** a categorized checklist (Interactions, Animations, Layout, Content, Forms, Performance, Design), with a section on using it with AI coding agents. Examples: `:focus-visible` rather than `:focus`; 44px touch targets and expanded hit areas for visuals under 24px; real `<a>` links so Cmd-click works; animate only `transform`/`opacity`; support `prefers-reduced-motion`; safe-area insets; use the "…" character and non-breaking spaces in "10 MB"; inline errors that focus the first error on submit; don't disable submit before submission; set `autocomplete`; give images explicit dimensions to avoid layout shift; virtualize long lists or use `content-visibility: auto`. — [vercel.com/design/guidelines](https://vercel.com/design/guidelines)
- **Visual hierarchy deconstruction (Refactoring UI) [Secondary summary]:** separate visual hierarchy from document hierarchy (h1/h2/h3 sizes don't need to map to app UI); use fewer borders, replacing them with spacing, shadows or background contrast; make primary actions prominent. — [Andrew's digital garden notes](https://knowledge-beryl.vercel.app/literature%20notes/Adam%20Wathan%20&%20Steve%20Schoger%20-%20Refactoring%20UI); [playbooks.com](https://playbooks.com/skills/wondelai/skills/refactoring-ui)
- **Kowalski:** reverse-engineer animations and inspect interactions (secondary description of his skill). — [instagit](https://instagit.com/emilkowalski/skills/what-is-emil-kowalskis-design-engineering-philosophy/)

### Inferences
- A practical teardown template for a developer: open devtools on an admired site and record (a) the type scale (sizes, line-heights, weights) and the ratio between steps; (b) the spacing values used and whether they sit on a scale; (c) the number of distinct greys and accents; (d) border vs shadow vs background separation; (e) motion durations, easings and the properties animated (use the browser's Animations panel or a slowed screen recording); (f) focus, hover, empty and error states. Then write one sentence per item on *why* it works. This combines the Rauno, Kowalski, Vercel and Refactoring UI sources.

### Gaps
- No primary source fetched gives specific numeric ratios used by named designers. Any such numbers would need sourcing.

## 4. How they iterate: divergence, constraints, principles, opinionated defaults

### Takeaway
There is controlled evidence that producing several alternatives in parallel beats refining one design serially, both on outcome quality and on the designer's confidence. Linear-style practice adds tight scope, an explicit quality bar, opinionated design for a specific user, and shared principles in place of rigid process.

### Cited Findings
- **Dow et al. 2010, parallel vs serial prototyping [Empirical]:** web ads created in the parallel condition significantly outperformed serial ones on click-through data and expert ratings. Independent raters judged them more diverse, and parallel participants gained more self-efficacy. Authors' explanation: developing alternatives "encourages investment in a creative process rather than one particular idea." — [ProtoLab UCSD](https://protolab.ucsd.edu/?p=3561); [Cardinal Path summary](https://www.cardinalpath.com/web-design-the-case-for-parallel-prototyping/)
- **Replication is mixed:** a physical-prototype follow-up by Dow was largely inconclusive. Murphy et al. (2022) found clear advantages for parallel prototyping in engineering design success and self-efficacy. A 2025 ICED study found first-year students *preferred* iterative work despite intending to work in parallel. — [Murphy 2022 PDF](https://edrl.engr.wisc.edu/wp-content/uploads/sites/142/2022/02/Murphy2022_Article_ComparingParallelAndIterativeP.pdf); [Cambridge/ICED 2025](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/5199FB635FF3E76F6C0B4DABDBBC9C2F/S2732527X25101739a.pdf/evaluation-of-self-directed-usage-of-parallel-and-iterative-prototyping-strategies-by-first-year-engineering-students.pdf)
- **Linear's iteration model [Practitioner opinion]:** start rough and iterate toward polish, but nothing below the bar reaches customers; reduce scope to raise quality; design opinionated products for a specific person; rely on shared values and principles rather than fixed process; rotate people across areas to keep ideas fresh. — [Figma blog](https://www.figma.com/blog/karri-saarinens-10-rules-for-crafting-products-that-stand-out/)
- **Make, then step away (Rauno):** prototype in code to surface surprises, then take a walk to synthesize. — [rauno.me](https://rauno.me/craft/interaction-design)
- **Constraints as a forcing function:** working in grayscale first forces hierarchy to come from spacing, size and contrast. — [playbooks.com Refactoring UI summary](https://playbooks.com/skills/wondelai/skills/refactoring-ui)
- **Principles as codified taste:** Rams' 10 principles and Vercel's guidelines are examples of written principles a team can review against; Vercel explicitly packages its guidelines for use by AI agents. — [Vitsœ](https://www.vitsoe.com/us/about/good-design); [Vercel](https://vercel.com/design/guidelines)

### Inferences
- For a developer or AI-assisted workflow: generate 3-5 deliberately divergent directions (different layout, type and colour strategies) before converging, critique them side by side, then refine one under a written principles document and a fixed quality checklist. The parallel-prototyping evidence supports the first step; Linear and Vercel practice supports the last.
- "Opinionated defaults" means making strong, specific choices for a defined user rather than neutral, configurable ones. Saarinen argues that flexible-for-everyone products are "good at nothing in particular."

### Gaps
- I found no rigorous study on design principles documents improving outcomes; the support is practitioner testimony.

## 5. What research says about expertise and aesthetic judgment

### Takeaway
The evidence is suggestive but thin. Art experts look at images differently from novices (they scan more widely, give more attention to background and composition, and their judgments depend less on surface features), and perceptual-expertise research suggests task-relevant training matters more than passive exposure. No controlled study I found shows that a particular training regimen improves *UI* aesthetic judgment. Practitioner advice ("study deliberately, don't just consume") is consistent with this research but not proven by it.

### Cited Findings
- **Francuz et al. 2018 [Empirical, small sample]:** 23 art experts vs 19 non-experts compared original paintings with versions whose composition had been altered. Eye-movement measures (dwell time, fixation duration and count) distinguished people who better recognized balanced compositions from those who preferred the altered versions. Familiarity affected both ratings and gaze. — [Frontiers in Human Neuroscience 2018](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2018.00087/full); [PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5879988/)
- **Pihko et al. 2011 [Empirical]:** 20 art-history experts vs 20 laypeople. Laypeople's aesthetic and emotional ratings dropped as paintings became more abstract; experts' ratings did not depend on the level of abstraction. Scanpaths and fixations also differed. — [Frontiers 2011](https://www.frontiersin.org/articles/10.3389/fnhum.2011.00094); [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3170917)
- **Earlier gaze work (cited in those papers):** Nodine et al. (1993) found untrained viewers fixate on central and foreground figures while art-trained viewers spend more time on background features; Kapoula and Lestocart (2006) proposed that experts scan a larger area of a painting. — [as cited in PMC5879988](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5879988/)
- **Caveat from the authors:** expertise groups are hard to define and should be carefully specified; art rules are "in a constant state of flux." — [Frontiers 2011](https://www.frontiersin.org/articles/10.3389/fnhum.2011.00094); [Chamberlain 2017 (search snippet only)](https://eprints-gro.gold.ac.uk/21013/1/Chamberlain%20%282017%29%20Expertise%20in%20the%20Visual%20Arts.pdf)
- **Perceptual learning vs perceptual expertise:** perceptual learning can sometimes come from mere exposure, while perceptual expertise appears to need task-relevant individuation training. The radiologist learning to read scans is the standard example of deliberate perceptual training. — [Stanford Encyclopedia of Philosophy, Perceptual Learning](https://plato.stanford.edu/archives/spr2025/entries/perceptual-learning/); [task-irrelevant perceptual expertise paper](https://typeset.io/pdf/task-irrelevant-perceptual-expertise-3e34lnr7lm.pdf)
- **Drawing expertise** correlates robustly with performance on local visual-processing tasks. — [Goldsmiths, "Drawing as a window onto expertise" (search snippet)](https://eprints-gro.gold.ac.uk/23563/1/Drawing%20as%20a%20window%20onto%20expertise_preProof.pdf)
- **Deliberate practice:** one account holds that deliberate practice explains most of the variance in expertise; others emphasize innate ability. The debate is unresolved in the sources found. — [SEP Perceptual Learning](https://plato.stanford.edu/archives/spr2025/entries/perceptual-learning/)

### Inferences
- Research favours *active, task-relevant* study: comparing an original against an altered version and naming the difference. That matches Kowalski's "study, don't consume" and suggests a concrete drill: take a good UI, make a degraded variant (wrong spacing, extra colours, borders everywhere), compare the two side by side and articulate why the original wins. This drill is my synthesis, not a tested intervention.
- Recreation and drawing-like copywork may train attention to local detail, the way drawing expertise relates to local visual processing. The link is speculative.

### Gaps
- No controlled study found on training UI or web aesthetic judgment specifically, or on copywork's effect on design quality.
- I did not retrieve primary Ericsson deliberate-practice papers or the Macnamara et al. meta-analyses, which put deliberate practice's share of explained variance much lower than Ericsson's account. These should be cited before any claim about how much variance practice explains.
- Goldsmiths eprints (Chamberlain 2017 review; drawing expertise paper) could not be fetched because the host is blocked in this session's network settings; only search snippets were used.
