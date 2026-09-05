# Feature: F010 — Admin Order and Ceiling Enquiry Operations

## Metadata

Feature ID: F010
Phase: PHASE-001
Priority: P0
Status: APPROVED
Owner Role: PRODUCT_LEAD
Approval Date: 2026-09-05

## User Goal

As an authorized SleepExcellent administrator, I can securely find and review immutable customer orders and ceiling enquiries, then update only their approved simple operational statuses.

## Approved Requirements

1. The Sunday order lifecycle is `NEW` → `PROCESSING` → `COMPLETED` and remains intentionally simple.
2. Do not add `CANCELLED`, `REFUNDED`, `SHIPPED`, `DELIVERED`, or `RETURNED` until corresponding business and fulfilment rules are approved; later architecture remains extensible.
3. Order status and payment status are separate concepts.
4. Admin may update order status but cannot manually change verified payment state or mark an order `PAID` through the ordinary admin interface.
5. Admin order detail may display non-secret Razorpay references needed for operational support as read-only values.
6. Never expose Razorpay secret keys, signing secrets, sensitive credentials, or internal secret configuration.
7. Admin cannot arbitrarily edit payment identifiers.
8. Order list is recent-first.
9. Sunday order search supports the SleepExcellent public order reference, customer phone, and customer email.
10. Sunday order filtering supports order status and payment status; advanced reporting/analytics is excluded.
11. Order detail uses immutable purchase snapshots for product/model name, configuration/specification, unit price, quantity, line total, customer/contact information, delivery address, subtotal, shipping, and final total.
12. Historical order records are not reconstructed from current catalogue values.
13. Admin cannot edit order items, historical prices/totals, payment status, or Razorpay identifiers during Sunday MVP.
14. Admin ceiling-enquiry operations support list/search, detail, customer contact data, selected ceiling type/Need guidance, approximate area, locality, project details, and enquiry status updates.
15. The enquiry lifecycle remains `NEW` → `CONTACTED` → `CLOSED` and must not expand into CRM functionality.
16. Admin enquiry operations never calculate final ceiling price, automatically create a quotation, convert an enquiry into cart/order, create Razorpay payment, or promise installation/transport pricing.
17. Customer/order/enquiry data is protected by authenticated identity, server-side admin authorization, and Supabase RLS where applicable.
18. Hidden navigation is insufficient; direct admin data/mutation requests require the same authorization.
19. Pending initial administrator identity, authoritative availability, product-media mappings, additional images/galleries/videos, cancellation policy, and refund/return policy do not block architecture or Sunday MVP development.
20. If time is constrained, F010 delivery order is order list, order detail, order-status update, enquiry list, enquiry detail, enquiry-status update, then search/filter polish.

Traceability: explicitly approved by the user on 2026-09-05 as “E2 — Admin Order and Ceiling Enquiry Operations APPROVED as F010,” with the specified status, payment separation, Razorpay, snapshot, enquiry, security, and priority adjustments.

## Acceptance Criteria

1. Anonymous visitors and normal customers cannot list, search, view, or mutate admin order/enquiry data.
2. Direct endpoint requests require server-side admin authorization and applicable RLS, regardless of whether admin navigation is visible.
3. Order list is recent-first and can search by public reference, phone, or email and filter by order/payment status.
4. Order detail displays the approved immutable product, customer, address, and monetary snapshots without consulting current catalogue values for historical fields.
5. Admin can move an order through `NEW`, `PROCESSING`, and `COMPLETED` using only allowed transitions defined later by architecture.
6. No ordinary admin control can set payment status to `PAID` or edit verified payment state.
7. Cancellation, refund, shipped, delivered, and returned states are absent from Sunday admin actions.
8. Non-secret Razorpay support references are readable but not editable; no credential or signing secret is exposed.
9. Admin cannot edit order lines, purchase-time names/configurations, historical amounts, customer/address snapshots, or final totals.
10. Enquiry list/search and detail display every approved F008 snapshot field needed for follow-up.
11. Admin can move an enquiry among `NEW`, `CONTACTED`, and `CLOSED` without CRM stages or automation.
12. Enquiry actions never produce a quotation, price calculation, cart item, order, or payment.
13. Loading, empty, validation, authorization, persistence, and successful-update states are clearly presented.
14. Order/enquiry views and status controls are keyboard accessible and practical on desktop/tablet with a safe non-broken mobile layout.
15. Missing media/availability or an unconfigured initial admin identity does not invalidate the feature architecture or other Sunday feature work.

