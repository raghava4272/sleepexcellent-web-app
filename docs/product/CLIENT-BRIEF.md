# Client Brief

## Existing Product State

SleepExcellent currently has an existing ecommerce homepage/demo that has already been shown to the client. The repository contains one public homepage route with a premium editorial presentation for mattresses, sofas, beds, and ceiling solutions. It includes local product media, catalogue-style collection lists, a featured-products grid, and a client-side cart demonstration.

The cart currently supports adding the hardcoded featured entries, changing quantities, removing entries, displaying a count and subtotal, and opening a checkout placeholder. It does not persist cart state and is not connected to product records, inventory, orders, authentication, a database, or payments.

Confirmed contact details currently used by the homepage are:

- Primary phone: `+91 98492 56799` / `tel:+919849256799`
- Secondary phone: `+91 90442 57999` / `tel:+919044257999`
- Email: `sleepexcellent999@gmail.com` / `mailto:sleepexcellent999@gmail.com`

## Existing Homepage / Visual Direction

The current homepage is the client-approved visual baseline and should be preserved and extended rather than rebuilt. Its direction is premium, editorial, warm, and residential, using large serif display typography, restrained sans-serif labels, ivory and cream surfaces, charcoal contrast, burgundy accents, generous spacing, immersive local photography, local collection videos, and subtle reveal/hover motion.

The current page includes a contact strip, responsive header and collection menus, mattress hero media, brand introduction, four category cards, featured products, mattress/sofa/bed/ceiling collection sections, benefit statements, brand story, consultation contact area, testimonials, inspiration gallery, footer, mobile navigation, and cart drawer.

## Current Technical Stack

- Next.js 16 App Router source structure
- React 19 and TypeScript 5
- Tailwind CSS 4 through PostCSS
- Framer Motion and Lucide React
- Vinext and Vite as the active build/runtime path
- Cloudflare Vite plugin, Worker entry point, and Wrangler-generated runtime state
- Drizzle ORM configured for SQLite/Cloudflare D1, with an intentionally empty application schema
- OpenAI Sites hosting metadata with no D1 or R2 binding enabled
- npm with `package-lock.json`

The repository declares Node.js `>=22.13.0`; the audited machine currently provides Node.js `20.12.2` and npm `10.5.0`.

## Intended Deployment Direction

The current intended direction is:

- Vercel
- Supabase
- Razorpay

This direction is not authorization to migrate or configure those services yet.

## Current Priorities

1. premium UI/UX
2. preserve and extend current homepage
3. responsive ecommerce experience
4. ecommerce functionality
5. Supabase integration
6. Razorpay payment integration
7. basic admin functionality
8. Vercel deployment

## Deferred Work

- shipping-provider integration
- advanced security hardening
- advanced monitoring
- unnecessary infrastructure

## Known Business Rules

