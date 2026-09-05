# ADR-002 — Supabase PostgreSQL, Auth, and Storage with Drizzle

Status: APPROVED
Date: 2026-09-05

## Context

Approved features require authoritative catalogue data, immutable orders, payments, enquiries, optional customer identity, independent admin authorization, RLS, and product media. The existing D1 schema is empty and media mappings are incomplete.

## Decision

Use Supabase PostgreSQL as the system of record, Supabase Auth for identity, and Supabase Storage for administrator-assigned product media. Use Drizzle's PostgreSQL dialect for schema, typed server queries, and reviewed versioned migrations. Domain writes remain server-only; service authorization and database constraints are primary controls, while Supabase grants/RLS provide defense in depth for exposed APIs. Preserve homepage media as repository static assets.

## Consequences

- One provider covers database, identity, and media for the small MVP.
- Drizzle schema/migrations remain version controlled.
- The server-only database connection is privileged, so application ownership/admin guards and tests remain mandatory even with RLS.
- Privileged/service-level credentials never enter browser code. Public, customer, guest, admin, payment, provider, and media operations use the single access-path model documented in `SYSTEM-ARCHITECTURE.md`.
- Existing D1 code/configuration must be replaced.
- Missing product media does not block catalogue migration; records start without mappings.

## Alternatives Considered

- Supabase client/Data API for every operation: rejected as the sole application data layer because authoritative multi-record commerce transactions and privileged admin workflows are clearer through a server transaction boundary.
- Store media binaries in PostgreSQL: rejected by approved requirements and operational cost/complexity.
- Continue SQLite/D1: rejected because the approved platform is Supabase PostgreSQL and the current schema contains no application data to preserve.

## Approval

Approved by the user on 2026-09-05 with the explicit rule that RLS never substitutes for authorization around privileged Drizzle operations and that privileged access is minimized to trusted server paths.
