---
description: Run the OMNI loop on a URL, file, or the current project's UI
argument-hint: <url | file.html | "this project"> [goal]
---

Use the `super-uiux-omni` skill on: $ARGUMENTS

1. If the target is a URL or HTML file, run
   `node "${CLAUDE_PLUGIN_ROOT}/bin/omni.js" full <target> --out omni-out/<name> --mobile`
   and read `REPORT.md` and the screenshots.
2. If the target is this project, find the main UI entry points, run it locally if possible, and audit the running page the same way.
3. Summarize the design DNA, the top UX problems, and the missing states.
4. Propose the fix plan (states, skeletons, motion, a11y), then implement it if the user asked for changes.
5. Re-run `omni audit` and report the before/after score.
