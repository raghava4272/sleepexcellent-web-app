# Feature: F002 — Catalogue Browsing and Search

## Metadata

Feature ID: F002
Phase: PHASE-001
Priority: P0
Status: FEATURE_COMPLETE
Owner Role: QA_ENGINEER
Approval Date: 2026-09-05

## User Goal

As a shopper, I can browse categories, search by product/model name, and sort the authoritative SleepExcellent catalogue to find an appropriate product without being shown invented product data.

## Approved Requirements

1. Display all catalogue entries: 16 sofas, 10 beds, 10 mattresses, and 8 ceiling solutions.
2. Use only catalogue-authoritative product/model names, configurations/specifications, supplied sizes, listed prices, and ceiling price ranges.
3. Sofa, bed, and mattress listings support the standard direct-purchase journey. Ceiling listings lead to quote/consultation behavior and never enter the direct-purchase cart.
4. Browsing, search, sorting, and filtering remain available without authentication.
5. P0 catalogue behavior includes category browsing, search by product/model name, category filtering, price low-to-high, price high-to-low, name sorting, filter clearing, and clear no-results behavior.
6. Price-range filtering is P1 and must not delay the P0 journey.
7. Do not build advanced filtering for missing or inferred product attributes.
8. Until authoritative availability is supplied, do not display `in stock` or `out of stock`, filter by availability, or block purchase using an assumed availability value.
9. The future data model may support simple `in stock`/`out of stock` values, but availability remains PENDING CLIENT INPUT and is non-blocking for the Sunday MVP.
10. Associate product images/videos only where the product-to-media mapping is authoritative.
11. When no authoritative product media mapping exists, show a deliberate polished pending-media fallback. Do not use another product’s media or fabricate a gallery/video.
12. Missing product media is PENDING CLIENT INPUT and must not block catalogue browsing, search, cart, checkout, payments, orders, admin, Supabase integration, or Vercel deployment.
13. Preserve the existing homepage/category media already used by the demo.
14. Product cards show only authoritative identity, category, supplied configuration/specification, listed price or ceiling range, and permitted CTA behavior.
15. Avoid pagination/infinite-scroll complexity for the initial catalogue size unless later evidence requires it.
16. The existing homepage search control opens a dedicated results page that preserves the submitted query and displays authoritative matching catalogue results.
17. While the user types in the homepage search control, show matching authoritative catalogue product suggestions; do not generate or infer recommendations from unavailable product attributes.
18. On desktop, hovering a homepage category label or its adjacent arrow reveals that category's authoritative listing; the listing disappears when the pointer leaves the category-menu region.

Traceability: explicitly approved by the user on 2026-09-05 as “A2 — Catalogue Browsing and Search APPROVED with these changes,” followed by the availability, filtering, authoritative-data, and media rules above.

## Acceptance Criteria

1. Catalogue totals are exactly 16 sofas, 10 beds, 10 mattresses, and 8 ceiling solutions.
2. No displayed product/model name, supplied configuration/specification, supplied size, listed price, or ceiling range conflicts with `docs/product/CATALOGUE.md`.
3. Users can browse each category and return to the all-products view.
4. Search matches product/model names without requiring authentication.
5. Category filtering returns only products in the selected category and can be cleared.
6. Price low-to-high, price high-to-low, and name sorting produce the correct visible order.
7. Empty/no-results states explain that no matching products were found and provide a clear reset action.
8. No availability badge, availability filter, or purchase restriction appears until authoritative availability data exists.
9. No material, color, discount, rating, stock value, size, variant, description, or other missing attribute is inferred.
10. A mapped product image/video is shown only when its association is authoritative.
11. Products without authoritative media use the approved polished pending-media fallback and never display another product’s media.
12. Missing media does not disable browsing, search, sorting, or permitted product navigation/purchase actions.
13. Direct-purchase catalogue cards display the exact supplied listed price.
14. Ceiling cards display the exact indicative range and `/sq. ft.` unit and expose no Add to Cart or Buy Now action.
15. P0 behavior is complete without price-range filtering; price-range filtering is treated as P1 polish.
16. Listing controls remain keyboard operable, touch friendly, and free from horizontal page overflow on mobile, tablet, and desktop widths.
17. Homepage search submits to a results page containing the matching authoritative catalogue records.
18. Homepage type-ahead suggestions match only authoritative catalogue product/model names and are keyboard and touch accessible.
19. Desktop category-menu listings open on hover and close when the pointer leaves, while retaining keyboard-triggered navigation access.

## Out of Scope

