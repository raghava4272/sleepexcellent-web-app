# Feature: F004 — Shopping Cart

## Metadata

Feature ID: F004
Phase: PHASE-001
Priority: P0
Status: FEATURE_COMPLETE
Owner Role: PRODUCT_LEAD
Approval Date: 2026-09-05

## User Goal

As a shopper, I can maintain a reliable cart across navigation and refreshes, while using Buy Now for one direct purchase without disrupting that cart.

## Approved Requirements

1. A shopper can add direct-purchase sofa, bed, and mattress catalogue products to a normal cart.
2. Cart quantities are positive whole numbers and support increment, decrement, and removal.
3. A shopper can clear the normal cart.
4. The cart persists across page navigation and browser refreshes for the Sunday MVP.
5. The global cart indicator shows the total item quantity and opens a cart drawer or equivalent responsive surface.
6. The cart shows each product's authoritative catalogue name, category/configuration context, unit price, quantity, line total, and subtotal.
7. Prices must be revalidated against authoritative product records before checkout; persisted client values are never checkout authority.
8. Add to Cart updates the persistent normal cart.
9. Buy Now creates a direct-checkout intent containing only the selected product and selected positive whole-number quantity.
10. Buy Now excludes unrelated normal-cart items and leaves the persistent normal cart unchanged.
11. The later Technical Lead design may share checkout logic but should not duplicate persistent storage unnecessarily.
12. Ceiling solutions cannot enter the cart.
13. Until authoritative availability is supplied, the cart shows no invented availability state and does not block purchase based on assumed stock.
14. Product media appears only where its mapping is authoritative. Otherwise the cart uses the deliberate pending-media fallback, never another product's image.
15. Missing availability and product media are non-blocking for cart completion.

Traceability: explicitly approved by the user on 2026-09-05 as “B1 — Shopping Cart APPROVED with the following adjustments.”

## Acceptance Criteria

1. Adding an eligible product creates or updates its normal-cart line and updates the global item count.
2. Adding the same product again combines it into the existing line unless later authoritative variant identity requires a distinct line.
3. Increment and decrement controls change quantity by one and never permit zero or a non-whole quantity; decrementing from one does not silently create an invalid line.
4. Remove deletes the selected line, and Clear Cart empties the normal cart only after an intentional shopper action.
5. The normal cart survives navigation and a browser refresh in the same browser.
6. Unit price, quantity, line total, and subtotal render in INR and calculate correctly from authoritative catalogue prices for display.
7. Entering checkout causes the server-side flow to revalidate product identities and prices rather than trusting persisted totals.
8. Buy Now with a selected product and quantity opens direct checkout containing only that selection.
9. Existing unrelated normal-cart lines remain present and unchanged before, during, and after initiating Buy Now.
10. Add to Cart never replaces the normal cart with a Buy Now selection.
11. Ceiling detail and catalogue views provide no route that adds a ceiling service to the cart.
12. No stock label or stock-based restriction is shown without authoritative availability.
13. An unmapped product uses the approved pending-media fallback and never borrows another product's media.
14. Empty-cart and unavailable/changed-product states provide clear recovery actions without a broken checkout route.
15. Drawer/modal controls, quantity controls, remove/clear actions, and checkout actions are keyboard operable, labelled, focus-managed, touch friendly, and responsive.

## Out of Scope

- Backend inventory reservation
- Invented stock enforcement
- Coupons, promotions, discounts, gift cards, or loyalty points
- Saved carts across different devices or anonymous browsers
- Multiple named carts or wishlists
- Ceiling-service cart items
- Final shipping or tax calculation

## Dependencies

- F002 Catalogue Browsing and Search
- F003 Product Detail Experience
- F005 Checkout, Address and Order Creation
- Authoritative catalogue product records and prices
- Product media mapping: PENDING CLIENT INPUT, non-blocking
- Initial availability: PENDING CLIENT INPUT, non-blocking
- Persistence and server-price-revalidation architecture to be designed after product discovery

## User Decisions

| Date | Decision | Approval Evidence | Effect |
| ---- | -------- | ----------------- | ------ |
| 2026-09-05 | Approve B1 with adjusted scope. | User explicitly approved “B1 — Shopping Cart.” | Registered F004 as an approved P0 feature. |
| 2026-09-05 | Separate Add to Cart from Buy Now intent. | Explicit Buy Now path adjustment. | Buy Now checks out only the selected item and preserves unrelated cart lines. |
| 2026-09-05 | Persist the normal cart across navigation and refresh. | Explicit cart behavior approval. | Sunday MVP requires browser persistence. |
| 2026-09-05 | Revalidate prices before checkout. | Explicit price-revalidation rule. | Client-stored price data is non-authoritative. |
| 2026-09-05 | Missing availability/media are non-blocking. | Explicit approval adjustment. | Cart proceeds without fabricated stock and with deliberate media fallback. |

