---
id: workspace-tool
title: Workspace tools: IDE, canvas, board, calendar, desktop app
surface: Operate
keywords: ide, editor, code editor, canvas, design tool, whiteboard, node editor, node graph, workflow builder, kanban, board, calendar, scheduler, desktop app, electron, file explorer, command palette, multi-pane, inspector
---
# Workspace tools

**Core tasks:** open and switch documents · act on a selection · find any command · arrange panes · trust that work is saved.

**Must exist**
- Panes: resizable splitters (`role=separator`, arrow keys), collapse with minimum widths, F6 to cycle focus between panes, layout restored on relaunch.
- Command palette (Ctrl/Cmd+K): the same key closes it and returns focus; every action is reachable and shows its shortcut; fuzzy matching plus aliases; a curated empty list. It's an accelerator, never the only path.
- Tabs: dirty marker, confirm before closing unsaved work, overflow menu, middle-ellipsis for long names.
- Status bar for background tasks (past 10 s: percent done plus cancel). Inactive-window styling.
- Canvas: zoom/pan/fit buttons with names, an offscreen object list, numeric inspector, arrow-key nudges (Shift ×10), labels hidden at far zoom rather than drawn at 4px.
- Boards/calendars: every drag has a non-drag path (a "Move to…" menu, click port → click port), moves announced live, WIP limits, DST and 12/24 h, events ≤ 15 min.

**Type:** chrome at 12–13px (11px floor), tabular numbers in inspectors, gutters and counts, mono for the editor, terminal and diffs only, `<kbd>` with platform glyphs.

**Slop risks:** a drag-only board; a bare `<canvas>` with no DOM mirror; ports that only show on hover; a palette that steals focus and never gives it back.

**Astryx (verified):** `ide`, `canvas-editor` (also what `build "node graph editor"` picks; there's no node-graph template), `editor` (page editor), `file-explorer`, `kanban-board`, `incident-console`, `shell-nav` (top + side nav + palette search). Blocks: `CommandPalette*`, `Resizable*`, `ScrollableAreaTwoAxisBoard`, `Calendar*`. No calendar-view page: `build "calendar scheduling"` → app shell.
