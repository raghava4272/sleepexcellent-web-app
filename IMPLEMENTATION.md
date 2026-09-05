# Implementation Plan

Status: APPROVED — F001 implementation authorized
Owner role: TECH_LEAD
Created: 2026-09-05
Implementation authorized: F001 only

## Phase

Phase ID: PHASE-001
Objective: Deliver the approved SleepExcellent Sunday demonstration through dependency-ordered, individually reviewed features while preserving the existing homepage and enforcing the approved security boundaries.

## Planning Principles

- Implement one active feature at a time after plan approval and Tech-Lead-to-Engineering handoff.
- P0 correctness and complete client-visible journeys take precedence over P1 scope and polish.
- Do not implement a feature before its genuine foundation exists.
- Preserve the existing homepage components/media during runtime migration; avoid rewrite-only churn.
- Use authoritative catalogue values and intentional missing-media/availability states from the first database-backed public read.
- Keep browser state non-authoritative and privileged access server-only.
- Run focused validation continuously; F011 is the final consolidated release gate, not the first time quality is checked.
- A stage may reach user review only after its Implementation Summary and every materially affected document match the actual code and tests; update only affected records and never invent source paths.
- No production deployment is authorized.

## Cross-Cutting UI/UX Priority

SleepExcellent's primary client-facing objective is a premium, high-quality ecommerce experience. Functional correctness and critical security/data integrity remain mandatory, but implementation must not optimize only for technical completion.

### Design authority

Use this order when making client-facing design decisions:

1. The existing SleepExcellent homepage is the primary visual identity and brand baseline.
2. Approved SleepExcellent feature specifications define required behavior and scope.
3. `docs/product/REFERENCE-ANALYSIS.md` supplies approved ecommerce UX patterns and interaction guidance.
4. The referenced websites are inspiration only.

If the reference analysis conflicts with an approved feature specification, the feature specification wins. Do not copy reference-site branding, logo treatment, wording, product names, media, icons, proprietary content, exact layouts, or exact styling.

### Experience standards

- Preserve and evolve the existing premium, modern, spacious, editorial, furniture/lifestyle-focused visual language; do not redesign the homepage from scratch.
- Maintain one coherent system for typography, colours, spacing, content width, section rhythm, border radius, cards, buttons, forms, shadows, icons, and motion across public, commerce, account, and admin surfaces.
- Design mobile intentionally at representative mobile, tablet, laptop, and desktop widths, including navigation, grids, details, galleries, drawers, checkout, forms, tables, media crops, and sticky controls.
- Give important controls intentional default, hover, focus, pressed, disabled, loading, success, and error states where applicable.
- Give major journeys deliberate loading, empty, no-results, missing-media, validation, persistence, payment, and authorization states rather than framework-looking fallbacks.
- Missing authoritative media remains non-blocking and uses a deliberate premium fallback that can later be replaced without redesign; unrelated product media is never substituted.
- Keep the approved commerce path direct and legible: Homepage → Browse → Product → Cart/Buy Now → Checkout → Razorpay → Confirmation.
- Consult `docs/product/REFERENCE-ANALYSIS.md` for relevant approved patterns such as category navigation, search/sort/filter treatment, product hierarchy, media/specification layout, clear commerce or quotation CTAs, cart/checkout behavior, mobile drawers, and touch-sized controls.

### Client-demo trade-offs and visual gate

When trade-offs are required, prioritize critical functional correctness, client-visible UI/UX quality, responsive polish, critical security/data integrity, then optional/P1 functionality. Visual polish never weakens a critical security or correctness boundary; optional backend/admin sophistication must not delay approved visible customer-facing quality.

Every client-facing feature's `DEVELOPER_VALIDATION` must explicitly review visual consistency, responsive layout, spacing, typography, hierarchy, CTA visibility, interaction feedback, missing-media presentation, mobile usability, accessibility basics, appropriate use of approved reference patterns, and freedom from copied Sleepwell/Wakefit design. Obvious UI regressions block transition to `AWAITING_FEATURE_REVIEW`.

