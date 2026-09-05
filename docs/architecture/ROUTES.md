# Proposed Routes and Interfaces

Status: APPROVED

## App Routes

| Route | Rendering/access | Purpose |
| ----- | ---------------- | ------- |
| `/` | Public server page + client islands | Existing homepage and global navigation |
| `/catalogue` | Public dynamic server page | F002 all published products; bounded `q`, `category`, and `sort` query parameters drive search/sort/category filtering. |
| `/api/catalogue/suggestions?q=…` | Public dynamic server route | F002 homepage type-ahead; returns at most six name/category suggestions from published persisted catalogue records only. |
| `/catalogue/[category]` | Reserved | Not implemented in F002; category browsing uses the approved `/catalogue?category=…` interface. |
| `/products/[slug]` | Public dynamic server page | F003/F004 published product/ceiling detail by stable slug. Direct categories add to a persistent cart or create a separate Buy Now intent; ceilings expose consultation only. Missing or unpublished slugs return safe not-found. |
| `/api/cart/products?slugs=…` | Public dynamic server route | F004 bounded current published direct-product display lookup for cart lines; excludes ceilings and returns no media/availability assertion. |
| `/checkout` | Dynamic/no-store | F005 cart or Buy Now review, server-derived quote, and India address form |
| `/api/checkout/quote` | Dynamic/no-store | F005 published direct-product quote; accepts identity/quantity only and returns server-derived INR amounts |
| `/orders/[reference]/confirmation` | Dynamic/no-store; owner or two-hour guest-token protected | F005 payment-pending immediate order view; F006 upgrades it to verified paid confirmation |
| `/ceiling-enquiry` | Dynamic form | Guest enquiry with optional preselected ceiling slug |
| `/ceiling-enquiry/confirmation` | Dynamic/no-store | Submission receipt; no public PII lookup |
| `/login`, `/signup` | P1 dynamic Auth routes | Optional customer access |
| `/auth/callback` | P1 dynamic/no-store Auth callback | Supported Supabase email-confirmation and Google OAuth return handling; safe intended-destination redirect only |
| `/forgot-password` | P1 route/UI | Non-blocking password-reset surface |
| `/account` | P1 authenticated/no-store | Minimal account overview |
| `/account/orders` | P1 authenticated/no-store | Own order history |
| `/account/orders/[reference]` | P1 authenticated/no-store | Own order detail |
| `/admin` | Admin/no-store | Compact navigation/summary |
| `/admin/products` | Admin/no-store | Catalogue list/search/filter |
| `/admin/products/new` | Admin/no-store | Unpublished product creation |
| `/admin/products/[id]` | Admin/no-store | Category-safe editing/media/publication/availability |
| `/admin/orders` | Admin/no-store | Recent-first order list/search/filter |
| `/admin/orders/[reference]` | Admin/no-store | Immutable detail and order-status update |
| `/admin/enquiries` | Admin/no-store | Ceiling-enquiry list/search/status |
| `/admin/enquiries/[reference]` | Admin/no-store | Enquiry detail/status update |

URL parameters never establish authorization. Customer ownership, guest confirmation token, and admin access are checked server-side for every protected read/mutation.

## Mutation Interfaces

Same-origin forms use Server Actions unless an explicit HTTP callback/consumer requires a Route Handler. Every interface validates with shared server schemas and returns a stable result envelope containing either data or a safe error code/message.

### `createCheckoutOrder`

Input:

- checkout mode: `CART` or `BUY_NOW`
- product IDs and positive whole quantities
- approved customer/India address fields
- client-generated UUID idempotency key

Server behavior:

- resolves published direct-purchase records;
- rejects ceilings and malformed quantities;
- rebuilds prices/subtotal/shipping/total;
- writes immutable order/item/address/contact snapshots transactionally;
- creates the payment-pending application order only; F006 later creates and records the Razorpay test order from the stored total;
- issues a path-scoped, HttpOnly, two-hour guest-confirmation cookie when unauthenticated; deployed cookies are Secure and SameSite=Lax;
- returns the public order reference. No payment-provider field or paid-order email is produced by F005.

Idempotent retry with the same key returns the existing compatible order result and never creates a second payable order.

The guest token is 32 cryptographically random bytes; only its SHA-256 hash is stored. The public reference/internal ID alone is insufficient. Guest history retrieval, magic links, and order claiming are not exposed.

