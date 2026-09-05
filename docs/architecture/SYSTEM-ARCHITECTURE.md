# SleepExcellent System Architecture

Status: APPROVED
Owner: TECH_LEAD
Date: 2026-09-05
Scope: Approved features F001–F011

## Architecture Summary

SleepExcellent will be a server-first modular monolith built with the standard Next.js App Router and deployed to Vercel. Supabase provides PostgreSQL, Auth, and Storage. Drizzle defines the application schema, typed queries, and reviewed PostgreSQL migrations. Razorpay Standard Checkout remains test-mode only for the Sunday preview.

The architecture deliberately avoids a separate backend service, queue, cache cluster, CMS, CRM, inventory service, and microservice split. Server Components render read-heavy pages; small Client Components handle navigation, filters, local cart state, media controls, drawers/dialogs, and Razorpay Checkout. Server Actions handle same-origin mutations, while Route Handlers cover explicit HTTP contracts and Razorpay callbacks/webhooks.

## Context and Boundaries

```text
Browser
  ├─ public storefront and local cart/Buy Now state
  ├─ optional customer session
  └─ admin UI after server-verified authorization
            │ HTTPS / same-origin
            ▼
Next.js App Router on Vercel (Node.js runtime)
  ├─ Server Components and application services
  ├─ Server Actions / Route Handlers
  ├─ validation, authorization, pricing, snapshots, idempotency
  ├─ Drizzle database access
  ├─ Supabase Auth server client
  ├─ Supabase Storage administration
  └─ Razorpay order creation and signature verification
       │                 │                    │
       ▼                 ▼                    ▼
Supabase Postgres   Supabase Auth/Storage   Razorpay Test
```

### Trust boundaries

- The browser is untrusted for prices, totals, shipping, payment state, admin status, publication, and authorization.
- Supabase publishable values may reach the browser; database credentials, Supabase secret/service credentials, Razorpay key secret, and webhook secret stay server-only.
- Product and order data mutations pass through server application services even where RLS provides defense in depth.
- Razorpay browser success is only an input to server verification, never proof of payment.
- Authenticated identity and administrative authorization are distinct. A valid customer session is not admin authority.

### Data-access paths

| Operation class | Access path | Required authorization |
| --------------- | ----------- | ---------------------- |
| Public catalogue | Server Component/service → server-only Drizzle connection | Query must enforce `PUBLISHED`; only public fields returned |
| Authenticated customer | Supabase SSR identity verification → customer service → Drizzle | Explicit ownership check on every profile/order read; matching RLS remains defense in depth |
| Guest checkout/enquiry | Validated same-origin Server Action/Route Handler → service → Drizzle | No identity assumed; idempotency, record capability, and approved public fields only |
| Admin | Supabase SSR identity verification → `admin_users` authorization → admin service → Drizzle | Active server-controlled admin record required for every read and mutation |
| Payment/provider | Trusted Route Handler/service → Drizzle + Razorpay | Stored order/provider identity, amount match, secret-based verification, idempotent transition |
| Product media upload | Admin-authorized server endpoint → restricted short-lived Storage capability | Admin check before issuance and before authoritative database association |

The browser never receives the database URL, Supabase secret/service credential, or Razorpay secret. The application uses one server data-access architecture rather than parallel Drizzle and client-side Data API domain implementations. Privileged Drizzle operations explicitly authorize identity/ownership/admin access before touching customer profiles, orders/details, payments, admin data, or ceiling enquiries; RLS does not make those queries automatically safe.

## Runtime and Repository Direction

- Node.js `>=22.13.0`, matching the declared repository engine.
- Standard `next dev`, `next build`, and `next start` scripts.
- Remove Vinext, Vite, Cloudflare Worker/D1 runtime coupling after architecture approval.
- Keep Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Framer Motion, and Lucide.
- Prefer the Vercel Node.js runtime for database, Auth, crypto, and Razorpay operations. Do not opt core commerce/auth routes into Edge runtime without a reviewed need.
- Use npm and the committed lockfile.

## Application Modules

| Module | Ownership | Principal responsibilities |
| ------ | --------- | -------------------------- |
| Storefront | Public | Homepage, categories, catalogue, search/sort/filter, product detail, authoritative fallbacks |
| Cart | Browser + server revalidation | Versioned normal-cart persistence; separate Buy Now intent; no trusted monetary fields |
| Checkout | Server | Input validation, authoritative product lookup, free-shipping rule, immutable order creation, idempotency |
| Payments | Server + Razorpay | Test order creation, signature verification, atomic paid transition, P1 webhook reconciliation |
| Customer | Supabase Auth + server | Optional cookie session, account/order ownership, private order reads |
| Ceiling enquiries | Server | Guest validation, immutable submission snapshot, idempotency, public reference, simple status |
| Admin | Server | Independent authorization, catalogue/publication/availability/media operations, order/enquiry status |
| Media | Static public assets + Supabase Storage | Preserve homepage assets; authoritative product-media paths and controlled admin upload |

