# ADR-004 — Identity, Authorization, and Public References

Status: APPROVED
Date: 2026-09-05

## Context

Guest checkout is first-class, signed-in customers may see only their own orders, ordinary customers must never become admins, and sequential internal identifiers cannot serve as the sole public order/enquiry reference.

## Decision

Use Supabase Auth cookie sessions for customer identity. Associate authenticated orders with `auth.users.id`; never claim guest orders by email. Authorize admins through a server-controlled `admin_users` table keyed by Auth UUID with no public mutation path. Use UUID internal keys, high-entropy prefixed public references, and a separate 32-byte cryptographically random guest token stored only as a SHA-256 hash. Deliver the raw token in a path-scoped HttpOnly cookie using `Secure` in deployed environments, `SameSite=Lax`, and a two-hour expiry rather than placing it in the URL. Public reference/internal ID alone never authorizes access.

## Consequences

- Customer identity and admin authority are explicitly separate.
- Guest confirmation is usable without making order references a bearer secret.
- Guest order claiming remains out of scope.
- Initial admin identity can be provisioned later without redesign.
- Cookie/session and protected-route caching behavior require explicit tests.
- Sunday provides immediate guest confirmation only; guest history retrieval, magic links, and order claiming remain additional unapproved scope.

## Alternatives Considered

- User-editable metadata/claims for admin role: rejected as an explicit authorization violation.
- Email matching to claim guest orders: rejected by approved requirements and ownership risk.
- Sequential public IDs or token in query string: rejected due enumeration/leakage risk.

## Approval

Approved by the user on 2026-09-05 with the recorded high-entropy, hashing, cookie attributes/expiry, public-reference, immediate-confirmation-only, and separate admin-authority clarifications.