## Out of Scope

- Manual payment-status editing
- Cancellation, refund, return, shipment, or delivery workflows
- Refund execution or Razorpay settlement management
- Editing orders, snapshots, amounts, addresses, or payment identifiers
- Shipping labels, tracking numbers, or courier integration
- Invoice generation
- CRM pipeline or sales automation
- Automated customer notifications
- Data export, advanced reporting, or analytics dashboards
- Automatic quotation or enquiry-to-order conversion

## Dependencies

- F005 Checkout, Address and Order Creation
- F006 Razorpay Test Payment and Order Confirmation
- F008 Ceiling Catalogue and Consultation Request
- F009 Admin Access and Catalogue Management for admin authorization
- Future Supabase order/enquiry persistence, RLS, and server-authorization architecture
- Cancellation policy: PENDING CLIENT DECISION, non-blocking
- Refund/return policy: PENDING CLIENT DECISION, non-blocking
- Initial administrator identity: PENDING CLIENT INPUT, non-blocking

## User Decisions

| Date | Decision | Approval Evidence | Effect |
| ---- | -------- | ----------------- | ------ |
| 2026-09-05 | Approve E2 as F010 with P0 priority. | User explicitly approved E2 and assigned F010. | Registers the Sunday order/enquiry admin feature. |
| 2026-09-05 | Use `NEW` → `PROCESSING` → `COMPLETED` only. | Explicit order-lifecycle approval. | Unapproved fulfilment/policy states remain unavailable. |
| 2026-09-05 | Separate order status from verified payment status. | Explicit payment-state rule. | Ordinary admin can never manually set `PAID`. |
| 2026-09-05 | Make Razorpay support references read-only and keep secrets hidden. | Explicit Razorpay-information rule. | Admin operations cannot modify identifiers or expose credentials. |
| 2026-09-05 | Use immutable order snapshots in detail. | Explicit order-detail rule. | Current catalogue edits cannot alter historical display. |
| 2026-09-05 | Limit enquiry administration to view/search and `NEW`/`CONTACTED`/`CLOSED`. | Explicit enquiry scope. | Staff follow-up is supported without CRM or automatic quoting. |
| 2026-09-05 | Protect all admin data and endpoints server-side. | Explicit privacy/security rule. | Hidden links are never treated as authorization. |

## Design References

- Existing SleepExcellent typography, colour, form, and responsive visual language.
- `docs/product/CLIENT-BRIEF.md`
- F005/F006 order and payment confirmation requirements.
- F008 enquiry snapshot and status requirements.

## Architecture References

Approved initial architecture: `docs/architecture/SYSTEM-ARCHITECTURE.md`, `docs/architecture/DATA-MODEL.md`, `docs/architecture/ROUTES.md`, ADR-003, and ADR-004.

## Implementation Plan

Proposed in `IMPLEMENTATION.md`, awaiting explicit approval. Application implementation is not yet authorized.

## Implementation Status

Current state: NOT STARTED
Summary: Approved product specification only; no admin screens, Supabase configuration, database tables, or payment changes were created.

## Files Changed

| File | Purpose |
| ---- | ------- |
| None | No implementation files have been changed for this feature. |

## Developer Validation

| Check | Result | Evidence / Notes |
| ----- | ------ | ---------------- |
| Not started | Pending | Implementation has not been authorized. |

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

- Initial admin identity, authoritative availability, and product media remain PENDING CLIENT INPUT but non-blocking.
- Cancellation and return/refund policies remain PENDING CLIENT DECISION, so related states/actions are intentionally absent.
- Shipping/fulfilment, invoicing, notifications, CRM, reporting, exports, and automatic quotation are excluded.
- Detailed persistence, authorization, RLS, and state-transition mechanisms await Technical Lead architecture planning.

## Change History

| Date | Change | Reason | Approved By |
| ---- | ------ | ------ | ----------- |
| 2026-09-05 | Initial approved specification created with immutable order review, separated status control, read-only Razorpay references, and lightweight enquiry operations. | Group E approval. | User |
