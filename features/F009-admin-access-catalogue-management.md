# Feature: F009 — Admin Access and Catalogue Management

## Metadata

Feature ID: F009
Phase: PHASE-001
Priority: P0
Status: APPROVED
Owner Role: PRODUCT_LEAD
Approval Date: 2026-09-05

## User Goal

As an authorized SleepExcellent administrator, I can securely prepare, publish, and maintain authoritative catalogue records, primary product media, and simple availability without exposing incomplete products or altering historical orders.

## Approved Requirements

1. There is no public admin signup.
2. Normal customer authentication never grants administrative access.
3. Admin authorization is determined by a server-controlled, server-verified source and does not rely on browser local state, query parameters, client-controlled claims, editable customer-profile fields, or user-editable metadata.
4. The exact authorization mechanism is reserved for Technical Lead architecture planning. Supabase Auth may provide identity, but admin authorization remains independently controlled and server verified.
5. Initial authorized administrator identity is PENDING CLIENT INPUT and does not block implementation of the authorization mechanism.
6. Product publication is separate from availability and supports `PUBLISHED` and `UNPUBLISHED`.
7. New products default to `UNPUBLISHED`; only explicitly published products appear in normal public storefront/catalogue reads.
8. Incomplete draft products must not be exposed publicly.
9. Availability supports `UNSET`, `IN STOCK`, and `OUT OF STOCK`; it is not inferred from publication state.
10. Availability remains `UNSET` until the client or an authorized administrator supplies an authoritative value. `UNSET` does not block purchase under the approved MVP rules.
11. `UNPUBLISHED` must never be interpreted as `OUT OF STOCK`.
12. Sofa, bed, and mattress editing supports name, category, supplied configuration/specification, supplied size where applicable, fixed catalogue price, publication state, optional explicit availability, and primary image.
13. Ceiling editing supports ceiling type/name, supplied suitability information, indicative minimum and maximum price per square foot, publication state, and primary image.
14. Ceilings remain enquiry-only. Admin editing can never enable Add to Cart, Buy Now, checkout, or Razorpay for a ceiling product.
15. Product creation is supported, defaults to `UNPUBLISHED`, stores only explicitly supplied values, uses server-side validation, and enforces category-specific pricing rules.
16. Do not create complex product variants or invent missing attributes for Sunday.
17. Catalogue edits affect future public reads and purchases but never modify immutable historical order-item snapshots.
18. Changing product name, price, configuration, media, publication, or availability never rewrites pending or completed order snapshots.
19. Hard deletion is out of scope. Use `UNPUBLISHED` when a product should no longer appear publicly.
20. Sunday P0 media management supports primary image upload, preview, assignment, replacement, removal, and graceful fallback.
21. Ordered gallery images and optional product video are P1 and cannot delay the Sunday MVP.
22. Future media uses Supabase Storage, while database records store media paths/references and metadata rather than binary files.
23. An authorized administrator's explicit media assignment establishes the authoritative product-media mapping.
24. Until media is authoritatively assigned, use the approved polished fallback and never reuse unrelated product images; missing media remains non-blocking.
25. Admin forms require server-side validation and clear loading, success, validation-error, authorization-error, and persistence-error states.
26. Admin UI is optimized primarily for desktop and tablet while retaining a safe usable mobile layout without excessive Sunday mobile polish.
27. If time is constrained, F009 delivery order is secure admin access, catalogue list, catalogue edit, publication control, product creation, primary-image management, then simple availability.

Traceability: explicitly approved by the user on 2026-09-05 as “E1 — Admin Access and Catalogue Management APPROVED as F009,” with the specified authorization, publication, availability, catalogue, media, history, and priority adjustments.

## Acceptance Criteria

