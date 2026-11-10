# Conversational / chat interfaces

Research notes for UI-MAX, researched 2026-11-10. Scope: AI assistant chat (ChatGPT, Claude.ai, Gemini, Perplexity, IDE agent panels, Copilot), agent run and approval UIs, human messaging (Slack, Discord, iMessage, WhatsApp, Telegram), support widgets, and voice chat.

**Already covered elsewhere, not repeated here:**
- `skills/ui-max/playbooks/agent-chat.md` covers the step-card state machine, the pinned approval, stick-to-bottom, Esc to stop, the context meter, and closing unfinished fences.
- `research_notes/Stylized UI that stays usable/ai_agent_app_ux.md` covers use-stick-to-bottom, Streamdown, AI Elements tool states, Claude Code checkpoints and queueing.

**Gaps in that coverage:** neither file has typography numbers, human-messaging conventions, support widgets, voice, a screen-reader model for streaming, or auditor checks. Those are the focus here.

**How the numbers were gathered:** values marked *(prod CSS)* were read directly from each product's shipped stylesheet on 2026-11-10: chatgpt.com, gemini.google.com/app, discord.com/app and app.slack.com. Values marked *(3rd-party)* come from reconstructed design.md sites and are unverified.

## 1. Anatomy

**AI assistant**
- **Sidebar.** New chat, search, a history list grouped by date, projects/folders, account. It collapses to icons or a drawer.
- **Thread.** One centered reading column.
- **User turn.** A right-aligned bubble that sizes to its content.
- **Assistant turn.** Full width with no bubble. Microsoft's Atlas chat pattern states this split: AI responses span the message area and user messages size to fit ([Atlas chat](https://microsoft.github.io/atlas-design/patterns/chat.html)).
- **Per-turn actions.** Copy, regenerate, edit, branch pager ‹2/3›, feedback, share.
- **Composer.** Auto-growing textarea, attach, a model/mode picker, voice, and a Send button that turns into Stop. Beneath it, a disclaimer line.
- **Rich blocks inside a message:**
  - code block (language label, copy, optional wrap toggle)
  - table (horizontal scroll and copy)
  - math
  - images
  - citations
  - tool/step cards
  - reasoning disclosure ("Thought for 12s")
  - artifact/canvas side panel
