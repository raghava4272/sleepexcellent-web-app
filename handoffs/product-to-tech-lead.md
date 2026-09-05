# Product → Tech Lead Handoff

## Approved Feature Specification

Approved PHASE-001 scope is F001–F011, registered in `FEATURES.md` with individual specifications under `features/`.

## Acceptance Criteria

Each feature specification contains its approved criteria. F011 defines the priority-aware Sunday release envelope: implemented P0 features gate acceptance; P1 work gates only when included, while all implemented security boundaries remain mandatory.

## Out of Scope

- Unapproved product attributes, variants, stock, media mappings, discounts, service promises, and policy claims
- Direct ceiling commerce or calculated ceiling quotations
- Complex inventory, staff permissions, CRM, fulfilment, reporting, and analytics
- Live Razorpay and production-grade webhook completion for Sunday
- Production deployment or production-readiness claims
- Implementation before architecture approval

## Dependencies

- Standard Next.js/Vercel architecture and Node.js `>=22.13.0`
- Supabase PostgreSQL, Auth, RLS, and Storage architecture
- Drizzle PostgreSQL migrations and authoritative catalogue seeding
- Razorpay test credentials and server verification design
- Vercel/Supabase access for later implementation
- PENDING CLIENT INPUT/DECISION items recorded in `PROJECT.md` and `docs/product/CLIENT-BRIEF.md`

## Client / User Decisions

| Date | Decision | Approval Evidence | Impact |
| ---- | -------- | ----------------- | ------ |
| 2026-09-05 | Approved F001–F011 and explicitly closed Product Lead discovery. | Group A–F approval messages. | Architecture may begin; implementation may not. |
| 2026-09-05 | Authorized transition to TECH_LEAD for an initial architecture proposal. | Explicit Group F handoff authorization. | Next state is `ARCHITECTURE_PLANNING`, followed by human architecture approval. |
| 2026-09-05 | Kept F007 and listed optional capabilities P1. | F011 approval. | Unimplemented P1 scope cannot block Sunday preview. |
| 2026-09-05 | Required server-authoritative security boundaries for Sunday. | F005, F006, F007, F009, F010, and F011 approvals. | Architecture must protect prices, payments, private data, admin actions, publication, and snapshots. |

## Priority

F001–F006 and F008–F011 are P0. F007 is P1. Internal P1 slices are recorded in their respective specifications and must not silently become P0 blockers.

## Design Status

Dedicated design planning is not required before initial architecture. The existing client-approved homepage, reference analysis, and detailed responsive/accessibility behavior in feature specifications provide the design baseline. Any later material visual change must be escalated.

## Risks / Open Questions

- Current Cloudflare/Vinext/D1 runtime differs from approved Next.js/Vercel/Supabase direction.
- Local Node.js `20.12.2` is below required `>=22.13.0`.
- Existing hardcoded product names/prices conflict with authoritative catalogue and must not survive as public product records.
- Product media mapping, availability, platform credentials, and initial admin identity remain pending but are non-blocking for architecture.
- Production tax, shipping, invoice, policy, email, domain, monitoring, and final media decisions remain outside Sunday readiness.

## Architecture Approval Expectation

Initial project architecture and significant changes require explicit human approval. No implementation or `IMPLEMENTATION.md` is authorized before that approval.

## Handoff Acceptance

Received by: Codex / Tech Lead
Date: 2026-09-05
Next state: `ARCHITECTURE_PLANNING`
