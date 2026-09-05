# Phase: PHASE-001

## Phase Objective

Initial product discovery and feature definition.

## Status

Status: PLANNING
Start Date: 2026-09-05
Completion Date: Pending

## Approved Features

| Feature ID | Feature | Priority | Specification |
| ---------- | ------- | -------- | ------------- |
| F001 | Homepage and Global Navigation | P0 | [Specification](../features/F001-homepage-global-navigation.md) |
| F002 | Catalogue Browsing and Search | P0 | [Specification](../features/F002-catalogue-browsing-search.md) |
| F003 | Product Detail Experience | P0 | [Specification](../features/F003-product-detail-experience.md) |
| F004 | Shopping Cart | P0 | [Specification](../features/F004-shopping-cart.md) |
| F005 | Checkout, Address and Order Creation | P0 | [Specification](../features/F005-checkout-address-order-creation.md) |
| F006 | Razorpay Test Payment and Order Confirmation | P0 | [Specification](../features/F006-razorpay-test-payment-order-confirmation.md) |
| F007 | Customer Authentication, Account and Order History | P1 | [Specification](../features/F007-customer-authentication-account-order-history.md) |
| F008 | Ceiling Catalogue and Consultation Request | P0 | [Specification](../features/F008-ceiling-catalogue-consultation-request.md) |
| F009 | Admin Access and Catalogue Management | P0 | [Specification](../features/F009-admin-access-catalogue-management.md) |
| F010 | Admin Order and Ceiling Enquiry Operations | P0 | [Specification](../features/F010-admin-order-ceiling-enquiry-operations.md) |
| F011 | MVP Experience Quality and Release Acceptance | P0 | [Specification](../features/F011-mvp-experience-quality-release-acceptance.md) |

## Completed Features

| Feature ID | QA Evidence | Completion Date |
| ---------- | ----------- | --------------- |

## Active Feature

Feature ID: None
State: None

## Phase-Level Decisions

| Date | Decision | Reason | Reference |
| ---- | -------- | ------ | --------- |
| 2026-09-05 | Approved Group A storefront scope as F001–F003. | Establish the Sunday-critical homepage, catalogue, search, and product-detail journey while preserving the existing visual baseline. | User approval and feature specifications. |
| 2026-09-05 | Approved Group B commerce scope as F004–F006. | Establish persistent cart, guest checkout, authoritative order totals, Razorpay test payment, and secure confirmation while deferring unresolved policy decisions. | User approval and feature specifications. |
| 2026-09-05 | Approved Group C customer scope as F007. | Add a minimal optional customer account and private order-history experience without making authentication a prerequisite for the Sunday guest commerce journey. | User approval and feature specification. |
| 2026-09-05 | Approved Group D ceiling-enquiry scope as F008. | Provide a lightweight guest quotation-request journey using authoritative indicative ceiling ranges without creating a calculated price or commerce transaction. | User approval and feature specification. |
| 2026-09-05 | Approved Group E admin scope as F009–F010. | Provide secure single-role catalogue/media administration and minimal order/enquiry operations without expanding into complex inventory, fulfilment, or CRM workflows. | User approval and feature specifications. |
| 2026-09-05 | Approved Group F cross-cutting scope as F011. | Define priority-aware Sunday release gates for usability, accessibility, data authority, security, automated validation, browser inspection, performance, and preview readiness. | User approval and feature specification. |
| 2026-09-05 | Product Lead feature discovery closed with F001–F011 registered. | User explicitly authorized discovery closure and Tech Lead handoff after the final feature audit. | F001–F011 and Product-to-Tech-Lead handoff. |
| 2026-09-05 | Initial architecture proposed and internally reviewed. | Translate approved requirements into a reviewable Next.js/Vercel, Supabase, Drizzle, Razorpay, authorization, data, testing, and deployment design before implementation planning. | `docs/architecture/` and proposed ADR-001–ADR-004. |
| 2026-09-05 | Initial architecture and ADR-001–ADR-004 approved with clarifications. | Authorize implementation planning while retaining the separate plan-approval and feature-handoff gates. | User architecture approval and synchronized architecture records. |

## Phase Completion Criteria

- All approved phase features are QA-verified or explicitly moved out through an approved scope change.
- Required documentation and project state are current.
- Phase-level risks, follow-ups, and client decisions are recorded.