## Rendering and State

### Server-rendered data

- Public catalogue/product pages read only `PUBLISHED` records.
- Authenticated account and every admin route are dynamic and non-shared-cacheable.
- Checkout, payment, confirmation, and enquiry confirmation are dynamic and `no-store`.
- Public catalogue responses may use tagged revalidation. Product/admin publication or media changes invalidate affected catalogue/product tags.

### Client state

- Normal cart: versioned `localStorage` payload containing only product IDs and positive whole quantities.
- Buy Now: separate, tab-scoped `sessionStorage` intent containing one product ID and quantity.
- Neither store contains authoritative price, availability, or payment state.
- At order submission the server resolves current published direct-purchase records, rebuilds every amount, and writes immutable snapshots.
- Verified normal-cart success subtracts only purchased quantities from the current cart; Buy Now never mutates unrelated normal-cart state.

## Primary Data Flows

### Public catalogue

1. Server reads published products from PostgreSQL.
2. Search/category/sort inputs are validated and translated into bounded queries.
3. Missing authoritative media returns the deliberate fallback; no inferred mapping occurs.
4. Availability `UNSET` produces no stock claim or purchase block.

### Checkout and payment

1. Browser submits checkout mode, product IDs/quantities, customer/address fields, and an idempotency key.
2. Server validates India-only fields and reconstructs product prices, subtotal, `₹0` configured shipping, and final INR amount.
3. One database transaction writes the order and immutable item/address/customer snapshots.
4. Server creates a Razorpay test order for the stored total and records the external reference.
5. Browser opens Razorpay Checkout with public key ID and server-created order details.
6. Browser returns payment ID/order ID/signature to a server verification endpoint.
7. Server verifies against its stored Razorpay order ID and secret, then atomically transitions payment to `PAID` once.
8. That same verified transition creates durable, unique customer-confirmation and business-notification delivery records. Trusted server code sends them through Resend from immutable order snapshots; a delivery failure remains recoverable and never reverses `PAID`.
9. Guest confirmation requires the public reference plus a 32-byte cryptographically random secret held in a path-scoped HttpOnly cookie. Only its SHA-256 hash is stored. The deployed cookie is `Secure`, uses `SameSite=Lax`, expires after two hours, and is compared safely; authenticated confirmation also enforces user ownership.

### Ceiling enquiry

1. Guest submits the approved fields plus an idempotency key.
2. Server validates the authoritative ceiling selection or `Need guidance` and optional positive area.
3. Server stores an immutable request snapshot and `NEW` status without calculating price.
4. Confirmation returns a non-sequential public reference and never exposes a public detail lookup containing PII.

### Admin

1. Supabase validates the cookie-backed identity.
2. The server checks an active record in the non-client-editable `admin_users` table.
3. Server-side services validate every mutation and enforce category-safe invariants.
4. Direct database/Storage client access is not used as a substitute for authorization.

## Authentication and Authorization

- Use Supabase's cookie-based SSR client for optional customer sessions; do not reuse the existing OpenAI workspace-auth header helper as ecommerce identity.
- Email/password signup uses Supabase Auth's supported, expiring confirmation flow. A customer is not treated as verified until Supabase confirms the email; resend and invalid/expired-link recovery stay within that provider flow rather than a custom token system.
- Google OAuth is initiated and completed through Supabase Auth. A successfully returned Google identity is treated as verified, establishes the normal customer session, and does not receive a second verification requirement.
- Authentication email delivery uses approved Supabase Auth/custom SMTP configuration when F007 is implemented. Resend is an allowed future provider selection; SMTP/provider secrets never enter browser code, and the final SleepExcellent no-reply sender domain remains client/owner input.
- `auth.users.id` is the customer identity referenced by orders and the server-controlled admin registry.
- Customer order reads require `orders.customer_user_id = authenticated user ID` in both service authorization and RLS policy.
- Guest orders have no customer user ID and use a hashed high-entropy access token for confirmation.
- Public order reference or internal database ID alone never authorizes guest access. Sunday provides only the immediate two-hour confirmation capability; guest order history, magic-link retrieval, and account claiming remain additional scope.
- `admin_users` has no browser mutation path. Initial administrator provisioning is an environment/operations action after the client supplies an identity.
- RLS and grants deny direct anonymous/authenticated mutation for orders, payments, enquiries, and admin records. Public product reads are restricted to published records.

## Reliability and Failure Handling