- Availability display/filtering/enforcement before client input
- Semantic or AI-powered search
- Reviews and ratings
- Wishlist
- Product comparison
- Recommendations
- Discounts and promotional badges
- Filters based on inferred attributes
- Complex faceted filtering
- Pagination or infinite scroll for the initial catalogue
- Invented image/video mappings

## Dependencies

- `docs/product/CATALOGUE.md`
- F001 Homepage and Global Navigation
- F003 Product Detail Experience
- Product records and media-path structure defined later during approved architecture planning
- Product media mapping: PENDING CLIENT INPUT, non-blocking
- Initial availability values: PENDING CLIENT INPUT, non-blocking
- Future approved cart feature for active purchase controls

## User Decisions

| Date | Decision | Approval Evidence | Effect |
| ---- | -------- | ----------------- | ------ |
| 2026-09-05 | Approve A2 with adjusted scope. | User explicitly stated “A2 — Catalogue Browsing and Search APPROVED with these changes.” | Registered F002 as an approved P0 feature. |
| 2026-09-05 | Do not invent or enforce availability. | Explicit availability rules in the approval. | Availability UI/filtering is excluded until client data exists. |
| 2026-09-05 | Limit P0 filtering and move price-range filtering to P1. | Explicit Sunday priority split in the approval. | Protects the critical browsing journey from advanced-filter scope. |
| 2026-09-05 | Missing media uses a polished fallback and is non-blocking. | Explicit product-media rules in the approval. | Prevents false mapping while allowing storefront delivery. |

## Design References

- Existing homepage and category-card styling establish the visual language.
- `docs/product/CLIENT-BRIEF.md`
- `docs/product/REFERENCE-ANALYSIS.md`

## Architecture References

Approved initial architecture: `docs/architecture/SYSTEM-ARCHITECTURE.md`, `docs/architecture/DATA-MODEL.md`, and ADR-002. It preserves unset availability and unmapped-media fallbacks.

## Implementation Plan

Approved in `IMPLEMENTATION.md`; the user authorized implementation of F002 only on 2026-09-05.

## Implementation Status

Current state: FEATURE_COMPLETE
Summary: F002 acceptance testing passed. The authoritative persisted-catalogue homepage type-ahead, results-page search, filter/sort behavior, responsive desktop/mobile interactions, RLS/grant controls, and repeatable standalone seed all meet the approved scope. The Next.js application entry point retains its `server-only` guard while trusted standalone scripts reuse the same canonical connection factory.

## Implementation Summary

F002 adds the public `/catalogue` route, with model-name search, category filters,
price/name sorting, filter reset, no-results/error/loading states, responsive
controls, exact direct-product prices, and exact ceiling price ranges per square
foot. Product cards deliberately use a premium `Media pending` presentation;
no image/video is mapped from the unverified local product-image folder, no
availability state is displayed, and ceiling cards have no commerce CTA.

The PostgreSQL foundation is represented by the Drizzle schema in `db/schema.ts`,
the reviewed versioned migration `drizzle/0000_past_grim_reaper.sql`, and an
idempotent slug-based seed script. It creates the approved category/publication/
availability/media enums, `products` and `product_media` tables, category-safe
price constraints, indexes, RLS, revoked direct grants, and published-product
read policy. The 44 supplied records are held in one authoritative source module
with availability unset and no media mappings. In the absence of a configured
database connection, local development renders that same authoritative seed;
when `DATABASE_URL` is set, the route reads published products through the
server-only Drizzle application entry point and reports a recoverable catalogue
error on a database failure. Trusted standalone Node/tsx maintenance scripts
reuse that single connection factory directly, without importing the Next.js-only
guard or making database access available to client components.

### Post-completion client-media revision — 2026-09-06

The explicitly approved demo-media revision adds a client-safe local media
resolver for the supplied ceiling and mattress folders. Catalogue cards use only
an authoritative primary image (`<product>.jpg`) when present; all other cards
retain the polished fallback. It normalizes case, repeated spaces, and safe
separators only, so it cannot fuzzy-map a model to another product. The exact
paths and the one explicit Bonnell/Bonnel alias are recorded in
`docs/product/CATALOGUE.md`. `product_media` remains empty and unchanged.
The same approved revision adds the supplied partner images unchanged to the
homepage before its footer, with no extra biography or claims.

The approved sofa/bed media update adds only clearly identified folder mappings
to catalogue-card primary media and detail galleries. Bed galleries append the
shared mattress guide exactly once as their final fifth item; material folder
name discrepancies stay unmapped pending separate approval.

## Files Changed

