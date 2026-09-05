# SleepExcellent

SleepExcellent is a premium ecommerce experience built with the standard
Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons.

## Prerequisites

- Node.js 22.13.0 or newer (the repository currently uses Node 22.23.2)
- npm

If you use fnm, run `fnm use` before installing or running.

## Local Development

1. Run `npm ci`.
2. Run `npm run dev`.
3. Open [http://localhost:3000](http://localhost:3000).

## Validation

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm start`

## Catalogue Database Setup (F002)

Copy `.env.example` to a local untracked `.env.local` and provide the
server-only non-production `DATABASE_URL`. Then run the reviewed migration and
idempotent authoritative seed:

- `npm run db:generate` — generate a new reviewed migration after schema changes.
- `npm run db:migrate` — apply reviewed migrations.
- `npm run db:seed` — insert/update the 44 supplied catalogue records by slug.

Do not place database credentials in browser-visible variables. Product media
and availability are deliberately absent from the F002 seed until client input
is authoritative.

## Current Scope

F001 provides the homepage and global navigation. F002 adds catalogue browsing,
model-name search, category filters, approved sorting, and database migration/
seed infrastructure. F003 adds persisted-catalogue product and ceiling detail
routes with category-safe purchase/consultation presentation and a deliberate
pending-media fallback. F004 adds a persistent browser cart for direct-purchase
products and a separate Buy Now intent, while checkout, authentication, admin,
and integrations remain implemented only in their separately approved feature
stages.

Homepage media is stored in `public/photos` and `public/videos`. Authoritative
catalogue product media uses the approved deterministic resolver. For Vercel,
keep large product media in the public Supabase `product-media` bucket and set
`NEXT_PUBLIC_PRODUCT_MEDIA_BASE_URL` only after uploading the approved objects;
`DATABASE_URL` remains server-only. Canonical source folders and the temporary
`public/media` mirror are intentionally Git-ignored.
