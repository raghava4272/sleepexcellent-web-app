# Feature: F008 — Ceiling Catalogue and Consultation Request

## Metadata

Feature ID: F008
Phase: PHASE-001
Priority: P0
Status: APPROVED
Owner Role: PRODUCT_LEAD
Approval Date: 2026-09-05

## User Goal

As a customer, I can review authoritative ceiling options and indicative per-square-foot ranges, submit approximate project information as a guest, and receive confirmation that SleepExcellent will follow up with a personalized quotation.

## Approved Requirements

1. Ceiling solutions remain enquiry/quotation only through: Homepage / Catalogue / Ceiling Detail → Request Quote → Enquiry Form → Enquiry Stored → Confirmation → Staff Follow-up.
2. Ceiling solutions provide no Add to Cart, Buy Now, Razorpay, quantity controls, final payable amount, automatic quotation, installation-price calculation, or transport-price calculation.
3. Display only the catalogue-authoritative indicative range per square foot for each ceiling type.
4. Indicative ranges are informational. Even when an approximate area is submitted, do not calculate area × price into an estimated or final payable amount.
5. Required enquiry fields are customer name, phone number, project city/locality, and an authoritative ceiling type or “Need guidance.”
6. Optional fields are email, approximate area in square feet, and project details.
7. Entry from a specific ceiling detail preselects that ceiling type and allows the customer to change it.
8. Entry from a general consultation action defaults to “Need guidance.”
9. Approximate area is optional. If supplied, accept only positive numeric values, label it as approximate, preserve it in the enquiry snapshot, and do not convert it into a quotation or payable total.
10. A customer who does not know the approximate area can still submit the form.
11. Preserve the existing ceiling-interior homepage media and use authoritative mapped media where available.
12. Where ceiling-specific media is not authoritatively mapped, use the polished pending-media fallback and never assign unrelated images.
13. Missing ceiling media is PENDING CLIENT INPUT and does not block enquiry submission.
14. Later Supabase architecture persists each valid enquiry as a submission snapshot containing selected type/Need guidance, applicable indicative catalogue range, customer name, phone, optional email, optional approximate area, locality, project details, submission timestamp, and enquiry status.
15. Detailed database schema is reserved for Technical Lead architecture planning.
16. The simple enquiry lifecycle is approximately `NEW` → `CONTACTED` → `CLOSED`; do not create a complex CRM workflow.
17. Protect against obvious accidental duplicates caused by double clicks, delayed-response retries, or repeated browser submission using a lightweight mechanism selected during architecture planning.
18. After success, display a non-sensitive public enquiry reference rather than a simple sequential internal database ID as the sole public reference.
19. Confirmation shows enquiry received, public reference, selected type/Need guidance, submitted locality, and that SleepExcellent will contact the customer.
20. Confirmation does not promise response time, installation date, final price, service availability, or transport cost without later client confirmation.
21. Keep approved SleepExcellent phone and email options visible as alternative contact paths, including after a failed web enquiry.
22. Do not add WhatsApp until an approved WhatsApp destination exists.
23. Authentication is not required; the entire ceiling journey works for guests and remains disconnected from normal cart/order/payment flows.
24. Group E must later include a lightweight staff view supporting enquiry list, detail, contact information, ceiling type, approximate area, locality, and simple status update.
25. The form clearly states that submitted contact details will be used by SleepExcellent to respond. Final privacy/legal wording is PENDING CLIENT DECISION and no detailed policy may be invented.
26. Keep the feature lightweight so advanced enquiry functionality does not delay core commerce or admin work.

Traceability: explicitly approved by the user on 2026-09-05 as “Approve D1 — Ceiling Catalogue and Consultation Request,” with registration as F008 and the specified pricing, form, persistence, media, status, confirmation, and admin-dependency adjustments.

## Acceptance Criteria

1. All eight ceiling types, suitability statements, and indicative ranges exactly match `docs/product/CATALOGUE.md`.
2. Homepage, catalogue, and ceiling-detail Request Quote actions open the enquiry flow.
3. A detail-page entry preselects the exact originating type while permitting change; a general entry defaults to “Need guidance.”
4. A guest can submit without creating or signing into an account.
5. Customer name, phone, city/locality, and ceiling type/Need guidance are required and receive accessible validation.
6. Email, approximate area, and project details are optional and an unknown area never blocks submission.
7. If area is supplied, only a positive numeric value is accepted, clearly labelled approximate, and stored unchanged.
8. No area-based estimated price, final quotation, cart item, order, or payment action is created.
9. A valid form creates one persisted enquiry snapshot containing every approved field, the applicable catalogue range, timestamp, and initial status.
10. Double click or safe retry does not create obvious accidental duplicate enquiries for the same submission attempt.
11. Success displays a non-sensitive public enquiry reference, selected type/Need guidance, locality, receipt message, and follow-up indication.
12. The confirmation makes no unsupported promise about response time, service coverage, installation, transport, or final price.
13. Internal sequential database IDs are not exposed as the sole public enquiry reference.
14. Missing ceiling-specific media shows the approved fallback and never blocks submission.
15. Submission failure preserves entered values where safe and leaves working primary phone and email alternatives visible.
16. Phone/email alternatives use `tel:+919849256799`, `tel:+919044257999`, and `mailto:sleepexcellent999@gmail.com` as applicable.
17. The consent notice states only the approved contact-use purpose until final privacy wording is provided.
18. Form, errors, success state, and direct-contact actions are responsive, keyboard accessible, labelled, focus-aware, and touch friendly.
19. The future staff workflow can list/view enquiries and transition their status among `NEW`, `CONTACTED`, and `CLOSED` without CRM functionality.

