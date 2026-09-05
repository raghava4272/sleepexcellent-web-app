# Feature: F011 — MVP Experience Quality and Release Acceptance

## Metadata

Feature ID: F011
Phase: PHASE-001
Priority: P0
Status: APPROVED
Owner Role: PRODUCT_LEAD
Approval Date: 2026-09-05

## User Goal

As a shopper or authorized administrator, I can use every included Sunday MVP journey reliably, accessibly, securely, and responsively in a clearly identified development/demonstration preview.

## Approved Requirements

1. Sunday release acceptance respects feature priority and does not promote P1 functionality into a P0 blocker.
2. Every implemented P0 feature must satisfy its approved acceptance criteria.
3. P1 features are validated only when included in the Sunday build. F007 remains P1 and full account functionality does not block preview acceptance if it was not selected for implementation.
4. Any implemented portion of F007 must still enforce its approved security boundaries.
5. Mandatory public commerce journey: Homepage → Category → Listing/Search → Product Detail → Add to Cart or Buy Now → Checkout → Razorpay Test Payment → Verified Confirmation.
6. Mandatory ceiling journey: Catalogue → Detail → Request Quote → Enquiry Form → Submission → Confirmation.
7. Mandatory admin journeys cover catalogue create/edit, publication, primary image, availability, order list/detail/status, and ceiling-enquiry list/detail/status.
8. Mandatory journeys contain no dead controls, placeholder actions, or misleading success states.
9. Unfinished P1 work is tracked explicitly and never silently marked complete.
10. P1 work that cannot block Sunday includes full account polish, password-reset completion, product galleries/video management, price-range filtering, related products, webhook reconciliation, advanced admin responsive polish/media optimization, and production email configuration.
11. Validate representative mobile, tablet, laptop, and desktop widths for practical usability without requiring pixel-perfect behavior at every viewport.
12. Responsive review covers overflow, clipping, navigation, drawers, dialogs, forms, product grids, checkout, tables, admin layouts, typography, images, videos, and sticky/fixed elements.
13. The practical accessibility baseline covers semantic structure, labelled forms, meaningful control names, keyboard operation of critical journeys, visible focus, accessible validation, reasonable contrast, reduced motion, focus-managed dialogs/drawers, and non-blocking media failure.
14. No public experience may contradict the authoritative catalogue or expose obsolete demo values, invented variants, availability, discounts, attributes, media mappings, or policy claims.
15. Catalogue-authoritative data and authorized admin edits are the current source of truth; historical orders retain immutable snapshots.
16. Preserve existing approved homepage media unless an approved reason authorizes replacement. Known media is used, missing media uses the polished fallback, and admin-assigned media becomes authoritative.
17. Sunday security validation covers server-authoritative product prices/order totals, server-controlled paid state, server-side Razorpay signature verification, server-only secrets, publication filtering, customer/admin isolation, server-controlled admin authorization, enquiry-only ceilings, and immutable snapshots.
18. These security boundaries are MVP correctness requirements, not cosmetic production hardening.
19. Razorpay uses test mode only, isolated from future live credentials, and the preview does not imply production payment readiness. Webhook reconciliation remains P1/follow-up.
20. Critical journeys provide intentional loading, empty, validation, persistence, authorization, payment-cancel/failure, missing-media, no-results, and unavailable-record states without raw framework errors or silent normal-path failures.
21. Preview acceptance requires passing TypeScript/typecheck, ESLint, focused automated tests, and production build.
22. Focused tests cover applicable high-risk boundaries without pursuing arbitrary coverage percentages.
23. Use Playwright/manual browser inspection for critical end-to-end journeys and record representative desktop, tablet, and mobile verification.
24. Practical performance requires no obviously excessive blocking, reasonable image loading, working video fallbacks, avoidance of clearly preventable large client bundles, and no severe runtime console errors in critical journeys.
25. Optional optimization cannot delay core correctness.
26. TECH_LEAD must resolve the current Node.js `20.12.2` versus required `>=22.13.0` mismatch before relying on final dependency installation/regeneration, typecheck, lint, tests, or build and must later document the supported version.
27. Sunday acceptance requires a working Vercel preview after approved migration, clearly labelled development/demonstration rather than production-ready.
28. Live Razorpay, final domain, GST/tax, shipping provider, refunds/cancellations, legal policies, advanced monitoring, production email, final media, and additional production hardening remain follow-up work where applicable.
29. During later implementation/validation, materially affected project documentation stays synchronized with actual code without generating unnecessary documents; code remains the implementation source of truth.
30. The existing SleepExcellent homepage is the primary visual baseline for every new client-facing surface; approved specifications define behavior, `REFERENCE-ANALYSIS.md` supplies UX patterns, and reference websites remain inspiration only.
31. Client-facing work maintains a coherent premium design system across typography, colour, spacing, content width, section rhythm, buttons, cards, forms, shadows, icons, motion, and responsive behavior rather than assembling unrelated templates.
32. Important interactions include intentional applicable default, hover, focus, pressed, disabled, loading, success, and error states, and major journeys avoid raw framework-looking loading/empty/error experiences.
33. Every client-facing developer-validation pass includes an explicit visual/interaction review; obvious UI regressions block transition to `AWAITING_FEATURE_REVIEW` even when technical checks pass.
34. Reference-site branding, wording, product names, media, icons, proprietary content, exact layouts, and exact styling are never copied.