## Design References

- Existing homepage cart drawer and premium visual system.
- `docs/product/CLIENT-BRIEF.md`
- `docs/product/REFERENCE-ANALYSIS.md`

## Architecture References

Approved initial architecture: `docs/architecture/SYSTEM-ARCHITECTURE.md` and ADR-003 define the versioned persistent cart and separate tab-scoped Buy Now intent.

## Implementation Plan

Proposed in `IMPLEMENTATION.md`, awaiting explicit approval. Application implementation is not yet authorized.

## Implementation Status

Current state: FEATURE_COMPLETE
Summary: Independent QA passed the persistent normal cart and isolated Buy Now intent. F005 checkout/order creation remains unstarted and out of scope.

## Files Changed

| File | Purpose |
| ---- | ------- |
| `components/cart-provider.tsx` | Versioned local persistent normal-cart store and separate session-scoped Buy Now intent, containing slugs/positive quantities only. |
| `app/api/cart/products/route.ts` | Refreshes currently published direct-purchase catalogue display data for persisted cart lines. |
| `components/home-page.tsx` | Global cart count and responsive drawer with quantity/remove/clear/empty/recovery states. |
| `components/product-detail-page.tsx` | Connects direct-product Add to Cart and Buy Now controls; ceiling consultation controls remain excluded. |
| `app/layout.tsx`, `lib/catalogue/repository.ts`, `app/globals.css` | Global provider, published direct-product read, and cart visual/accessibility treatment. |
| `tests/cart.test.mjs` | F004 persistence, separation, exclusion, and recovery regression checks. |

## Developer Validation

| Check | Result | Evidence / Notes |
| ----- | ------ | ---------------- |
| Automated tests | Passed | `npm test` passed all 15 tests, including F004 cart coverage. |
| Type/lint/build | Passed | `npm run typecheck`, `npm run lint`, and `npm run build` completed successfully. |
| Browser checks | Passed | Desktop and 390px mobile review verified add/merge, quantity update, refresh persistence, Buy Now isolation, drawer controls, and ceiling CTA exclusion. |

## User Review

Status: Accepted
Feedback: User manually reviewed and explicitly accepted F004 for independent QA.
Acceptance Date: 2026-09-05

## QA Testing

| Acceptance Criterion | Test | Result | Evidence |
| -------------------- | ---- | ------ | -------- |
| 1–4 | Cart identity/quantity, merge, remove, and intentional clear behavior | Passed | Static F004 regression coverage plus independent code review; browser retained existing test cart because browser-policy confirmation is required before local-data deletion. |
| 5–7 | Persistence, current display pricing, non-authoritative browser state | Passed | Local browser navigation/refresh retained 4 then 5 merged items; provider stores only slug/quantity and `/api/cart/products` refreshes current published direct products. |
| 8–10 | Buy Now isolation | Passed | Browser Buy Now status confirmed separate intent; normal cart remained unchanged. |
| 11–13 | Ceiling/media/availability boundaries | Passed | Glass Ceiling exposed consultation only with zero Add to Cart/Buy Now controls; current cart contains no availability labels and uses the pending-media fallback. |
| 14–15 | Recovery, responsive, accessibility, reduced motion | Passed | Empty/changed/loading/recoverable states reviewed; 390px drawer review verified close/subtotal/disabled F005 checkout; labelled controls/focus trap and reduced-motion branch verified. |

## AI Evals, When Applicable

Not applicable. This feature does not include AI behavior.

## Known Limitations

- Product media mapping and initial availability are PENDING CLIENT INPUT but non-blocking.
- Cross-device anonymous cart persistence is not included.
- The cart stores only identity/quantity and uses a current published catalogue read for presentation; F005 must perform authoritative server-side checkout-price revalidation.
- Buy Now is safely stored as a separate direct-checkout intent. The actual checkout route, order creation, payment, and post-payment reconciliation are deferred to F005/F006.

## Change History

| Date | Change | Reason | Approved By |
| ---- | ------ | ------ | ----------- |
| 2026-09-05 | Initial approved specification created with persistent-cart, direct Buy Now, revalidation, media, and availability rules. | Group B approval. | User |
| 2026-09-05 | Implemented and developer-validated persistent cart and isolated Buy Now intent. | Explicit F004 implementation authorization. | Codex / Software Engineer |
| 2026-09-05 | Independent acceptance testing passed; feature marked complete. | User acceptance followed by QA verification. | Codex / QA Engineer |