## Feature Execution Order

| Order | Feature ID | Dependency | Rationale |
| ----- | ---------- | ---------- | --------- |
| 1 | F001 | Approved ADR-001; Node `>=22.13.0` | Establish standard Next.js/Vercel runtime while proving the client-approved homepage survives intact. |
| 2 | F002 | F001; non-production Supabase access | Introduce PostgreSQL/Drizzle product foundation and authoritative 44-entry seed before public catalogue behavior. |
| 3 | F003 | F002 | Build stable product/ceiling detail routes from authoritative records and fallbacks. |
| 4 | F004 | F003 | Add versioned normal cart and isolated Buy Now state with server revalidation contracts ready. |
| 5 | F005 | F004; order schema | Add validated India checkout, authoritative calculation, idempotent order creation, and immutable snapshots. |
| 6 | F006 | F005; Razorpay test credentials | Complete server-created Razorpay test order, signature verification, paid transition, and secure confirmation. Earliest usable public end-to-end demo. |
| 7 | F008 | F002/F003 | Add separate guest ceiling enquiry persistence/confirmation without touching commerce. |
| 8 | F009 | F002; Supabase Auth/Storage | Add server-controlled admin access, catalogue/publication/availability, and P0 primary media operations. |
| 9 | F010 | F005/F006/F008/F009 | Add minimal admin order and enquiry review/status operations. Full functional Sunday demo exists here. |
| 10 | F011 | All implemented P0 features | Run cross-cutting accessibility, responsive, security, automated, browser, performance, documentation, and Vercel Preview gates. |
| 11 | F007 | P0 stable; Supabase Auth foundation from F009 | Implement optional customer account/order history only after core P0 is stable. |

## Stage 1 — Standard Runtime and Homepage Preservation

### Objective

Complete F001 while migrating the execution path to standard Next.js/Vercel with evidence that the approved homepage still works.

### Affected feature

F001 — Homepage and Global Navigation

### Technical tasks

1. Record the existing homepage behavior/media and protect unrelated worktree changes.
2. Install/use Node.js `>=22.13.0`; add one repository runtime pin supported by the developer environment and document it.
3. Add a standard Next.js validation path and confirm it runs/builds before removing Vinext/Vite/Cloudflare integration.
4. Switch package scripts to `next dev`, `next build`, and `next start` only after the standard path passes.
5. Remove obsolete active Vinext, Vite, Worker, Wrangler, Cloudflare D1 dependencies/configuration after verification; keep no competing runtime.
6. Preserve and polish the existing homepage, dropdown navigation, local photos/videos, contact links, and responsive behavior under standard Next.js.
7. Retain existing media unless replacement is separately approved.
8. Add environment-name documentation without any secret values.

### Likely code areas

`package.json`, lockfile, runtime-version file, `next.config.ts`, `app/`, `components/`, `lib/site-data.ts`, Tailwind/PostCSS configuration, `.env.example`, `README.md`; obsolete `vite.config.ts`, `worker/`, Cloudflare-specific build/config paths only after the checkpoint passes.

### Dependencies

Node runtime availability; approved ADR-001. No Supabase credential is required to prove the migrated homepage.

### Validation

Standard Next.js dev start and production build, existing homepage smoke test, browser/console/media inspection at mobile/tablet/laptop/desktop, exact `tel:`/`mailto:` verification, baseline visual comparison, interaction-state review, and confirmation that relevant reference-analysis patterns improve usability without copying the reference sites.

### Documentation synchronization

F001 status/evidence, `PROJECT.md`, `INDEX.md`, `README.md`, initial `docs/architecture/CODEBASE-MAP.md`, ADR-001 consequences if implementation exposes a material mismatch.

### Completion/review gate

Standard Next path runs/builds and the homepage remains faithful before obsolete runtime files are removed. Developer validation then user review; QA only after explicit acceptance.

## Stage 2 — Authoritative Catalogue Foundation and Browsing

### Objective

Complete F002 and establish the minimum Supabase/Drizzle product foundation needed by every later P0 flow.

