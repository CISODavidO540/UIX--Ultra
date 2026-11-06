# UI/UX Patterns for AI Chat and Agent Applications (late 2026)

Scope: apps where an LLM streams answers, calls tools, runs code in sandboxes and works through multi-step tasks, including self-hosted ones (Open WebUI, LibreChat, Hermes Agent). Sources researched 2026-11-06. Product claims come from official docs where possible; aggregator and blog claims are flagged. Items in "Inferences" are design recommendations built from the cited findings plus general front-end practice. They are not sourced facts.

---

## 1. Streaming text UX (token rendering, autoscroll, markdown while streaming, stop/regenerate/edit, latency)

### Takeaway
The two hard engineering problems are (a) scroll ownership, meaning pinning to the bottom only while the user hasn't scrolled away, and (b) rendering markdown that isn't finished yet (unclosed code fences, bold, links) without layout thrash. Both now have off-the-shelf solutions (`use-stick-to-bottom`, Streamdown). NN/g's research adds one twist: for long answers, users want to read from the top of the new message, not get dragged to the end.

### Cited Findings
- `use-stick-to-bottom` (StackBlitz Labs, the library behind bolt.new) uses ResizeObserver to detect content growth and shrinkage, so it doesn't depend on CSS `overflow-anchor`, which Safari lacks. Scrolling up cancels the lock. It separates user scrolls from its own animation scrolls without debouncing. It uses a velocity-based spring rather than duration easing, which the authors say handles variable-height streamed content better. The API is a `StickToBottom` component (`resize`, `initial` props) whose children read `isAtBottom` and call `scrollToBottom()` from context, plus a `useStickToBottom` hook that returns `scrollRef` and `contentRef`. MIT licensed, zero dependencies, React 16.8–19. — [GitHub: stackblitz-labs/use-stick-to-bottom](https://github.com/stackblitz-labs/use-stick-to-bottom); [npm](https://npmjs.com/package/use-stick-to-bottom)
- NN/g, from a study of real users with site chatbots, says "Don't autoscroll during responses". Mississippi's MISSI bot and Turo's bot streamed long answers while scrolling to the end, so users couldn't read from the start. The recommendation is to keep the scroll position at the top of the new message. — [NN/g: Guidelines for Site AI Chatbots](https://www.nngroup.com/articles/ai-chatbots-design-guidelines/)
  - **Tension:** NN/g's advice conflicts with the "stick to bottom" default common in dev-tool chat UIs (bolt.new, AI Elements `Conversation`). The two fit together once you see that NN/g studied long consumer answers read once, while agent UIs stream short status updates and tool cards that users monitor.
