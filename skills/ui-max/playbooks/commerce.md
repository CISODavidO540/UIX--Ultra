---
id: commerce
title: E-commerce: product page, cart, checkout
surface: Convert
keywords: shop, store, e-commerce, ecommerce, product page, product detail, pdp, cart, checkout, payment, order, catalog, sku
---
# Commerce

**Core tasks:** judge the product · pick a variant · know the total and delivery date · pay without an account.

**Baymard:** 70% average abandonment. Excluding browsers, people leave over surprise costs (40%), slow delivery (20%), trust (19%), a forced account (18%) and complexity (17%). The average checkout has 11.3 fields when about 8 are needed.

**Must exist:** zoomable gallery with in-use and in-scale images; price + unit price with sale "was" text a screen reader can hear (not just `<s>`); variant pickers that don't rely on color alone, with per-option stock; delivery date and cost on the product page; returns summary; sticky add-to-cart on mobile; review distribution; guest checkout first; address autocomplete; full total visible on the step with the pay button; correct `autocomplete` tokens; no double-submit.

**Forgotten states:** out of stock / low stock, price changed since added to the cart, invalid promo, declined card and 3-DS, session timeout that keeps the cart.

**Type:** tabular numbers in price lists, `Intl.NumberFormat`, and no display face where 1/7 or 0/8 can be confused.

**Astryx (verified):** `product-detail`, `product-gallery`, `payment-form`, `checkout-wizard`, `detail-page` (order). Note: `astryx build "e-commerce checkout"` misroutes to the app shell, so name the template directly.
