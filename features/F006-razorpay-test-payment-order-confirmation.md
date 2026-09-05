# Feature: F006 — Razorpay Test Payment and Order Confirmation

## Metadata

Feature ID: F006
Phase: PHASE-001
Priority: P0
Status: APPROVED
Owner Role: PRODUCT_LEAD
Approval Date: 2026-09-05

## User Goal

As a shopper, I can complete a secure Razorpay test payment and receive a protected order confirmation without losing unrelated cart items.

## Approved Requirements

1. The Sunday MVP integrates Razorpay in test mode only.
2. The Razorpay order amount is created from the server-authoritative checkout total in INR.
3. Razorpay secrets remain server-only and are never exposed to the browser.
4. Browser-reported payment success is insufficient to mark an order paid.
5. An order becomes `PAID` only after the server verifies the Razorpay payment signature and confirms it against the expected order/payment context.
6. Failed, cancelled, interrupted, or unverifiable payments do not become `PAID`.
7. After verified normal-cart payment, clear only the cart that was successfully purchased.
8. After verified Buy Now payment, preserve all unrelated normal-cart items.
9. Cancellation or payment failure preserves the relevant normal-cart or direct-checkout state so the shopper can recover or retry.
10. Successful payment leads to a confirmation experience containing the order reference, payment result, purchased item snapshots, payable total, and delivery/customer summary appropriate for confirmation.
11. Guest confirmation access must not expose a guessable/sequential public database identifier.
12. The Technical Lead will select the secure guest-confirmation mechanism during architecture planning.
13. Duplicate payment/order processing must be safely handled in conjunction with F005's idempotency/state-transition requirement.
14. Razorpay webhook reconciliation is P1 and non-blocking for the Sunday MVP.
15. Production release requires production-grade webhook/reconciliation follow-up and is not satisfied by the Sunday test-mode integration alone.
16. Missing product media uses the deliberate fallback and does not block payment or confirmation.
17. Only the verified server-side transition to `PAID` may create the paid-order notification work. A browser Razorpay-success callback is never sufficient to send customer or business email.
18. After that verified transition, send one Resend customer order-confirmation email to the immutable stored order email and one Resend new-order notification to the configured business recipient. The business recipient must be configurable, never a hardcoded address.
19. The customer confirmation contains only appropriate non-sensitive order information: SleepExcellent order reference, payment confirmation, purchased items/quantities, total, order status, and relevant delivery/contact summary.
20. The business notification contains operational information: order reference, customer name, phone, email, delivery address, purchased items/quantities, total, payment status, and order status.
21. Resend credentials remain server-only. Use a configurable SleepExcellent no-reply sender in the desired form `SleepExcellent <no-reply@APPROVED_DOMAIN>`; the final sending domain remains PENDING CLIENT/OWNER INPUT.
22. Paid-order email delivery is a durable idempotent side effect of the verified `PAID` transition. Repeated payment callbacks must not create accidental duplicate confirmations; a delivery failure is recorded/reported for recovery but never rolls back the paid order or payment.

Traceability: explicitly approved by the user on 2026-09-05 as “B3 — Razorpay Test Payment and Order Confirmation APPROVED with the following adjustments.”

## Acceptance Criteria

1. Checkout creates a Razorpay test order using the server-rebuilt final payable total in INR.
2. Browser source, rendered markup, and client network payloads do not contain the Razorpay secret.
3. A client-side success callback alone cannot set the persisted order status to `PAID`.
4. Valid server-side signature verification transitions the correct order to `PAID` once and records the external payment references needed for support/reconciliation.
5. Invalid signature, mismatched order/payment context, cancellation, and failure leave the order unpaid and show a clear recoverable state.
6. Repeated callbacks or shopper retries do not produce duplicate paid transitions or duplicate payable orders for one attempt.
7. Verified normal-cart success removes the successfully purchased lines without clearing unrelated/new lines introduced outside that checkout snapshot.
8. Verified Buy Now success leaves the shopper's normal cart unchanged.
9. Failed or cancelled normal-cart payment preserves the relevant cart contents; failed or cancelled Buy Now payment preserves a retryable direct-checkout intent.
10. Success opens a confirmation page/state showing a non-sensitive order reference, verified payment status, immutable purchased-item summary, final paid total, and delivery/customer summary.
11. A guest cannot access another order confirmation by incrementing, guessing, or substituting a sequential database ID.
12. Missing product media uses the deliberate fallback without preventing payment or confirmation rendering.
13. Absence of webhook reconciliation does not block Sunday P0 acceptance, but the production-readiness limitation remains explicitly documented.
14. Razorpay launch/cancel/failure controls and confirmation content are keyboard accessible, focus-managed, understandable, and responsive.
15. A browser-only Razorpay success callback cannot queue or send either paid-order email.
16. The verified `PAID` transition creates at most one durable delivery record for each customer-confirmation and business-notification message for an order.
17. A successful paid order sends the approved non-sensitive customer confirmation through Resend to its immutable order email and the operational business notification through Resend to a configurable recipient.
18. A Resend failure leaves the payment/order `PAID`, records a safe delivery failure for recovery, and does not expose email-provider secrets or detailed provider errors to the customer.

