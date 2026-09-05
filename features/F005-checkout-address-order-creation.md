# Feature: F005 — Checkout, Address and Order Creation

## Metadata

Feature ID: F005
Phase: PHASE-001
Priority: P0
Status: DEVELOPER_VALIDATION
Owner Role: SOFTWARE_ENGINEER
Approval Date: 2026-09-05

## User Goal

As a shopper, I can provide an Indian delivery address, review an authoritative payable total, and create a reliable order from either my normal cart or a Buy Now selection.

## Approved Requirements

1. Guest checkout is supported and authentication is not required.
2. Checkout supports two modes: normal-cart checkout includes all current normal-cart items; Buy Now checkout includes only the selected product and quantity.
3. Both modes may share UI and server logic while maintaining their distinct item sources.
4. Checkout collects the minimum customer and delivery information needed for an India-only order: customer name, required email, phone, address lines, city, state, and PIN code.
5. Country defaults to India and is not user-selectable for the Sunday MVP.
6. Phone and PIN code receive appropriate validation, with the PIN code conforming to an Indian six-digit postal code.
7. Currency is INR.
8. Sunday MVP shipping is free at `₹0` and is server-configurable for later rule changes.
9. Shipping-provider integration is deferred.
10. The Sunday MVP shows no separate tax/GST line.
11. Do not label catalogue prices as GST-inclusive or GST-exclusive until the client confirms final GST/tax treatment.
12. Sofa, bed, and mattress catalogue listed prices are the authoritative Sunday demo checkout prices for supplied standard configurations.
13. The server rebuilds and validates product identity, unit price, subtotal, shipping, final payable amount, and initial payment status from product IDs and quantities.
14. The server does not trust browser-submitted price, subtotal, shipping, total, or payment status.
15. Order creation stores immutable item snapshots containing product identity, catalogue name, supplied configuration/specification, unit price, quantity, and line total.
16. Later catalogue edits must not rewrite historical order-item snapshots.
17. Duplicate-order protection is required for repeated submission/retry; the Technical Lead will define idempotency and state transitions later.
18. Missing availability does not block order creation and no invented stock is enforced.
19. Missing product media uses the deliberate fallback and does not block checkout or order creation.
20. Final shipping rules, GST/tax treatment, invoice requirements, cancellation policy, return/refund policy, installation charges, and transport charges are PENDING CLIENT DECISION.
21. Store the required customer email in the immutable order/contact snapshot. It is the address used later for approved transactional order communication, whether the order was guest or authenticated.
22. F005 creates the unpaid order and preserves its contact snapshot only; it does not send the paid-order customer or business email. Those messages belong exclusively to F006 after a verified `PAID` transition.

Traceability: explicitly approved by the user on 2026-09-05 as “B2 — Checkout, Address and Order Creation APPROVED with the following adjustments.”

## Acceptance Criteria

1. A guest can enter checkout from either a non-empty normal cart or a valid Buy Now selection without signing in.
2. Normal-cart checkout displays every current cart line and excludes no valid cart line.
3. Buy Now checkout displays only the selected product and quantity and does not include unrelated normal-cart lines.
4. Required customer and Indian address fields provide clear accessible validation and prevent submission when invalid or missing.
5. Country is displayed/defaulted as India without a country-selection control, and the payment currency is INR.
6. A valid PIN code must be six digits; invalid formats receive a specific validation message.
7. Order summary displays product lines, subtotal, Shipping `₹0`, and final payable total, with no separate GST/tax line and no GST-inclusive/exclusive claim.
8. Shipping `₹0` is produced by server configuration rather than accepted from the browser.
9. Before order creation, the server fetches each product and reconstructs all monetary values from authoritative IDs and positive whole quantities.
10. Tampering with browser-submitted unit price, subtotal, shipping, total, or payment status cannot change the server-created order amount or status.
11. Each order item stores the required immutable identity, name, supplied configuration/specification, unit-price, quantity, and line-total snapshot.
12. Editing a product record later does not alter an existing historical order item.
13. Retrying checkout submission cannot create unintended duplicate payable orders for the same checkout attempt.
14. No assumed stock state blocks checkout while availability data is pending.
15. Missing media displays the deliberate fallback and does not prevent address submission or order creation.
16. Checkout is keyboard operable, properly labelled, error-focused, touch friendly, and responsive across mobile, tablet, and desktop widths.
17. Both guest and authenticated checkout persist a required customer email as part of the immutable order/contact snapshot without changing the approved guest-checkout path.
18. F005 does not send a paid-order email while creating an unpaid order.

## Out of Scope

- Shipping-provider integration
- Delivery-rate calculations beyond the approved temporary `₹0` rule
- International checkout or non-INR currency
- Separate GST/tax calculation or unconfirmed tax labels
- Final invoice generation requirements
- Installation or transport charge calculation
- Coupon, discount, gift-card, or loyalty logic
- Account-required checkout
- Ceiling-service checkout
- Paid-order transactional email delivery (F006 only)

## Dependencies

- F003 Product Detail Experience
- F004 Shopping Cart
- F006 Razorpay Test Payment and Order Confirmation
- `docs/product/CATALOGUE.md`
- Future Supabase order persistence and server-authoritative pricing architecture
- Final shipping charge/rules: PENDING CLIENT DECISION
- Final GST/tax treatment: PENDING CLIENT DECISION
- Invoice requirements: PENDING CLIENT DECISION
- Cancellation policy: PENDING CLIENT DECISION
- Return/refund policy: PENDING CLIENT DECISION
- Installation charges: PENDING CLIENT DECISION
- Transport charges: PENDING CLIENT DECISION
- Initial availability: PENDING CLIENT INPUT, non-blocking
- Product media mapping: PENDING CLIENT INPUT, non-blocking

