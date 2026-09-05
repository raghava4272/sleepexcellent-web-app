# Feature: F001 — Homepage and Global Navigation

## Metadata

Feature ID: F001
Phase: PHASE-001
Priority: P0
Status: APPROVED
Owner Role: PRODUCT_LEAD
Approval Date: 2026-09-05

## User Goal

As a visitor, I can understand the SleepExcellent offering and move easily to a product category, search, account, cart, or contact action from any supported device without losing the existing premium brand experience.

## Approved Requirements

1. Preserve the existing homepage as the client-approved visual baseline, including its visual identity, typography, premium editorial direction, category presentation, video-led presentation, spacing, and overall styling language.
2. Preserve the working homepage images and videos already present in the demo. Do not replace them without a clear reason and approval.
3. Missing future catalogue media must not block homepage or navigation completion.
4. Retain the four-category presentation: Mattresses, Sofas, Beds, and Ceiling Solutions.
5. Retain the current mattress hero video and the sofa and bed collection videos, with their existing local fallback media and reduced-motion behavior.
6. Use catalogue-authoritative model names in navigation and collection menus where current mock data conflicts with the catalogue.
7. Make category, shop, search, account, cart, and contact controls lead to a real destination or working interface. Do not expose silent or dead placeholder controls.
8. Ceiling navigation leads to the ceiling catalogue and quote/consultation journey, not the normal direct-purchase cart flow.
9. Populate product-related homepage content only from authoritative catalogue records. Do not use conflicting mock names or prices.
10. Use the confirmed telephone and email values throughout the homepage.
11. Unverified testimonials, service claims, social destinations, and legal destinations must not be presented as confirmed facts or working links.
12. Preserve responsive behavior and polish overflow, alignment, keyboard access, touch behavior, focus handling, and responsive typography without redesigning the homepage.

Traceability: explicitly approved by the user on 2026-09-05 as “A1 — Homepage and Global Navigation APPROVED as proposed,” with the additional media-preservation rule.

## Acceptance Criteria

1. The completed homepage remains recognizably the same premium visual experience already shown to the client.
2. Existing working homepage/category images and videos remain in place unless a separately approved change authorizes replacement.
3. Missing catalogue product media does not prevent the homepage or global navigation from reaching a demonstrable completed state.
4. Header navigation works with mouse, keyboard, and touch at desktop and mobile widths.
5. Desktop collection menus expose catalogue-authoritative model names for the four categories.
6. Mobile navigation exposes all four categories plus shop, search, account, cart, and contact access.
7. Every visible primary navigation action and CTA has a working destination or interface; no visible action silently points to `#`.
8. Ceiling navigation reaches the ceiling catalogue/quote journey and does not imply direct cart purchase.
9. The homepage does not display a product name or price that conflicts with the authoritative catalogue.
10. Hero and collection media use local project files, preserve fallbacks, and respect reduced-motion preferences.
11. Telephone links use `tel:+919849256799` and `tel:+919044257999`; email links use `mailto:sleepexcellent999@gmail.com`.
12. Unverified testimonials, claims, social URLs, privacy policy, and terms are hidden, clearly unavailable, or replaced only with approved content.
13. Navigation drawers/modals manage keyboard focus appropriately and provide accessible names, close controls, and Escape behavior.
14. The homepage has no unintended horizontal overflow and remains readable and operable at mobile, tablet, laptop, and desktop widths.

## Out of Scope

- Full homepage redesign
- Wishlist
- Product comparison
- Store finder
- Loyalty or referral programs
- Promotional offer engine
- Blog or editorial CMS
- Admin editing of homepage content
- Replacing working homepage media without separate approval

## Dependencies

- `docs/product/CATALOGUE.md`
- F002 Catalogue Browsing and Search
- F003 Product Detail Experience
- Future approved account and cart features for their header destinations
- Client-provided social, testimonial, trust-claim, and legal content if those areas are displayed

## User Decisions

| Date | Decision | Approval Evidence | Effect |
| ---- | -------- | ----------------- | ------ |
| 2026-09-05 | Approve A1 as proposed. | User explicitly stated “A1 — Homepage and Global Navigation APPROVED as proposed.” | Registered F001 as an approved P0 feature. |
| 2026-09-05 | Preserve existing working homepage media; missing future media is non-blocking. | User supplied the additional media rule in the approval. | Existing homepage media is protected, and catalogue-media gaps cannot block F001. |

## Design References

- Existing homepage implementation is the visual baseline.
- `docs/product/CLIENT-BRIEF.md`
- `docs/product/REFERENCE-ANALYSIS.md`
- Responsive and accessibility behavior is defined by the approved requirements and acceptance criteria above.

## Architecture References

Approved initial architecture: `docs/architecture/SYSTEM-ARCHITECTURE.md`, `docs/architecture/ROUTES.md`, and ADR-001.

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

- Authentic testimonials, approved trust claims, social URLs, and legal content remain PENDING CLIENT INPUT.
- Account, search, and cart destinations depend on later approved features.
- Missing future catalogue media is explicitly non-blocking.

## Change History

| Date | Change | Reason | Approved By |
| ---- | ------ | ------ | ----------- |
| 2026-09-05 | Initial approved specification created. | Group A approval. | User |
