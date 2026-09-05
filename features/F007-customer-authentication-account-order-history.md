# Feature: F007 — Customer Authentication, Account and Order History

## Metadata

Feature ID: F007
Phase: PHASE-001
Priority: P1
Status: APPROVED
Owner Role: PRODUCT_LEAD
Approval Date: 2026-09-05

## User Goal

As a customer, I can optionally create an account, maintain a supported secure session, and privately review orders associated with my identity without making authentication a prerequisite for shopping or guest checkout.

## Approved Requirements

1. Use Supabase Auth for customer authentication, supporting email/password and Google OAuth sign-in only.
2. F007 includes email/password signup and login, Google sign-in, logout, authenticated session persistence, account overview, customer order history, and customer order detail.
3. Password reset is P1 within F007 and cannot delay the critical Sunday ecommerce demonstration.
4. If password reset cannot be completed without additional email configuration, preserve its route/UI and record the remaining work as incomplete P1.
5. New email/password accounts use Supabase Auth's supported confirmation flow: account creation is pending until the customer verifies the email through its single-purpose, expiring Supabase link. An unverified customer cannot silently bypass this requirement.
6. A verified email/password customer signs in normally thereafter. Login must not trigger a new verification message; an attempted login before confirmation explains the state and offers a safe resend-verification action without creating another account.
7. Google sign-in uses Supabase Auth Google OAuth. A successful Google identity is treated as verified, creates or links the Supabase identity, establishes the intended session, and never requires a second email-confirmation step.
8. The first successful Google sign-in may send an informational welcome/account-created email when transactional email delivery is configured; it does not authorize the account. Subsequent Google logins authenticate normally without a verification or welcome requirement.
9. Authentication-related email uses the approved SleepExcellent no-reply sender when production email delivery is configured. The final sending domain remains PENDING CLIENT/OWNER INPUT. Supabase Auth verification delivery must use an approved provider/custom SMTP path; Resend is an allowed provider choice if selected during implementation.
10. Development/demo environments must exercise a supported, safe verification configuration or pre-verified test identities. Lack of email delivery must be disclosed rather than silently weakening the approved production verification behavior.
11. Verification links and tokens are generated, validated, expired, and redirected only through the supported Supabase Auth flow. No custom verification-token system is permitted. Invalid or expired links provide a clear recovery/resend state.
12. Authentication is not required for homepage access, catalogue browsing, search, product detail, cart, Buy Now, checkout, Razorpay payment, or guest order confirmation.
13. The approved guest journey remains first-class: Browse → Product → Cart / Buy Now → Checkout → Razorpay → Confirmation.
14. When an authenticated customer checks out, associate the new order with the authenticated Supabase user ID.
15. When a guest checks out, retain a guest order and the submitted immutable customer/contact snapshot required by F005.
16. Do not automatically associate a guest order with an account based solely on matching email, and do not implement guest-order claiming for the MVP.
17. Keep account overview minimal: customer email/basic identity, logout, and order-history access.
18. Do not include complex profile editing, avatar, preferences, saved payment methods, wishlist, loyalty, multiple saved addresses, or notification settings.
19. Order history displays the safe public SleepExcellent order reference, order date, payment status, order status, short purchased-item summary, total, and a view-details action.
20. Order detail uses the immutable purchase snapshots defined by F005 and does not reconstruct historical names or prices from the current catalogue.
21. A customer must never access another customer's profile, order list, or order detail.
22. Protect customer records using Supabase Auth identity, basic RLS, and server-side authorization where required; hiding UI links alone is insufficient.
23. Changing a URL or order identifier must not expose another customer's order.
24. Do not expose internal sequential database IDs as the sole public order identifier.
25. The Technical Lead will later define internal identity, a safe public SleepExcellent order reference, and secure guest-confirmation access.
26. Use Supabase's supported secure session handling for the selected Next.js architecture; do not invent a custom token system or manually store sensitive authentication tokens in insecure browser storage when a safer supported integration exists.
27. Authentication UI uses the existing SleepExcellent visual language and supports a clear “Continue with Google” alternative, email/password signup, a post-signup check-email state, resend verification, return-to-login, loading, validation/authentication errors, signed-in account, empty order history, and signed-out/expired-session states.
28. All controls are responsive, keyboard accessible, labelled, and touch friendly.
29. Admin authentication and authorization remain Group E scope and are not mixed into F007, although later architecture may reuse Supabase Auth with separate admin authorization.
30. If time is constrained, delivery order within F007 is: secure signup verification and login, Google sign-in, logout/session, minimal account, authenticated order association, order history/detail, then password reset.

Traceability: explicitly approved by the user on 2026-09-05 as “Approve C1 — Customer Authentication, Account and Order History,” with registration as F007 and the specified scope, priority, privacy, session, and guest-checkout adjustments.

## Acceptance Criteria

