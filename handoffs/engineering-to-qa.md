# Engineering → QA Handoff — F002

Date: 2026-09-05
Feature: F002 — Catalogue Browsing and Search

## Accepted Scope

The user explicitly accepted F002 after reviewing the public catalogue, persisted
homepage type-ahead, catalogue results route, and desktop category-menu hover
behavior.

## Engineering Evidence

- Reviewed migration and idempotent 44-record seed are applied to the configured
  non-production Supabase project.
- Developer validation recorded passing typecheck, lint, 9 automated tests,
  production build, live persisted-catalogue browser checks, responsive review,
  and hover-menu behavior.
- Availability remains unset, product media mappings remain absent, and ceiling
  solutions remain consultation-oriented.

## Revision Note

QA identified that the standalone `tsx` seed process could not import Next.js's
`server-only` guard. Engineering retained the guard at the application-facing
`db/index.ts` boundary, extracted the one canonical trusted connection factory
to `db/connection.ts`, and updated only the seed script to import that factory.
`DATABASE_URL`-configured `npm run db:seed` now completed twice against the
configured non-production database. The resulting state remains 44 distinct
published products (16 sofas, 10 beds, 10 mattresses, 8 ceilings), with all
availability unset, zero product-media mappings, and zero duplicate slugs.

## QA Focus

Independently verify the F002 acceptance criteria, data authority, published-only
access, seed idempotency, RLS/grants, catalogue search/filter/sort, homepage
type-ahead, desktop/mobile behavior, reduced-motion preservation, and no
invented catalogue claims.
