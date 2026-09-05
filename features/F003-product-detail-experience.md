# Feature: F003 — Product Detail Experience

## Metadata

Feature ID: F003
Phase: PHASE-001
Priority: P0
Status: APPROVED
Owner Role: PRODUCT_LEAD
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

Proposed in `IMPLEMENTATION.md`, awaiting explicit approval. Application implementation is not yet authorized.

## Implementation Status

Current state: NOT STARTED
Summary: Approved product specification only; no application code changed.

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

- Product media mapping, additional product media, and initial availability are PENDING CLIENT INPUT but explicitly non-blocking.
- Product descriptions and richer specifications are unavailable for most catalogue entries.
- Related products are P1/optional.

## Change History

| Date | Change | Reason | Approved By |
| ---- | ------ | ------ | ----------- |
| 2026-09-05 | Initial approved specification created with revised pricing, media, availability, and ceiling rules. | Group A approval. | User |
