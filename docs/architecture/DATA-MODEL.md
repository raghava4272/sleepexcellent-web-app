# Proposed Data Model

Status: APPROVED
Database: Supabase PostgreSQL
Schema ownership: Drizzle TypeScript schema plus reviewed SQL migrations

## Conventions

- Internal primary keys are UUIDs and are never the sole public identifier.
- Money is stored as integer INR minor units (`*_minor`) to avoid floating-point arithmetic.
- Timestamps are UTC `timestamptz`.
- Public references are unique, high-entropy, human-readable prefixes plus random data.
- Historical orders and enquiries store immutable submission-time snapshots.
- Product media records store Supabase Storage paths/metadata, never binary payloads.

## Enumerations

| Enum | Values |
| ---- | ------ |
| `product_category` | `SOFA`, `BED`, `MATTRESS`, `CEILING` |
| `publication_state` | `PUBLISHED`, `UNPUBLISHED` |
| `availability_state` | `IN_STOCK`, `OUT_OF_STOCK`; SQL `NULL` represents approved `UNSET` |
| `media_kind` | `IMAGE`, `VIDEO` |
| `checkout_mode` | `CART`, `BUY_NOW` |
| `order_status` | `NEW`, `PROCESSING`, `COMPLETED` |
| `payment_status` | `PENDING`, `PAID`, `FAILED` |
| `payment_attempt_status` | `CREATED`, `VERIFIED`, `FAILED` |
| `enquiry_status` | `NEW`, `CONTACTED`, `CLOSED` |

## Tables

### `products`

| Field | Notes |
| ----- | ----- |
| `id` | Internal UUID primary key |
| `slug` | Unique stable public slug |
| `category` | Approved product category |
| `name` | Catalogue-authoritative/admin-supplied name |
| `configuration` | Nullable supplied configuration/specification |
| `size` | Nullable supplied size |
| `suitability` | Nullable; ceiling suitability text only |
| `fixed_price_minor` | Direct-purchase price; nullable for ceilings |
| `indicative_min_minor` | Ceiling range lower bound; null for direct products |
| `indicative_max_minor` | Ceiling range displayed upper value; null for direct products |
| `indicative_max_open_ended` | Preserves the catalogue's `₹700+` ceiling semantics |
| `publication_state` | Defaults `UNPUBLISHED` for admin-created products |
| `availability` | Nullable = approved `UNSET` |
| `created_at`, `updated_at` | Audit timestamps |

Database checks enforce:

- Sofa/bed/mattress: positive `fixed_price_minor`; no ceiling range/suitability fields.
- Ceiling: no fixed price; positive min/max with max ≥ min; enquiry-only behavior is derived from category, not an editable purchase-mode flag.
- A published record must contain all category-required public fields.

### `product_media`

| Field | Notes |
| ----- | ----- |
| `id` | UUID primary key |
| `product_id` | Product foreign key, delete restricted |
| `kind` | Image or video |
| `storage_path` | Unique path in product-media bucket |
| `mime_type`, `byte_size`, `width`, `height` | Validation/display metadata where applicable |
| `alt_text` | Nullable until authoritative alt text supplied |
| `position` | Ordered gallery support |
| `is_primary` | Primary image marker |
| `created_by` | Admin Auth UUID |
| `created_at` | Timestamp |

A partial unique index permits at most one primary image per product. P0 admin UI manages the primary image; the table already supports P1 gallery/video without schema redesign.

### `admin_users`

| Field | Notes |
| ----- | ----- |
| `auth_user_id` | Supabase Auth UUID primary key |
| `active` | Server-controlled authorization switch |
| `created_at`, `updated_at` | Timestamps |

There is no public insert/update policy or public provisioning endpoint.

### `orders`

| Field | Notes |
| ----- | ----- |
| `id` | Internal UUID primary key |
| `public_reference` | Unique, non-sequential SleepExcellent reference |
| `customer_user_id` | Nullable Supabase Auth UUID; null for guest |
| `checkout_mode` | Cart or Buy Now |
| `order_status` | `NEW` initially |
| `payment_status` | Server-owned state, `PENDING` initially |
| `currency` | Check constrained to `INR` |
| `subtotal_minor`, `shipping_minor`, `total_minor` | Server-calculated snapshots |
| `customer_name`, `email`, `phone` | Purchase-time contact snapshot |
| `address_line_1`, `address_line_2`, `city`, `state`, `postal_code`, `country` | India-only address snapshot; country fixed `IN` |
| `checkout_idempotency_key` | Unique attempt key scoped to the order-creation contract |
| `guest_access_token_hash` | Nullable SHA-256 hash of a 32-byte random immediate-confirmation token; raw token is never stored |
| `guest_access_expires_at` | Two-hour immediate-confirmation expiry; no long-term guest retrieval |
| `created_at`, `updated_at`, `paid_at` | Timestamps |

