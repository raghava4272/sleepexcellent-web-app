# Ecommerce Reference Analysis

## Sources and Access

### Reference 1

- Shared link: `https://share.google/ZdFoX7WllaYimefPp`
- Resolved site: `https://www.mysleepwell.com/`
- Access on 2026-09-05: Accessible.
- Observed surface: Sleepwell homepage plus one representative product-detail page.

### Reference 2

- Shared link: `https://share.google/xxjZWLBAxg5e0CGPf`
- Resolved site: `https://www.wakefit.co/mattress`
- Access on 2026-09-05: Accessible in a browser.
- Observed surface: Wakefit mattress product listing. A direct command-line request encountered a Cloudflare challenge, but the browser page rendered successfully.

These sites are UX references only. Their branding, imagery, wording, claims, and proprietary content should not be copied.

## Navigation

| Pattern observed | Classification | Relevance to SleepExcellent |
| --- | --- | --- |
| Persistent brand header with primary product categories | HIGH VALUE FOR OUR PROJECT | Preserve clear access to mattresses, sofas, beds, interiors, and catalogue pages. |
| Search, account, and cart utilities grouped in the header | HIGH VALUE FOR OUR PROJECT | The current homepage already reserves these controls; real behavior needs discovery. |
| Rich category menu with direct access to product families | HIGH VALUE FOR OUR PROJECT | Useful once the catalogue hierarchy and product records are approved. |
| Compact promotional strip | OPTIONAL | Use only if SleepExcellent has confirmed offers or service promises. |
| City/pincode selector and store finder in the primary header | OPTIONAL | Useful only if local pricing, delivery availability, or physical showroom discovery is required. |
| Wishlist as a primary utility | OPTIONAL | Can wait until account and saved-item behavior are justified. |
| Very broad multi-category navigation | NOT NEEDED FOR MVP | SleepExcellent has four confirmed catalogue categories and does not need reference-site breadth. |

## Homepage

| Pattern observed | Classification | Relevance to SleepExcellent |
| --- | --- | --- |
| Focused hero with one clear primary action | HIGH VALUE FOR OUR PROJECT | The current premium hero already provides a strong baseline. |
| Visual category discovery near the top of the page | HIGH VALUE FOR OUR PROJECT | Supports quick movement into the four confirmed categories. |
| Trust/service benefits placed close to shopping entry points | HIGH VALUE FOR OUR PROJECT | Should use only client-confirmed promises. |
| Curated product/collection modules | HIGH VALUE FOR OUR PROJECT | Useful when catalogue products and images are mapped correctly. |
| Customer proof and FAQ content | OPTIONAL | Requires authentic testimonials and approved policy/product answers. |
| Guided mattress selector/quiz | OPTIONAL | Potential later aid after mattress attributes and recommendation rules are supplied. |
| Store finder and in-store vs online comparison | OPTIONAL | Relevant only if physical-store strategy and service areas are confirmed. |
| Editorial blog feed and long SEO copy on the homepage | NOT NEEDED FOR MVP | Adds content and maintenance scope without enabling core commerce. |

## Product Listing

The Wakefit listing visibly uses a product count, sorting control, a desktop filter rail, quick size and type chips, and image-led product cards with labels, ratings/review counts, wishlist controls, and short benefit summaries.

| Pattern observed | Classification | Relevance to SleepExcellent |
| --- | --- | --- |
| Product count and clear category heading | HIGH VALUE FOR OUR PROJECT | Helps users understand catalogue scope. |
| Sort control | HIGH VALUE FOR OUR PROJECT | Useful when price and product data are authoritative. |
| Filters based on meaningful product attributes | HIGH VALUE FOR OUR PROJECT | Filter fields must come from approved data, not be invented. |
| Quick chips for common size/type choices | HIGH VALUE FOR OUR PROJECT | Especially useful for mattress size/type; exact variants remain pending. |
| Cards with image, product name, price, compact benefits, and rating | HIGH VALUE FOR OUR PROJECT | Product benefits and reviews require real source data. |
| Wishlist control | OPTIONAL | Depends on account/saved-item scope. |
| Promotional badges and discount treatment | OPTIONAL | Use only with confirmed offers and discount rules. |
| Infinite-scroll/pagination behavior | OPTIONAL | The supplied entry page did not provide enough evidence to select one; decide from catalogue scale and performance needs. |

## Product Detail

The inspected Sleepwell product page includes breadcrumbs, a multi-image/video gallery, product title, review summary, warranty/benefit highlights, size selection, price areas, pincode availability, quantity, Add to Cart and Buy Now actions, nearby-store access, detailed construction/specification content, care guidance, FAQs, and related products.