- Product categories in the supplied catalogue are Sofas, Beds, Mattresses, and Ceiling Solutions.
- Sofa, bed, and mattress prices are listed per item/model.
- Ceiling prices are listed per square foot.
- Catalogue prices are indicative and may vary based on size, material, finish, customization, transport, and installation requirements.
- The final quotation must be confirmed before ordering.
- The catalogue is authoritative for supplied model names, configurations/specifications, and listed prices.
- Standard catalogue sofas and beds use direct online purchase at their listed price. Sofa customization that materially affects price uses consultation/request quote and never invents a customized price.
- Mattresses use direct online purchase at the listed price for the single supplied size/configuration only. No additional sizes, thicknesses, variants, or prices may be inferred.
- Ceiling solutions show indicative price ranges per square foot and use Request Quote/Consultation. They do not use quantity, Add to Cart, Buy Now, or a final payable calculation.
- Guest users may browse, search, add to cart, and check out without being forced to authenticate.
- Add to Cart updates the shopper's persistent normal cart. Quantities are positive whole numbers and shoppers can increment, decrement, remove, or clear items.
- Buy Now creates a direct-checkout intent containing only the selected product and quantity. It leaves the shopper's unrelated normal cart items unchanged and does not require a second persistent cart.
- Checkout supports both normal-cart and Buy Now modes through consistent shared behavior.
- For the Sunday MVP, shipping is free (`₹0`) and must remain server-configurable for later rules. Shipping-provider integration is deferred.
- The Sunday MVP is India-only, uses INR, validates Indian PIN codes, and defaults country to India without a country selector.
- The Sunday MVP shows no separate tax/GST line and must not label prices as GST-inclusive or GST-exclusive until the client confirms the final treatment.
- The server rebuilds authoritative product prices, subtotal, shipping, final payable amount, and payment state from product IDs and quantities. Browser-submitted totals and payment status are never authoritative.
- Order items retain immutable snapshots of product identity, catalogue name, supplied configuration/specification, unit price, quantity, and line total.
- Duplicate-order/payment protection is required; its idempotency and state-transition design is deferred to Technical Lead architecture planning.
- Razorpay uses test mode for the Sunday MVP. A payment becomes `PAID` only after server-side signature verification against the server-authoritative amount; browser-reported success is insufficient.
- After verified payment, normal-cart checkout clears only the successfully purchased cart, while Buy Now leaves unrelated normal-cart items untouched. Cancellation or failure preserves the relevant cart/checkout state.
- Guest order-confirmation access must use a non-guessable mechanism rather than a sequential public database ID.
- Razorpay webhook reconciliation is P1 and non-blocking for Sunday; production release requires a production-grade webhook/reconciliation follow-up.
- Customer authentication uses Supabase Auth with email/password signup, login, logout, and supported secure session handling. A custom token system or manual insecure token storage is not permitted.
- Authentication is optional for the customer journey. Homepage, catalogue, search, product detail, cart, Buy Now, checkout, Razorpay payment, and guest confirmation remain accessible without login.
- Sunday development/demo account creation must not be blocked by external email verification. Production email verification, delivery configuration, and final authentication policy require explicit review rather than a silent weakening of production rules.
- The minimal customer account contains basic email/identity, logout, order-history access, and order detail. Complex profile, avatar, preferences, saved payments, wishlist, loyalty, saved addresses, and notification settings are excluded from the Sunday MVP.
- An authenticated checkout order is associated with the authenticated Supabase user ID. A guest checkout remains a guest order with its immutable customer/contact snapshot.
- Guest orders are never automatically associated with an account solely through a matching email address; guest-order claiming is deferred.
- Customer order history displays the safe public SleepExcellent order reference, order date, payment status, order status, purchased-item summary, total, and detail action using immutable purchase snapshots.
- Customer privacy is mandatory: Supabase identity, basic RLS, and server authorization prevent one customer from accessing another customer's profile or orders, including through changed URLs or identifiers.
- Internal sequential database IDs cannot serve as the sole public order identifier. Public order-reference and secure guest-confirmation mechanisms await Technical Lead architecture design.
- Password reset is P1 and cannot delay the Sunday commerce demonstration. Its route/UI may remain while email-delivery work is recorded as incomplete P1 work.
- Admin authentication and authorization remain separate from customer account scope, though the future architecture may reuse Supabase Auth with distinct admin authorization.
- Ceiling solutions remain enquiry/quotation only: Homepage/Catalogue/Detail → Request Quote → Enquiry Form → Stored Enquiry → Confirmation → Staff Follow-up.
- Ceiling pages display only the authoritative indicative catalogue range per square foot. Approximate area is never multiplied into an estimated or final payable amount for the Sunday MVP.
- Ceiling enquiries remain separate from cart, Buy Now, order, and payment flows and require no customer authentication.
- The ceiling enquiry requires customer name, phone, project city/locality, and an authoritative ceiling type or “Need guidance.” Email, approximate area, and project details are optional.
- Entry from a ceiling detail preselects that type but allows change; a general consultation entry defaults to “Need guidance.”
- An entered approximate area must be positive, is stored as submitted, and is not used to calculate a quotation. Unknown area never blocks submission.
- Each valid ceiling enquiry preserves a submission snapshot: selected type/Need guidance, applicable indicative catalogue range, customer/contact fields, optional approximate area/details, locality, timestamp, and simple enquiry status.
- The lightweight enquiry lifecycle is `NEW` → `CONTACTED` → `CLOSED`; complex CRM workflow is excluded.
- Obvious accidental duplicate submissions require lightweight protection, with the mechanism deferred to Technical Lead architecture planning.
- Successful submission shows a non-sensitive public enquiry reference and concise receipt confirmation without promising response time, installation date, final price, service coverage, or transport cost.
- The public form states only that submitted contact details will be used by SleepExcellent to respond. Final privacy/contact-consent wording remains pending and no detailed policy may be invented.
- Approved phone and email contacts remain visible as alternatives, especially after submission failure. WhatsApp is excluded until an approved destination exists.
- Group E should provide a lightweight staff enquiry list/detail/status surface without CRM functionality.
- Until authoritative availability is supplied, the storefront must not show or enforce invented stock states, filter by availability, or block purchase based on assumed stock.
- Product media may be associated with a catalogue product only when the mapping is authoritative. Missing media uses a deliberate fallback and must not block the Sunday MVP.
- Product media must support a primary image, multiple gallery images, and an optional video later. Media belongs in Supabase Storage; database records store paths and metadata, not binary media.
- Initial inventory behavior is limited to `in stock` and `out of stock` once authoritative values exist.
- One basic admin role supports catalogue/media management and order/enquiry operations. There is no public admin signup, and customer authentication never grants admin authority.
- Administrative authorization comes from an independently controlled, server-verified source. It cannot rely on browser state, query parameters, client-controlled claims, editable profiles, or user-editable metadata. The exact mechanism awaits Technical Lead architecture planning.
- Product publication (`PUBLISHED`/`UNPUBLISHED`) is separate from availability (`UNSET`/`IN STOCK`/`OUT OF STOCK`). New products default to `UNPUBLISHED`; only published records appear publicly.
- Availability remains `UNSET` until explicitly supplied by an authorized administrator. `UNSET` does not block purchase, and `UNPUBLISHED` must never be interpreted as `OUT OF STOCK`.
- Admin catalogue editing is limited to authoritative category-appropriate fields. Sofas, beds, and mattresses use fixed catalogue prices; ceilings use indicative minimum/maximum per-square-foot ranges and remain enquiry-only.
- Catalogue edits affect future reads/purchases but never rewrite immutable historical order snapshots. Hard deletion is excluded; unpublishing is used to remove a product from public view.
- Sunday P0 media administration supports primary image upload, preview, assignment, replacement, removal, and fallback. Ordered galleries and optional product video are P1.
- Authorized admin media assignment establishes the authoritative mapping. Until assignment, missing media remains non-blocking and uses the polished fallback without borrowing unrelated media.
- Admin forms require server-side validation and explicit loading, success, validation, authorization, and persistence-error states. Admin UI prioritizes desktop/tablet while retaining safe mobile usability.
- The Sunday order lifecycle is `NEW` → `PROCESSING` → `COMPLETED`. Cancellation, refund, shipping, delivery, and return states remain excluded until their business rules are approved.
- Order status and payment status remain separate. Admin may update order status but cannot manually set `PAID`, edit Razorpay identifiers, or expose payment secrets.
- Admin order list is recent-first with simple search by public order reference, phone, or email and filtering by order/payment status.
- Admin order detail uses immutable purchase-time product, customer, address, and monetary snapshots. Admin cannot edit order items, historical values, payment status, or Razorpay references.
- Admin ceiling-enquiry operations support list/search, detail, customer/contact/project review, and the approved `NEW` → `CONTACTED` → `CLOSED` status updates only.
- Admin enquiry operations do not calculate quotes, create carts/orders/payments, or promise unapproved installation/transport pricing.
- All admin data and mutations require authenticated identity, server-side admin authorization, and Supabase RLS where applicable; hidden navigation is never sufficient authorization.
- Sunday release acceptance is priority-aware: all implemented P0 features must pass their approved criteria, while P1 work is evaluated only when included in the Sunday build. F007 remains P1 and cannot block the preview when it is not selected for implementation.
- Mandatory Sunday journeys are the verified public commerce flow, guest ceiling-enquiry flow, catalogue/media administration, order review/status update, and ceiling-enquiry review/status update.
- P1 work—including full customer-account polish, password-reset completion, galleries, product-video administration, price-range filtering, related products, Razorpay webhook reconciliation, advanced admin responsiveness/media optimization, and production email configuration—must be tracked accurately and cannot be silently marked complete.
- Release quality requires representative mobile, tablet, laptop, and desktop usability checks without demanding pixel perfection at every possible viewport.
- The practical accessibility baseline includes semantic structure, labels, meaningful control names, critical keyboard operation, visible focus, accessible errors, reasonable contrast, reduced-motion support, focus-managed dialogs/drawers, and non-blocking media failure.
- MVP security correctness includes server-authoritative prices/totals/payment state, server-side Razorpay verification, server-only secrets, publication filtering, customer/admin isolation, enquiry-only ceilings, and immutable order snapshots.
- Before preview acceptance, TypeScript, ESLint, focused high-risk automated tests, and the production build must pass, followed by Playwright/manual inspection of critical journeys at representative desktop, tablet, and mobile widths.
- Sunday performance expectations are practical: no obviously excessive blocking, reasonable image loading, working video fallbacks, avoidance of clearly unnecessary client bundles, and no severe console errors in critical journeys.
- The Vercel preview is explicitly development/demonstration only and does not imply production payment, policy, monitoring, email, security-hardening, or final-media readiness.

