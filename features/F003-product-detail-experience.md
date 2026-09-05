# Feature: F003 — Product Detail Experience

## Metadata

Feature ID: F003
Phase: PHASE-001
Priority: P0
Status: FEATURE_COMPLETE
Owner Role: QA_ENGINEER
Approval Date: 2026-09-05

## User Goal

As a shopper, I can review authoritative product information and either purchase the supplied standard configuration or request consultation when direct purchase is inappropriate.

## Approved Requirements

1. Every catalogue entry has a dedicated product/detail view with a stable product identity.
2. Sofa, bed, and mattress details show the authoritative name, category, supplied configuration/specification, supplied size where present, and catalogue listed price.
3. The catalogue listed price is the authoritative MVP checkout price for the supplied standard sofa, bed, or mattress configuration.
4. Do not invent variant pricing, customization pricing, additional sizes, thicknesses, discounts, or product attributes.
5. Sofa customization that materially affects price uses consultation/request quote and does not modify the standard catalogue price.
6. Direct-purchase details support positive whole-number quantity, Add to Cart, and Buy Now.
7. Until authoritative availability is supplied, do not display or enforce an invented stock status and do not block purchase based on assumed stock.
8. Ceiling details show the ceiling type, indicative range per square foot, and supplied “best suited for” information, followed by Request Quote/Consultation.
9. Ceiling details provide no quantity, Add to Cart, Buy Now, or final payable calculation.
10. Product images/videos may be associated only when the mapping to the catalogue product is authoritative.
11. If no authoritative mapping exists, use a deliberate pending-media fallback. Do not use random existing media or fabricate a gallery/video.
12. The product-media model must later support one primary image, multiple gallery images, and one optional video.
13. Future product media is stored in Supabase Storage, while database records store media paths and metadata rather than binary media.
14. Missing media is PENDING CLIENT INPUT and must not delay storefront, cart, checkout, Razorpay, orders, admin, Supabase integration, or Vercel deployment.
15. Missing descriptions, materials, colors, warranties, care information, or delivery promises are omitted until authoritative content is supplied.
16. Related products are P1/optional and must not delay the core MVP journey.

Traceability: explicitly approved by the user on 2026-09-05 as “A3 — Product Detail Experience APPROVED with these changes,” including the standard-price, ceiling, availability, media, Supabase Storage, and related-product rules.

## Acceptance Criteria

1. Every catalogue entry opens a stable detail view representing that exact catalogue entry.
2. Displayed names, categories, configurations/specifications, sizes, listed prices, and ceiling ranges exactly match `docs/product/CATALOGUE.md`.
3. The standard sofa, bed, or mattress price passed to cart/checkout equals the catalogue listed price for the supplied configuration.
4. No unprovided variant, size, thickness, customization price, discount, material, color, or description is displayed.
5. A shopper can select a positive whole-number quantity and use Add to Cart or Buy Now for a standard sofa, bed, or mattress.
6. Sofa customization directs to consultation/request quote without changing or calculating a customized price.
7. No stock badge or stock-based purchase restriction appears until authoritative availability data exists.
8. A ceiling detail displays its exact indicative range per square foot and supplied suitability information.
9. A ceiling detail exposes Request Quote/Consultation and no quantity, Add to Cart, Buy Now, or final payable total.
10. Mapped product media is displayed only when its association is authoritative.
11. An unmapped product displays the polished pending-media fallback and no fabricated gallery or video controls.
12. The future data contract can represent a primary image, ordered gallery images, and optional video using paths/metadata rather than binary database fields.
13. Missing product media does not disable detail navigation, quantity, direct purchase, or ceiling enquiry behavior.
14. Missing unsupported content sections are omitted rather than filled with assumptions.
15. Related products are not required for P0 acceptance.
16. Galleries, quantities, CTAs, breadcrumbs, and consultation actions are keyboard operable, touch friendly, and responsive across mobile, tablet, and desktop widths.

## Out of Scope

- Unprovided variants, sizes, thicknesses, colors, materials, or customization prices
- Invented stock states
- Reviews and ratings
- Wishlist
- Product comparison
- Rich recommendation engine
- Fabricated galleries or product videos
- Final shipping-provider integration
- Final ceiling-price calculation
- Related products for P0

## Dependencies

- `docs/product/CATALOGUE.md`
- F002 Catalogue Browsing and Search
- Future approved cart/checkout feature
- Future approved ceiling-enquiry feature
- Product media mapping: PENDING CLIENT INPUT, non-blocking
- Initial availability: PENDING CLIENT INPUT, non-blocking
- Supabase Storage/media architecture to be designed after product discovery
- Server-authoritative pricing architecture to be designed after product discovery

## User Decisions

