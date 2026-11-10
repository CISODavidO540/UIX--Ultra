---
id: terminal-tui
title: Terminal UI / CLI
surface: Operate
keywords: tui, terminal ui, cli, command line, shell, ratatui, bubble tea, bubbletea, lipgloss, ncurses, lazygit, tmux
---
# Terminal UIs and CLIs

The app controls neither font nor size, so hierarchy comes from **bold, dim, reverse, underline, color, case, box drawing and position**. Italic is unreliable.

**Must exist:** a one-line key-hint bar generated from the real key bindings (Bubbles `help`) and `?` for all keys; `/` filter, `esc`, `q`; the 16 ANSI colors for meaning (users theme them) with truecolor only for decoration; color off when not a TTY, `NO_COLOR`, `TERM=dumb` or `--no-color`; `--json` / `--plain`; data on stdout and logs on stderr; something printed within 100 ms; prompts only when stdin is a TTY, plus `--no-input`.

**Forgotten states:** terminal too small ("needs 80×24"), light background, monochrome, piped output, SIGINT (restore the cursor, leave the alternate screen), double-width CJK and emoji, Nerd Font glyphs with ASCII fallbacks.

**Checks:** Playwright doesn't apply unless the TUI runs in xterm.js. Use a pty harness: no line wider than the terminal at 80×24 and 60×20 (by `wcwidth`); zero `\x1b[` with `NO_COLOR=1 … | cat`; golden snapshots (ratatui `TestBackend`, `teatest`, VHS tapes).

**Not this playbook:** a *web* app styled like a terminal is `game-fui`.

**Astryx:** none (web only). `build "terminal console"` picks `ide`, which only makes sense for a web terminal pane.
