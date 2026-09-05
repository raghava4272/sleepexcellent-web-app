# SleepExcellent Codebase Map

## Runtime Foundation

The application uses the standard Next.js App Router on Node.js 22 with
TypeScript and Tailwind CSS. The production build is created with Next.js's
supported webpack builder because the local Next.js 16 Turbopack production
builder stalled; development continues to use the standard `next dev`
command. The current homepage is statically prerendered.

## Application Surface

| Path | Responsibility |
| ---- | -------------- |
| `app/layout.tsx` | Root HTML shell, local font imports, global metadata, and global stylesheet loading. |
| `app/page.tsx` | Server-rendered App Router entry point for the public homepage. |
| `app/catalogue/` | Dynamic public catalogue route with loading and recoverable error treatment. |
| `app/api/catalogue/suggestions/` | Dynamic F002 endpoint for bounded persisted-catalogue homepage type-ahead suggestions. |
| `app/api/cart/products/` | Dynamic F004 bounded lookup of current published direct-purchase display data for persisted cart lines. |
| `app/api/checkout/quote/` | Dynamic F005 no-store server quote endpoint that resolves only published direct-purchase products and returns server-derived INR amounts. |
| `app/checkout/` | Dynamic F005 cart/Buy Now checkout route, Server Action, loading, and recovery surfaces. |
| `app/orders/[reference]/confirmation/` | Dynamic F005 immediate guest-capability-protected payment-pending order view. |
| `app/products/[slug]/` | Dynamic F003 published product/ceiling detail route with safe not-found handling. |
| `app/globals.css` | SleepExcellent colour, typography, spacing, responsive, focus, control, and navigation-menu styles. |
| `components/home-page.tsx` | Client-side homepage composition, local-media presentation, desktop/mobile navigation, persisted-catalogue search/type-ahead dialog, collection menus, cart empty state, focus management, and responsive interactions. |
| `components/product-detail-page.tsx` | F003 responsive premium product/ceiling detail presentation, local quantity control, category-safe CTAs, and mapped-gallery/fallback composition. |
| `components/product-media-gallery.tsx` | Client gallery with mapped-image thumbnail navigation, reduced-motion-aware transition, and the existing fallback. |
| `components/cart-provider.tsx` | F004 browser state boundary: versioned local normal-cart slug/quantity lines and a separate tab-scoped Buy Now intent. |
| `components/checkout-page.tsx` | F005 premium dual-mode checkout form and authoritative summary presentation. |
| `lib/site-data.ts` | Confirmed contact destinations, approved homepage media paths, catalogue-authoritative collection/model labels, and factual homepage content. |
| `lib/catalogue/` | F002/F003 authoritative seed source, typed catalogue model, bounded query parsing, shared presentation helpers, published catalogue/detail read repository, and deterministic temporary local-media resolver. |
| `db/` and `drizzle/` | F002/F005 Drizzle PostgreSQL schema, Next.js server-only application entry point, shared trusted CLI connection factory, catalogue migration, and additive order migration. |
| `lib/checkout/`, `lib/orders/`, `lib/security/` | F005 shared India validation, server-only order entry point, trusted persistence service, authoritative quote calculation, idempotency, and guest-access token helpers. |
| `scripts/seed-catalogue.ts` | Idempotent stable-slug seed for the 44 approved records. |

## Local Media

`public/media/ceiling/` and `public/media/mattresses/` mirror the client-supplied
root media unchanged for the approved demo-only resolver in
`lib/catalogue/media.ts`. They are not database `product_media` mappings; F009
will replace this source with validated Supabase Storage metadata. Exact mapping
and deliberately unmapped files are recorded in `docs/product/CATALOGUE.md`.

`public/media/partners/` preserves the two supplied partner images unchanged.
`components/home-page.tsx` presents their filename-supplied CEO/Managing
Director designations and names in the pre-footer editorial
`Meet the Partners` section using `object-contain`, so no names, titles, or
logo content inside the supplied images is cropped.

| Path | Responsibility |
| ---- | -------------- |
| `public/photos/` | Client-provided mattress, sofa, bed, and ceiling photography used by the homepage and as video posters/fallbacks. |
| `public/videos/` | Client-provided mattress hero, sofa collection, and bed collection films. |
| `public/products/` | Unmapped product images retained for later authoritative catalogue mapping; F001 does not associate them with products. |

## Quality and Configuration

| Path | Responsibility |
| ---- | -------------- |
| `tests/homepage.test.mjs` | F001 contact, local-media, fallback, dead-link, and standard-runtime regression checks. |
| `next.config.ts` | Standard Next.js configuration surface. |
| `postcss.config.mjs` | Tailwind CSS/PostCSS integration. |
| `eslint.config.mjs` | Next.js core-web-vitals and TypeScript lint configuration with generated-output ignores. |
| `tsconfig.json` | Strict TypeScript and Next.js App Router compiler configuration. |
| `package.json` | Node requirement and standard Next.js development, build, start, lint, typecheck, and test scripts. |
| `.nvmrc` | Project-level Node.js 22.23.2 runtime pin. |

## Current Boundaries

- F001 contains no database, authentication, payment, order, or admin code.
- F002 introduces the PostgreSQL/Drizzle catalogue foundation. The public route
  reads published rows through a server-only `DATABASE_URL` when configured;
  the reviewed migration and authoritative 44-record seed have been applied to
  the configured non-production Supabase project. `db/index.ts` remains the
  server-only application boundary, while trusted standalone maintenance scripts
  reuse its single connection factory through `db/connection.ts`.
- F003 resolves published catalogue records by their stable public slug. It uses
  no inferred media, availability, variants, descriptions, or attributes:
  details render the same authoritative database fields and a replacement-ready
  pending-media fallback. F004 connects direct product controls to the browser
  cart while ceilings remain consultation-only.
- F004 persists only direct-product slugs and quantities locally, fetches current
  published display data on drawer open, and keeps Buy Now as a separate
  session-scoped selection. F005 consumes these separate sources without
  trusting browser prices, creates immutable PENDING order snapshots, and keeps
  payment, paid confirmation, cart reconciliation, and email delivery for F006.
- Ceiling content remains consultation-oriented and does not enter a cart.
- The Vinext, Vite, Cloudflare Worker, Wrangler, D1, and Sites-hosting runtime
  integration has been removed after the standard Next.js checkpoint passed.
- The removed D1/SQLite Drizzle starter is not a replacement architecture:
  ADR-002 assigns the future F002 data foundation to Supabase PostgreSQL with
  Drizzle's PostgreSQL dialect, plus Supabase Auth and Storage.
- Vercel preview/deployment is deferred to its approved implementation and
  deployment gate; no production deployment is implied by this foundation.

## Update Rule

Update this map only when a major module, runtime boundary, or directory-level
responsibility changes. Source code remains the implementation truth.