- Checkout and enquiry submissions carry unique idempotency keys enforced by database constraints.
- Payment verification is atomic, replay-safe, and keyed to stored Razorpay identifiers and amount.
- Paid-order email is a server-only Resend side effect of the verified `PAID` transition, with durable per-order/per-kind idempotency. Provider failure is observable/recoverable but cannot make a paid order unpaid or cause a browser-triggered send.
- Expected validation, conflict, authorization, persistence, payment-cancel/failure, missing-media, empty, and not-found states return intentional UI states.
- No automatic retries are performed for non-idempotent mutations without the same idempotency key.
- P1 Razorpay webhook processing uses the raw request body, signature validation, event-ID deduplication, and monotonic payment transitions.

## Observability

- Emit structured Vercel server logs with request/correlation ID, operation, safe public reference, result class, and duration.
- Never log passwords, Auth tokens, access cookies, Razorpay secrets/signatures, Resend credentials, full payment payloads, or complete customer/address/email data.
- Persist non-secret Razorpay order/payment references for support.
- Sunday uses platform logs and focused test evidence; advanced monitoring/alerting remains production follow-up.

## Testing Strategy

- Unit tests cover money calculations, category pricing invariants, validation, state transitions, public-reference/token helpers, and cart reconciliation.
- Integration tests run against an isolated PostgreSQL test schema/project and cover transactions, unique idempotency constraints, immutable snapshots, publication filtering, ownership, admin authorization, and RLS/grants.
- Razorpay adapter tests use deterministic fixtures and test-mode integration; signature tests include valid, invalid, mismatched, and replayed inputs without logging secrets.
- Playwright covers the mandatory F011 public, ceiling, and admin journeys at representative desktop, tablet, and mobile widths.
- Accessibility checks combine automated scanning with manual keyboard/focus/dialog validation.
- Test fixtures use synthetic customer data and the authoritative catalogue seed; they never depend on production data or live payment credentials.
- Required release command sequence is typecheck, ESLint, focused unit/integration tests, production build, then Playwright/manual preview verification.

## Migration and Rollback

1. Upgrade local runtime to supported Node.js before dependency work.
2. Convert scripts/configuration to standard Next.js while preserving the current homepage.
3. Introduce PostgreSQL schema through reviewed, versioned Drizzle migrations; do not use unreviewed schema push for shared preview/production.
4. Seed the 44 authoritative catalogue entries idempotently: 16 sofas, 10 beds, 10 mattresses, and 8 ceiling types. Seed them published with availability unset, and attach no product media without an authoritative mapping.
5. Replace conflicting hardcoded product identities/prices with database reads while leaving approved homepage/category media intact.
6. Configure a non-production Supabase project, Razorpay test credentials, and Vercel Preview variables.
7. Release the preview only after F011 gates pass.

Rollback uses Vercel deployment rollback for application code, additive/reversible database migrations where practical, and compensating migrations for committed schema changes. The pre-migration application remains recoverable from Git history; no production data migration is authorized.

## Risks and Mitigations

| Risk | Impact | Mitigation |
| ---- | ------ | ---------- |
| Deadline pressure | Incomplete P0 journeys | Implement in dependency order; keep F007 and internal P1 slices non-blocking |
| Unknown media mapping | False catalogue representation | Seed no product mapping; use fallback until admin/client assignment |
| Unknown availability | Invented stock behavior | Store `UNSET`; show/enforce nothing until explicit value |
| Browser tampering | Incorrect totals or paid status | Server rebuild, immutable snapshots, HMAC verification, database constraints |
| Privileged database connection bypasses RLS | Data exposure if service checks fail | Server-only data layer, mandatory ownership/admin guards, deny direct grants, RLS defense in depth, authorization tests |
| Shared preview credentials | Cross-environment contamination | Non-production Supabase project and Razorpay test keys; Vercel environment scoping |
| Auth response caching | Session leakage | Dynamic/no-store authenticated routes and supported Supabase SSR cookie handling |
| Payment callback replay | Duplicate paid transitions | Unique external IDs, transaction/conditional update, idempotent response |
| Unresolved policies | Misleading production claims | Omit unsupported behavior and label preview development/demonstration |

## Requirement Traceability

| Architecture area | Approved features |
| ----------------- | ----------------- |
| Public rendering, media preservation, catalogue | F001–F003, F011 |
| Cart and Buy Now separation | F004, F011 |
| Server-authoritative checkout and snapshots | F005, F011 |
| Razorpay verification and confirmation security | F006, F011 |
| Optional customer identity and private orders | F007, F011 |
| Ceiling enquiry persistence and separation | F008, F011 |
| Admin authorization/catalogue/media | F009, F011 |
| Admin order/enquiry operations | F010, F011 |

## Authoritative References Checked

- [Next.js cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [Next.js Server Actions configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions)
- [Supabase server-side Auth client](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control)
- [Drizzle with Supabase PostgreSQL](https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase)
- [Razorpay Standard Checkout signature verification](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/)
- [Vercel environments](https://vercel.com/docs/deployments/environments)
