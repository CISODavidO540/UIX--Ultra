---
id: data-table-admin
title: Data table / admin / CRUD
surface: Operate + Compare
keywords: table, admin, crud, list, records, users, inventory, grid, rows, bulk, filter, sort, back office, cms, sessions list
---
# Data table / admin

**Core tasks:** find a record · filter and sort · edit one · act on many (bulk) · export.

**Must exist**
- Sticky header, right-aligned tabular numbers, left-aligned text, truncation with full value on hover/focus.
- Filter bar with visible active filters and one-click clear; search that matches what users type.
- Row selection + bulk action bar; destructive bulk actions use undo rather than confirm where possible.
- Pagination or virtualization; row count; keyboard row navigation.
- States: loading (row skeletons with real column widths), empty (first use: how to add), empty (filtered: clear filters), error with retry, saving per row, conflict.

**Effects budget:** none beyond hover/selection and row add/remove fades.

**Slop risks:** zebra stripes + borders + shadows all at once; icon-only action columns without labels; cards instead of a table for tabular data.

**Astryx:** templates `table-page`, `table-filter`, `table-grouped`, `table-tree`, `table-collapsible`, `table-comparison`, `table-inbox`; component `Table` (sorting, selection, pagination, column management via plugins). `astryx component Table` before changing props.