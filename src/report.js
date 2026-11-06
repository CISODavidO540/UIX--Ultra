const swatch = (hex) => `\`${hex}\``;

export function renderReport({ dna, audit, tokens, files }) {
  const c = tokens.color;
  const comps = Object.entries(dna.components).filter(([, n]) => n > 0).map(([k, n]) => `${k} ${n}`).join(' · ');
  const issues = audit.issues.map((i) => `- **${i.severity}** \`${i.rule}\`: ${i.message}${i.sample ? `  \n  <sub>${i.sample.replace(/[<>]/g, (m) => (m === '<' ? '&lt;' : '&gt;'))}</sub>` : ''}`).join('\n');
  const states = dna.states.map((s) => `- "${s.label || '(no label)'}": hover changes ${Object.keys(s.hover).join(', ') || '**nothing**'}; focus changes ${Object.keys(s.focus).join(', ') || '**nothing**'}`).join('\n');

  const gaps = [];
  if (!dna.media.reducedMotion) gaps.push('No `prefers-reduced-motion` handling → use `scaffold/css/motion.css`.');
  if (!dna.components.skeletons) gaps.push('No skeleton loaders in the initial DOM → use `scaffold/css/skeleton.css` for every async view.');
  if (!dna.motion.transitions.length) gaps.push('No transitions → state changes snap. Add the duration/easing tokens.');
  if (dna.states.some((s) => !Object.keys(s.focus).length)) gaps.push('Some buttons have no visible focus change → add `:focus-visible` rings.');
  if (dna.states.some((s) => !Object.keys(s.hover).length)) gaps.push('Some buttons have no hover feedback.');
  if (!dna.media.darkMode) gaps.push('No dark-mode media query detected.');

  return `# OMNI report: ${dna.meta.title || dna.meta.url}

Source: ${dna.meta.url}
Captured: ${dna.capturedAt} at ${dna.viewport.width}×${dna.viewport.height}
UX score: **${audit.score}/100** (critical ${audit.bySeverity.critical}, serious ${audit.bySeverity.serious}, moderate ${audit.bySeverity.moderate}, minor ${audit.bySeverity.minor})

![desktop](desktop-fold.png)

## Design DNA

| Role | Value |
|---|---|
| Background | ${swatch(c.bg)} |
| Surface | ${swatch(c.surface)} |
| Text | ${swatch(c.text)} |
| Muted | ${swatch(c.muted)} |
| Border | ${swatch(c.border)} |
| Primary | ${swatch(c.primary)} on ${swatch(c.onPrimary)} |

- Fonts: ${tokens.font.family.body}${tokens.font.family.display !== tokens.font.family.body ? ` / display ${tokens.font.family.display}` : ''}
- Type scale: ${Object.entries(tokens.font.size).map(([k, v]) => `${k} ${v}`).join(', ')}
- Spacing base: ${tokens.meta.spacingBase}px
- Radii: ${Object.entries(tokens.radius).map(([k, v]) => `${k} ${v}`).join(', ')}
- Motion: fast ${tokens.motion.duration.fast}, base ${tokens.motion.duration.base}, slow ${tokens.motion.duration.slow}; easing \`${tokens.motion.easing.standard}\`
- Breakpoints: ${tokens.breakpoints.join(', ') || 'none detected'}
- Components: ${comps}
- Source animations: ${dna.motion.animations.length}, transitions: ${dna.motion.transitions.length}, keyframes: ${dna.motion.keyframes.length}

## Interaction states observed

${states || '_No buttons sampled._'}

## What the UI is missing (beyond pretty)

${gaps.map((g) => `- ${g}`).join('\n') || '- Nothing obvious. Still verify empty, error and offline states by hand.'}

## Audit findings

${issues || '_No issues found._'}

## Generated files

${files.map((f) => `- \`scaffold/${f}\``).join('\n')}

Open \`scaffold/state-sheet.html\` to see every state using these tokens.
`;
}