### Affected feature

F002 — Catalogue Browsing and Search

### Technical tasks

1. Configure server-only PostgreSQL access, Drizzle PostgreSQL dialect, reviewed migrations, and Supabase public/server clients without committing secrets.
2. Create product/publication/availability/media enums and `products`/`product_media` tables with category checks, grants, and RLS.
3. Add an idempotent seed for exactly 44 authoritative catalogue entries from `CATALOGUE.md`: published, availability unset, no guessed media mappings or attributes.
4. Replace conflicting hardcoded public product identities/prices with database-backed reads.
5. Implement published-only catalogue/category browsing, name search, category filter, price/name sorts, clear filters, and intentional no-results/error/loading states.
6. Keep price-range filtering P1 and omit availability filtering.
7. Implement bounded query parsing and tagged catalogue revalidation contract.

### Likely code areas

`db/schema.ts`, `db/index.ts`, `drizzle.config.ts`, migration directory, seed script/data module, `lib/db/`, `lib/catalogue/`, `lib/validation/`, `app/catalogue/`, catalogue components, `.env.example`.

### Dependencies

F001; non-production Supabase project URL/publishable key/database URL for integration. Credential absence blocks remote integration, not local code structure or seed preparation.

### Validation

Migration generation/review, isolated database migration, repeatable seed, exact 44-entry/count/value checks, database constraints, publication/RLS tests, search/sort/filter tests, responsive catalogue browser checks.

### Documentation synchronization

F002 evidence, `DATA-MODEL.md`, `ROUTES.md`, `INTEGRATIONS.md`, `CODEBASE-MAP.md`, `README.md`, `PROJECT.md`.

### Completion/review gate

Authoritative published catalogue works with no old mock data, guessed media, or availability claim; repeat seed is harmless. Developer validation and user review follow.

## Stage 3 — Product and Ceiling Detail

### Objective

Complete F003 with stable category-safe details and authoritative purchase/enquiry controls.

### Affected feature

F003 — Product Detail Experience

### Technical tasks

1. Add stable product slug resolution and not-found behavior.
2. Render exact supplied fields and mapped-media/fallback behavior.
3. Enable positive whole quantity plus Add to Cart/Buy Now only for direct-purchase categories.
4. Keep sofa customization and every ceiling product on consultation/enquiry paths.
5. Render exact ceiling range including the open-ended Glass Ceiling upper value.
6. Omit unsupported attributes, galleries, videos, variants, descriptions, and availability claims.

### Likely code areas

`app/products/[slug]/`, product-detail components, catalogue repository/service, media fallback component, validation/types.

### Dependencies

F002 database/read model and seed.

### Validation

All 44 routes resolve; direct/ceiling CTA matrix tests; no guessed content/media; keyboard/responsive/media-crop checks; unavailable/unpublished records return safe not-found behavior.

### Documentation synchronization

F003 evidence, `ROUTES.md`, `CODEBASE-MAP.md`, `PROJECT.md`.

### Completion/review gate

Every authoritative record has a stable correct detail and ceilings cannot enter commerce. Developer validation and user review follow.

## Stage 4 — Cart and Buy Now Separation

### Objective

Complete F004 with resilient client persistence that never becomes monetary authority.

### Affected feature

F004 — Shopping Cart

### Technical tasks

1. Create a versioned normal-cart store containing product IDs/positive quantities only.
2. Create a separate temporary/tab-scoped Buy Now intent with one product and quantity.
3. Build drawer/count/quantity/remove/clear/empty/recovery interactions.
4. Fetch current public product display data and handle changed/unpublished products clearly.
5. Prepare checkout payload contracts and post-payment purchased-quantity reconciliation.
6. Ensure Buy Now never reads or mutates unrelated cart lines.

### Likely code areas

Cart provider/store/hooks, cart drawer/components, product CTAs, checkout-intent utilities, shared product display endpoint/service, tests.

### Dependencies

F003 product identity/CTA behavior.

### Validation