Traceability: explicitly approved by the user on 2026-09-05 as “Approve F1 — MVP Experience Quality and Release Acceptance,” with registration as F011 and the specified priority, journey, quality, security, validation, Node, Vercel, and documentation adjustments.

## Acceptance Criteria

1. Every implemented P0 feature passes its approved acceptance criteria; unimplemented P1 scope is not treated as a Sunday failure.
2. Any included P1 behavior is accurately marked and enforces all applicable privacy/security boundaries.
3. Each mandatory public, ceiling, and admin journey completes without dead controls, placeholder actions, or false success.
4. Public product identities, specifications, prices, ranges, publication, availability, and media agree with authoritative records.
5. Historical order display remains unchanged after catalogue edits.
6. Normal cart and Buy Now remain isolated; browser values cannot control price, total, or paid state.
7. Razorpay test payment becomes paid only after server verification and no secret reaches the browser.
8. Unpublished products are excluded publicly; customers cannot access another customer's data; normal customers cannot access admin data/mutations.
9. Ceiling enquiries never create payable commerce transactions.
10. Every expected loading/empty/error/cancellation/missing/unavailable state provides clear, recoverable behavior.
11. Representative mobile, tablet, laptop, and desktop checks find no material overflow, clipping, inaccessible control, unusable layout, or journey-blocking media crop/failure.
12. Critical journeys are keyboard operable with labelled controls, visible focus, accessible validation, focus-managed overlays, reasonable contrast, and reduced-motion support.
13. Missing media uses the approved fallback without unrelated substitution, and existing approved homepage media remains intact unless separately authorized.
14. TypeScript/typecheck, ESLint, focused automated tests, and production build all pass using supported Node.js `>=22.13.0`.
15. Focused tests exercise applicable price authority, cart/Buy Now separation, ceiling exclusion, publication filtering, immutable snapshots, Razorpay verification, customer/admin authorization, and enquiry-only behavior.
16. Playwright/manual verification records successful critical journeys at representative desktop, tablet, and mobile widths.
17. Critical journeys have no severe runtime console error, clearly avoid preventable page-blocking/client-bundle excess, and retain working image/video fallbacks.
18. A working Vercel preview is clearly identified as development/demonstration and does not claim production readiness.
19. Implemented behavior and material project documentation agree, while incomplete P1 and production follow-up work remains explicitly recorded.
20. Client-facing journeys remain visually consistent with SleepExcellent, use relevant approved reference-analysis patterns, feel premium at representative mobile/tablet/laptop/desktop widths, and do not appear copied from Sleepwell or Wakefit.
21. Visual review finds no obvious regression in spacing, typography, hierarchy, CTA visibility, interaction feedback, missing-media presentation, touch usability, or accessibility basics.

## Out of Scope