Checks enforce positive totals, `subtotal + shipping = total`, non-negative configured shipping, and valid status values. Tax is not stored as a separate Sunday line.

### `order_items`

| Field | Notes |
| ----- | ----- |
| `id` | UUID primary key |
| `order_id` | Order foreign key, delete restricted |
| `product_id` | Product identity reference, delete restricted |
| `product_name`, `category`, `configuration`, `size` | Immutable purchase snapshot |
| `unit_price_minor`, `quantity`, `line_total_minor` | Immutable monetary snapshot |

Checks enforce positive whole quantity and `unit_price × quantity = line_total`.

### `payment_attempts`

| Field | Notes |
| ----- | ----- |
| `id` | UUID primary key |
| `order_id` | Order foreign key |
| `provider` | Check constrained to `RAZORPAY` for current MVP |
| `provider_order_id` | Unique Razorpay order identifier |
| `provider_payment_id` | Unique nullable payment identifier |
| `status` | Created/verified/failed |
| `amount_minor`, `currency` | Must match stored order total/INR |
| `signature_verified_at` | Nullable verification timestamp |
| `failure_code` | Sanitized optional code; no secret payload |
| `created_at`, `updated_at` | Timestamps |

The signature itself and secret keys are not persisted. A transaction/conditional update makes verified payment and parent-order paid transition idempotent.

### `ceiling_enquiries`

| Field | Notes |
| ----- | ----- |
| `id` | Internal UUID primary key |
| `public_reference` | Unique, non-sequential enquiry reference |
| `ceiling_product_id` | Nullable when selection is `Need guidance` |
| `selection_name`, `range_min_minor`, `range_max_minor`, `range_max_open_ended` | Immutable submitted catalogue snapshot |
| `customer_name`, `phone`, `email` | Contact snapshot; email nullable |
| `approximate_area_sq_ft` | Nullable positive numeric |
| `locality`, `project_details` | Locality required, details nullable |
| `status` | `NEW` initially |
| `submission_idempotency_key` | Unique submission-attempt key |
| `created_at`, `updated_at` | Timestamps |

No quotation, calculated price, cart, order, or payment relationship is present.

## Indexes and Access Paths

- `products(publication_state, category, name)` for public browsing/filtering.
- Unique `products(slug)`.
- `orders(created_at desc)`, `orders(customer_user_id, created_at desc)`, `orders(order_status, created_at desc)`, `orders(payment_status, created_at desc)`.
- Unique `orders(public_reference)` and `orders(checkout_idempotency_key)`.
- Search-support indexes for normalized order email/phone as needed after query-plan validation; do not log search PII.
- `ceiling_enquiries(created_at desc)`, `ceiling_enquiries(status, created_at desc)` and unique public/idempotency references.
- Unique provider order/payment identifiers.

## Grants and RLS

| Data | Anonymous | Authenticated customer | Admin application service |
| ---- | --------- | ---------------------- | ------------------------- |
| Published products/media | Read | Read | Read/write after server admin check |
| Unpublished products | None | None | Read/write after server admin check |
| Orders/items | No direct access | Own rows only | Read; approved status mutation only |
| Payments | None | No direct table access; confirmation through server | Read-only operational fields; no paid mutation |
| Ceiling enquiries | No direct table access; server form only | Same as guest | Read and approved status mutation |
| Admin registry | None | None | Server authorization lookup only |

RLS is enabled on every application table exposed through Supabase APIs, with grants revoked unless explicitly required. The application uses a server-only Drizzle connection for domain writes and repeats ownership/admin checks in its service layer; RLS remains defense in depth rather than a substitute for those checks.

## Migration Strategy

- Drizzle code-first PostgreSQL schema is version controlled.
- Generate reviewed SQL migrations; apply them through a controlled preview process.
- Prefer additive changes. Destructive changes require backups, explicit data migration, rollback/compensating plan, and separate approval when material.
- Seed the authoritative 44 entries idempotently by stable slug. Seed existing catalogue records `PUBLISHED`, availability `UNSET`, and product media absent unless mapping is authoritative.
- Never seed the current hardcoded mock names/prices as catalogue truth.