- **Citations.** Perplexity's pattern: inline numbered superscripts plus source chips (favicon, domain, title) below the answer or in a rail ([open-design Perplexity](https://open-design.ai/systems/perplexity/), 3rd-party).
- **Labeling.** Fluent requires AI-generated content to be labeled and distinguishable from non-AI content ([Fluent 2 Responsible AI](https://fluent2.microsoft.design/responsible-AI/)).

**Human messaging**
- **Layout.** Channel/DM list with unread and mention badges, a channel header (topic, members, search), and a message list with day dividers and a "New messages" line.
- **Grouping.** Consecutive messages from the same author group together. Only the first message in a group shows the avatar and name; the rest show the time on hover in the gutter. Grouping should break after a time window. MUI defaults to 5 minutes ([MUI Chat messages](https://mui.com/x/react-chat/basics/messages/)), and Zed added the same rule ([Zed commit](https://git.secluded.site/zed/commit/7d1cb8b072c6eeeaee253a7158e323401cb529d5)).
- **Bubble layouts** (iMessage, WhatsApp, Telegram) mark their position in a group as first, middle, last or none, which sets the tail and corner radii.
- **Message parts.** Reactions, thread replies ("3 replies"), delivery and read receipts (sending → sent → delivered → read), typing indicator, edited marker, pinned/saved messages.

**Support widget (Intercom-style)**
- **Launcher.** A bottom-right launcher opens a panel of roughly 380–400px. It isn't resizable on Intercom ([Intercom community](https://community.intercom.com/messenger-8/how-to-increase-the-chat-widget-size-and-adding-custom-text-4674)). NN/g asks for a resizable window for rich answers.
- **Contents.** Home tab (greeting, suggested articles, status), conversation, and handoff to a human with the expected wait time.
- **NN/g rules** ([NN/g AI chatbots](https://www.nngroup.com/articles/ai-chatbots-design-guidelines/)):
  - one entry point that persists across pages, including checkout
  - an opening message scoped to the current page
  - suggested replies as buttons after each answer, not just at the start
  - expand in place rather than appending a new message
  - save or share the answer
  - voice input

**Voice**
- **One turn-state indicator** (orb or waveform) with explicit states: idle, listening, thinking, speaking, interrupted (barge-in).
- **Live captions** for both sides and a persistent transcript that merges back into the text thread.
- **Controls.** Mute, end, and switch to text.
- **Screen readers** get the state changes announced ([assistant-ui voice](https://www.assistant-ui.com/docs/guides/voice.md); [uxdesign.cc voice patterns](https://uxdesign.cc/8-voice-aiux-patterns-81324c8feaa0)).

## 2. States to design

- **Thread start:**
  - Empty or first run: an example-prompts grid that is clickable and context-scoped, and a capability statement with no overpromise. NN/g cites Turo's "help you find any info" as the failure.
  - New chat in a project, which inherits context.
- **Generation:**
  - Pre-first-token, the "thinking" phase. It needs a label. After about 2–3s, switch to an explicit verb such as "Searching…".
  - Streaming.
  - Reasoning, collapsed with a duration.
  - Tool running.
  - Needs approval.
  - Background run with a notification.
- **Interruption:**
  - Stopped (partial output kept, with a "Stopped" marker and Continue).
  - Error mid-stream (keep the partial output, offer Retry).
  - Content refusal.
  - Rate-limited or quota hit (say when it resets and offer a model fallback).
  - Context full (offer to summarize or start a new chat).
- **Connection:**
  - Offline or reconnecting: queue the send and show an "unsent" marker with Retry. The draft must never be lost.
  - Attachment states: uploading with progress, unsupported type, too large, processing.
- **Editing:**
  - Edit a user message, which forks the thread.
  - Regenerate, which adds a sibling and a pager.
  - Branch switch.
  - Deleted message (tombstone).
- **Long content:**
  - Long thread (virtualize, jump to latest).
  - Very long message (collapse with "Show more").
  - Wide table or code (scroll inside the block).
- **Messaging-specific:**
  - Unread divider.
  - Typing indicator.
  - Sending, failed to send ("Tap to retry").
  - Read receipts.
  - Mention highlight.
  - Muted channel.
  - Thread pane open.
  - Handoff to human queued.
  - Agent offline (support).
- **Voice:**
  - Microphone permission denied.
  - No speech detected.
  - Barge-in.
  - Speech-to-text low confidence (show the recognized text before acting).

## 3. Typography

### What shipping products actually use

| Product | Body face | Size / line-height | Measure | Code | Source |
|---|---|---|---|---|---|
| ChatGPT | `"OpenAI Sans"`, then the system stack (`-apple-system-body`, `system-ui`, Segoe UI) | `--text-base` 1rem / 1.5 | `--thread-content-max-width: 48rem`, 40–42rem in narrow or extension contexts | `ui-monospace, SF Mono, Menlo, Consolas`, size `--text-sm` (.875rem), weight normal | prod CSS; brand: [Wallpaper](https://www.wallpaper.com/tech/openai-has-undergone-its-first-ever-rebrand-giving-fresh-life-to-chatgpt-interactions) |
| Gemini | Google Sans Flex (Google Sans Text fallback) | body-l 1rem–1.0625rem (16–17px) / 24, 26 or 30px; axes `wdth 92–95`, `opsz 16–17`, `ROND 0`; headline-l weight **350** | content ≈768px | Google Sans Code ([design.google](https://design.google/library/open-source-custom-fonts-google)) | prod CSS |
| Discord | gg sans ([Discord](https://support.discord.com/hc/en-us/articles/9507780972951)) | markup 1rem / **1.375rem** (22px) | full pane | gg mono; inline code **85%**, block .875rem/1.125rem; headings 1.375em | prod CSS |
| Slack | Lato (brand: [brand.slackhq.com/ui](https://brand.slackhq.com/ui)), `Slack-Lato, Slack-Fractions` | `.c-message__body` line-height **1.46668** (22px at 15px); timestamps 12px | full pane | `"SF Mono"`/Monaco | prod CSS |
| Claude.ai | Anthropic Sans for UI and body, Anthropic Serif for display, Anthropic Mono for code | body 16–17 / 1.5; code 14 / 1.5; inline code 0.9em | prose 680px | Anthropic Mono | [3rd-party design.md](https://www.webdesignhot.com/design.md/claude-ai/) |
| iOS (iMessage) | SF Pro | Body 17pt (Dynamic Type) | bubble ~70–75% of width (observed) | — | [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/typography) |

### Rules derived from the table

1. **Measure is about 60–80 characters, not "max-w-3xl because it looks fine".**
   - 48rem at 16px is roughly 85–95ch of a typical sans. ChatGPT gets away with it because headings, lists, code and tables break up the prose. For plain prose, aim for 60–75ch ([readability research summary](https://blogs.oregonstate.edu/calverta/line-width-in-digital-typography-for-accessibility-and-comprehension/)).
   - Rule: keep paragraphs at `max-width: 70ch` inside a column of about 46–48rem, and let tables and code use the full column.
   - Messaging panes run full width but lose little, because messages are short.
2. **Body text is 16–17px at a line-height of 1.375–1.6.**
   - Dense messaging sits at the tight end: Discord 22/16 and Slack 22/15. Long-form assistant answers sit at the loose end: 24–30px on 16–17px.
   - Tailwind Typography's `prose` default is 16px/**1.75**, and paragraph margins are 1.25em ([@tailwindcss/typography styles.js](https://unpkg.com/@tailwindcss/typography@0.5.16/src/styles.js)). In a thread with many short paragraphs that looks airy and floaty. Tighten it to about 1.5–1.6 and paragraph margins to about 0.75em.
3. **The markdown heading scale must be compressed.**
   - ChatGPT renders message h1/h2/h3 at **150%/125%/115%** of body.
   - Discord renders headings bold with a line-height of 1.375em and margins of 16px above and 4px below.
   - `prose` defaults to h1 **2.25em (36px)**, h2 24px with 48px top margin, and weight 800. Model output is full of `#` headings, so that scale makes every answer look like a landing page.
   - Rule: no heading in a message larger than 1.5× body. Use weight, not size, for hierarchy.
4. **Code and mono.**
   - Use the system mono stack or a family-matched mono. Gemini pairs Google Sans with Google Sans Code; Discord pairs gg sans with gg mono; this toolkit's netrunner theme pairs Plex Sans with Plex Mono. Family-matched mono shares x-height and stroke, so inline code doesn't jump.
   - Inline code at 0.85–0.9em with a tinted background and no literal backticks. `prose` injects `` ` `` through `code::before/::after` and sets weight 600, which is a common tell.
   - Code blocks at about 0.875rem and a line-height of about 1.45, scrolling horizontally (or with an opt-in wrap toggle), at code weight normal (ChatGPT sets `--font-code-weight: normal`).
   - Use mono for commands, paths, IDs, token counts and diffs. Never use it for prose or UI labels.
5. **Numerals.**
   - Use `font-variant-numeric: tabular-nums` for timestamps, durations ("Thought for 12s"), token and cost meters, and table number columns. Discord ships `.tabularNumbers` and uses it on durations.
   - Slack goes further and adds a `Slack-Fractions` font to its stack.
   - Use `<time datetime>` with relative text plus an absolute tooltip.
6. **Stylized and display faces belong in chrome, never in the reading surface.**
   - Gemini's expressive variable face changes the *axes* of the same family (weight 350 for headlines, wdth 92–95, opsz matched to size) rather than switching to a second display face.
   - Claude puts its serif on display and marketing surfaces and keeps the UI and body sans (3rd-party).
   - For a stylized theme such as cyberpunk, the display face (e.g. Barlow Condensed) may set the session title, empty-state hero, plate labels and step-card designators: caps, ≥12px, tracking +0.04–0.08em. Message bodies, the composer, code, tables and citations stay in the text face and mono. Speaker labels can use small-caps or the label style, but the text after them is the reading face.
   - Keep display type under about 5% of the glyphs on screen (inference).
   - Fluent: never all caps for emphasis ([Fluent 2 typography](https://fluent2.microsoft.design/typography)).
7. **Text sizes for small elements.**
   - Secondary text (timestamps, disclaimers, citations) at 12–13px minimum and ≥4.5:1 contrast. Discord's compact timestamp at 11px is the floor, and it bumps to 12px under a11y scaling.
   - The composer textarea must be **≥16px**, or iOS Safari zooms on focus ([Rick Strahl](https://weblog.west-wind.com/posts/2023/Apr/17/Preventing-iOS-Textbox-Auto-Zooming-and-ViewPort-Sizing)).
8. **Typography during streaming (inference).**
   - Don't apply `text-wrap: pretty/balance` to the paragraph that is streaming. It re-wraps earlier lines and makes them jitter. Apply it once the block completes.
   - Reserve height for code and tables, and highlight syntax only once the fence closes. Users also ask for a density or line-height control ([OpenAI community](https://community.openai.com/t/feature-request-compact-density-1-0-line-height-option-to-reduce-wasted-vertical-space-in-chatgpt-responses/1370458); [Cursor forum](https://forum.cursor.com/t/feature-request-customizable-line-height-and-paragraph-spacing-in-ai-chat/148821)).

## 4. Layout, motion, accessibility

**Layout**
- Desktop: sidebar (260–300px, collapsible) | centered thread column | optional artifact or thread pane (resizable).
- The composer is width-matched to the thread. ChatGPT derives `--composer-adjacent-max-width` from the thread width.
- Mobile:
  - The sidebar becomes a drawer, and artifacts open as a full-screen sheet.
  - The composer is pinned with `env(safe-area-inset-bottom)`.
  - Use `<meta name="viewport" content="…, interactive-widget=resizes-content">` so the keyboard resizes the layout instead of covering the composer (Chrome 108+, Firefox 132+) ([MDN viewport](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Viewport_meta_element); [Chrome](https://developer.chrome.com/blog/viewport-resize-behavior)).
  - Use `dvh` rather than `vh`.
- The composer grows to about 40% of viewport height, then scrolls internally.

**Motion**
- On send, put the user turn at the top of the viewport and follow the stream only while the user stays at the bottom. NN/g: users "expect to read from the beginning".
- Show a "Jump to latest" pill when they've scrolled up.
- Flush tokens per animation frame, not per token, and don't fade each token.
- Use a single caret or shimmer on the active turn and none under `prefers-reduced-motion`.
- Typing indicators in human chat are dots that stop after a timeout.

**Accessibility (streaming)**
- **Never put the streaming body in a live region.** Each token mutation gets announced ([Smashing 2026-11](https://smashingmagazine.com/2026/11/making-immersive-llm-chat-experiences-more-accessible/); [azukiazusa](https://azukiazusa.dev/en/blog/accessible-streaming-chat-ui)).
- **ChatGPT's pattern:** a visually hidden `role="status" aria-live="polite" aria-atomic="true"` element reads "Thinking", then "Response complete". Each turn has a hidden heading naming the sender.
- **Claude's pattern:** an ARIA `feed` with `article` elements carrying `aria-posinset`/`aria-setsize`, and the label "Currently streaming message" while streaming.
- **Rules:**
  - The status element exists in the DOM at load.
  - Clear it before setting a new message.
  - Use polite even for errors.
  - Don't rely on `aria-busy`, which screen readers honor inconsistently.
- **Focus stays in the composer after send.**
- **Smashing's additions:**
  - Announce "Loading" after about 5s, then every 5s.
  - One `article` per message with an sr-only `h2` ("You said:" or "{agent} said:").
  - Landmarks: `nav` for history, `main` for the thread, `form` for the composer, `aside` for artifacts. Don't make each message a landmark; one long session produced 23 landmarks versus 3.
  - The history list is one tab stop with arrow keys, Home/End and typeahead.
  - Ctrl+F6 cycles landmarks.
  - Table and code summaries ("settings.json, 738 lines").
  - Toggles for announcement granularity, motion and sound.
  - Test at increased text size, because chat UIs tend to use small text.
- **WCAG:**
  - 1.4.10 Reflow at 320px; 1.4.12 Text Spacing (line-height 1.5, paragraph 2em, letter 0.12em, word 0.16em) must not clip bubbles ([WCAG 2.2](https://www.w3.org/TR/WCAG22/)).
  - 2.4.11 Focus Not Obscured: a sticky composer or the jump pill must not cover a focused message action.
  - 2.5.8 Target Size: per-message actions ≥24×24 and visible on focus, not hover only.

## 5. What vibe-coded chat UIs get wrong

1. Raw `prose` defaults: 36px/800 h1s inside answers, 1.75 line-height, literal backticks around inline code.
2. Both sides in bubbles, with gradient user bubbles and a 100%-width assistant bubble. Long answers in bubbles lose the measure and the copy affordances.
3. Unbounded line length (a full 1400px row) on desktop, or `max-w-md` bubbles that make code and tables scroll.
4. Display or "theme" faces (Orbitron, mono-caps, glitch) used for message text. A neon `text-shadow` on body text kills legibility.
5. Autoscroll that yanks the reader down while they read. No jump-to-latest pill.
6. A spinner with no label, and nothing between send and the first token.
7. Send stays enabled during a stream; there's no Stop; the stop loses the partial output; an error deletes the user's prompt.
8. Code blocks with no copy button, no language label, and wrapping that breaks indentation. Tables overflow the page at 375px.
9. Composer below 16px (iOS zoom), covered by the keyboard, `100vh` jank, Enter-to-send with no newline path, IME composition sending early. Check `isComposing` before sending on Enter.
10. No live region at all, or `aria-live` on the whole message list.
11. Timestamps in proportional figures that jitter; "2m ago" with no absolute time.
12. Fake chat: every message the same length, no long, error or edited message tested; only the empty state looks designed.
13. Support widgets that hide on checkout, can't be resized, show a generic "Ask me anything", and offer no human handoff.

## 6. Playwright-checkable rules

- **Measure:** for `[data-role=assistant] p`, `width / (canvas measureText('0') of the computed font)` should be in **55–85ch** at a 1440px viewport. Fail above 95 or below 35.
- **Body:** message `p` font-size ≥16px (≥15px allowed for dense messaging). Line-height ratio 1.35–1.65.
- **Heading scale:** inside messages, `h1..h3` font-size ≤ 1.6× body. Fail on any heading weight of 800 or more.
- **Inline code:** `getComputedStyle(code,'::before').content` must be `none` or `""`. Font-size ratio 0.8–0.95. Family is monospace.
- **Code blocks:** `pre` has `overflow-x: auto|scroll` or a wrap toggle, plus a button whose accessible name matches /copy/i.
- **Display-face leak:** message-body `font-family` equals the theme's text token, not the heading or display token. Fail on `text-transform: uppercase`, letter-spacing above 0.05em, or a non-`none` `text-shadow` on message text.
- **Numerals:** `time`, duration and meter elements have `font-variant-numeric` containing `tabular-nums`. `time[datetime]` is present.
- **Composer:** the textarea has an accessible name and font-size ≥16px at a 390px viewport.
  - Shift+Enter inserts a newline. Enter during IME composition doesn't send.
  - Send is disabled when the composer is empty.
- **Send flow:** after send, `document.activeElement` is the composer.
  - The user turn's top edge is inside the viewport.
  - During the stream, a Stop button occupies the Send button's rect (±4px). Esc stops the stream and the partial text remains.
- **Scroll ownership:** mock a slow stream and scroll up 400px. `scrollTop` must stay within 2px over 3s, and a "jump to latest" control must appear and work.
- **Live regions:** a `[role=status]` or `[aria-live=polite]` element exists before the first send. No ancestor of the streaming node has `aria-live` other than `off`.
  - Observe mutations on the status node: fewer than 5 during one response, and its final text matches /complete|finished|done/i.
- **Semantics:** messages are `article` elements, or inside `role=log` or `feed`, each with a sender name (heading or label). Landmark count ≤ 6 regardless of thread length.
- **Reflow:** at 320px and at 200% text zoom, `document.scrollingElement.scrollWidth ≤ clientWidth`. Wide tables and code scroll inside their own container.
- **Text spacing:** inject the WCAG 1.4.12 stylesheet. No message or chip has `scrollHeight > clientHeight` with hidden overflow.
- **Focus not obscured:** Tab through message actions. For each focused element, `elementFromPoint(center)` resolves to it, not to the composer or pill.
- **Targets:** message actions ≥24×24 and visible on `:focus-visible`.
- **Contrast:** timestamps, disclaimer and citation text ≥4.5:1.
- **Reduced motion:** with `reducedMotion: 'reduce'`, no running CSS animations or transitions longer than 0ms on caret or shimmer.
- **Failure states, via route mocks:**
  - 500 mid-stream: partial text kept, Retry button shown.
  - 429: message includes a reset time.
  - `context.setOffline(true)`: banner shown, draft preserved, unsent marker.
  - Each state screenshotted.
- **Stability:** during streaming, layout-shift entries attributed to *earlier* messages total under 0.01.
- **Long thread:** seed 500 messages. The rendered message node count is under about 150 (virtualized), or scroll stays at 50+fps.
