---
id: detail-page
title: Detail / record / document page
surface: Inspect + Operate
keywords: detail, record, profile page, item page, document, issue, ticket, order, inspector, entity, view page
---
# Detail page

**Core tasks:** understand the item at a glance · take the main action · see history/activity · navigate to related items.

**Must exist**
- Title + key status + primary action above the fold; secondary actions in a menu.
- Metadata as a definition list, not a wall of cards.
- Activity/history timeline; related items.
- Inline edit with save/cancel; optimistic updates with rollback.
- States: loading (layout-matching skeleton), not found, no permission, deleted/archived, conflict.

**Slop risks:** hero banner on a record page; every field in its own card.

**Astryx:** templates `detail-page`, `work-item-detail`, `product-detail`.