| File | Purpose |
| ---- | ------- |
| `app/catalogue/` | Public dynamic catalogue route with loading and recoverable error states. |
| `components/catalogue-page.tsx` | Premium responsive search/filter/sort controls, media-pending cards, price/range hierarchy, and empty state. |
| `lib/catalogue/media.ts` | Client-safe deterministic temporary local-media resolver; replacement seam for the F009 Storage metadata source. |
| `public/media/` | Unchanged client-supplied ceiling and mattress image mirror used by the temporary demo resolver. |
| `lib/catalogue/` | Authoritative 44-record seed transcription, bounded query parsing, types, and server-only database/seed read repository. |
| `db/schema.ts`, `db/index.ts`, `db/connection.ts`, `drizzle.config.ts`, `drizzle/` | Drizzle PostgreSQL schema, server-only application entry point, shared trusted CLI connection factory, reviewed versioned migration, RLS/grant policy, and metadata. |
| `scripts/seed-catalogue.ts` | Idempotent slug-based Supabase seed command. |
| `.env.example`, `package.json`, `package-lock.json` | Server-only database variable documentation, Drizzle dependencies, and migration/seed scripts. |
| `components/home-page.tsx`, `lib/site-data.ts`, `app/globals.css` | Catalogue destinations from the existing homepage and shared premium catalogue controls. |
| `tests/catalogue.test.mjs` | Exact seed/count/price-range, no-invented-data, schema/migration, server-only/CLI boundary, and public UI regression checks. |

## Developer Validation

| Check | Result | Evidence / Notes |
| ----- | ------ | ---------------- |
| Node/tooling | PASS | Node.js 22.23.2 runtime used via fnm; Drizzle ORM, postgres-js, Drizzle Kit, and tsx installed with the lockfile updated. |
| Schema and migration review | PASS (local) | `npm run db:generate` generated `drizzle/0000_past_grim_reaper.sql`; `npx drizzle-kit check` passed. The migration includes category constraints, product/media tables, RLS, revoked direct grants, and published-only read policy. |
| Seed data | PASS (remote) | After the boundary repair, `DATABASE_URL`-configured `npm run db:seed` completed twice against the configured non-production Supabase project. The resulting database contains exactly 44 distinct products: 16 sofas, 10 beds, 10 mattresses, and 8 ceilings; all availability values are null, all records are published, `product_media` remains empty, and duplicate slugs equal zero. |
| TypeScript | PASS | `npm run typecheck` after the connection correction. |
| ESLint | PASS | `npm run lint` after the connection correction. |
| Automated tests | PASS | `npm test`: 9 tests passed, 0 failed, including the server-only application/CLI connection-boundary regression check, homepage persisted-suggestion, and category-menu hover coverage. |
| Production build | PASS | `npm run build`: Next.js compiled, typechecked, and produced the dynamic `/catalogue` and `/api/catalogue/suggestions` routes. |
| Browser review | PASS | Desktop 1280px and mobile 390px browser validation confirmed persisted `ortho` type-ahead results, a maximum of two matching suggestions, selection and form routing to `/catalogue?q=…`, live result counts, keyboard/touch-reachable controls, and no horizontal overflow. Desktop category listings open while the pointer is over the category/arrow and close after pointer exit. Existing catalogue category/filter/sort/no-results/media-pending/ceiling behavior remains covered by the passing suite. |
| Remote Supabase migration and seed | PASS | Applied the reviewed `0000_past_grim_reaper.sql` migration to the configured non-production Supabase project. Remote validation confirmed the products/product_media schema, RLS enabled on both tables, revoked direct anon/authenticated SELECT grants, and the published-products policy. |
| Homepage type-ahead revision | PASS | The corrected non-production connection returns exactly 44 published products. Homepage type-ahead returns only matching published authoritative names/categories from the persisted catalogue, is bounded to six results, and routes users to live `/catalogue?q=…` results. |
| 2026-09-06 local-media revision | PARTIAL | `npm run typecheck` and `npm test` (24 tests) pass, including deterministic slot/order and partner-asset tests. The local Next route compiler did not return a catalogue/product response within 30 seconds; full lint/build have the same established local-toolchain stall and are not claimed as passing. |

## User Review

Status: Accepted
Feedback: The user explicitly accepted the revised F002 implementation for independent acceptance testing on 2026-09-05.
Acceptance Date: 2026-09-05

## QA Testing

