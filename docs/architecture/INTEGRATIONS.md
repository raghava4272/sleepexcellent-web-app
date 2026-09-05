# Proposed Integrations and Environment Strategy

Status: APPROVED

## Vercel

- Target runtime for the standard Next.js App Router application.
- Use Development and Preview environments for Sunday; production deployment remains separately gated.
- Preview variables point only to a non-production Supabase project and Razorpay test credentials.
- Vercel deployment rollback is the application rollback path.
- Preview must be labelled development/demonstration in UI or environment treatment where payment readiness could be misunderstood.

Reference: [Vercel environments](https://vercel.com/docs/deployments/environments)

## Supabase PostgreSQL

- System of record for products, product media metadata, orders/items, payment attempts, ceiling enquiries, and admin authorization.
- Drizzle uses a server-only pooled PostgreSQL connection and owns application schema/migrations.
- Use versioned reviewed migrations; do not use `drizzle-kit push` for shared preview/production state.
- One non-production project is sufficient for Sunday preview. A separate production project/environment is required before production launch.
- RLS and explicit grants protect every Data API-exposed table; the server service layer still performs ownership/admin checks because its privileged connection is a separate trust boundary.

References: [Drizzle with Supabase](https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)

## Supabase Auth

- P1 customer email/password identity with cookie-based SSR sessions.
- Admin may reuse Auth identity, but authorization is the server-controlled `admin_users` record and cannot be inferred from customer-editable metadata.
- Use the current supported Supabase SSR package/pattern verified during implementation; do not copy the OpenAI workspace-auth helper into ecommerce auth.
- Authenticated pages are dynamic/no-store to prevent shared caching of session responses.
- Sunday demo email verification may be non-blocking; production configuration and policy require later review.

References: [Supabase package selection](https://supabase.com/docs/guides/auth/choosing-a-server-package), [Supabase SSR client](https://supabase.com/docs/guides/auth/server-side/creating-a-client)

## Supabase Storage

- Preserve approved homepage media in the repository as static assets.
- Store future product-admin uploads in a dedicated `product-media` bucket.
- Public catalogue media may be publicly readable, but listing/write/delete operations remain admin-controlled.
- Admin upload uses an authorization-checked, short-lived, restricted upload capability or equivalent server-controlled flow so secret/service credentials never enter the browser.
- Database holds bucket/path, type, dimensions/size, position, and primary marker—not binary content.
- Orphan cleanup and failed replacement use compensating cleanup; an upload never becomes authoritative until its database association commits.

Reference: [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control)

## Razorpay

- Standard Checkout, test mode only for Sunday.
- Server creates each Razorpay order from the persisted authoritative INR total.
- Browser receives only key ID, provider order ID, amount/currency, and safe checkout display fields.
- Server verifies the returned signature using its stored order ID and secret before marking paid.
- Payment/order IDs are stored read-only for operational support.
- P1 webhook endpoint validates raw-body signature, deduplicates event IDs, and reconciles delayed events; its absence is documented as a production limitation.
- Test and future live credentials are environment-isolated and never reused across modes.

References: [Razorpay Standard Checkout verification](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/), [Razorpay webhook validation](https://razorpay.com/docs/webhooks/validate-test/)

## Environment Variable Classification

Exact platform key names should follow the current provider dashboard at implementation time. The classification is fixed:

| Variable purpose | Browser-visible | Scope |
| ---------------- | --------------- | ----- |
| Supabase project URL | Yes | Development/Preview/Production-specific |
| Supabase publishable key | Yes | Environment-specific; RLS still mandatory |
| Supabase database URL | No | Server/build migration only |
| Supabase secret/service credential | No | Server-only, exceptional privileged operations |
| Razorpay key ID | Yes | Test for preview; live only after production approval |
| Razorpay key secret | No | Server-only, environment-specific |
| Razorpay webhook secret | No | Server-only, environment-specific, P1 |
| Shipping fee minor units | No | Server configuration; Sunday value `0` |
| Public app base URL | Yes | Environment-specific redirects/canonical behavior |

No secret is committed, logged, embedded in Markdown, prefixed for browser exposure, or copied from Preview to Production without explicit configuration.

## Local, Preview, and Production

| Environment | Database/Auth/Storage | Payments | Purpose |
| ----------- | --------------------- | -------- | ------- |
| Local | Non-production Supabase | Razorpay test | Development and automated validation |
| Vercel Preview | Non-production Supabase | Razorpay test | Sunday client demonstration and E2E |
| Production | Separate production configuration, not yet authorized | Razorpay live only after explicit approval | Future launch |

## Integration Failure Policy

- Supabase unavailable: show recoverable persistence error; never fake success.
- Storage upload failure: retain previous authoritative image/fallback and report failure.
- Razorpay cancellation/failure: keep order unpaid and preserve relevant cart/Buy Now recovery state.
- Verification timeout/uncertainty: do not mark paid; allow idempotent verification retry and later webhook reconciliation.
- Vercel Preview failure: preview acceptance fails, but production is untouched.