| Date | Decision | Approval Evidence | Effect |
| ---- | -------- | ----------------- | ------ |
| 2026-09-05 | Approve A3 with adjusted scope. | User explicitly stated “A3 — Product Detail Experience APPROVED with these changes.” | Registered F003 as an approved P0 feature. |
| 2026-09-05 | Catalogue price is authoritative for the supplied standard configuration. | Explicit pricing rule in the approval. | Direct-purchase detail/cart data may not infer variant or customization prices. |
| 2026-09-05 | Ceiling remains enquiry-only. | Explicit ceiling behavior in the approval. | Ceiling details never create cart items or payable totals. |
| 2026-09-05 | Media requires authoritative mapping and future Supabase Storage paths. | Explicit media/data-storage rules in the approval. | Prevents false media attribution and binary database storage. |
| 2026-09-05 | Missing media and availability are non-blocking. | Explicit non-blocking rule in the approval. | Core MVP flows proceed with fallbacks and without stock enforcement. |

## Design References

- Existing homepage product-card and premium editorial styling.
- `docs/product/CLIENT-BRIEF.md`
- `docs/product/REFERENCE-ANALYSIS.md`

## Architecture References

Approved initial architecture: `docs/architecture/DATA-MODEL.md`, `docs/architecture/INTEGRATIONS.md`, and ADR-002 for product/media representation.

## Implementation Plan

Implemented under the user's explicit F003-only authorization on 2026-09-05, following the approved Stage 3 plan in `IMPLEMENTATION.md`.

## Implementation Status

Current state: FEATURE_COMPLETE
Summary: F003 adds stable persisted-catalogue product and ceiling detail pages. Direct categories render exact supplied facts, price, an accessible local quantity control, F004-deferred Cart/Buy Now presentation, and sofa-customization consultation. Ceilings render only their exact indicative range, supplied suitability, and consultation CTA. The approved 2026-09-06 demo revision renders deterministically mapped client-supplied ceiling/mattress galleries while unmapped products retain the replacement-ready pending-media fallback.

## Implementation Summary

F003 adds dynamic `/products/[slug]` pages that read one published authoritative
catalogue record through the existing server-only Drizzle repository. Direct
products render only supplied name/category/configuration/size/price, local
positive quantity control, Cart/Buy Now presentation without F004 persistence,
and the sofa customization consultation link. Ceilings render only their
authoritative range, supplied suitability, and consultation CTA. The shared
premium pending-media layout contains no image/video mapping and is designed for
later `product_media` replacement without a layout redesign.

### Post-completion client-media revision — 2026-09-06

`components/product-media-gallery.tsx` now uses the shared deterministic local
resolver for approved ceiling/mattress files. Galleries use a strong primary
image, touch-sized horizontal thumbnail navigation, focus states, subtle
reduced-motion-aware transitions, and retain the existing fallback for every
unmapped product. The resolver adds no database media row and maps no generic
video. It is a temporary local demo source that F009 can replace with
Supabase-Storage metadata without changing the gallery component.
The client explicitly approved the sole `Bonnell Spring Mattress` → `Bonnel
Spring` filename alias on 2026-09-06; it maps main, second, layers, close, then
the shared guide. No other spelling or fuzzy alias is permitted.

The approved sofa/bed media update reuses this gallery for clearly identified
folders. Sofa galleries retain every supplied ordered image; bed galleries use
up to four ordered bed images and append the shared mattress guide exactly once
as the final fifth item. Unmapped folder names retain the fallback.

On 2026-09-06 the client approved eight additional explicit sofa/bed folder
aliases. They are recorded in `CATALOGUE.md` and implemented as fixed manifest
entries only, not fuzzy matching.

## Files Changed

| File | Purpose |
| ---- | ------- |
| `app/products/[slug]/page.tsx` | Dynamic stable-slug route, metadata, published-only lookup, and safe not-found handling. |
| `components/product-detail-page.tsx` | Premium responsive detail view, animation/reduced-motion treatment, category-safe controls, and pending-media fallback. |
| `components/product-media-gallery.tsx` | Responsive mapped-image gallery and shared polished fallback. |
| `lib/catalogue/media.ts` | Safe filename-normalized local demo mapping for the supplied ceiling and mattress media. |
| `components/catalogue-page.tsx` | Stable product-detail links from each authoritative listing card. |
| `lib/catalogue/repository.ts`, `lib/catalogue/presentation.ts` | Published single-product lookup and shared authoritative INR/range presentation. |
| `app/globals.css` | Detail media, facts, quantity, CTA, and feedback styles within the existing visual system. |
| `tests/product-detail.test.mjs` | Stable-route, publication boundary, CTA matrix, no-invented-media, and accessibility regression checks. |

## Developer Validation

