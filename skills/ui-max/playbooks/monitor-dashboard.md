---
id: monitor-dashboard
title: Monitoring dashboard / status overview
surface: Monitor
keywords: dashboard, monitor, metrics, kpi, status, health, uptime, observability, analytics, overview, gpu, cluster, nodes, homelab, alerts
---
# Monitoring dashboard

**Core tasks:** spot what's wrong in < 5 s · drill into one item · compare to normal · acknowledge an alert.

**Must exist**
- Exceptions first: sort/flag by severity; healthy items recede (muted), problems take color.
- Every number has a unit, a timeframe and a comparison (vs. yesterday / threshold). Tabular numerals.
- Status is never color alone: icon + text.
- Last-updated time and live/stale indicator; graceful stale state when the feed drops.
- States: loading (skeleton per tile), no data yet, partial outage, stale, error per tile (not whole page).
- Density toggle; keyboard to move between tiles.

**Effects budget:** value-change flash (≤ 300 ms) only when a value crosses a threshold; no ambient motion.

**Slop risks:** 4 identical KPI cards with big numbers and +12% badges; donut charts for everything; decorative sparklines with no axis.

**Concepts & themes**
- *Wall display / glance from across the room* → **Master control** (`master-control`): exceptions first, tally lamps, mimic lines; healthy things recede.
- *Ops console you also act from* → **Flight deck** (`flight-deck-night`): annunciators + synoptic page.
- Not: vision mixer (no preview/program idea in monitoring).

**Astryx:** templates `dashboard`, `dashboard-alert-rail` (exceptions first), `dashboard-scorecard`, `dashboard-progress`, `incident-console`. Charts via `@astryxdesign/charts` (canary). Watch the `dashboard` template's "row of headline tiles": make each tile carry a unit, timeframe and comparison, or it becomes slop tell "identical KPI cards".