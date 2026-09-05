# Tech Lead → Engineering Handoff

## Approved Feature Specification

F001 — Homepage and Global Navigation: [`features/F001-homepage-global-navigation.md`](../features/F001-homepage-global-navigation.md)

## Architecture

Use the approved standard Next.js 16 App Router modular monolith on the Vercel Node.js runtime. Preserve the existing client-approved homepage and local media while replacing the active Vinext/Vite/Cloudflare execution path only after the standard Next.js path runs, builds, and passes visual inspection.

References: [`SYSTEM-ARCHITECTURE.md`](../docs/architecture/SYSTEM-ARCHITECTURE.md), [`ROUTES.md`](../docs/architecture/ROUTES.md), and [`ADR-001`](../docs/adr/ADR-001-nextjs-vercel-modular-monolith.md).

## Interfaces and APIs

F001 owns the public `/` route and accessible global navigation. Header category, shop, search, account, cart, and contact controls must reach a working destination or explicit interface. Category/menu labels use catalogue-authoritative names. Ceiling actions remain consultation-only. No backend API, database, authentication, catalogue, checkout, or payment interface is introduced in F001.

## Database Changes

None. Supabase PostgreSQL and Drizzle PostgreSQL migration work begins with F002, not F001.

## AI Architecture

Not applicable.

## Dependencies

- Node.js 22.23.2 via fnm and npm with the committed lockfile.
- Existing Next.js App Router source, local homepage photos/videos, Tailwind CSS, Framer Motion, and Lucide.
- Authoritative names and contact values in `docs/product/CATALOGUE.md` and `docs/product/CLIENT-BRIEF.md`.
- No Supabase, Razorpay, or Vercel project connection is required for local F001 implementation.

## Implementation Plan

1. Record and run the current homepage baseline without replacing working media.
2. Establish and validate standard `next dev` and `next build` paths before removing old runtime integration.
3. Preserve the premium visual composition while correcting authoritative navigation names, dead controls, unverified content, responsive behavior, media fallback/reduced-motion behavior, and focus management.
4. Remove obsolete Vinext/Vite/Cloudflare integration only after the standard path and homepage are verified.
5. Run developer validation and synchronize the F001 summary, project/plan state, README, and codebase map.

Single active work item: F001 runtime migration plus homepage/global-navigation completion.

## Risks

- Runtime migration could change CSS/media behavior; mitigate with before/after browser inspection at desktop, tablet, and mobile widths.
- Existing hardcoded product names, prices, media associations, testimonials, social links, and legal links are not authoritative; do not present them as confirmed content.
- F002/F004/F007 destinations are not implemented; F001 may provide explicit accessible interim interfaces but must not implement later feature behavior.
- Escalate any need to replace approved homepage media or materially redesign the page.

## ADRs

- [`ADR-001`](../docs/adr/ADR-001-nextjs-vercel-modular-monolith.md) governs the runtime migration.
- ADR-002 through ADR-004 remain future-feature constraints and require no F001 database, commerce, or identity work.

## Architecture Approval

The user approved the initial architecture and ADR-001 through ADR-004 on 2026-09-05, then approved `IMPLEMENTATION.md` and authorized F001 only on 2026-09-05. No additional architecture approval is required.

## Handoff Acceptance

Received by: Codex / Software Engineer
Date: 2026-09-05
Next state: `IMPLEMENTING_FEATURE`