Persistence/version migration tests, positive-quantity rules, duplicate-line merging, cart/Buy Now isolation, unpublished/changed record recovery, drawer focus/keyboard/mobile checks.

### Documentation synchronization

F004 evidence, `ROUTES.md`, `CODEBASE-MAP.md`, `PROJECT.md`.

### Completion/review gate

Cart refresh persistence and Buy Now isolation pass automated/browser checks. Developer validation and user review follow.

## Stage 5 — Checkout and Immutable Order Creation

### Objective

Complete F005 with India-only guest checkout, server-authoritative money, idempotency, and immutable snapshots.

### Affected feature

F005 — Checkout, Address and Order Creation

### Technical tasks

1. Add order/order-item enums and tables, constraints, indexes, grants/RLS, and migration.
2. Build shared checkout UI for normal-cart and Buy Now sources.
3. Add shared client/server validation for approved customer/address fields and six-digit Indian PIN.
4. Implement one server calculation service: published eligible products, positive quantities, catalogue unit prices, subtotal, server-configured shipping `0`, INR total, no tax line.
5. Create orders/items/contact/address snapshots transactionally with a unique checkout idempotency key; require and preserve the customer email for later transactional communication without sending email from F005.
6. Issue two-hour guest access capability using 32 random bytes, SHA-256 stored hash, and path-scoped HttpOnly/SameSite cookie settings; Secure when deployed.
7. Add safe retries/conflict behavior and no-store checkout/confirmation handling.

### Likely code areas

Drizzle migrations/schema, `lib/checkout/`, `lib/orders/`, `lib/security/`, validation schemas, `app/checkout/`, order confirmation route shell, Server Action/Route Handler tests.

### Dependencies

F004; PostgreSQL foundation; server environment configuration.

### Validation

Calculation/tampering tests, category exclusion, India validation, transaction rollback, idempotent retry, immutable snapshot tests, guest token entropy/hash/expiry/cookie/access tests, responsive checkout/error-state checks.

### Documentation synchronization

F005 evidence, `DATA-MODEL.md`, `ROUTES.md`, `CODEBASE-MAP.md`, `PROJECT.md`.

### Completion/review gate

Both checkout modes create one correct immutable unpaid order under tampering/retry tests. Developer validation and user review follow.

## Stage 6 — Razorpay Test Payment and Verified Confirmation

### Objective

Complete F006 and produce the earliest usable end-to-end Sunday public commerce demo.

### Affected feature

F006 — Razorpay Test Payment and Order Confirmation

### Technical tasks

1. Add payment-attempt and durable paid-order email-delivery tracking constraints/migrations.
2. Isolate Razorpay test adapter behind a server interface.
3. Create Razorpay orders from persisted order totals and store unique provider order IDs.
4. Load Standard Checkout client-side with public fields only.
5. Implement verification Route Handler using the stored provider order ID, amount agreement, server secret, timing-safe comparison/library helper, and atomic idempotent paid transition that creates one durable customer-confirmation and business-notification delivery record per paid order.
6. Handle invalid/mismatched/replayed/cancelled/failed flows without false paid state.
7. Protect authenticated or immediate guest confirmation; never authorize by public/internal ID alone.
8. Reconcile normal cart by purchased quantities after verified success; preserve normal cart after Buy Now.
9. Dispatch queued paid-order notifications from trusted server code through Resend only after the verified `PAID` transition. Delivery failure is recorded for recovery and never rolls back the order/payment; retries reuse the existing delivery record rather than creating duplicates.
10. Keep the no-reply sender and business recipient server-side, environment-configured values; no email-provider credential or recipient is hardcoded in browser code.
11. Leave webhook endpoint/processing explicitly P1 unless separately selected.

### Likely code areas

Payment and email-delivery schema/migration, `lib/payments/razorpay/`, server-only Resend adapter/delivery service, verification Route Handler, checkout launcher, confirmation route, cart reconciliation, integration/unit/E2E tests.

### Dependencies

F005, Razorpay test key ID/secret, and server-only Resend credentials plus configurable sender/recipient. Missing credentials block live E2E delivery but not deterministic adapter/signature/delivery-state tests.

