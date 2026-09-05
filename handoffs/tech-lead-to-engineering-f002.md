# Tech Lead → Engineering Handoff — F002

## Approved Feature

F002 — Catalogue Browsing and Search: [`features/F002-catalogue-browsing-search.md`](../features/F002-catalogue-browsing-search.md)

## Approved Architecture

Use Supabase PostgreSQL as the system of record and Drizzle's PostgreSQL dialect
for schema, server-only reads, reviewed migrations, and an idempotent 44-record
seed. Public reads expose only published records. Availability remains SQL
`NULL`/unshown and product media remains unmapped unless a client-approved
association exists. References: ADR-002, `DATA-MODEL.md`, `ROUTES.md`, and
`INTEGRATIONS.md`.

## Scope Boundary

Implement `/catalogue` browse, model-name search, category filter, price/name
sort, clear/no-results/loading/error states, and media-pending fallback. Do not
implement product details, cart, checkout, availability, variants, product media
mapping, authentication, payments, admin, or F003-plus scope.

## Validation Boundary

Generate and review a versioned PostgreSQL migration; prove the seed contains
exactly 16 sofas, 10 beds, 10 mattresses, and 8 ceilings; validate the public UI
at mobile, tablet, laptop, and desktop widths. Applying migrations or seed to
Supabase requires the configured non-production database connection or a
project-scoped write-capable MCP operation.

## Handoff Acceptance

Received by: Codex / Software Engineer
Date: 2026-09-05
Authorized feature: F002 only