| Check | Result | Evidence / Notes |
| ----- | ------ | ---------------- |
| Automated tests | PASS | `npm test`: 12 tests passed, including F003 stable-route, category CTA, media fallback, and reduced-motion regression checks. |
| TypeScript | PASS | `npm run typecheck` completed without errors. |
| ESLint | PASS | `npm run lint` completed without errors. |
| Production build | PASS | `npm run build` compiled the dynamic `/products/[slug]` route successfully. |
| Browser review | PASS | Desktop review covered L-Shape Sofa quantity, local action feedback, custom-sofa consultation, exact bed/mattress price/facts, Glass Ceiling open-ended range/suitability/consultation-only behavior, and safe unknown-slug 404. Mobile 390px and tablet 768px checks confirmed touch-sized quantity/CTA controls, responsive pending-media layout, and no availability claims. |
| 2026-09-06 local-gallery revision | PARTIAL | Typecheck and the full 24-test suite pass, including ceiling slot order, mattress semantic order, safe spelling non-match, and partner-asset coverage. New desktop/tablet/mobile review remains pending because the local Next compiler did not complete a representative product route within 30 seconds; lint/build also retain the existing local stall. |

## User Review

Status: Accepted
Feedback: The user explicitly accepted F003 for independent acceptance testing on 2026-09-05.
Acceptance Date: 2026-09-05

## QA Testing

| Acceptance Criterion | Test | Result | Evidence |
| -------------------- | ---- | ------ | -------- |
| Published stable detail routes | Read-only non-production query and representative browser routes | PASS | The persisted catalogue contains 44 published products in the authoritative 16 sofa / 10 bed / 10 mattress / 8 ceiling split. L-Shape Sofa, Classic Model Headboard Bed, Ortho Mattress, and Glass Ceiling each resolved at their stable `/products/[slug]` route. |
| Missing/unpublished safety | Browser unknown-slug route; published-only repository review | PASS | Unknown slug rendered the safe Next.js 404 page. The server-only repository requires both matching slug and `PUBLISHED` publication state, so unpublished records are not publicly resolved. |
| Authoritative direct-product detail | Desktop browser, source/data review | PASS | Sofa, bed, and mattress details rendered exact sampled authoritative price/configuration/size values: ₹63,500 and 3-seater + lounger for L-Shape Sofa; ₹49,600 and King size for Classic Model Headboard Bed; ₹12,699 and 72 × 75 × 6 in for Ortho Mattress. |
| Quantity and direct CTA presentation | Desktop and mobile browser | PASS | Direct categories expose labelled positive quantity controls with a minimum of one, local feedback for Cart/Buy Now presentation, and no persisted cart mutation before F004. Sofa customization routes to the confirmed consultation phone destination. |
| Ceiling enquiry-only behavior | Desktop and tablet browser | PASS | Glass Ceiling rendered its exact ₹300 – ₹700+ / sq. ft. range and supplied suitability with Request consultation only; no quantity, Add to Cart, Buy Now, or final price calculation appeared. |
| No invented data or media | Read-only database query, browser, and regression tests | PASS | All availability values remain unset; `product_media` remains empty; pending-media fallback is shown without image/video mapping. Unsupported attributes, stock, discounts, and delivery/warranty claims are absent. |
| Responsive, accessibility, and motion | Desktop 1440px, mobile 390px, tablet 768px browser; source review | PASS | Detail hierarchy, touch-sized CTAs, labelled quantity buttons, focus styles, and pending-media presentation remain responsive. `useReducedMotion` plus the global `prefers-reduced-motion` safeguard preserve reduced-motion behavior. Browser automation's synthetic Space/Enter did not invoke a click, but the controls are native labelled buttons with their working click path and no custom keyboard suppression. |
| Regression and build | Automated commands | PASS | `npm test` passed 12/12, `npm run typecheck`, `npm run lint`, and `npm run build` all passed. |

## AI Evals, When Applicable

Not applicable. This feature does not include AI behavior.

## Known Limitations

- Product media mapping, additional product media, and initial availability are PENDING CLIENT INPUT but explicitly non-blocking.
- Product descriptions and richer specifications are unavailable for most catalogue entries.
- Related products are P1/optional.

## Change History

| Date | Change | Reason | Approved By |
| ---- | ------ | ------ | ----------- |
| 2026-09-05 | Initial approved specification created with revised pricing, media, availability, and ceiling rules. | Group A approval. | User |
| 2026-09-05 | Implemented F003 stable product and ceiling details. | User explicitly authorized F003 only; reused F002 persisted catalogue and retained F004/F008 behavior as deferred. | Codex / Software Engineer |
| 2026-09-05 | Independent F003 acceptance testing completed. | User accepted the implementation for QA; persisted data, category-safe detail behavior, responsive/accessibility checks, and regression validation passed. | Codex / QA Engineer |
| 2026-09-06 | Approved client-media presentation revision implemented. | Added deterministic local galleries for supplied ceiling/mattress files without changing product facts or commerce behavior. | Codex / Software Engineer |
| 2026-09-06 | Bonnell/Bonnel media alias approved. | Adds one explicit filename alias only; no generalized fuzzy matching. | User |
