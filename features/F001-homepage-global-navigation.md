# Feature: F001 — Homepage and Global Navigation

## Metadata

Feature ID: F001
Phase: PHASE-001
Priority: P0
Status: FEATURE_COMPLETE
Owner Role: PRODUCT_LEAD
Approval Date: 2026-09-05

## User Goal

As a visitor, I can understand the SleepExcellent offering and move easily to a product category, search, account, cart, or contact action from any supported device without losing the existing premium brand experience.

## Approved Requirements

1. Preserve the existing homepage as the client-approved visual baseline, including its visual identity, typography, premium editorial direction, category presentation, video-led presentation, spacing, and overall styling language.
2. Preserve the working homepage images and videos already present in the demo. Do not replace them without a clear reason and approval.
3. Missing future catalogue media must not block homepage or navigation completion.
4. Retain the four-category presentation: Mattresses, Sofas, Beds, and Ceiling Solutions.
5. Retain the current mattress hero video and the sofa and bed collection videos, with their existing local fallback media and reduced-motion behavior.
6. Use catalogue-authoritative model names in navigation and collection menus where current mock data conflicts with the catalogue.
7. Make category, shop, search, account, cart, and contact controls lead to a real destination or working interface. Do not expose silent or dead placeholder controls.
8. Ceiling navigation leads to the ceiling catalogue and quote/consultation journey, not the normal direct-purchase cart flow.
9. Populate product-related homepage content only from authoritative catalogue records. Do not use conflicting mock names or prices.
10. Use the confirmed telephone and email values throughout the homepage.
11. Unverified testimonials, service claims, social destinations, and legal destinations must not be presented as confirmed facts or working links.
12. Preserve responsive behavior and polish overflow, alignment, keyboard access, touch behavior, focus handling, and responsive typography without redesigning the homepage.
13. Treat premium client-facing UI/UX as a primary F001 objective: preserve the established modern, spacious, editorial furniture/lifestyle language and use it as the design foundation for later pages.
14. Consult `docs/product/REFERENCE-ANALYSIS.md` for approved navigation, mobile, touch, cart-drawer, and ecommerce interaction patterns where relevant, without copying reference-site branding, content, media, icons, exact layouts, or styling.
15. Use a consistent design system and intentional control states; technical completion with an obvious visual or interaction regression is not ready for feature review.

Traceability: explicitly approved by the user on 2026-09-05 as “A1 — Homepage and Global Navigation APPROVED as proposed,” with the additional media-preservation rule.

## Acceptance Criteria

1. The completed homepage remains recognizably the same premium visual experience already shown to the client.
2. Existing working homepage/category images and videos remain in place unless a separately approved change authorizes replacement.
3. Missing catalogue product media does not prevent the homepage or global navigation from reaching a demonstrable completed state.
4. Header navigation works with mouse, keyboard, and touch at desktop and mobile widths.
5. Desktop collection menus expose catalogue-authoritative model names for the four categories.
6. Mobile navigation exposes all four categories plus shop, search, account, cart, and contact access.
7. Every visible primary navigation action and CTA has a working destination or interface; no visible action silently points to `#`.
8. Ceiling navigation reaches the ceiling catalogue/quote journey and does not imply direct cart purchase.
9. The homepage does not display a product name or price that conflicts with the authoritative catalogue.
10. Hero and collection media use local project files, preserve fallbacks, and respect reduced-motion preferences.
11. Telephone links use `tel:+919849256799` and `tel:+919044257999`; email links use `mailto:sleepexcellent999@gmail.com`.
12. Unverified testimonials, claims, social URLs, privacy policy, and terms are hidden, clearly unavailable, or replaced only with approved content.
13. Navigation drawers/modals manage keyboard focus appropriately and provide accessible names, close controls, and Escape behavior.
14. The homepage has no unintended horizontal overflow and remains readable and operable at mobile, tablet, laptop, and desktop widths.
15. Visual review confirms consistent typography, colour, spacing, content width, buttons, cards, icons, motion, hierarchy, CTA visibility, interaction feedback, media cropping, and mobile usability relative to the approved homepage baseline.
16. Relevant patterns from `REFERENCE-ANALYSIS.md` improve navigation and commerce discoverability without making the page look copied from Sleepwell or Wakefit.

## Out of Scope

- Full homepage redesign
- Wishlist
- Product comparison
- Store finder
- Loyalty or referral programs
- Promotional offer engine
- Blog or editorial CMS
- Admin editing of homepage content
- Replacing working homepage media without separate approval

## Dependencies

- `docs/product/CATALOGUE.md`
- F002 Catalogue Browsing and Search
- F003 Product Detail Experience
- Future approved account and cart features for their header destinations
- Client-provided social, testimonial, trust-claim, and legal content if those areas are displayed

## User Decisions