### Validation

Valid/invalid/mismatch/replay signature tests; paid-transition/email-delivery idempotency and failure-recovery tests; secret-exposure scan; test-mode browser payment/cancel/failure runs; confirmation authorization; cart-mode reconciliation.

### Documentation synchronization

F006 evidence, `INTEGRATIONS.md`, `ROUTES.md`, `DATA-MODEL.md`, `CODEBASE-MAP.md`, `PROJECT.md`.

### Completion/review gate

Verified Razorpay test payment reaches protected confirmation; no browser-only path can set paid. This is the earliest usable public end-to-end Sunday demo. Developer validation and user review follow.

## Stage 7 — Ceiling Consultation Journey

### Objective

Complete F008 as an independent guest enquiry path.

### Affected feature

F008 — Ceiling Catalogue and Consultation Request

### Technical tasks

1. Add ceiling-enquiry table, constraints, indexes, grants/RLS, and migration.
2. Build general/detail-preselected form with approved fields and `Need guidance` default.
3. Validate optional positive area without price multiplication.
4. Store immutable range/contact/project snapshot with unique submission idempotency key and `NEW` status.
5. Return non-sequential public reference and concise no-promise confirmation.
6. Retain direct phone/email fallbacks and user input on recoverable errors.

### Likely code areas

Enquiry schema/migration, `lib/enquiries/`, validation, `app/ceiling-enquiry/`, confirmation component/route, homepage/detail CTAs, tests.

### Dependencies

F002/F003 catalogue data and standard server persistence foundation.

### Validation

Required/optional fields, positive area, no price calculation, no cart/order/payment relationship, idempotency, fallback contact links, responsive/keyboard/form-error E2E.

### Documentation synchronization

F008 evidence, `DATA-MODEL.md`, `ROUTES.md`, `CODEBASE-MAP.md`, `PROJECT.md`.

### Completion/review gate

Guest submission persists once and confirms without a payable calculation or promise. Developer validation and user review follow.

## Stage 8 — Secure Admin Catalogue and Primary Media

### Objective

Complete F009 with server-controlled administration and no public draft leakage.

### Affected feature

F009 — Admin Access and Catalogue Management

### Technical tasks

1. Integrate supported Supabase cookie-based SSR identity handling needed for admin access.
2. Add `admin_users` table with no client mutation path; implement `requireAdmin()` for every admin read/mutation.
3. Support later secure provisioning of the pending initial admin identity without public signup.
4. Build admin catalogue list/edit/create with category constraints.
5. Implement `PUBLISHED`/`UNPUBLISHED` and nullable availability (`UNSET`, explicit in/out) independently.
6. Invalidate public catalogue/product cache tags after authoritative changes.
7. Configure product-media Storage access and admin-authorized primary-image upload/preview/commit/replace/remove flow.
8. Store only verified media path/metadata; retain old mapping or fallback on failure.
9. Keep gallery/video administration P1.

### Likely code areas

Auth server utilities/session refresh boundary, admin authorization service, admin schema/migration/policies, `app/admin/products/`, admin actions, Storage adapter, media validation/components, tests.

### Dependencies

F002; Supabase Auth/Storage configuration; initial admin identity only needed for final access validation, not mechanism implementation.

### Validation

Anonymous/customer/admin matrix tests at route and mutation levels, RLS/grants tests, draft publication filtering, availability separation, category constraints, history preservation, upload authorization/type/size/association/failure tests, desktop/tablet and safe-mobile browser checks.

### Documentation synchronization

F009 evidence, `DATA-MODEL.md`, `ROUTES.md`, `INTEGRATIONS.md`, `CODEBASE-MAP.md`, Auth/admin setup in `README.md`, `PROJECT.md`.

### Completion/review gate

Only a configured server-authorized admin can maintain catalogue/primary media; drafts stay private and ceilings remain enquiry-only. Developer validation and user review follow.

## Stage 9 — Admin Orders and Enquiries

### Objective

