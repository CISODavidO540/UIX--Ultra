---
id: mobile-app
title: Mobile app screens
surface: any (touch)
keywords: mobile, ios, android, phone, app screen, bottom nav, touch, pwa, swipe
---
# Mobile

**Must exist:** 44 px targets, primary actions in thumb reach, bottom nav ≤ 5 items, safe areas, pull-to-refresh or explicit refresh, offline state, keyboard-aware layouts, 16 px+ inputs (no iOS zoom).

**Effects budget:** gesture-driven motion that follows the finger; commit destructive gestures on release.

**Slop risks:** desktop layout squeezed; hover-only affordances.

**Astryx:** shells `shell-nav`, `shell-side-nav`, `shell-top-nav`, `messaging-shell`; verify every template at 390 px with `omni check`.