| Acceptance Criterion | Test | Result | Evidence |
| -------------------- | ---- | ------ | -------- |
| Authoritative persisted catalogue | Field-by-field non-production comparison | PASS | All 44 persisted records exactly match the authoritative seed: 16 sofas, 10 beds, 10 mattresses, and 8 ceilings. |
| Seed operation and idempotency | `DATABASE_URL`-configured `npm run db:seed` twice | PASS | Both standalone `tsx` seed invocations completed successfully after the repaired import boundary. The final database has zero duplicate slugs. |
| Publication, availability, and media integrity | Read-only non-production query | PASS | All 44 records are `PUBLISHED`, availability is null for all 44, there are zero unpublished rows, and `product_media` has zero mappings. Repository queries and suggestions explicitly filter to `PUBLISHED`. |
| Database/RLS integrity | Read-only non-production query | PASS | RLS is enabled on `products` and `product_media`; there are no direct `SELECT` grants for `anon` or `authenticated`; the sole public policy permits only published-product reads. |
| Catalogue browse/search/filter/sort | Desktop browser at 1440px | PASS | `/catalogue` rendered 44 cards; sofa filtering rendered 16 cards; price-desc order began U-Shape Sofa, Italian Model Sofa, Chester Model Sofa; no-results state and clear route behaved correctly. Homepage `ortho` suggestions contained only Ortho Mattress and Ortho Plus Mattress, selection and Search submission routed to the matching persisted results. |
| Ceiling presentation | Desktop browser | PASS | Ceiling filter rendered 8 cards with authoritative indicative `/sq. ft.` ranges and consultation text; no Add to Cart, Buy Now, or availability claims were present. |
| Responsive and premium interaction review | Desktop 1440px and mobile 390px browser | PASS | Mobile search was reached from the drawer, returned the same two persisted suggestions, selected correctly, and had no horizontal overflow (390px client/scroll width). Desktop category hover opened its authoritative listing and closed after pointer exit. Motion/focus treatments and the `prefers-reduced-motion` safeguard remain present. |
| Regression and build | Automated commands | PASS | `npm test` passed 9/9, `npm run typecheck`, `npm run lint`, and `npm run build` all passed. |

## AI Evals, When Applicable

Not applicable. Search is deterministic product/model-name matching and does not include AI behavior.

## Known Limitations

- Product media mapping and initial availability are PENDING CLIENT INPUT but explicitly non-blocking.
- Product descriptions, detailed attributes, and variant data are not supplied.
- Price-range filtering is P1.

## Change History

| Date | Change | Reason | Approved By |
| ---- | ------ | ------ | ----------- |
| 2026-09-05 | Initial approved specification created with revised media, availability, and filter scope. | Group A approval. | User |
| 2026-09-05 | F002 implementation and local developer validation completed. | Authorized F002-only Engineering OS work; remote database validation remains pending. | Codex / Software Engineer |
| 2026-09-05 | Applied and validated the reviewed migration plus idempotent 44-product seed in the configured non-production Supabase project. | User authorized the remaining F002 database gate. | Codex / Software Engineer |
| 2026-09-05 | Homepage search results and authoritative type-ahead suggestions added to F002 requirements. | Explicit user revision request during feature review. | User |
| 2026-09-05 | Implemented homepage type-ahead and results-page search revision; validation blocked by local database DNS. | Preserve persisted-authority requirement and disclose incomplete live validation. | Codex / Software Engineer |
| 2026-09-05 | Completed live persisted-catalogue validation after database connection correction. | Resolve the F002 developer-validation blocker without changing feature scope. | Codex / Software Engineer |
| 2026-09-05 | Desktop category-menu hover behavior added to F002 requirements. | Explicit user revision request during feature review. | User |
| 2026-09-05 | Implemented and developer-validated desktop category-menu hover behavior. | Open authoritative listings on category-arrow hover and close after pointer exit. | Codex / Software Engineer |
| 2026-09-05 | QA returned F002 for seed-command dependency repair. | The approved idempotent seed command cannot resolve `server-only` in standalone execution. | Codex / QA Engineer |
| 2026-09-05 | Repaired the standalone seed import boundary and repeated non-production validation. | Preserve the Next.js application `server-only` guard while allowing trusted Node/tsx maintenance scripts to reuse the canonical Drizzle connection factory. | Codex / Software Engineer |
| 2026-09-05 | Independent acceptance testing completed. | User accepted the repaired implementation for QA; database, browser, accessibility/responsiveness, and regression evidence passed. | Codex / QA Engineer |
| 2026-09-06 | Approved client-media presentation revision implemented. | Deterministic ceiling/mattress local media mapping and primary catalogue-card rendering; database product-media records unchanged. | Codex / Software Engineer |