- Streamdown is a drop-in replacement for react-markdown built for streamed AI output. Its preprocessing layer (`remend`) closes unterminated syntax: an open inline code span gets a closing backtick, and code blocks get special handling. Props: `parseIncompleteMarkdown` (default true), `isAnimating`, and `mode` ("streaming" | "static"). — [Streamdown docs](https://streamdown.ai/docs); [Unterminated block parsing](https://streamdown.ai/docs/termination)
- Vercel AI Elements ships chat primitives including Conversation, Message, Prompt Input, Shimmer (a loading text effect), Reasoning, Tool, Sources, Inline Citation, Context, Queue, Checkpoint, Model Selector, Suggestion and Question. The page notes that AI Elements is moving to shadcn/ui and will be deprecated at the end of November 2026. — [AI Elements](https://elements.ai-sdk.dev/)
- In Claude Code, `Esc` interrupts the current response or tool call mid-turn "so you can redirect", and Claude keeps the work done so far. Queued messages are sent next. `Ctrl+Enter` sends queued messages right away. `Up` takes back what you queued. Double-`Esc` on an empty input opens rewind. — [Claude Code interactive mode](https://code.claude.com/docs/en/interactive-mode)
- After a rewind, Claude Code puts the original prompt back into the input field so the user can edit and re-send it. This is the edit-and-resubmit pattern. — [Claude Code checkpointing](https://code.claude.com/docs/en/checkpointing)
- NN/g recommends progressive disclosure. Users expected "More details" to expand in place and collapse again, not to append a new message that pushes content out of view (Amazon Rufus failed this). — [NN/g](https://www.nngroup.com/articles/ai-chatbots-design-guidelines/)

### Inferences (implementable spec)
- **Scroll controller spec.**
  - State: `isAtBottom` (within ~8–16px of the end), `userLocked`, which is set on any user wheel, touch or keyboard scroll upward and cleared when the user returns to the bottom or clicks "Jump to latest".
  - On send, scroll the user's new message to the top of the viewport. This is NN/g-compatible and is what ChatGPT- and Claude-style UIs appear to do, though I didn't confirm it from a primary source. Then follow the stream only while `!userLocked`.
  - When locked and new content arrives, show a floating "↓ New output" pill with an unread or streaming dot. `aria-live="polite"` should announce completion, not every token.
  - For long-form answers (reports, essays), a "follow output" toggle can default to off.
- **Smooth reveal vs chunk jumps.** Buffer incoming tokens and flush them on `requestAnimationFrame`, not per network chunk. Optionally run a character-rate smoother that catches up when the backlog grows, so bursty providers don't show 200-char jumps. Avoid per-token fade animations on very long outputs because they cost CPU. Respect `prefers-reduced-motion` by disabling the typewriter or shimmer.
- **Markdown while streaming.**
  - Parse incrementally and memoize completed blocks: re-render only the last block. Streamdown and similar libraries split content into blocks.
  - Auto-close open fences. Show a code block's language label and copy button only once the fence closes, or show copy disabled until then.
  - Defer syntax highlighting, Mermaid and KaTeX until the block completes to avoid flicker and parse errors.
  - Reserve min-height for tables and images.
- **Stop / regenerate / edit.**
  - The Send button becomes Stop (with the same position and hit target) while streaming. `Esc` also stops.
  - A stopped message stays visible, marked "Stopped" with a Continue action.
  - Regenerate creates a sibling branch with a "‹ 2/3 ›" pager. Edit-user-message forks the conversation rather than destroying history (this maps to shapeof.ai "Branches" in §4).
  - Queued follow-ups appear as chips above the composer with edit/remove and "send now".
- **Latency indicators.**
  - Before the first token, show an immediate optimistic echo of the user message plus a "thinking" shimmer within 100 ms.
  - After ~2–3 s with no token, escalate to explicit status text ("Searching…", "Waiting for model…").
  - Show elapsed time on any long phase, for example "Thought for 12s".
  - Exposing TTFT and tokens/sec in a hover or debug footer is a power-user nicety (self-hosted UIs often show it). That observation is anecdotal.

### Gaps
- No primary-source quantitative study (for example, TTFT thresholds and their effect on abandonment) turned up for chat specifically. Classic 0.1 s / 1 s / 10 s response-time limits are the usual fallback and weren't re-verified here.
- I couldn't fetch primary docs confirming exactly how ChatGPT or Claude.ai position scroll on send. The behavior described above is observation, not documentation.

---

## 2. Tool calls and agent steps (step cards, live status, durations, diffs, approvals, interrupt/steer, background tasks, errors)

### Takeaway
The converging pattern is a collapsible step or tool card with an explicit state machine (pending → running → awaiting approval → completed / error / denied). Cards collapse by default into one summary line ("Called slack 3 times"), with a global toggle to a verbose transcript. Durable undo (checkpoints) and non-destructive steering (queue a message so it applies at the next tool boundary) are the newer differentiators.

### Cited Findings
- **Vercel AI Elements `Tool` component.** `<Tool>` (a Collapsible), `<ToolHeader type state title toolName>`, `<ToolContent>`, `<ToolInput>` (formatted JSON) and `<ToolOutput output errorText>`. `getStatusBadge` maps 7 states to badges: `input-streaming` → Pending, `input-available` → Running, `approval-requested` → Awaiting Approval, `approval-responded` → Responded, `output-available` → Completed, `output-error` → Error, `output-denied` → Denied. The header prop docs list only 4 of those states, a docs inconsistency. — [AI Elements Tool](https://elements.ai-sdk.dev/components/tool)
- AI Elements also has Chain of Thought (step list with linked sources, for example "Searching for profiles"), Plan (collapsible plan), Task/Todo, Queue (for example "7 Queued" pending messages), Confirmation, Checkpoint, and code-agent components: Terminal, Test Results, Stack Trace, File Tree, Commit, Sandbox, Web Preview, Environment Variables. The descriptions are inferred from the demo, not documented on the landing page. — [AI Elements](https://elements.ai-sdk.dev/)
- **Claude Code.**
  - `Ctrl+O` toggles a transcript viewer that shows detailed tool usage with timestamps and the model per message. It also expands lines collapsed by default, such as MCP calls shown as a single "Called slack 3 times" line.
  - `Ctrl+T` toggles a task checklist (to-do) in the status area. `/tasks` lists running shells and subagents.
  - `Ctrl+B` moves a running Bash command or agent to the background. `Ctrl+X Ctrl+K` stops all background subagents, and requires pressing it twice within 3 seconds to confirm.
  - `Shift+Tab` cycles permission modes: default (labeled "Manual"), acceptEdits, plan, then bypassPermissions/auto when available.
  - — [Claude Code interactive mode](https://code.claude.com/docs/en/interactive-mode)
- **Claude Code checkpoints.** Every prompt that starts a turn creates a checkpoint, and the last 100 are kept. The rewind menu offers Restore code and conversation, Restore conversation, Restore code, Summarize from here, Summarize up to here, and Never mind. Documented limits:
  - Bash-only file changes aren't tracked.
  - Edits by background subagents aren't restored.
  - External edits aren't tracked.
  - Messages sent mid-turn are marked "No code restore".
  - Symlinked files are skipped, with a warning.
  - The docs say checkpoints are "not a replacement for version control". — [Claude Code checkpointing](https://code.claude.com/docs/en/checkpointing)
- **Cursor 3** (launched 2026-04-02) replaced Composer with an "Agents Window" and a new diffs view to review, commit and manage PRs in-editor.
  - v3.2 (2026-04-24) lets queued messages be multitasked in parallel.
  - A build reported on 2026-08-19 lets follow-up messages "steer a working agent without cutting it off mid-action; they wait for the next tool call". This is aggregator-sourced and not verified against the official changelog.
  - Cursor for iOS beta allows reviewing diffs and artifacts and merging PRs from mobile.
  - — [digitalapplied (aggregator)](https://www.digitalapplied.com/blog/cursor-3-agents-window-complete-guide); [techdevnotes (aggregator)](https://techdevnotes.com/releases/cursor-ide/20260819-181343Z-621090ca53ad); [anycap changelog (aggregator)](https://anycap.ai/page/en-US/ai/cursor-changelog-july-2026)
  - Forum complaints: users report "Per-change Keep/Undo buttons missing after Agent edits — only 'Undo All' available", an empty Changes panel, and a broken multi-repo diff UI in v3. Granular hunk-level accept/reject is in demand and fragile. — [Cursor forum, review tag](https://forum.cursor.com/tag/review/276)
- **Hermes Agent (Nous Research), self-hosted.** `hermes dashboard` serves `http://127.0.0.1:9119` with these pages: Status, Chat, Config, API Keys, Sessions, Logs, Analytics, Cron, Profiles, Skills, MCP, Webhooks, Pairing, Channels and System.
  - The Chat tab embeds the real TUI via xterm.js in a PTY, so tool-call cards, markdown streaming and clarify/sudo/approval prompts behave exactly as in the terminal.
  - The Sessions page renders assistant tool calls as collapsible blocks showing function name and JSON args. It has full-text search with highlighted snippets, role color-coding, and rename/export JSON/prune/delete actions.
  - Approval mode for dangerous commands (smart / manual / off) is a Config setting. There's no dedicated approvals page.
  - The Cron page shows each job's state (enabled/paused/error), last and next run times, and buttons to trigger immediately, pause, edit or delete. Delivery targets are local, Telegram, Discord, Slack or email.
  - Logs offer level and component filters and a 5 s tail.
  - — [Hermes Agent web dashboard docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/web-dashboard)
  - Community web UIs (Hermes Studio, hermes-web-ui) add real-time streamed tool rendering. These are third-party, not Nous. — [Hermes Studio](https://github.com/JPeetz/Hermes-Studio)
- **Open WebUI** detects reasoning tags (`<think>`, `<thought>`, configurable per chat or model) and shows them in a collapsible "Thought/Thinking" block. In multi-step tool turns it captures `reasoning_content` / `reasoning` / `thinking` and passes it back within the turn, but not across turns. — [Open WebUI reasoning models](https://docs.openwebui.com/features/chat-features/reasoning-models)
- **assistant-ui** (React library) groups reasoning and tool calls into one collapsed "Thinking" accordion (ChainOfThought primitive). — [assistant-ui chain of thought](https://www.assistant-ui.com/docs/guides/chain-of-thought.mdx)
- **LibreChat Agents.** Code Interpreter runs Python, JS/TS, Go, C/C++, Java, PHP, Rust and Fortran with file upload and download. Artifacts render React, HTML and Mermaid in a separate UI window. Capabilities (including `deferred_tools`, on by default, and programmatic tool calling) toggle in `librechat.yaml`. — [LibreChat agents docs](https://librechat.ai/docs/features/agents)
- **shapeof.ai** "Governors" category: Action plan (show steps before executing), Controls (pause mid-stream), Verification (confirm before proceeding), Stream of Thought (reasoning, tool use and decisions for audit), Cost estimates, Shared vision (live visibility on a shared canvas). "Footprints" (trace steps from prompt to result) is listed under Trust builders. — [shapeof.ai](https://www.shapeof.ai/)

### Inferences (implementable spec)
- **StepCard component.**
  - Props: `{id, kind: 'tool'|'reasoning'|'subagent'|'plan'|'code', name, title, state, startedAt, endedAt, input, output, error, approval?, children?}`.
  - Header, one line: status icon (spinner / check / x / pause-hand / skip), a human verb title ("Read `auth.ts`", "Searched web: 'x'", "Ran `npm test`"), right-aligned duration (live-ticking while running, frozen after), and a chevron.
  - Collapsed by default when completed. Auto-expand on error, on approval request, and optionally the most recent running step.
  - Group consecutive same-tool calls ("Read 6 files ▸").
  - Body tabs: Input (pretty JSON or rendered args), Output (truncated with "show all", plus a copy button), Raw.
  - Code-execution outputs render as a terminal (ANSI colors, exit-code badge, stdout/stderr split).
  - File edits render as a unified or split diff with per-hunk Accept/Reject. Forum evidence shows "Undo all only" frustrates users.
- **ApprovalPrompt spec** (state `approval-requested`).
  - Inline in the step card and also pinned above the composer so it can't scroll away.
  - Shows the exact command, path or URL. Flag risk (network, delete, outside-workspace write, cost).
  - Buttons: Allow once (primary, `Enter`), Always allow for this tool/pattern (scoped and revocable in settings), Deny with feedback (text box sent back to the agent), Edit-then-run.
  - Fire a desktop or push notification if the tab is hidden.
  - Global mode switch (Manual / Auto-accept edits / Plan-only / Auto) visible in the composer footer, mirroring Claude Code's `Shift+Tab` cycle.
- **Interrupt and steer.**
  - Stop (`Esc`) keeps partial work and leaves the run resumable.
  - "Steer" messages queue and inject at the next tool boundary, per Cursor's reported model. The UI labels them "Will apply after the current step".
  - Queued chips are editable and retractable.
- **Background tasks.** A tasks tray (badge count) lists running shells, subagents and cron jobs, each with elapsed time, live log tail, Stop, and "Open transcript". Send a completion notification ("Done in 4m 12s — 3 files changed") with a deep link.
- **Errors and retry.**
  - The failed step shows a red state and the error message first (stack trace collapsed), plus whether the agent will auto-retry ("Retrying 2/3 in 5s…").
  - Manual buttons: Retry step, Retry from here (fork), Skip.
  - Never silently swallow tool errors. The agent's recovery reasoning should be visible as the next step.
- **Verbosity toggle.** Two densities: Summary (default) and Transcript (all steps expanded with timestamps and model per message), following Claude Code's `Ctrl+O`.

### Gaps
- I couldn't fetch OpenAI's ChatGPT agent announcement (HTTP 403), so the specifics of its takeover, watch mode and confirmation prompts aren't sourced here.
- I didn't retrieve primary docs for Devin, Manus, Perplexity (step lists and source cards), v0 or Claude.ai's web tool-use display. Treat any claims about them in the final report as general knowledge.

---

## 3. Layout for power users (multi-pane, resizable panels, command palette, shortcuts, search/history, model switcher, context meters)

### Takeaway
Serious agent UIs are converging on chat on the left, a work surface on the right (artifact/canvas/preview/diff/terminal) in resizable panes, a session list with full-text search, a model picker in the composer, and a context/usage meter. Keyboard-first control (interrupt, background, rewind, history search, mode cycle) is the main power-user differentiator.

### Cited Findings
- **NN/g: let users resize the chat window.** Scoutly's interactive map was cramped until enlarged, so rich-content bots need resizable surfaces. — [NN/g](https://www.nngroup.com/articles/ai-chatbots-design-guidelines/)
- AI Elements includes Context (context/token usage display), Model Selector, Artifact, Web Preview, File Tree, Terminal, and a Workflow set (Canvas, Node, Edge, Panel, Toolbar, Controls) for node-graph views. — [AI Elements](https://elements.ai-sdk.dev/)
- **Claude Code keyboard model.**
  - `Ctrl+R` reverse history search. In fullscreen it's a dialog with a preview pane, and `Ctrl+S` cycles scope (session / project / all projects).
  - `Ctrl+G` opens the prompt in an external editor.
  - `Esc Esc` rewinds. `Shift+Tab` changes mode. `Ctrl+O` opens the transcript. `Ctrl+T` toggles to-dos. `Ctrl+B` backgrounds a task.
  - Vim mode is supported, and the mode is preserved across panels.
  - — [Claude Code interactive mode](https://code.claude.com/docs/en/interactive-mode)
- **Hermes dashboard.**
  - Chat has a right rail with recent sessions, a model picker, new chat and a workspace-directory picker.
  - Sessions has Chats / Automation / All filter tabs, a per-source dropdown, full-text search with highlighted snippets, and a stats bar.
  - Status lists the 20 most recent sessions with model, message count, token usage and preview.
  - A profile switcher sits in the sidebar.
  - — [Hermes docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/web-dashboard)
- **Cursor 3** separates an "Agents Window" (multiple agents, diffs, PRs) from the editor. Design Mode lets users annotate UI elements inside a canvas (v3.9, aggregator-reported). — [digitalapplied (aggregator)](https://www.digitalapplied.com/blog/cursor-3-agents-window-complete-guide); [techdevnotes](https://techdevnotes.com/releases/cursor-ide/20260819-181343Z-621090ca53ad)
- **shapeof.ai Tuners:** Model management, Modes, Attachments, Connectors, Filters, Parameters. — [shapeof.ai](https://www.shapeof.ai/)

### Inferences (implementable spec)
- **Shell layout.**
  - Three regions: Sidebar (sessions, collapsible to icons, `Ctrl/Cmd+B`), Chat, and Workbench (tabs: Preview | Code/Diff | Files | Terminal | Logs).
  - Use resizable split panels (for example react-resizable-panels) with persisted sizes, double-click a divider to reset, keyboard-resizable dividers (`role="separator"`, arrow keys), and a minimum chat width of ~360px.
  - On mobile, the Workbench becomes a full-screen sheet toggled from the message that produced the artifact.
- **Command palette** (`Cmd/Ctrl+K`): new chat, switch model, switch mode, search sessions, open file, run slash commands, toggle panels. It lists shortcuts inline. `?` opens a shortcut cheat sheet.
- **Core shortcuts:** `Enter` send / `Shift+Enter` newline; `Esc` stop; `↑` in an empty composer edits the last message; `Cmd+Shift+C` copies the last code block; `Cmd+/` toggles the workbench; `Cmd+.` toggles verbose transcript.
- **Session history.** Full-text search over messages and tool outputs with highlighted snippets and filters (source, model, date, has-artifact, automation vs chat). Pin, rename, export (JSON/MD), fork.
- **Composer footer.** Model chip (with capability icons: vision, tools, reasoning effort), mode chip (Manual/Auto/Plan), attachment and connector chips, and a context meter.
- **Context meter.** A ring or bar showing used/limit tokens. It turns amber at ~75% and red at ~90%, with "Compact / Summarize" actions (matching Claude Code's summarize-from-here). The hover breakdown covers system, tools, files and conversation.

### Gaps
- I found no published usability study comparing pane layouts (chat-left vs chat-right, tabs vs splits) for agent apps. Current conventions come from product convergence, not research.

---

## 4. Trust and control (citations, confidence, previewing actions, undo, sandbox visibility, cost/usage)

### Takeaway
Trust comes from making the agent legible (plan before acting, a trace of what it did, sources inline) and recoverable (checkpoints, branches, per-hunk undo, scoped permissions), and from being honest about cost and limits. The HAX guidelines and shapeof.ai's Governors and Trust-builders categories give named, checkable patterns for this.

### Cited Findings
- **Microsoft HAX, 18 guidelines:**
  1. Make clear what the system can do
  2. Make clear how well the system can do what it can do
  3. Time services based on context
  4. Show contextually relevant information
  5. Match relevant social norms
  6. Mitigate social biases
  7. Support efficient invocation
  8. Support efficient dismissal
  9. Support efficient correction
  10. Scope services when in doubt
  11. Make clear why the system did what it did
  12. Remember recent interactions
  13. Learn from user behavior
  14. Update and adapt cautiously
  15. Encourage granular feedback
  16. Convey the consequences of user actions
  17. Provide global controls
  18. Notify users about changes

  They're grouped into four phases: Initially, During interaction, When wrong, Over time. The library page doesn't map guidelines to phases. By numbering, 1–2 are "initially" and 9–11 "when wrong", but that mapping is unverified on the page. — [HAX Design Library](https://www.microsoft.com/en-us/haxtoolkit/library/); [MSR project page](https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/)
- **shapeof.ai Governors and Trust builders:** Action plan, Branches, Citations, Controls, Cost estimates, Draft mode, Memory, References, Sample response, Shared vision, Stream of Thought, Variations, Verification; and Caveat, Consent, Data ownership, Disclosure, Footprints, Incognito mode, Watermark. — [shapeof.ai](https://www.shapeof.ai/)
- **NN/g on capability disclosure.**
  - State capabilities clearly. Turo's generic "help you find any info" overpromised, while Williams Sonoma named its topics.
  - Home Depot's bot could see the current product and recall earlier items, but the UI didn't say so, and users found out by accident. This is a hidden-context trust failure.
  - Users wanted to save, share or email chat content.
  - — [NN/g](https://www.nngroup.com/articles/ai-chatbots-design-guidelines/)
- **Claude Code** gives granular undo: separate code-vs-conversation restore, documented gaps in what's tracked, and a "skipped N files" warning on restore. It's an example of honest undo whose limits are visible. — [Claude Code checkpointing](https://code.claude.com/docs/en/checkpointing)
- **Hermes Analytics** shows a 7/30/90-day window of input and output tokens, cache hit %, estimated or actual cost, and session count, plus a daily stacked token chart and per-model cost table. — [Hermes docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/web-dashboard)
- AI Elements ships Sources, Inline Citation, Plan, Confirmation, Checkpoint and Sandbox components. — [AI Elements](https://elements.ai-sdk.dev/)

### Inferences (implementable spec)
- **Citations.** Inline numbered pills `[1]` that show a hover card (title, domain, favicon, quoted snippet, and when it was retrieved), plus a collapsible "Sources (n)" strip under the message. Clicking a pill highlights the supporting span. Mark unsupported claims rather than fabricating a citation.
- **Confidence.** Avoid fake numeric confidence. Prefer qualitative caveats tied to evidence ("No source found for X", "Based on 1 source"), following HAX 2 and shapeof.ai "Caveat".
- **Pre-action preview.**
  - In Plan mode, render an editable checklist (Action plan) with Approve / Edit / Reject before execution.
  - For consequential actions (send email, purchase, delete, push, deploy), show a Verification card describing the exact effect. This follows HAX 16, "convey consequences".
- **Undo hierarchy.** Per-hunk reject, then per-turn checkpoint, then branch or fork. Always say what undo can't revert (external side effects, network calls).
- **Sandbox visibility.**
  - A status chip shows sandbox state (Starting / Ready / Busy / Stopped), runtime and image, network policy (allowed hosts), mounted workspace path, and resource usage.
  - "Open terminal" attaches to the live sandbox.
  - Writes outside the workspace and network egress raise approval prompts.
- **Cost and usage.**
  - Per-message footer on hover: model, input/output tokens, cost, latency.
  - Per-session total in the header.
  - A pre-run Cost estimate for expensive jobs (deep research, batch), and budget caps with a warning at 80%.
- **Global controls** (HAX 17): Settings → Memory (view/delete), Incognito chat, default permission mode, an always-allowed tool list with revoke.

### Gaps
- I couldn't retrieve the Google PAIR People + AI Guidebook content (the page rendered empty to the fetcher). Its chapters (Mental Models, Explainability + Trust, Feedback + Control, Errors + Graceful Failure) are known from general knowledge but not quoted here.
- No sourced data was retrieved on whether showing cost per message changes user behavior.

---

## 5. Loading and thinking states (thinking indicators, reasoning display, skeletons, long-job progress, completion notifications)

### Takeaway
The standard is now: a shimmer for "thinking", a collapsible reasoning block with an elapsed-time label that auto-collapses when the answer begins, and step-level progress (a to-do checklist) for long tasks. Long and background work should notify on completion. Reasoning should be a trace for auditing, not something the user has to read to get the answer.

### Cited Findings
- **Open WebUI** reasoning is a collapsible block labeled "Thought/Thinking" and is parsed from configurable tags. — [Open WebUI docs](https://docs.openwebui.com/features/chat-features/reasoning-models)
- AI Elements includes Reasoning, Shimmer, Chain of Thought, Task and Plan components. The demo shows a "Toggle plan" control and a to-do list. — [AI Elements](https://elements.ai-sdk.dev/)
- **Claude Code** shows a to-do checklist in the status area (`Ctrl+T`), runs background tasks with `/tasks`, and stamps a timestamp and model on each message in the transcript. — [Claude Code interactive mode](https://code.claude.com/docs/en/interactive-mode)
- **Hermes** has a Status page with active sessions (last 5 min), a 5 s refresh, a resource banner for low memory or disk, and Cron rows with last and next run and error state. Cron results can be delivered to Telegram, Discord, Slack or email, which works as an out-of-app completion notification. — [Hermes docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/web-dashboard)
- **shapeof.ai "Stream of Thought"** displays reasoning, tool use and decisions for auditing. "Controls" lets users pause mid-stream. — [shapeof.ai](https://www.shapeof.ai/)

### Inferences (implementable spec)
- **ThinkingIndicator.**
  - Shimmering label ("Thinking…") with a live elapsed counter after 1 s. On the first answer token it becomes "Thought for 14s ▸" (collapsed).
  - Reasoning text streams inside at lower contrast and a smaller size, and is height-capped with internal autoscroll.
  - The `aria-busy` region is on the message. Shimmer and pulse are disabled for reduced motion and replaced with a static "…" plus a timer.
- **Artifact skeletons.** As soon as an artifact or tool call starts streaming its arguments (`input-streaming`), open the Workbench tab with a typed skeleton: file name, line counter, progressive code fill; for previews, a "Building…" overlay with the build log. Don't block on a blank pane.
- **Long-job progress.**
  - Determinate when steps are known (plan checklist "3/7", per-step status). Otherwise indeterminate, with the latest activity line ("Reading `src/api/*.ts`…").
  - Show elapsed time, and an ETA only if it's reliable.
  - Allow minimizing to the tasks tray.
- **Notifications.**
  - When the tab is hidden or the user navigated away: a browser Notification plus a title badge ("(✓) Done — MyChat") and a favicon dot.
  - For approvals needed while away, use a distinct, higher-priority notification.
  - Self-hosted options include webhooks or chat-app delivery, per the Hermes model.
- **Empty and failed states.** On timeout, show what completed, what didn't, and offer Resume from the last step.

### Gaps
- I found no sourced research on whether showing raw reasoning raises or lowers trust or comprehension. Claims either way would be anecdotal.

---

## 6. Known pain points and research (NN/g, HAX, PAIR, shapeof.ai)

### Takeaway
Documented failures cluster around discoverability (unclear capabilities and hidden context), loss of reading position (autoscroll), conversation sprawl (appended detail instead of in-place expansion), poor saving and sharing, and, in agentic tools, coarse undo and unreliable diff review. Many patterns are still missing from many products: in-place expansion, save/share, per-hunk undo, scoped permission memory, and visible cost.

### Cited Findings
- **NN/g's ten guidelines from a real-user study of site chatbots:**
  1. Consolidate chat options (Home Depot had two confusing bots)
  2. Keep the bot available on every page
  3. State capabilities and tailor the opening message to the page
  4. Make suggested questions clickable buttons and keep offering them after answers (Scoutly dropped them; Williams Sonoma's were plain text). Irrelevant or repeated follow-ups feel pushy.
  5. Include images with recommendations and instructions
  6. Use progressive disclosure, expanding in place
  7. Don't autoscroll during responses
  8. Let users resize the window
  9. Let users save or share content (most bots couldn't)
  10. Consider voice input (one participant called typing-only a dealbreaker; also an accessibility issue)

  — [NN/g: Guidelines for Site AI Chatbots](https://www.nngroup.com/articles/ai-chatbots-design-guidelines/)
- **Cursor users** report missing per-change Keep/Undo (only "Undo All"), empty Changes panels, and a broken multi-repo diff in Cursor 3. — [Cursor forum](https://forum.cursor.com/tag/review/276)
- **Claude Code docs** list undo blind spots (Bash-only edits, background subagents, external edits, symlinks). Honest, but it shows how hard full undo is for agents with shell access. — [Claude Code checkpointing](https://code.claude.com/docs/en/checkpointing)
- **HAX** lists 18 guidelines across 4 phases. They were validated through a 4-step process in a CHI 2019 paper (Amershi et al.), whose details I didn't retrieve. — [MSR project page](https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/)
- **Secondary sources** claim that NN/g's "State of UX 2026" reframes the challenge from "can AI do the task" to "can the user understand and trust what AI did". This is not confirmed from NN/g directly, so treat it as unverified. — [Built In (secondary)](https://builtin.com/articles/ux-research-better-agentic-ai)

### Inferences
- A short "commonly missing" checklist to audit an implementation against:
  1. Scroll lock that respects the user.
  2. Streaming-safe markdown.
  3. Stop that keeps partial output.
  4. Edit or regenerate as branches.
  5. A collapsible tool card with a state badge and duration.
  6. Inline approvals that can't scroll away, plus a notification.
  7. Steer or queue without killing the run.
  8. Per-hunk accept or reject, plus checkpoints.
  9. A context meter with compact.
  10. Per-message and per-session cost.
  11. Session full-text search.
  12. Save, share or export.
  13. Capability disclosure in the empty state (what the agent can see and do).
  14. A completion notification for background work.
  15. Keyboard access to all of the above, plus `prefers-reduced-motion` handling.
- **Accessibility for stylized UIs.**
  - Streaming regions need `aria-live="polite"` that announces at block or message completion, not per token.
  - Step cards need `aria-expanded` and focusable headers.
  - Status can't rely on color alone: use icon plus text label, as AI Elements' badge labels do.

### Gaps
- No primary access to NN/g's newer agent-specific articles. Search returned only secondary summaries.
- PAIR Guidebook content couldn't be fetched.
- No authoritative source for Manus, Devin or Perplexity UI specifics was retrieved within the tool budget.