1. A new email/password customer receives one required Supabase Auth verification flow, cannot silently bypass it while unverified, and can safely request a resend.
2. A verified email/password customer can log in later, retain an authenticated session across normal navigation/refresh, and log out without receiving repeated verification email.
3. Signup, login, and session errors provide clear, accessible, non-sensitive feedback.
4. Homepage, catalogue, search, product detail, cart, Buy Now, checkout, Razorpay payment, and guest confirmation remain usable while signed out.
5. Account overview displays only the authenticated customer's basic email/identity, logout, and order-history access.
6. An order created while authenticated is associated with the authenticated Supabase user ID.
7. A guest order remains unassociated with an account while retaining the F005 customer/contact snapshot.
8. Creating or signing into an account with the same email as a guest order does not automatically claim that order.
9. Order history lists the public order reference, date, payment status, order status, short purchased-item summary, total, and a working detail action.
10. Order detail displays immutable purchase-time item/customer/amount information rather than reconstructed current-catalogue values.
11. Supabase Auth identity, RLS, and server authorization prevent a signed-in customer from reading or modifying another customer's profile, order list, or order detail.
12. Substituting a URL or order identifier does not disclose another customer's order or whether a protected record exists.
13. Customer-facing order URLs/references do not rely solely on internal sequential database IDs.
14. Session handling uses the supported Supabase/Next.js integration and does not introduce a custom authentication/token system or insecure manual sensitive-token storage.
15. Password-reset route/UI is present as P1; incomplete email-backed delivery is documented and does not block the Sunday P0 journey.
16. Signup, login, loading, validation, authentication error, signed-in, empty-history, and expired-session states follow the existing premium visual language.
17. Authentication and account surfaces are keyboard operable, labelled, focus-aware, touch friendly, and responsive across mobile, tablet, and desktop widths.
18. Google sign-in creates or resumes the Supabase identity, treats the Google identity as verified, and returns the customer to the intended authenticated destination without redundant confirmation.
19. Subsequent Google sign-ins authenticate normally. The first Google signup may receive an informational welcome email only when delivery is configured.
20. Authentication email uses the configured SleepExcellent no-reply sender when production email delivery is enabled; email-provider credentials remain server/provider configuration only.
21. Invalid or expired verification links provide clear, accessible recovery without leaking secrets or issuing a custom token.
22. No admin role, admin screen, or admin authorization behavior is introduced through F007; Google or email authentication alone never grants admin authority.

## Out of Scope

- Required login for shopping or checkout
- Social providers other than Google OAuth
- Multi-factor authentication for Sunday
- Guest-order claiming
- Complex profile editing
- Avatar, preferences, or notification settings
- Saved payment methods
- Wishlist or loyalty features
- Multiple saved addresses
- Admin authentication, authorization, or screens
- Custom authentication, verification-token, or browser-managed email-delivery mechanisms

## Dependencies

- F005 Checkout, Address and Order Creation
- F006 Razorpay Test Payment and Order Confirmation
- Future Supabase Auth integration and supported Next.js session architecture
- Future customer/order data model, RLS policies, and server authorization
- Safe public order-reference and secure guest-confirmation architecture
- Approved Supabase Auth email confirmation and Google OAuth configuration
- Approved SMTP/email-delivery path for Supabase Auth verification; Resend may be selected during implementation
- Final approved SleepExcellent no-reply sending domain: PENDING CLIENT/OWNER INPUT

## User Decisions

| Date | Decision | Approval Evidence | Effect |
| ---- | -------- | ----------------- | ------ |
| 2026-09-05 | Approve C1 and register it as F007 with P1 feature priority. | User explicitly approved C1 and assigned F007. | Registers the customer-account feature without promoting it above the critical guest-commerce path. |
| 2026-09-05 | Prioritize core account access and defer password reset within F007. | Explicit P0/P1 split and ordered fallback. | Email-delivery dependencies cannot delay Sunday demonstration. |
| 2026-09-05 | Keep guest shopping and checkout first-class. | Explicit authentication-scope rule. | No public commerce step requires login. |
| 2026-09-05 | Link authenticated orders by Supabase user ID and never auto-claim guest orders by email. | Explicit order-association rule. | Prevents unsafe or surprising guest-order ownership changes. |
| 2026-09-05 | Require RLS and server-side customer authorization. | Explicit privacy rule. | URL manipulation or hidden-link bypass must not expose other customers' records. |
| 2026-09-05 | Use supported Supabase session handling and safe public order identifiers. | Explicit session and identifier rules. | Detailed mechanism is reserved for Technical Lead architecture. |
| 2026-09-05 | Keep customer account minimal and admin separate. | Explicit scope rules. | Sunday work avoids nonessential account polish and Group E remains independent. |
| 2026-09-05 | Clarify email/password verification, Google OAuth, and email-delivery behavior. | User-supplied approved F007 clarification. | Requires supported Supabase confirmation for email/password accounts, avoids redundant Google verification, and reserves the final no-reply domain for client/owner input. |

## Design References

- Existing homepage Account control and premium SleepExcellent visual system.
- `docs/product/CLIENT-BRIEF.md`
- `docs/product/REFERENCE-ANALYSIS.md`

## Architecture References

Approved initial architecture: `docs/architecture/SYSTEM-ARCHITECTURE.md`, `docs/architecture/DATA-MODEL.md`, `docs/architecture/INTEGRATIONS.md`, and ADR-004.

## Implementation Plan

Proposed in `IMPLEMENTATION.md`, awaiting explicit approval. Application implementation is not yet authorized.

## Implementation Status

Current state: NOT STARTED
Summary: Approved product specification only; no authentication or Supabase configuration changed.

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

- Password reset remains P1 and may remain incomplete for Sunday.
- The final no-reply sending domain and the selected production SMTP/provider configuration remain PENDING CLIENT/OWNER INPUT; Resend is permitted but not yet selected or configured.
- Guest-order claiming and nonessential account features are excluded.
- Detailed authentication, session, RLS, and public-order-reference mechanisms await Technical Lead architecture planning.

## Change History

| Date | Change | Reason | Approved By |
| ---- | ------ | ------ | ----------- |
| 2026-09-05 | Initial approved specification created with optional auth, secure customer authorization, immutable order history, and Sunday priority rules. | Group C approval. | User |
| 2026-09-05 | Approved email-verification and Google OAuth clarification recorded. | User-provided F007 requirements update. | User |
