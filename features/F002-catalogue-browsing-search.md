# Feature: F002 — Catalogue Browsing and Search

## Metadata

Feature ID: F002
Phase: PHASE-001
Priority: P0
Status: APPROVED
Owner Role: PRODUCT_LEAD
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

Not applicable. Search is deterministic product/model-name matching and does not include AI behavior.

## Known Limitations

- Product media mapping and initial availability are PENDING CLIENT INPUT but explicitly non-blocking.
- Product descriptions, detailed attributes, and variant data are not supplied.
- Price-range filtering is P1.

## Change History

| Date | Change | Reason | Approved By |
| ---- | ------ | ------ | ----------- |
| 2026-09-05 | Initial approved specification created with revised media, availability, and filter scope. | Group A approval. | User |
