---
id: agent-chat
title: AI chat / agent console
surface: Operate + Monitor
keywords: agent, chat, llm, assistant, copilot, hermes, tool call, streaming, sandbox, prompt, conversation, messaging, support widget
---
# Agent chat / agent console

**Core tasks (design for these first):** send a prompt · watch tool calls · approve/deny an action · stop and steer · find a past session · read and copy output.

**Must exist**
- Step card state machine: pending → running → awaiting approval → done | error | denied, with elapsed time; errors auto-expand.
- Approval prompt with the exact command, pinned so it can't scroll away; focus moves to it.
- Stick-to-bottom only while the user is at the bottom; otherwise a "New output" pill.
- Esc stops (keeps work), Ctrl/Cmd+Enter sends, Ctrl/Cmd+K palette, queued messages.
- Streaming markdown that closes unfinished fences; code blocks with copy.
- Context/token meter that warns at ~70% / 90%; per-message cost on hover.
- States: empty session, first-run, thinking (label + elapsed), disconnected/retrying, rate-limited, long output (collapse), very long session (virtualize).

**Type** (`references/type-by-format.md`; from the products' own CSS): body 15–16px at 1.5–1.6 (ChatGPT 16/24, Discord 16/22, Slack 15/22); paragraphs ≤ ~70ch while code and tables use the full column; headings inside answers ≤ 1.5× body (use weight, not size); a mono from the same family as the sans; composer ≥ 16px (iOS zooms below that); tabular timestamps. In a stylized theme the display face stays in the chrome (title, plates, step labels, empty state) and never sets the message body, composer, code or tables.

**Effects budget:** one ambient signal while the agent works (on the active step only). Message text, code, diffs and the composer stay plain.

**Slop risks:** chat bubbles with gradients; spinner with no label; "AI ✨" sparkles; neon on everything; fake stats panels.

**Concepts & themes (pick by the job, not by taste alone)**
- *Long, mostly-autonomous runs you glance at* → **Flight deck** (`flight-deck-night` / `-day` / `-hc`): calm, a strict color code, a master caution that only lights when you're needed. Best daily driver.
- *High-stakes approvals, demos, pairing sessions* → **Vision mixer** (`studio` / `studio-daylight`): the decision (TAKE) is the biggest thing on screen; preview vs program makes "staged vs executed" unmistakable. Costs some learning (Take/Cut/FTB).
- *Writing-heavy chat, research answers* → editorial (quiet chrome, measure, margins); not built yet.
- Not: either concept for a quick one-question chat; plain is better there.

**Astryx (0.7.11, verified):** page templates `ai-chat` (transcript + collapsible tool-call output + resizable artifact panel), `ai-chat-landing` (zero state), `ide` (multi-pane with docked drawer for a sandbox terminal), `table-inbox` (session list + reading pane). Blocks: `ChatToolCallsInteractiveToolCalls`, `ChatToolCallsShowcase`. Run `astryx build "<your task>"`. Hermes projects: `astryx init --agent hermes` writes the agent doc to `.hermes.md`/`HERMES.md`. The approval prompt and stick-to-bottom behavior still need checking against this playbook.

**Benchmark:** `benchmarks/` B1 (agent console).