Complete F010 and make the full Sunday operational demo available.

### Affected feature

F010 — Admin Order and Ceiling Enquiry Operations

### Technical tasks

1. Build recent-first bounded order list/search/filter and immutable order detail.
2. Show non-secret Razorpay references read-only; expose no secret or editable payment state.
3. Implement approved forward order transitions `NEW` → `PROCESSING` → `COMPLETED` without cancellation/refund/shipping states.
4. Build recent-first enquiry list/search/detail.
5. Implement approved enquiry transitions `NEW` → `CONTACTED` → `CLOSED` only.
6. Apply `requireAdmin()` to every query/action and return non-disclosing authorization errors.
7. Keep snapshots, totals, payment identifiers, and customer submissions immutable.

### Likely code areas

`app/admin/orders/`, `app/admin/enquiries/`, repositories/services, validated admin actions, tables/detail/status components, authorization/integration/E2E tests.

### Dependencies

F005/F006/F008/F009.

### Validation

Admin access isolation, recent-first pagination/search/filter, immutable/read-only fields, allowed/forbidden transitions, payment-state separation, no enquiry-to-commerce action, responsive desktop/tablet and safe-mobile checks.

### Documentation synchronization

F010 evidence, `ROUTES.md`, `CODEBASE-MAP.md`, `PROJECT.md`.

### Completion/review gate

The authorized admin can manage all required catalogue, order, and enquiry operations. The full functional Sunday demonstration exists here; developer validation and user review follow.

## Stage 10 — F011 Release Acceptance and Vercel Preview

### Objective

Verify every implemented P0 criterion and publish a clearly identified development/demonstration Vercel Preview.

### Affected feature

F011 — MVP Experience Quality and Release Acceptance

### Technical tasks

1. Resolve all P0 loading/empty/error/failure states and dead/placeholder controls.
2. Run responsive and practical accessibility remediation across representative mobile/tablet/laptop/desktop.
3. Audit authoritative data, media fallbacks, test-mode labels, contact links, public draft filtering, and no invented policy/content.
4. Run the complete security-boundary test matrix.
5. Run typecheck, ESLint, focused unit/integration tests, production build, and Playwright critical journeys.
6. Inspect runtime console/network/media behavior and prevent obvious blocking/bundle regressions.
7. Configure environment-scoped Vercel Preview using non-production Supabase and Razorpay test values.
8. Deploy Preview only; record URL/evidence and label it development/demonstration.
9. Keep P1 and production follow-up accurately incomplete.

### Likely code areas

Cross-cutting application components/styles, test suites/configuration, accessibility helpers, environment config, Vercel project settings, release-verification documentation.

### Dependencies

Implemented P0 features, supported Node runtime, non-production Supabase, Razorpay test credentials, Vercel access.

### Validation

Full F011 acceptance matrix and mandatory public/ceiling/admin Playwright journeys at representative widths; no severe console errors; production build succeeds.

### Documentation synchronization

F011 evidence, every materially affected feature, `PROJECT.md`, `INDEX.md`, `README.md`, architecture docs/ADRs, tests, release-verification record. No unnecessary component documentation.

### Completion/review gate

Preview evidence is presented for user review. Final QA begins only after explicit implemented-behavior acceptance. Production remains unauthorized.

## Stage 11 — P1 Customer Account and Optional Slices

### Objective

Implement only selected P1 scope after P0 is stable, without delaying Sunday acceptance.

### Affected feature

F007 and recorded P1 slices of F002/F003/F006/F009/F011.

### Technical tasks

- F007 core order: supported Supabase email/password signup verification and resend, email/password login/logout, Google OAuth sign-in, session, minimal account, authenticated order association, order history/detail, then password reset.
- Before F007 implementation, configure the approved Supabase confirmation/OAuth redirects and an approved SMTP delivery path. Resend may be selected as custom SMTP/email provider; final no-reply domain remains client/owner input and provider credentials remain server/provider configuration only.
- Optional only if explicitly selected by schedule: price-range filter, related products, webhook reconciliation, gallery/video admin, advanced admin polish/media optimization, and further production email work beyond the approved F007 auth flows.
- Any included P1 slice receives its own feature-state validation/review and all applicable security tests.

