# Taste profile

This is your taste profile. UI-MAX reads it before every design task, and it
grows every time you tell the AI what you like or don't. You don't have to fill
it in up front: the **Seed** rules below are a decent default distilled from
research and real verdicts, and your own verdicts override them.

How it learns: when you react to something ("too busy", "love the type", "the
blue is everywhere"), the AI logs your words in the verdict log, names the
property that decided it (color, type, layout, ornament, motion, density,
controls, states), and, if it generalizes, turns it into a Never/Always rule.
A rule needs one clear verdict to get in and a contrary verdict to get out.

Commands: `omni taste show`, `omni taste rule never|always "<rule>" --from "<your words>"`,
`omni verdict <page> keep|reject "<your words>" --property <p>`.
MCP: `ui_taste`, `ui_taste_rule`, `ui_verdict`.

## Who it's for

<!-- Filled in from conversation: what you build, who uses it, light or dark,
     how stylized you like daily tools vs demos, type you like. -->

## Never (yours)

## Always (yours)

## Seed rules (defaults; yours win when they conflict)

### Never
- Generic AI tells: blue/violet gradients, an indigo default accent, icon-topped feature-tile grids, glass blur everywhere, giant vanity numbers, everything centered, emoji as icons.
- Stock "cyberpunk": default cyan + magenta neon, glow on everything, scanlines, uppercase monospace as the UI font. Stylized is fine; *generic* stylized is not.
- Uniform decoration: the same ornament (brackets, glow, chamfers, tape) on every element, so nothing is special.
- Sprinkled color: colored text floating on gray, raw hex values in components.
- Restraint without color: graphite plus one status accent reads unfinished, not clean.
- Kit-default controls: if the buttons could come from any component kit, the UI reads vibe coded.
- One color "everywhere": a single hue on every edge, link and heading stops meaning anything.
- Fake content: invented stats, testimonials, and run facts in empty states.

### Always
- Start from a mature frame (the project's design system, or Astryx's templates) and spend design effort on theme, states and 2–3 concept pieces, not on reinventing layout.
- One concept from the real world (instruments, signage, print, film UI), not from other web apps. It must change layout and behavior, not just paint.
- Color with a job: every hue means one thing (action, live, failed, done), and it's grounded: a tinted surface, a border, and a solid, not just colored text.
- Managed themes: every color is a role from a generated, contrast-checked theme; light, dark and high contrast when the concept allows.
- Visible structure: clear regions and panels, a grid you can see.
- Controls designed from the concept: keys, lamps, plates with real states (hover, pressed, focus, disabled, loading).
- Every state designed: loading, empty, error, partial, success, disabled, focus.
- Effects report real state (working, waiting, failed, done). Keep a plain mode one click away.
- Aim for flex-worthy: impressive at first glance *and* usable. Clean-but-plain fails the same as pretty-but-unusable.
- Show the rendered result with its stat line, never a description of it.

## Open questions (ask when relevant, then move the answer up)

- Light or dark by default for tools?
- How stylized should daily-driver tools be compared with demos?
- Type families you like or dislike?
- Any colors you love or can't stand?

## Verdict log

Format: `date · artifact · verdict (your words) · property · rule it implies`