1. No public route or interface permits admin registration.
2. Anonymous visitors and ordinary authenticated customers cannot read admin data, enter admin screens, or perform admin mutations.
3. Direct requests to protected catalogue/media endpoints receive server-side authorization independent of client-controlled state or metadata.
4. The authorization mechanism can be configured with an administrator later without requiring the identity to be known during architecture/implementation.
5. A newly created product remains absent from public catalogue reads until an authorized administrator explicitly publishes it.
6. Unpublishing removes a product from new public catalogue/storefront reads without deleting its record or breaking historical references.
7. Publication and availability are displayed and mutated independently in admin.
8. `UNSET` availability produces no invented public availability label or purchase restriction, while an explicit authoritative value may drive the approved storefront behavior.
9. Admin can list and edit every approved category-specific field with server-side validation.
10. Fixed-price products require valid fixed prices, while ceiling records require valid indicative minimum/maximum per-square-foot ranges.
11. A ceiling remains enquiry-only regardless of edits and cannot be placed in cart or checkout.
12. Product creation stores no unspecified invented attribute and defaults to `UNPUBLISHED` and availability `UNSET`.
13. Editing any catalogue/media/publication/availability field does not change existing immutable order snapshots.
14. No hard-delete operation is available for Sunday.
15. Authorized admin can upload, preview, assign, replace, and remove a primary image; removal returns the product to the approved fallback.
16. Media is represented by Supabase Storage references/metadata rather than database binary fields.
17. A media assignment affects only its explicitly selected product and never creates a guessed or unrelated mapping.
18. Incomplete P1 gallery/video support does not block primary-image P0 acceptance.
19. Loading, success, validation, authorization, and persistence failures are clearly communicated without losing safe recoverable input.
20. Admin catalogue and media operations are keyboard accessible and practical on desktop/tablet with a non-broken mobile layout.

## Out of Scope

- Public admin signup
- Multiple admin/staff roles or granular permissions
- Hard product deletion
- Complex product variants
- Bulk import, bulk edit, or bulk media operations
- Advanced inventory quantities, reservations, or warehouse management
- Promotions, discounts, or coupon management
- Homepage content management
- Media editing/transcoding
- Ordered gallery images and product video for P0
- Full audit-log or analytics dashboard

## Dependencies

- F002 Catalogue Browsing and Search
- F003 Product Detail Experience
- F005 Checkout, Address and Order Creation
- F007 customer identity direction, with distinct admin authorization
- Future Supabase Auth, database, Storage, RLS, and server-authorization architecture
- Initial authorized administrator account/email: PENDING CLIENT INPUT, non-blocking
- Authoritative availability: PENDING CLIENT INPUT, non-blocking
- Product media mappings and additional media: PENDING CLIENT INPUT, non-blocking

## User Decisions

| Date | Decision | Approval Evidence | Effect |
| ---- | -------- | ----------------- | ------ |
| 2026-09-05 | Approve E1 as F009 with P0 priority. | User explicitly approved E1 and assigned F009. | Registers the Sunday admin-access/catalogue feature. |
| 2026-09-05 | Require independently server-controlled admin authorization. | Explicit authorization adjustment. | Customer auth and client-controlled state can never grant admin access. |
| 2026-09-05 | Separate publication from availability. | Explicit state-model adjustment. | Draft visibility and stock meaning cannot be conflated. |
| 2026-09-05 | Default new products to unpublished and availability unset. | Explicit defaults. | Incomplete products stay private and availability is never invented. |
| 2026-09-05 | Preserve category-specific pricing and enquiry-only ceilings. | Explicit catalogue rules. | Admin edits cannot make a ceiling directly purchasable. |
| 2026-09-05 | Exclude hard deletion and protect order snapshots. | Explicit history/deletion rules. | Catalogue maintenance cannot rewrite or orphan historical orders. |
| 2026-09-05 | Prioritize primary-image management; galleries/video are P1. | Explicit media priority. | Missing advanced media cannot delay Sunday. |

## Design References

- Existing SleepExcellent typography, colour, form, and responsive visual language.
- `docs/product/CLIENT-BRIEF.md`
- `docs/product/CATALOGUE.md`

## Architecture References

Approved initial architecture: `docs/architecture/SYSTEM-ARCHITECTURE.md`, `docs/architecture/DATA-MODEL.md`, `docs/architecture/INTEGRATIONS.md`, ADR-002, and ADR-004.

## Implementation Plan

Proposed in `IMPLEMENTATION.md`, awaiting explicit approval. Application implementation is not yet authorized.

## Implementation Status

Current state: NOT STARTED
Summary: Approved product specification only; no admin UI, Supabase configuration, database table, or account was created.

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

- Initial administrator identity, authoritative availability, and product-media mappings remain PENDING CLIENT INPUT but non-blocking.
- Gallery images and optional product video are P1 within F009.
- Hard deletion, complex variants, advanced inventory, bulk tools, and analytics are excluded.
- Detailed authorization, state, persistence, and Storage mechanisms await Technical Lead architecture planning.

## Change History

| Date | Change | Reason | Approved By |
| ---- | ------ | ------ | ----------- |
| 2026-09-05 | Initial approved specification created with server-controlled access, publication/availability separation, category-safe catalogue management, and P0 primary media. | Group E approval. | User |