## Out of Scope

- Add to Cart, Buy Now, quantity, checkout, Razorpay, or order creation
- Area-based estimate or final quotation generation
- Installation or transport price calculation
- Authentication requirement or customer-account association
- Appointment scheduling
- File or room-photo uploads
- WhatsApp integration without an approved destination
- CRM integration or complex lead workflow
- Automated email/SMS notifications for Sunday
- Service-coverage or response-time promises
- Detailed privacy policy creation

## Dependencies

- F001 Homepage and Global Navigation
- F002 Catalogue Browsing and Search
- F003 Product Detail Experience
- `docs/product/CATALOGUE.md`
- Future Supabase persistence and server-validation architecture
- Future lightweight admin enquiry surface in Group E
- Lightweight duplicate-protection and public-reference architecture
- Ceiling-specific media: PENDING CLIENT INPUT, non-blocking
- Final service locations: PENDING CLIENT INPUT, non-blocking
- Response-time expectations: PENDING CLIENT INPUT, non-blocking
- Installation charges: PENDING CLIENT DECISION
- Transport charges: PENDING CLIENT DECISION
- Final contact-consent/privacy wording: PENDING CLIENT DECISION

## User Decisions

| Date | Decision | Approval Evidence | Effect |
| ---- | -------- | ----------------- | ------ |
| 2026-09-05 | Approve D1 as F008 with P0 priority. | User explicitly approved D1 and assigned F008. | Registers the lightweight Sunday ceiling-enquiry journey. |
| 2026-09-05 | Keep ceilings entirely outside commerce. | Explicit purchase-model rule. | No cart, order, payment, quantity, or payable-total behavior is permitted. |
| 2026-09-05 | Show only authoritative per-square-foot ranges without area multiplication. | Explicit price-presentation rule. | Submitted area informs staff follow-up but never generates a quote. |
| 2026-09-05 | Use the approved required/optional form fields and guest access. | Explicit form and authentication rules. | Unknown area and missing account never block submission. |
| 2026-09-05 | Persist immutable enquiry snapshots with a simple status lifecycle. | Explicit persistence/status rules. | Supabase schema details remain reserved for architecture. |
| 2026-09-05 | Require lightweight duplicate protection and a non-sequential public reference. | Explicit integrity/reference rules. | Technical mechanism remains deferred. |
| 2026-09-05 | Preserve existing media and use fallback for missing mappings. | Explicit media rules. | Missing ceiling images remain non-blocking and cannot be fabricated. |
| 2026-09-05 | Include a basic staff enquiry view in Group E. | Explicit admin dependency. | Enquiry follow-up is visible without expanding into CRM scope. |

## Design References

- Existing homepage Ceiling Collection and Consultation Banner.
- Existing approved ceiling-interior photograph.
- `docs/product/CLIENT-BRIEF.md`
- `docs/product/CATALOGUE.md`
- `docs/product/REFERENCE-ANALYSIS.md`

## Architecture References

Approved initial architecture: `docs/architecture/DATA-MODEL.md`, `docs/architecture/ROUTES.md`, and ADR-003 define enquiry snapshots, idempotency, and public references.

## Implementation Plan

Proposed in `IMPLEMENTATION.md`, awaiting explicit approval. Application implementation is not yet authorized.

## Implementation Status

Current state: NOT STARTED
Summary: Approved product specification only; no enquiry form, persistence, or Supabase configuration changed.

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

- Ceiling-specific media, service locations, and response-time expectations remain PENDING CLIENT INPUT but non-blocking.
- Installation charges, transport charges, and final privacy/contact-consent wording remain PENDING CLIENT DECISION.
- Sunday excludes automated notifications, uploads, appointment scheduling, and CRM functionality.
- Detailed persistence, idempotency, and public-reference mechanisms await Technical Lead architecture planning.

## Change History

| Date | Change | Reason | Approved By |
| ---- | ------ | ------ | ----------- |
| 2026-09-05 | Initial approved specification created with enquiry-only pricing, lightweight form/persistence, guest access, and admin follow-up rules. | Group D approval. | User |