### Likely code areas

Customer Auth/account routes and services, optional feature-specific modules, associated tests/docs.

### Dependencies

Stable P0, Supabase Auth foundation, explicit selection of the P1 slice, enabled Google OAuth, approved Supabase confirmation redirect/custom SMTP configuration, and final no-reply sending-domain input.

### Validation

Feature-specific criteria, ownership/RLS/session isolation, and regression of guest/P0 journeys.

### Documentation synchronization

Update actual included/incomplete P1 status in feature files, `PROJECT.md`, `IMPLEMENTATION.md`, and relevant architecture/test records.

### Completion/review gate

P1 work never changes Sunday P0 acceptance retroactively. Each implemented slice follows developer validation, user review, and QA gates.

## Database and Migration Sequence

| Sequence | Triggering feature | Change | Safety/rollback |
| -------- | ------------------ | ------ | --------------- |
| M001 | F002 | PostgreSQL enums, `products`, `product_media`, constraints/indexes/grants/RLS | Initial additive migration; rollback drops only empty/new structures in non-production |
| Seed 001 | F002 | Idempotent 44-record authoritative catalogue seed | Stable slug upsert; no deletion, stock, invented fields, or media assignment |
| M002 | F005 | `orders`, `order_items`, constraints/indexes/grants/RLS | Additive; transaction tests; no destructive rollback after orders exist |
| M003 | F006 | `payment_attempts`, durable `order_email_deliveries`, provider uniqueness and state constraints | Additive; verified paid transition and per-message delivery idempotency protected; compensating migration if changed |
| M004 | F008 | `ceiling_enquiries`, idempotency/public-reference/status constraints | Additive and separate from commerce |
| M005 | F009 | `admin_users`, admin access policies/functions as required | Additive; no public grants; admin identity provisioned separately |

Every generated SQL migration is reviewed before application. Shared Preview/Production never uses unreviewed schema push. Destructive changes require a separately documented data/rollback decision.

## Deployment Migration Sequence

1. Establish Node.js `>=22.13.0` and standard Next scripts.
2. Run the existing homepage on standard Next and capture validation evidence.
3. Switch default scripts; remove Vinext/Vite/Worker/Wrangler only after the checkpoint passes.
4. Connect non-production Supabase and apply reviewed migrations/seed.
5. Add Razorpay test configuration and verified flow.
6. Link Vercel Preview with environment-scoped non-production values.
7. Deploy/update preview as integration milestones become stable.
8. Run final F011 validation against Preview.
9. Do not enable Vercel Production or live Razorpay without a new explicit production approval.

## Test and Validation Matrix

| Layer | Required focus |
| ----- | -------------- |
| Static | TypeScript/typecheck, ESLint, secret scan, production build |
| Unit | Money, validation, category rules, state transitions, references/tokens, cart reconciliation |
| Database integration | Constraints, transactions, idempotency, publication, snapshots, indexes, grants/RLS |
| Authorization integration | Customer ownership, guest capability, admin isolation, direct endpoint denial |
| Payment/email integration | Valid/invalid/mismatched/replayed verification, amount agreement, atomic paid state, customer/business delivery idempotency, and failure-without-payment-rollback |
| Browser/Playwright | Mandatory public, ceiling, and admin journeys; cancellation/failure/recovery |
| Accessibility/manual | Keyboard, focus, labels/errors, dialogs/drawers, reduced motion, contrast sanity |
| Responsive/manual | Mobile, tablet, laptop, desktop; overflow/crop/sticky/table/form behavior |
| Preview | Environment label/isolation, console/network/media, critical journey smoke |
| Visual/interaction | SleepExcellent design consistency, hierarchy, spacing, typography, CTA visibility, state feedback, missing-media treatment, reference-pattern fit, accessibility basics, and intentional mobile/tablet/laptop/desktop behavior |

