# ADR-001 — Standard Next.js App Router on Vercel

Status: APPROVED
Date: 2026-09-05

## Context

The repository currently runs Next.js source through Vinext/Vite and Cloudflare Worker tooling, while the approved destination is standard Next.js App Router on Vercel with Supabase and Razorpay. The MVP is one small-company ecommerce application with a short delivery deadline.

## Decision

Use a single standard Next.js 16 App Router application deployed to Vercel's Node.js runtime. Use Server Components by default, Client Components for interaction, Server Actions for same-origin mutations, and Route Handlers for explicit provider/HTTP interfaces. Remove active Vinext/Vite/Cloudflare Worker/D1 coupling during implementation while preserving the approved homepage.

## Consequences

- One deployment and codebase reduce operational and deadline risk.
- Database/Auth/payment secrets remain in server runtime.
- Cloudflare-specific examples/tooling no longer define application architecture.
- A reviewed migration of scripts/configuration is required.
- Vercel Preview is the Sunday release target; production remains separately gated.

## Alternatives Considered

- Keep Vinext/Cloudflare: rejected because it conflicts with the explicitly approved Vercel/Supabase direction and adds a second runtime model.
- Separate API service: rejected as unnecessary complexity for current scale and deadline.

## Approval

Approved by the user on 2026-09-05 with the recorded migration-order, Node.js, environment, validation, and no-unnecessary-rewrite clarifications.