## User Decisions

| Date | Decision | Approval Evidence | Effect |
| ---- | -------- | ----------------- | ------ |
| 2026-09-05 | Approve B2 with adjusted scope. | User explicitly approved “B2 — Checkout, Address and Order Creation.” | Registered F005 as an approved P0 feature. |
| 2026-09-05 | Use temporary free shipping and no separate GST line for Sunday. | Explicit Sunday defaults. | Checkout shows server-configured Shipping `₹0` without making an unconfirmed tax claim. |
| 2026-09-05 | Limit Sunday checkout to India and INR. | Explicit country/currency rule. | Address and validation are India-specific. |
| 2026-09-05 | Support normal-cart and Buy Now checkout modes. | Explicit two-mode rule. | Shared flow retains different item sources. |
| 2026-09-05 | Make the server authoritative for prices and status. | Explicit trust-boundary rule. | Browser monetary/status fields cannot control order records. |
| 2026-09-05 | Preserve immutable order-item snapshots and prevent duplicates. | Explicit order-integrity rules. | Historical orders remain stable and retry-safe architecture is required. |
| 2026-09-05 | Preserve the required order email for later transactional communication without sending from checkout. | User-approved transactional-email clarification. | Guest and authenticated orders retain the immutable contact address; F006 alone sends messages after verified payment. |

## Design References

- Existing homepage premium visual system and cart drawer.
- `docs/product/CLIENT-BRIEF.md`
- `docs/product/REFERENCE-ANALYSIS.md`

## Architecture References

Approved initial architecture: `docs/architecture/DATA-MODEL.md`, `docs/architecture/ROUTES.md`, and ADR-003 define server authority, snapshots, idempotency, and shipping configuration.

## Implementation Plan

Approved in `IMPLEMENTATION.md`; implementation was explicitly authorized on 2026-09-05.

## Implementation Status

Current state: DEVELOPER_VALIDATION
Summary: Server-authoritative checkout and immutable payment-pending order creation are implemented. F006 payment and email behavior remain excluded; final local browser/lint/build evidence is pending completion.

## Files Changed

| File | Purpose |
| ---- | ------- |
| `db/schema.ts`, `drizzle/0001_shallow_prodigy.sql` | Additive `orders`/`order_items` model, immutable snapshots, database checks, RLS, and grants. |
| `lib/checkout/`, `lib/orders/`, `lib/security/` | Shared validation, server-authoritative quote/order service, idempotency, and guest confirmation capability. |
| `app/checkout/`, `app/api/checkout/quote/`, `app/orders/[reference]/confirmation/` | Checkout UI, quote handler, payment-pending protected confirmation view, loading/error recovery. |
| `components/checkout-page.tsx`, cart/product CTA updates | Premium dual-mode checkout and direct Buy Now/cart hand-off. |
| `scripts/validate-f005.ts`, `tests/checkout.test.ts` | Live non-production integration evidence and deterministic checkout tests. |

## Developer Validation

| Check | Result | Evidence / Notes |
| ----- | ------ | ---------------- |
| Migration and database integration | Passed | Reviewed additive M002 applied to configured non-production Supabase. The live validator created, retried, verified, and cleaned up a synthetic PENDING order. |
| Server-authoritative pricing/snapshots/idempotency | Passed | `npm run db:validate:f005` confirmed authoritative catalogue amounts, immutable contact/item snapshots, PENDING/NEW initial state, compatible retry reuse, incompatible retry rejection, and no duplicate order. |
| Unit/regression suite | Passed | `npm test` passed 20 tests, including F005 contracts, price calculation, category exclusion, India validation, and guest-token hashing. |
| Typecheck | Passed | `npm run typecheck` completed successfully. |
| RLS/grants | Passed | `orders` and `order_items` have RLS enabled; anonymous grants are revoked and authenticated reads are restricted by ownership policies. |
| Browser, lint, production build | Pending local toolchain completion | Isolated webpack server started but homepage/checkout requests did not complete compilation within 90 seconds; full lint and build exhibited the same local process delay. No result is claimed. |

## User Review

Status: Not started
Feedback: Not applicable
Acceptance Date: Pending

## QA Testing

| Acceptance Criterion | Test | Result | Evidence |
| -------------------- | ---- | ------ | -------- |
| All | Pending implementation | Not run | Feature is not implemented. |

## AI Evals, When Applicable

Not applicable. This feature does not include AI behavior.

## Known Limitations

- The Sunday shipping rule is temporary and final shipping behavior is PENDING CLIENT DECISION.
- GST/tax wording, invoice requirements, policies, and installation/transport charges are unresolved and intentionally omitted.
- Initial availability and product media mapping are pending but non-blocking.
- Transactional paid-order emails are intentionally deferred to F006; no email is sent for an unpaid F005 order.

## Change History

| Date | Change | Reason | Approved By |
| ---- | ------ | ------ | ----------- |
| 2026-09-05 | Initial approved specification created with dual checkout modes, Sunday defaults, server authority, immutable snapshots, and pending decisions. | Group B approval. | User |
| 2026-09-05 | Added required order-email snapshot and F006-only transactional-email boundary. | User-approved requirements update. | User |