## Pending Client Decisions

- Final shipping charge and rule set: **PENDING CLIENT DECISION**
- Final GST/tax treatment and customer-facing wording: **PENDING CLIENT DECISION**
- Final invoice requirements: **PENDING CLIENT DECISION**
- Cancellation policy: **PENDING CLIENT DECISION**
- Return/refund policy: **PENDING CLIENT DECISION**
- Installation charges and calculation: **PENDING CLIENT DECISION**
- Transport charges and calculation: **PENDING CLIENT DECISION**
- Warranty behavior: **PENDING CLIENT DECISION**
- Production email-verification requirement and final authentication policy: **PENDING CLIENT DECISION**
- Production authentication email-delivery configuration and branding: **PENDING CLIENT DECISION**
- Final contact-consent/privacy wording: **PENDING CLIENT DECISION**

## Missing Assets/Data

- An authoritative mapping from the numeric image filenames in `public/products/` to catalogue models. The available files include multiple views/details of a small number of bed and sofa designs and must not be treated as 14 confirmed products without client mapping.
- Authoritative initial availability for each model. This is **PENDING CLIENT INPUT** and does not block the Sunday MVP.
- Product-level images for each catalogue mattress model.
- Product- or type-level images for each ceiling solution; only one general ceiling-interior photograph is present.
- Final service locations and service-coverage rules.
- Confirmed response-time expectations for ceiling enquiries.
- Confirmed product descriptions, SKUs, materials, colors, dimensions beyond the catalogue's supplied fields, variants, stock, discounts, taxes, and availability.
- Pricing rules for dimensions, finishes, materials, customization, transport, and installation.
- Delivery areas, delivery estimates, shipping charges, installation terms, cancellation/refund/return policy, warranty terms, privacy policy, and terms and conditions.
- Confirmed social-media URLs; current footer social links are placeholders.
- Final product-image alt text after catalogue-to-image mapping is approved.
- Admin users, permissions, workflows, and catalogue/order-management requirements.
- Initial authorized administrator account/email: **PENDING CLIENT INPUT**, non-blocking for authorization architecture.
- Additional product images, gallery images, and product videos.