## Documentation Plan

- Create `docs/architecture/CODEBASE-MAP.md` when foundation code exists; update it only for major module movement.
- Keep `DATA-MODEL.md`, `ROUTES.md`, and `INTEGRATIONS.md` synchronized with implemented contracts.
- Update `README.md` with Node/runtime, environment variable names, development, migration, seed, test, and preview setup.
- Update feature files with implementation status, changed files, developer validation, user review, and QA evidence as lifecycle advances.
- Update `PROJECT.md`, `INDEX.md`, phase records, ADR consequences, and tests at material transitions.
- Treat documentation synchronization as part of each developer-validation pass, including after user or QA revisions; stale implementation documentation blocks `AWAITING_FEATURE_REVIEW` and `FEATURE_COMPLETE`.
- Never place secret values in documentation or tracked configuration.

## Human Review Gates

1. Current gate: explicit approval of this implementation plan.
2. After approval: select F001, create Tech-Lead-to-Engineering handoff, then begin implementation.
3. For each feature: Software Engineer developer validation → presentation → explicit user review/acceptance → independent QA → feature complete.
4. Architecture conflicts return to TECH_LEAD; requirement changes return to PRODUCT_LEAD and require approval/spec update.
5. Vercel Preview is validated through F011. Production deployment always requires a separate explicit approval immediately before action.

## Earliest Demonstration Milestones

- After F001: client-approved homepage works on the target standard Next.js runtime.
- After F003: authoritative public browse/detail journey works.
- After F006: earliest usable end-to-end Sunday public commerce demo through verified Razorpay test confirmation.
- After F008: complete ceiling consultation demo.
- After F010: complete functional Sunday scope, including required admin operations.
- After F011: release-accepted Vercel development/demonstration preview.

## Safe P1 Drops Under Time Pressure

- Entire F007 customer authentication/account/order-history feature.
- Password reset and production email configuration.
- F002 price-range filtering.
- F003 related products.
- F006 production-grade webhook reconciliation.
- F009 ordered galleries and product-video administration.
- Advanced admin mobile polish beyond safe usability.
- Advanced media/performance optimization beyond F011 correctness baseline.

Dropping these does not permit incomplete work to be marked complete and does not weaken security for any included slice.

## External Inputs and Conditional Gates

| Input | Blocks | Does not block |
| ----- | ------ | -------------- |
| Non-production Supabase access | Remote DB/Auth/Storage integration and Preview | F001 runtime migration; local schema/code planning |
| Razorpay test keys | Real test-mode browser E2E | Deterministic adapter/signature tests and non-payment features |
| Vercel access | Preview deployment | Local implementation/validation |
| Initial admin identity | Final F009/F010 login E2E | Admin authorization mechanism and tests with synthetic fixture |
| Product media/availability | Authoritative mapped/stock presentation | Catalogue, checkout, admin mechanism, and fallbacks |
| Production business/legal inputs | Production readiness | Sunday development/demonstration Preview |

## Implementation Status

Status: F004 FEATURE COMPLETE — independent acceptance testing passed. F005 implementation, migration, server-authoritative order validation, RLS/grant validation, tests, and typecheck are complete; local browser/lint/build completion remains the developer-validation gate. The separately approved F002/F003/homepage client-media presentation revision adds a temporary local ceiling/mattress media resolver and partner section without changing F005 behavior or state.

## Current Feature

Feature ID: F005
Specification: `features/F005-checkout-address-order-creation.md`
State: `DEVELOPER_VALIDATION`

## Blocked Features

| Feature ID | Blocker | Owner | Resolution Needed |
| ---------- | ------- | ----- | ----------------- |
| None at planning stage | External inputs are conditional integration gates listed above, not blockers to plan approval. | — | — |

## Completed Features

| Feature ID | QA Evidence | Completion Date |
| ---------- | ----------- | --------------- |
| F001 | `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and independent production browser acceptance checks passed. | 2026-09-05 |
| F004 | `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and independent desktop/mobile cart acceptance checks passed. | 2026-09-05 |