### `POST /api/payments/razorpay/verify`

Input: public order reference, Razorpay payment ID, Razorpay order ID, Razorpay signature.

Server behavior:

- loads its stored provider order ID/amount;
- compares identifiers without trusting browser order context;
- verifies HMAC server-side using Razorpay key secret;
- atomically marks the attempt verified and order paid once, creating durable customer-confirmation and business-notification delivery records only for that verified transition;
- returns safe confirmation state.

Invalid/mismatched/replayed data cannot create a paid transition or paid-order email. Server-side Resend delivery consumes the durable records only after `PAID`; a delivery failure is reported for recovery without changing the paid response/order state.

### `POST /api/webhooks/razorpay` — P1

- Reads raw body before parsing.
- Validates `X-Razorpay-Signature` using environment-specific webhook secret.
- Deduplicates `x-razorpay-event-id` or equivalent stored event identity.
- Applies monotonic reconciliation; webhook arrival order cannot regress a verified paid order.

### `createCeilingEnquiry`

Input: selected ceiling product ID or `NEED_GUIDANCE`, required/optional F008 fields, UUID idempotency key.

Server behavior validates authoritative selection/optional positive area, snapshots the applicable range, stores one `NEW` enquiry, and returns a non-sensitive public reference without performing any price multiplication.

### Customer Auth/Account — P1

- Signup/login/logout use Supabase Auth with supported cookie-based SSR handling. Email/password signup invokes the supported required confirmation flow; an unverified login response offers safe resend/recovery and never creates a second account.
- Google sign-in starts Supabase Google OAuth. Its supported callback creates/links the identity, exchanges/establishes the session, and returns to a validated in-app destination without redundant confirmation.
- Confirmation/OAuth tokens and redirect validation stay inside the supported Supabase Auth flow. The callback treats expired/invalid links as a recoverable authentication state and never logs tokens or exposes provider credentials.
- Account/order reads resolve the authenticated user on the server and enforce ownership.
- Password reset route may remain incomplete P1 if email configuration is unavailable.

### Admin product/media actions

- `createProduct`, `updateProduct`, `setPublication`, `setAvailability` all call `requireAdmin()` first and enforce database/category invariants.
- New products default unpublished and availability unset regardless of omitted client fields.
- `requestPrimaryImageUpload` validates intended product, MIME/type/size policy, and admin authorization before issuing a short-lived restricted upload capability.
- `commitPrimaryImage` records the verified Storage object metadata transactionally and replaces only the selected product's mapping.
- `removePrimaryImage` removes/archives the association safely; binary cleanup may be asynchronous or compensating if database update fails.

### Admin order/enquiry actions

- `updateOrderStatus(reference, nextStatus)` permits only approved state transitions and never touches payment state.
- `updateEnquiryStatus(reference, nextStatus)` permits only `NEW` → `CONTACTED` → `CLOSED` transitions chosen by the approved model.
- List queries use bounded page size, recent-first cursor pagination, validated simple filters, and no advanced reporting.

## Error Contract

| Code | Meaning |
| ---- | ------- |
| `VALIDATION_ERROR` | Field or category invariant failed |
| `UNAUTHENTICATED` | Valid identity required |
| `FORBIDDEN` | Identity lacks ownership/admin authority |
| `NOT_FOUND` | Record absent or intentionally undisclosed |
| `CONFLICT` | State changed, duplicate identifier, or incompatible idempotent retry |
| `PAYMENT_VERIFICATION_FAILED` | Razorpay data did not verify |
| `PERSISTENCE_ERROR` | Safe retry/recovery is possible |
| `MEDIA_UPLOAD_ERROR` | Upload/association validation or persistence failed |

Protected-resource responses avoid revealing whether another customer's/admin-only record exists. Raw framework/database/provider errors are logged safely and never sent to users.

## Validation and Limits

- Server validation is authoritative; client validation is usability only.
- Quantities are positive integers; Indian PIN is six digits; money never comes from browser input.
- Search/filter/page-size inputs are bounded.
- Same-origin mutation protection remains enabled; no broad Server Action allowed-origin configuration.
- Media upload capability is short-lived, product-scoped, admin-authorized, and constrained to approved image types/sizes selected during implementation planning.
- Mutation retries reuse idempotency keys; clients do not generate a fresh key for the same pending operation.
