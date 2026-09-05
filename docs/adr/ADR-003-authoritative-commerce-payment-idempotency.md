# ADR-003 — Server-Authoritative Commerce, Payment, and Idempotency

Status: APPROVED
Date: 2026-09-05

## Context

Cart state is browser-persistent, Buy Now must remain separate, prices and totals cannot be trusted from the browser, orders require immutable snapshots, and Razorpay browser success cannot establish paid state. Retries must not create duplicate orders, payments, or enquiries.

## Decision

Persist only product IDs/quantities in the versioned normal cart and a separate tab-scoped Buy Now intent. At checkout, the server resolves current authoritative products, calculates INR amounts and configured shipping, and writes an immutable order transaction keyed by a client-generated idempotency key. Razorpay order creation uses that stored total. Server HMAC verification against the stored provider order ID performs a conditional atomic paid transition. Enquiry submission uses the same lightweight unique-key principle.

## Consequences

- Browser tampering cannot change payable totals or payment state.
- Cart and Buy Now remain conceptually and physically separate without a duplicate persistent cart.
- Payment retry/callback replay is safe.
- Normal-cart clearing must subtract the purchased snapshot rather than blindly delete newly added lines.
- P1 webhook reconciliation can extend the payment attempt model without redesign.

## Alternatives Considered

- Trust client cart totals: rejected as an explicit security violation.
- Store two persistent carts: rejected as unnecessary and contrary to the approved Buy Now guidance.
- Mark paid from Checkout callback alone: rejected by approved Razorpay verification requirements.

## Approval

Approved by the user on 2026-09-05 with the recorded cart/Buy Now separation, immutable snapshots, amount matching, uniqueness, replay protection, and transaction-safety requirements.