- Promoting unimplemented P1 work into Sunday P0
- Formal accessibility certification
- Pixel-perfect testing at every possible viewport
- Arbitrary test-coverage percentage targets
- Advanced performance infrastructure or optimization
- Advanced reporting, monitoring, or incident automation
- Razorpay live mode or production webhook completion
- Final domain, GST/tax, shipping-provider, refund/cancellation, or legal-policy completion
- Final product media set or production email configuration
- Production deployment approval

## Dependencies

- Approved feature specifications F001–F010
- `docs/product/CATALOGUE.md`
- Technical Lead architecture approval and later implementation plan
- Supported Node.js `>=22.13.0` environment
- Supabase project/configuration, Razorpay test credentials, and Vercel access for implementation/preview
- All recorded PENDING CLIENT INPUT/DECISION items, non-blocking where already approved

## User Decisions

| Date | Decision | Approval Evidence | Effect |
| ---- | -------- | ----------------- | ------ |
| 2026-09-05 | Approve Group F as F011 with P0 priority. | User explicitly approved F1 and assigned F011. | Registers the final cross-cutting release feature. |
| 2026-09-05 | Make release acceptance priority-aware. | Explicit priority-boundary adjustment. | Unimplemented F007/P1 scope cannot block Sunday, but included slices remain secure. |
| 2026-09-05 | Require the specified public, ceiling, and admin P0 journeys. | Explicit mandatory-journey list. | Sunday acceptance is tied to complete client-visible outcomes. |
| 2026-09-05 | Treat core authorization/payment/data boundaries as MVP correctness. | Explicit security-boundary approval. | These checks cannot be deferred as cosmetic hardening. |
| 2026-09-05 | Require focused automation plus browser validation. | Explicit validation approval. | Type, lint, high-risk tests, build, and representative browser evidence gate preview acceptance. |
| 2026-09-05 | Require Node `>=22.13.0` and a demonstration-only Vercel preview. | Explicit environment/release adjustment. | Runtime mismatch must be resolved before final checks, and preview cannot imply production readiness. |
| 2026-09-05 | Close Product Lead discovery after F001–F011 audit and authorize Tech Lead handoff. | Explicit workflow authorization. | Discovery advances to architecture planning without implementation permission. |
| 2026-09-05 | Make premium UI/UX and reference-analysis use explicit cross-cutting release guidance. | Documentation clarification. | Every relevant client-facing developer-validation pass now includes a blocking visual/interaction review without changing feature scope or priority. |

## Design References

Design authority, in order:

1. Existing approved SleepExcellent homepage and media.
2. Approved feature specifications F001–F010.
3. `docs/product/REFERENCE-ANALYSIS.md` for approved ecommerce UX patterns.
4. Reference websites for inspiration only.

`docs/product/CLIENT-BRIEF.md` remains supporting project truth. A feature specification overrides the reference analysis if they conflict.

## Architecture References

Approved initial architecture: `docs/architecture/SYSTEM-ARCHITECTURE.md`, `docs/architecture/DATA-MODEL.md`, `docs/architecture/ROUTES.md`, `docs/architecture/INTEGRATIONS.md`, and `docs/architecture/ARCHITECTURE-REVIEW.md`.

## Implementation Plan

Proposed in `IMPLEMENTATION.md`, awaiting explicit approval. Application implementation is not yet authorized.

## Implementation Status

Current state: NOT STARTED
Summary: Approved cross-cutting specification only; no application, platform, database, integration, test, or deployment implementation changed.

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

Not applicable. The approved project contains no AI product behavior.

## Known Limitations

- F007 and the explicitly listed optional capabilities remain P1 and are not Sunday blockers unless selected for implementation.
- The audited local Node version does not yet satisfy the repository requirement.
- Platform credentials/access and client inputs remain unavailable but are non-blocking for architecture planning.
- Sunday preview is a test/demo release and does not establish production readiness.

## Change History

| Date | Change | Reason | Approved By |
| ---- | ------ | ------ | ----------- |
| 2026-09-05 | Initial approved specification created with priority-aware release gates, P0 journeys, accessibility, security, automated/browser validation, and preview boundaries. | Group F approval. | User |
| 2026-09-05 | Added the premium design-system, interaction-state, reference-analysis, and blocking visual-review guidance. | Documentation clarification; no feature, architecture, priority, or workflow change. | User |