| Date | Decision | Approval Evidence | Effect |
| ---- | -------- | ----------------- | ------ |
| 2026-09-05 | Approve A1 as proposed. | User explicitly stated “A1 — Homepage and Global Navigation APPROVED as proposed.” | Registered F001 as an approved P0 feature. |
| 2026-09-05 | Preserve existing working homepage media; missing future media is non-blocking. | User supplied the additional media rule in the approval. | Existing homepage media is protected, and catalogue-media gaps cannot block F001. |

## Design References

Design authority, in order:

1. Existing homepage implementation — primary visual identity and brand baseline.
2. This approved feature specification — required behavior and scope.
3. `docs/product/REFERENCE-ANALYSIS.md` — approved ecommerce UX patterns and interaction guidance.
4. Reference websites — inspiration only; never copied.

`docs/product/CLIENT-BRIEF.md` and the responsive/accessibility requirements above remain supporting project truth.

## Architecture References

Approved initial architecture: `docs/architecture/SYSTEM-ARCHITECTURE.md`, `docs/architecture/ROUTES.md`, and ADR-001.

## Implementation Plan

Approved in `IMPLEMENTATION.md`; the user authorized implementation of F001 only on 2026-09-05.

## Implementation Status

Current state: FEATURE_COMPLETE
Summary: The approved homepage/global-navigation implementation and standard Next.js runtime migration are complete, developer-validated, accepted by the user after localhost review, and independently QA-verified against the F001 acceptance criteria.

## Implementation Summary

F001 preserves the existing premium editorial homepage and all approved local
homepage media while completing the global navigation and standard Next.js
foundation. Desktop category controls expose catalogue-authoritative model
lists; mobile navigation exposes all four categories plus browse, search,
account, cart, about, and contact access. Search, account, and cart controls
open intentional accessible interim interfaces without implementing their later
feature scope. Confirmed contact destinations are used everywhere, unverified
product mappings/prices/testimonials/social/legal links are not presented, and
the ceiling journey remains consultation-oriented.

The application now runs as a standard Next.js App Router project. The prior
Vinext/Vite/Cloudflare Worker/Wrangler/D1/Sites wiring was removed only after
the Next.js development server, production build, and homepage passed the
required checkpoint. See `components/home-page.tsx`,
`lib/site-data.ts`, `app/globals.css`, and
`tests/homepage.test.mjs`.

## Files Changed

| File | Purpose |
| ---- | ------- |
| `components/home-page.tsx` | Preserve and complete the homepage, navigation menus, responsive drawers/dialogs, focus handling, media fallbacks, contact actions, and factual content. |
| `lib/site-data.ts` | Centralize confirmed contact/media values and catalogue-authoritative model names; remove invented product and testimonial data. |
| `app/globals.css` | Refine the shared design tokens, intentional control states, overflow handling, and desktop menu alignment. |
| `package.json`, `package-lock.json` | Replace legacy runtime scripts/dependencies with standard Next.js commands and F001 validation scripts. |
| `next.config.ts`, `tsconfig.json`, `eslint.config.mjs` | Remove Cloudflare-only configuration and retain strict standard Next.js tooling. |
| `tests/homepage.test.mjs` | Add regression coverage for contact links, local media/fallbacks, dead links, and runtime migration. |
| `README.md` | Document the supported Node runtime and local development/validation commands. |
| `docs/architecture/CODEBASE-MAP.md` | Record the implemented foundation and current module/runtime boundaries. |
| `handoffs/tech-lead-to-engineering.md` | Record the authorized F001 ownership transition. |
| Project/feature/phase implementation records | Synchronize authorization, active state, UI/UX guidance, implementation evidence, and review gate. |
| Legacy Vinext/Vite/Cloudflare/D1 files | Removed `.openai/hosting.json`, `app/chatgpt-auth.ts`, `build/sites-vite-plugin.ts`, `db/`, `drizzle.config.ts`, `examples/d1/`, `vite.config.ts`, `worker/index.ts`, and the obsolete rendered-HTML test. |

## Developer Validation