## Out of Scope

- Razorpay live-mode activation
- Production launch approval
- Refund initiation or settlement management
- Final invoice generation
- Cash on delivery or another payment gateway
- Saved payment methods
- P0 webhook reconciliation
- Ceiling-service payments
- Marketing, newsletter, abandoned-cart, SMS, WhatsApp, refund, shipping, or invoice email

## Dependencies

- F004 Shopping Cart
- F005 Checkout, Address and Order Creation
- Razorpay test credentials: required for implementation/validation
- Future secure server runtime and order persistence architecture
- Secure guest-confirmation and payment-state architecture to be designed after product discovery
- Razorpay webhook reconciliation: P1 production follow-up
- Resend server-side credentials, configurable no-reply sender, and configurable business notification recipient: required for live transactional-email delivery
- Final SleepExcellent sending domain and business notification recipient: PENDING CLIENT/OWNER INPUT
- Cancellation policy: PENDING CLIENT DECISION
- Return/refund policy: PENDING CLIENT DECISION
- Invoice requirements: PENDING CLIENT DECISION
- Product media mapping: PENDING CLIENT INPUT, non-blocking

## User Decisions

| Date | Decision | Approval Evidence | Effect |
| ---- | -------- | ----------------- | ------ |
| 2026-09-05 | Approve B3 with adjusted scope. | User explicitly approved “B3 — Razorpay Test Payment and Order Confirmation.” | Registered F006 as an approved P0 feature. |
| 2026-09-05 | Use Razorpay test mode for Sunday. | Explicit payment-mode rule. | Live activation remains out of scope. |
| 2026-09-05 | Require server signature verification before `PAID`. | Explicit verification rule. | Browser success is never authoritative. |
| 2026-09-05 | Preserve cart scope according to checkout mode. | Explicit post-payment behavior. | Normal purchase clears purchased cart scope; Buy Now preserves unrelated cart items. |
| 2026-09-05 | Protect guest confirmation from guessable IDs. | Explicit guest-security rule. | Secure public-access mechanism awaits architecture design. |
| 2026-09-05 | Treat webhooks as P1 for Sunday but mandatory production follow-up. | Explicit reconciliation rule. | Sunday can proceed without claiming production readiness. |
| 2026-09-05 | Send transactional paid-order emails only after verified server-side payment. | User-approved transactional-email requirements. | Uses Resend from trusted server code, preserves `PAID` on delivery failure, and records idempotent delivery work. |

## Design References

- Existing homepage premium visual system and cart drawer.
- `docs/product/CLIENT-BRIEF.md`
- `docs/product/REFERENCE-ANALYSIS.md`

## Architecture References

Approved initial architecture: `docs/architecture/SYSTEM-ARCHITECTURE.md`, `docs/architecture/INTEGRATIONS.md`, ADR-003, and ADR-004.

## Implementation Plan

Proposed in `IMPLEMENTATION.md`, awaiting explicit approval. Application implementation is not yet authorized.

## Implementation Status

Current state: NOT STARTED
Summary: Approved product specification only; no application code changed.

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

- Razorpay is test mode only; production readiness requires live configuration, final policies, and robust webhook/reconciliation work.
- Razorpay test credentials are required before implementation validation.
- Product media mapping is pending but non-blocking.
- Final no-reply sender domain and business notification recipient remain PENDING CLIENT/OWNER INPUT; Resend is approved but not configured.

## Change History

| Date | Change | Reason | Approved By |
| ---- | ------ | ------ | ----------- |
| 2026-09-05 | Initial approved specification created with server verification, mode-aware cart preservation, secure guest confirmation, and webhook follow-up. | Group B approval. | User |
| 2026-09-05 | Added Resend paid-order customer and business notification requirements. | User-approved requirements update. | User |