| Pattern observed | Classification | Relevance to SleepExcellent |
| --- | --- | --- |
| Breadcrumbs, media gallery, product identity, and authoritative price | HIGH VALUE FOR OUR PROJECT | Core context for a purchasable catalogue item. |
| Variant selection before purchase | HIGH VALUE FOR OUR PROJECT | Required where size/configuration changes the product or price. |
| Specification, care, warranty, and delivery information | HIGH VALUE FOR OUR PROJECT | Only after the client supplies authoritative content. |
| Quantity and unambiguous purchase/quotation CTA | HIGH VALUE FOR OUR PROJECT | CTA must reflect the client decision for each product type. |
| Related products | OPTIONAL | Useful after product taxonomy and relationships exist. |
| Product comparison | OPTIONAL | Valuable for mattresses but not required for the first commerce release. |
| Elaborate layer diagrams and product videos for every item | OPTIONAL | Useful only when the assets and validated claims are available. |
| Long-form SEO blocks duplicated below product content | NOT NEEDED FOR MVP | Can obscure primary decision information and add editorial overhead. |

## Cart

The Sleepwell reference exposes a cart drawer with empty-state guidance and supports a standard ecommerce cart path. The exact checkout was not entered and no transaction was attempted.

| Pattern observed | Classification | Relevance to SleepExcellent |
| --- | --- | --- |
| Drawer/modal cart with item count and immediate feedback | HIGH VALUE FOR OUR PROJECT | The current demo already establishes this interaction model. |
| Product configuration, quantity, remove action, line totals, and subtotal | HIGH VALUE FOR OUR PROJECT | Required once real variants and prices exist. |
| Clear empty state and continue-shopping action | HIGH VALUE FOR OUR PROJECT | Keeps the shopping path understandable. |
| Wishlist-to-cart or cross-sell inside cart | OPTIONAL | Not required for MVP. |
| Heavy promotion/gamification inside cart | NOT NEEDED FOR MVP | Adds complexity and can conflict with a premium, consultation-led brand. |

## Checkout

The checkout itself was not entered, so its exact screens were not treated as verified reference evidence.

| Pattern | Classification | Relevance to SleepExcellent |
| --- | --- | --- |
| Contact/address, delivery method, order summary, payment, and confirmation states | HIGH VALUE FOR OUR PROJECT | Core only for categories approved for direct purchase. |
| Clear payment failure, retry, and cancelled-payment handling | HIGH VALUE FOR OUR PROJECT | Required for a future Razorpay integration. |
| Guest checkout | OPTIONAL | Client decision is required before choosing guest vs login-required checkout. |
| Coupons, gift cards, loyalty, and accelerated checkout | NOT NEEDED FOR MVP | No confirmed business rules support them. |

## Account

The Sleepwell reference provides profile, order history/tracking, return request, warranty registration, and complaint links. Authentication behavior was not entered.

| Pattern | Classification | Relevance to SleepExcellent |
| --- | --- | --- |
| Order lookup/history after purchase | HIGH VALUE FOR OUR PROJECT | Valuable once orders exist; whether it requires login is pending. |
| Account sign-in and saved addresses | OPTIONAL | Supabase Auth is intended, but mandatory login is not yet approved. |
| Wishlist and saved comparisons | OPTIONAL | Defer until core catalogue, cart, and orders are stable. |
| Loyalty, referrals, or complex profile features | NOT NEEDED FOR MVP | No confirmed requirement. |

## Responsive UX

| Pattern observed | Classification | Relevance to SleepExcellent |
| --- | --- | --- |
| Compact mobile header with access to search, categories, and cart | HIGH VALUE FOR OUR PROJECT | The existing drawer navigation is a useful baseline. |
| Mobile filter/sort sheet for product listings | HIGH VALUE FOR OUR PROJECT | Prevents desktop sidebars from crowding small screens. |
| Horizontally scrollable quick-filter chips | HIGH VALUE FOR OUR PROJECT | Keeps common filters reachable without dense forms. |
| Touch-sized controls and persistent purchase summary on product pages | HIGH VALUE FOR OUR PROJECT | Important once product-detail purchase behavior is approved. |
| Replicating every desktop navigation link on the first mobile level | NOT NEEDED FOR MVP | Progressive disclosure is clearer for the four-category catalogue. |

## Product Discovery Implications

The references support discussing clear catalogue navigation, searchable/filterable listings, complete product information, a reliable cart, and a concise purchase or quotation journey. They do not approve any feature. Product Lead discovery must first resolve the business decisions and missing source data recorded in `CLIENT-BRIEF.md` and `CATALOGUE.md`.