| Check | Result | Evidence / Notes |
| ----- | ------ | ---------------- |
| Node runtime | PASS | Node.js 22.23.2 arm64 and npm 10.9.8. |
| TypeScript | PASS | `npm run typecheck`. |
| ESLint | PASS | `npm run lint`. |
| Automated tests | PASS | `npm test`: 3 tests passed, 0 failed. |
| Production build | PASS | `npm run build`: Next.js 16.2.6 webpack build compiled, typechecked, and statically prerendered `/`. |
| Production start | PASS | `npm start` reached Ready; localhost returned HTTP 200 and the browser loaded the production-built homepage without the development overlay. |
| Desktop browser review | PASS | 1280×720: hero/media, contact bar, sticky header, hover/click collection model menu, CTA hierarchy, and ceiling photo/text alignment reviewed; no horizontal overflow. |
| Tablet browser review | PASS | 820×1180: responsive header, hero crop/type, CTAs, and section flow reviewed; no horizontal overflow. |
| Mobile browser review | PASS | 390×844: hero, touch controls, navigation drawer, expanded category links, search panel, cart empty state, and ceiling media/copy reviewed; no horizontal overflow. |
| Interaction/accessibility basics | PASS | Skip link, semantic landmarks/headings, accessible dialog names, visible focus, close controls, keyboard focus containment/restoration, Escape handlers, reduced-motion media fallback, and touch-sized controls verified from source and browser interaction. |
| Contact destinations | PASS | Browser DOM contains only `tel:+919849256799`, `tel:+919044257999`, and `mailto:sleepexcellent999@gmail.com`; no empty or bare-`#` anchors. |
| Browser diagnostics | PASS | No application console errors; development log contained only React DevTools/HMR informational messages. |
| Visual/reference review | PASS | Remains visually consistent with the approved SleepExcellent homepage; uses relevant clear navigation, drawer, CTA, and empty-state patterns without copying reference-site branding/layout. |

## User Review

Status: Accepted
Feedback: User manually reviewed F001 on localhost and visually accepted the implementation, then authorized Engineering OS acceptance testing for F001 only.
Acceptance Date: 2026-09-05

## QA Testing

| Acceptance Criterion | Test | Result | Evidence |
| -------------------- | ---- | ------ | -------- |
| Premium visual baseline and local media preservation | Browser review and source/media regression test | PASS | 1280×720 rendered homepage retains the editorial hero, local mattress/sofa/bed/ceiling media, and established SleepExcellent hierarchy. |
| Desktop and mobile navigation | Browser interaction at 1440px and 390px | PASS | Four desktop collection menus render; the mobile drawer exposes Mattresses, Sofas, Beds, Ceilings, browse, search, account, cart, About, and contact. |
| Authoritative navigation and ceiling behavior | Browser semantic snapshot and `lib/site-data.ts` inspection | PASS | Menus display approved model names; ceiling controls lead to the consultation section and no direct-purchase CTA is implied. |
| Utility interfaces and no dead primary controls | Browser interaction and DOM audit | PASS | Search, account, and cart open intentional labelled interim panels; no empty or bare-`#` anchors were found. |
| Responsive layout and visual consistency | Browser review at 390×844, 820×1180, 1280×720, and 1440×900 | PASS | No horizontal overflow; navigation, media cropping, spacing, typography, CTA hierarchy, and the ceiling layout remain readable and operable. |
| Keyboard, focus, and motion | Browser interaction plus source inspection | PASS | Drawer and utility panels provide close controls, focus placement/restoration, and Escape closing; `useReducedMotion` supplies image fallbacks for motion media. |
| Contact links and unsupported content | DOM audit and source scan | PASS | Only the confirmed `tel:+919849256799`, `tel:+919044257999`, and `mailto:sleepexcellent999@gmail.com` destinations are used; no testimonial, availability, price, social, privacy, or terms claims are presented. |
| Runtime and architecture regression | `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, production HTTP check, diagnostics, and ADR review | PASS | All checks passed; the production build is static for `/` and returned HTTP 200 locally, browser reported no application console errors, and ADR-002 confirms Supabase PostgreSQL + Drizzle is deliberately established in F002 rather than by the removed D1 starter. |

## AI Evals, When Applicable

Not applicable. This feature does not include AI behavior.

## Known Limitations

- Authentic testimonials, approved trust claims, social URLs, and legal content remain PENDING CLIENT INPUT.
- Full catalogue search, account authentication, and cart commerce remain
  deferred to F002, F007, and F004; F001 provides explicit interim interfaces
  so their global controls are not dead.
- Missing future catalogue media is explicitly non-blocking.
- Existing files in `public/products/` remain deliberately unmapped pending
  authoritative product-media associations.
- The local Next.js 16 Turbopack production builder stalled; the validated
  production script uses Next.js's supported webpack builder. Development uses
  the standard `next dev` command.
- Vercel preview and deployment remain deferred to their approved later gate.

## Change History

| Date | Change | Reason | Approved By |
| ---- | ------ | ------ | ----------- |
| 2026-09-05 | Initial approved specification created. | Group A approval. | User |
| 2026-09-05 | Added the cross-cutting premium UI/UX priority and reference-analysis hierarchy. | Documentation clarification; no scope, architecture, priority, or workflow change. | User |
| 2026-09-05 | Implemented and developer-validated F001 on the standard Next.js App Router runtime. | Authorized F001 implementation and mandatory validation/documentation synchronization. | Codex / Software Engineer |
| 2026-09-05 | User accepted F001 and independent QA marked it FEATURE_COMPLETE. | Acceptance testing passed the approved F001 criteria without implementation changes. | User / Codex QA Engineer |
