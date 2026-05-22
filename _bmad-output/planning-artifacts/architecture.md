---
stepsCompleted: [1, 2, 3, 4, 5, 6]
workflowType: 'architecture'
project_name: 'MyPuzzleInventory'
user_name: 'Andrew'
date: '2026-05-22'
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-MyPuzzleInventory-2026-05-20/prd.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/product-brief.md
  - _bmad-output/planning-artifacts/research/market-jigsaw-puzzle-collection-tracking-research-2026-05-20.md
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements (35 total across 12 feature groups):**

- **Catalog (FR-1–4):** Publicly accessible Puzzle detail pages (SSR required for SEO), full-text catalog search with ranked results, browse/filter by brand/piece count/theme, and a scheduled scraper ingestion pipeline that is architecturally decoupled from the app.

- **Authentication (FR-5–8):** Email/password and Google OAuth via Supabase Auth. 30-day session persistence via secure httpOnly cookies. Username assignment for public profile URLs. Auth-on-write, browse-without-auth.

- **Collection Management (FR-9–11):** One Status per (User, Puzzle) pair. Optimistic UI with server rollback. Batch status badge fetching per results page. Duplicate Warning on detail pages for Status = Owned.

- **Onboarding Wizard (FR-12–15):** Post-signup only, one-time. Reuses catalog search. Magic Moment tracking (5 puzzles in first session). Inline Contribution Prompt within wizard context.

- **My Collection / My Wishlist (FR-16–19):** Authenticated pages with sort/filter. Quick status actions without detail page navigation. Buy button → Affiliate Redirect (new tab).

- **Affiliate Redirect (FR-20–22):** `/r/[link_id]` endpoint — log click then 302 redirect. Must respond <200ms p95. Click logging must NOT block redirect. Internal dashboard (admin-only, daily aggregation).

- **Public Profile (FR-23–24):** `/u/[username]` — no auth required, SSR required for social crawlers, Buy buttons work for unauthenticated visitors.

- **Data Import/Export (FR-25–26):** CSV export (always free, all users). CSV import with column-mapping, preview/confirmation flow, up to 500 rows.

- **Contribution Prompt (FR-27–28):** Zero-results state captures submissions. Admin queue for review/approval. No auto-catalog creation.

- **Custom Puzzles (FR-29–30):** User-scoped records, never in global catalog search, appear in user's Collection/Wishlist/Public Profile. Image upload (JPG/PNG ≤5MB).

- **Premium Tier (FR-31–35):** Stripe subscription management with webhook sync. Downgrade preserves data. Collection valuation, lent-out tracking, multiple wishlists, advanced stats.

**Non-Functional Requirements:**

| Requirement | Target | Architectural Impact |
|---|---|---|
| Puzzle detail page TTFB | <300ms p95 | SSR or ISR required — no client-side-only rendering |
| Catalog search response | <500ms p95 | Server-side full-text search; caching strategy needed |
| Affiliate Redirect response | <200ms p95 | Lightweight route handler; async click logging |
| My Collection/Wishlist load | <1.5s p95 for ≤500 puzzles | Pagination or efficient batch queries |
| SEO | SSR + OG + JSON-LD + sitemap | App Router server components or pages router with SSR |
| Security | httpOnly cookies, input sanitization, Affiliate Redirect validates link_id | Middleware-level auth, no open redirect |
| Accessibility | Keyboard nav, text+color status badges | Component design concern |
| Scraper isolation | Scraper failure ≠ app degradation | Separate deployment/repo; app reads from DB only |
| GDPR | Data deletion mechanism (manual v1) | Admin tooling and deletion cascade policy needed |
| Stripe | No card data on app servers | Stripe-hosted checkout + webhook sync |

**Scale & Complexity:**

- Primary domain: Full-stack web application (Next.js, SSR-required)
- Complexity level: **Medium** — no real-time features, no WebSockets, no offline required; complexity is in the SSR/SEO layer, affiliate infrastructure, and scraper decoupling
- Estimated architectural components: ~8 (Web app, DB, Auth, Scraper (separate), Affiliate Redirect, Admin, Object Storage, Stripe webhook handler)
- Target load: 5,000 MAU at month 6 — modest; no distributed/sharding concerns at v1

### Technical Constraints & Dependencies

- **Assumed stack (A-6):** Next.js + PostgreSQL + Supabase Auth on Vercel. Architecture decisions should validate or refine this assumption explicitly.
- **Supabase Auth:** Handles email/password, Google OAuth, session cookies — confirm as a commitment before building.
- **Stripe:** Payment processing. Webhooks must reach the app (Vercel function endpoint). Subscription status cached on User record.
- **Scraper infrastructure:** Separate repo/deployment. Imports to catalog DB via internal API. Four anchor brands (Ravensburger, Buffalo Games, Cobble Hill, White Mountain). Image deduplication via perceptual hash.
- **Affiliate programs (OI-1 BLOCKER):** Amazon Associates ToS must be verified before building affiliate infrastructure. Architecture should be affiliate-program-agnostic (Retailer Links store destination URLs; the redirect endpoint doesn't know or care about the specific program).
- **Image hosting:** Custom Puzzle uploads (JPG/PNG ≤5MB) and catalog puzzle images require object storage (Supabase Storage, Vercel Blob, or S3-compatible).

### Cross-Cutting Concerns Identified

1. **Authentication boundary:** Auth-on-write everywhere; browse-without-auth for all catalog and public profile surfaces. Must be enforced consistently — middleware pattern or route-level guards.

2. **SSR requirement:** Puzzle detail pages and Public Profile require SSR (not CSR) for SEO and social sharing. Two-phase render pattern: fast server-rendered shell with personalised ownership badges loaded as a second pass. These require distinct cache strategies: public catalog pages (long TTL, CDN-cacheable), authenticated contexts (no-store or short TTL).

3. **Affiliate click integrity:** Click must be logged before redirect; failed log write must NOT block redirect. Async-write pattern with fire-and-forget logging — but requires a dead-letter mechanism (failed_clicks table or persistent log drain) to prevent silent underreporting.

4. **Admin vs. user access:** Affiliate dashboard and Contribution Queue are admin-only. Separate access control layer needed (not just route protection — data access too).

5. **Scraper decoupling:** The catalog ingestion pipeline is a separate system. The app reads from DB only; it never calls scrapers directly. Scraper → internal API → DB is the only write path for catalog data. This interface contract (direct DB write vs. staging table vs. API) must be explicit before either system is built.

6. **Data portability:** CSV export must be always free and available from day one — a trust commitment that cannot be gated.

7. **Optimistic UI with rollback:** Status actions (Own/Want/Completed) are optimistic. Server errors must roll back UI state with user feedback.

### Pre-Architecture Decisions Required (Before Schema or Code)

The following must be resolved before architectural decisions are locked — identified through multi-perspective analysis:

**1. Catalog canonicalization model (highest priority — unlocks everything below)**
Define what makes a puzzle record "canonical." Three options: (a) scraper-only, editorially approved; (b) user-contributed + editor-curated; (c) crowdsourced with trust scores. This single decision determines the contribution queue CRUD model, cache TTL strategy, scraper integration contract, RLS policy design, and data deletion cascade behavior for contributed records.

**2. Duplicate/match confidence model**
Define confidence tiers for puzzle matching (exact match, fuzzy match, user-confirmed match, unmatched). This determines the search result UI trust hierarchy, the contribution queue deduplication logic, the onboarding empty state design, and whether premium features include "high-confidence dedup" or "manual override."

**3. User data taxonomy with explicit deletion behaviors**
Map every user-associated data category to its delete behavior before writing any schema:

| Category | Examples | Delete Behavior |
|---|---|---|
| Identity data | email, auth UID | Hard delete |
| Contributed content | submitted puzzle records | Orphan (set NULL) or anonymize — TBD |
| Personal inventory | collection, wishlist | Hard delete |
| Behavioral data | affiliate clicks, session logs | Anonymize with retention period |
| Uploaded images | custom puzzle photos | Hard delete + S3 cleanup job |
| Stripe customer | subscription record | Stripe deletion + local soft-delete |

**4. Free vs. Premium feature table**
A two-column table of Free vs. Premium features before any auth-adjacent code is written — required to design RLS policies, middleware entitlement checks, and the Stripe webhook sync schema.

**5. Page render state machine**
Named states for all page render contexts: public cached, authenticated, session-expired mid-browse, premium vs. free viewing a gated feature, own-profile vs. others-profile. Without this, every component that makes auth decisions will invent its own rule.

**6. Contribution queue actor/CRUD model**
For each actor (anonymous, registered user, contributor, moderator, admin): what operations are permitted on each queue item state. Determines FK nullability, RLS policies, and the moderation UI data model.

**7. Image upload state machine**
Named states: pending, processing, failed, succeeded — with corresponding UI treatments and pub/sub events. Required before the image pipeline architecture is chosen (resize-on-upload vs. CDN transform).

**8. Explicit offline decision**
Decide: online-only (with graceful error state) or PWA/service-worker capable. This closes or opens a significant architectural door. v1 assumption is online-only — but must be explicit, not accidental.

**9. Error catalog**
10–15 named error conditions (e.g., puzzle-not-found for soft-deleted vs. never-existed, scraper import partial failure, affiliate link invalid, contribution rejected vs. pending) with user-visible message and HTTP status — before the API layer is built.

**10. Operational posture for solo developer**
Minimum viable alerting: Stripe webhook failure alert window, uptime monitoring, Vercel deploy rollback story. Architecture must be operable by one person at 11pm on a Saturday.

### Dependency Unlock Sequence

These pre-architecture decisions form a dependency chain:

1. **Canonicalization model** → unlocks contribution queue CRUD, cache strategy, scraper contract
2. **Confidence/match model** → unlocks search UI trust hierarchy, onboarding empty state, premium feature boundary
3. **User data taxonomy** → unlocks RLS policies, deletion handler, image cleanup jobs, GDPR compliance posture
4. All three → **Free vs. Premium table** → unlocks auth middleware design
5. All above → **Schema design** → unlocks implementation stories

---

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application with SSR requirements, requiring a framework that supports server-side rendering for SEO, server components for auth-aware pages, Route Handlers for the affiliate redirect endpoint and Stripe webhooks, and tight integration with Supabase Auth's cookie-based session pattern.

### Starter Options Considered

**Option A: T3 Stack (`create-t3-app`)**

Bundles Next.js + tRPC + Prisma + Tailwind + NextAuth. Evaluated and rejected for this project because:
- NextAuth (Auth.js) directly conflicts with Supabase Auth — two competing auth systems in one repo
- Prisma cannot manage the `auth.*` schema that Supabase Auth owns, creating two migration authorities (`prisma/migrations/` vs `supabase db push`) that will desync
- tRPC adds no value for the two most critical endpoints: `/r/[link_id]` (affiliate redirect, plain Route Handler) and Stripe webhooks (raw HTTP with signature verification)
- Prisma's traditional client is not Vercel edge-compatible without Prisma Accelerate; Supabase's client is already designed for this environment

**Option B: Vanilla `create-next-app` + Drizzle ORM + `@supabase/ssr`** ✅ Selected

Single coherent data and auth layer. Drizzle ORM replaces Prisma without its conflicts: migrations are plain SQL files managed by `drizzle-kit`, the `auth.*` schema is left entirely to Supabase, and typed queries work alongside Supabase's RLS policies rather than around them.

### Selected Starter

**`create-next-app` + Drizzle ORM + `@supabase/ssr` + Tailwind CSS**

**Rationale:** T3 Stack's value proposition is the integration of NextAuth + Prisma + tRPC. Supabase Auth replaces NextAuth — T3's anchor dependency. Carrying T3 means paying the maintenance cost of Prisma migrations alongside Supabase migrations, fighting two auth systems, and holding two Postgres clients open in the same request handlers. Vanilla + Drizzle gives a flat, legible architecture: one auth pattern everywhere, one migration authority, no adapter shims.

**Initialization Command:**

```bash
npx create-next-app@latest my-puzzle-inventory --typescript --tailwind --eslint --app --src-dir
```

> Note: `create-next-app` now defaults to TypeScript, Tailwind, ESLint, and App Router — the flags above are explicit for clarity. `--src-dir` puts source files under `src/` for cleaner project organization.

**Then add:**

```bash
npm install @supabase/supabase-js@^2.106.1 @supabase/ssr@^0.10.3
npm install drizzle-orm@^0.45.2 postgres
npm install -D drizzle-kit
```

**First files to create after scaffold (before any feature work):**

```
src/lib/supabase/server.ts         # createServerClient() with cookies() helper
src/lib/supabase/client.ts         # createBrowserClient() helper
src/middleware.ts                  # session refresh + route protection
src/app/api/auth/callback/route.ts # OAuth code exchange route
src/db/schema.ts                   # Drizzle table definitions (start empty)
src/db/index.ts                    # drizzle(pool) singleton
drizzle.config.ts                  # Drizzle Kit config pointing to Supabase DB URL
```

Auth must work and be tested (401 on unauthenticated protected route) before any feature code is written.

### Architectural Decisions Provided by Starter

**Language & Runtime:**
TypeScript throughout. `tsconfig.json` with `@/*` import alias. Strict mode recommended for a solo developer — type errors at compile time are cheaper than runtime bugs at 11pm.

**Styling Solution:**
Tailwind CSS (included by default in `create-next-app`). No additional CSS-in-JS library. Tailwind's utility classes are sufficient for the component complexity in this product (no design system, no animation-heavy interactions).

**Build Tooling:**
Next.js App Router with Turbopack for development (default in current `create-next-app`). Vercel for deployment — zero-config for Next.js, edge function support for the affiliate redirect endpoint if needed.

**ORM & Migrations:**
Drizzle ORM (`drizzle-orm` v0.45.2) with `drizzle-kit` for migrations. Migrations generated as plain `.sql` files in `drizzle/migrations/` — single source of truth. `drizzle-kit push` for development; `drizzle-kit generate` + `supabase db push` for production migrations.

**Testing Framework:**
Not scaffolded by `create-next-app` — add separately. Recommended: Vitest for unit/integration tests (fast, TypeScript-native), Playwright for E2E. Add after first feature is working, not on day one.

**Code Organization:**
```
src/
  app/                  # Next.js App Router pages and layouts
    (auth)/             # Auth routes (login, signup, callback)
    (admin)/            # Admin routes (affiliate dashboard, contribution queue)
    api/                # Route Handlers (webhook endpoints, affiliate redirect)
    r/[link_id]/        # Affiliate redirect
    u/[username]/       # Public profile (SSR)
    puzzles/[slug]/     # Puzzle detail (SSR)
  components/           # Shared React components
  db/                   # Drizzle schema and client
  lib/
    supabase/           # Supabase client helpers (server + browser)
    auth/               # Auth utilities (getUser, requireUser)
    stripe/             # Stripe client and webhook helpers
  types/                # Shared TypeScript types
drizzle/
  migrations/           # Generated SQL migration files
```

**Development Experience:**
- Turbopack dev server (fast HMR)
- `supabase gen types typescript` for DB type generation into `src/types/database.types.ts`
- ESLint configured by default

**Note:** Project initialization using the command above should be the first implementation story. Auth wiring (middleware + callback route + protected route test) should be the second story before any catalog or collection features are built.

**Package versions verified:** May 2026
- `create-next-app`: latest (Next.js 15+)
- `@supabase/supabase-js`: 2.106.1
- `@supabase/ssr`: 0.10.3
- `drizzle-orm`: 0.45.2
- `drizzle-kit`: 1.0.0-rc.3 (active release candidate; use `latest` tag)

---

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Catalog canonicalization model — determines contribution queue schema, RLS policies, cache strategy
- User data taxonomy with deletion cascade — determines every table's FK nullability and GDPR posture
- Free vs. Premium feature boundary — determines auth middleware and entitlement enforcement pattern
- Search implementation — determines DB schema additions (`tsvector`, `pg_trgm` indexes)

**Important Decisions (Shape Architecture):**
- Soft/hard delete strategy — affects every query's `WHERE` clause
- Caching strategy — affects all public-facing page rendering
- Client-side state approach — affects all interactive components
- Scraper integration contract — affects catalog DB schema and security model

**Deferred Decisions (Post-MVP):**
- Supabase region migration (reassess at month 4 if EU traffic >15%)
- TanStack Query (revisit if server state complexity grows significantly)
- Drizzle Kit stable release (currently rc.3; upgrade when v1.0.0 stable ships)

---

### Data Architecture

**Decision: Catalog Canonicalization Model**
- Choice: **Option A — Scraper-only canonical records**
- Canonical `puzzles` table records are created only by scrapers or admin action
- User contributions enter `contribution_queue` table; admin reviews and promotes approved records to `puzzles`
- Custom Puzzles (FR-29) are user-scoped private records in `custom_puzzles` — never canonical
- Contributor status visibility: queue items must expose state (`pending` → `approved` → `live`) to the submitting user
- Rationale: v1 catalog quality control. Contribution-to-canonical promotion is an admin workflow, not a community system. Scraper is the authoritative source for the four anchor brands.
- Cascading implication: contribution queue CRUD model is admin-gated; `puzzles` table has no direct user write path

**Decision: Search Implementation**
- Choice: **Postgres `pg_trgm` + `tsvector`**
- `tsvector` column on `puzzles` (title, brand, artist, theme tags) for ranked full-text search
- `pg_trgm` GIN index for fuzzy/partial match ("botanical" surfaces "Garden Botanica")
- Search results ranked: exact title > fuzzy title > brand/artist > theme tag
- No external search service at v1; re-evaluate if catalog exceeds 50,000 records
- Rationale: already in the DB, zero additional service, handles 5k–50k puzzles comfortably

**Decision: Delete Strategy**
- Choice: **Mixed — soft-delete for user-visible records, hard-delete for operational data**

| Table | Strategy | Column |
|---|---|---|
| `puzzles` | Soft-delete | `deleted_at TIMESTAMPTZ` |
| `user_puzzle` | Soft-delete | `deleted_at TIMESTAMPTZ` |
| `custom_puzzles` | Hard-delete | — |
| `retailer_links` | Soft-delete | `deleted_at TIMESTAMPTZ` |
| `contribution_queue` | Hard-delete (rejected) / promote (approved) | — |
| `affiliate_clicks` | Anonymize on user deletion | `user_id → NULL`, retain for reporting |
| `processed_webhook_events` | Hard-delete after 90 days | `created_at` TTL |
| `profiles` | Soft-delete (30-day grace) then hard-delete | `deleted_at TIMESTAMPTZ` |

- All queries on soft-deleted tables must include `WHERE deleted_at IS NULL` — enforced via Drizzle query helpers, not raw SQL

**Decision: Image Storage and Processing**
- Choice: **Supabase Storage + transform URL parameters**
- Catalog images: stored in `puzzles` bucket, public read
- User uploads (custom puzzles): stored in `user-uploads` bucket, private with signed URLs
- Image delivery: Supabase Storage transform URL (`?width=300&height=300&resize=contain`) for thumbnails — no custom resize worker
- Upload constraints: JPG/PNG ≤5MB enforced at upload handler; client-side validation before POST
- Image upload states: `pending` → `processing` → `complete` | `failed` — stored on the record; UI reflects state; retry available on `failed`
- On user account deletion: `user-uploads` bucket objects deleted via storage cleanup job triggered by deletion cascade

**Decision: Caching Strategy**
- Public catalog pages (puzzle detail, `/puzzles/[slug]`): `revalidate = 3600` (ISR, 1-hour CDN cache)
- Public profile pages (`/u/[username]`): `revalidate = 300` (ISR, 5-minute cache — profile changes should propagate faster)
- Authenticated pages (`/collection`, `/wishlist`, `/settings`): `cache: 'no-store'`
- Two-phase render for search results: server renders puzzle list (cached); client-side `useEffect` calls `fetchUserPuzzleStates(puzzleIds[])` Server Action to batch-fetch ownership badges post-hydration
- Cache invalidation on admin catalog edit: `revalidateTag('puzzle-{slug}')` via Next.js cache tags

---

### Authentication & Security

**Decision: Authorization Enforcement Pattern**
- Choice: **Application-layer primary, RLS as safety net**
- All authorization logic lives in Next.js Route Handlers and Server Actions — readable, testable, debuggable
- RLS policies exist on `user_puzzle` and `profiles` as a second layer (prevents direct Supabase client abuse)
- RLS is NOT the primary enforcement mechanism — it is the last line of defense
- `requireUser()` utility in `src/lib/auth/get-user.ts` throws 401 on unauthenticated requests; used at the top of every protected Server Action and Route Handler

**Decision: Premium Feature Gate**
- Choice: **`premium_until TIMESTAMPTZ` on `profiles` table**
- Stripe webhook handler (`/api/webhooks/stripe`) sets `premium_until = subscription_end_date` on successful payment, `premium_until = NOW()` on cancellation/expiry
- `requirePremium()` utility checks `profiles.premium_until > NOW()` — used as a guard in premium Server Actions
- Stripe webhook idempotency: `processed_webhook_events(stripe_event_id UNIQUE)` — check before processing, insert after
- Downgrade behaviour: `premium_until` expires naturally; Premium-only data (extra wishlists) is preserved but inaccessible until re-subscribe

**Decision: Admin Role Detection**
- Choice: **`app_metadata.role = 'admin'` in Supabase JWT**
- Set once in Supabase dashboard for Andrew's account
- `requireAdmin()` utility reads `user.app_metadata.role === 'admin'` from Supabase session — no DB query
- All `(admin)/` routes protected by `requireAdmin()` in their layout or individual Server Actions

**Additional Security Decisions:**
- Affiliate Redirect validation: `link_id` validated against `retailer_links` table; unknown IDs return 404 — no open redirect
- All user-supplied input (search, contribution form, CSV import) sanitized before persistence
- Stripe webhook signature verified via `stripe.webhooks.constructEvent()` before any processing
- httpOnly, SameSite=Strict cookies for auth (handled by `@supabase/ssr`)

---

### API & Communication Patterns

**Decision: Server Actions vs. Route Handlers**
- **Server Actions** (`'use server'`): all mutations from React components — toggle puzzle status, create custom puzzle, submit contribution, update settings, CSV export trigger
- **Route Handlers**: external-facing endpoints only — `/r/[link_id]` affiliate redirect, `/api/webhooks/stripe`, `/api/auth/callback`, `/api/ingest` (scraper)
- No REST API built for UI interactions — Server Actions are the data layer for all in-app mutations

**Decision: Scraper-to-Catalog Integration**
- Choice: **Direct DB write via dedicated `scraper` Postgres role**
- Scraper repo has its own Postgres connection string with a `scraper` role
- `scraper` role has: `INSERT`, `UPDATE` on `puzzles` and `retailer_links` tables only — no other access
- Scraper writes directly to production DB; no staging table or API middleman at v1
- Scraper run produces a JSON manifest (puzzle count, new additions, updated records, errors) — stored to Supabase Storage for admin review
- Scraper failure does not affect the app; app reads from DB only

**Decision: Affiliate Redirect Pattern**
Route Handler at `src/app/r/[link_id]/route.ts`:
1. Validate `link_id` against `retailer_links` — 404 on unknown
2. Check `is_in_stock` — 410 on out-of-stock link (do not redirect to unavailable product)
3. Fire-and-forget click insert: `supabase.from('affiliate_clicks').insert(...)` — NOT awaited
4. Return `NextResponse.redirect(destination_url, { status: 302 })`
5. On insert failure: catch silently, write structured log to Vercel Log Drain — redirect still fires
6. Bot detection: check `User-Agent` against basic bot list; flagged clicks inserted with `is_bot: true` — not blocked, but excluded from revenue reporting

---

### Frontend Architecture

**Decision: Client-Side State Management**
- Choice: **`useOptimistic` + Server Actions + `nuqs` for URL state — no state manager library**
- Status toggles (Own/Want/Completed): `useOptimistic` in `PuzzleCard.tsx` via `useTogglePuzzleStatus()` hook → Server Action in `src/app/actions/puzzles.ts`
- Ownership badge second-pass: `useEffect` in `SearchResults.tsx` calls `fetchUserPuzzleStates(puzzleIds[])` Server Action; result cached in component state (`Map<puzzleId, status>`)
- Onboarding wizard step state: plain `useState` — transient client UI state, not server state
- Collection/Wishlist filters and sort: `nuqs` manages URL state; Server Action fetches on param change
- No `useOptimistic` for navigation or multi-step flows — `useState` only

**Decision: Component Interaction Patterns**
- Optimistic toggle rollback: `useOptimistic` + `useTransition`; on Server Action error, `startTransition` rolls back and shows toast error
- Loading states: `useFormStatus` within Server Action forms; `isPending` from `useTransition` for button loading states
- Error display: inline toast (bottom of viewport, auto-dismiss 4s) for transient errors; inline field errors for form validation

---

### Infrastructure & Deployment

**Decision: CI/CD**
- Vercel automatic deploys from `main` branch — zero-config for Next.js
- Preview deployments on every PR against `main`
- DB migrations: `drizzle-kit generate` produces `.sql` files committed to repo; run `supabase db push` manually before merging breaking schema changes
- No GitHub Actions for the app at v1; add only if deployment complexity grows

**Decision: Monitoring & Alerting**
- Sentry (free tier): client + server error tracking; alert on Stripe webhook failures and affiliate redirect 500s
- Vercel Analytics (built-in): Core Web Vitals, page performance, Affiliate Redirect latency
- Supabase dashboard: DB metrics, auth logs, storage usage
- No custom monitoring infrastructure at v1

**Decision: Supabase Region**
- Launch: `us-east-1` (North America)
- GDPR posture at launch (mandatory, pre-launch): Privacy Policy naming data flows + Supabase DPA signed + user account deletion mechanism
- Reassess at month 4: if EU users exceed 15% of active users, migrate to `eu-west-1` with Standard Contractual Clauses (SCCs)
- Region migration is a 48–72 hour operational lift, not an architectural rewrite — deferred deliberately

**Decision: GDPR Minimum Viable Posture (pre-launch, non-negotiable)**
1. Privacy Policy: names Supabase (US-hosted DB), Google OAuth token storage, affiliate click log with IP, Stripe payment processing; includes retention periods
2. Supabase DPA: signed (Supabase provides template); establishes Supabase as processor, Andrew as controller
3. Account deletion mechanism: user-initiated deletion cascades across all tables per the user data taxonomy in §Project Context; 30-day right-to-erasure response window

---

## Implementation Patterns & Consistency Rules

### Naming Conventions

**Database (Drizzle schema) — snake_case throughout:**
- Tables: plural snake_case — `puzzles`, `user_puzzle`, `retailer_links`, `affiliate_clicks`, `contribution_queue`, `custom_puzzles`, `profiles`
- Columns: snake_case — `puzzle_id`, `created_at`, `deleted_at`, `is_in_stock`
- Foreign keys: `{singular_table}_id` — `puzzle_id`, `user_id`
- Boolean columns: `is_` prefix — `is_in_stock`, `is_bot`
- Timestamp columns: `_at` suffix — `created_at`, `updated_at`, `deleted_at`, `premium_until`
- Indexes: `idx_{table}_{column(s)}` — `idx_puzzles_brand`, `idx_user_puzzle_user_id`

**TypeScript / React:**
- Variables and functions: camelCase — `puzzleId`, `getUserPuzzleStates`, `toggleStatus`
- React components: PascalCase — `PuzzleCard`, `SearchResults`, `OnboardingWizard`
- Component files: PascalCase — `PuzzleCard.tsx`, `SearchResults.tsx`
- Non-component files: kebab-case — `get-user.ts`, `stripe-helpers.ts`, `action-response.ts`
- Server Action files: kebab-case in `src/app/actions/` — `puzzles.ts`, `collection.ts`
- Custom hooks: `use` prefix camelCase — `useTogglePuzzleStatus`, `useFetchUserPuzzleState`

**Route parameters: snake_case folder names, accessed via `params`:**
- Affiliate redirect: `src/app/r/[link_id]/route.ts` → `params.link_id`
- Puzzle detail: `src/app/puzzles/[slug]/page.tsx` → `params.slug`
- Public profile: `src/app/u/[username]/page.tsx` → `params.username`
- Note: folder names use snake_case for consistency with DB naming; `params` keys match the folder name exactly

**TypeScript types:**
- Drizzle inferred types re-exported from `src/lib/db/types.ts` with domain names: `export type Puzzle = typeof puzzlesTable.$inferSelect`
- Component props: `interface` (not `type`) — `interface PuzzleCardProps { ... }`
- No inline `type` aliases for domain objects; import from `src/lib/db/types.ts`
- DB-sourced nullable fields: `string | null` in component props — never transform `null → undefined` at boundaries

---

### Project Structure

**Component organisation — by feature, not by type:**
```
src/components/
  puzzle/       # PuzzleCard, PuzzleDetail, PuzzleSearch, PuzzleStatusBadge
  collection/   # CollectionGrid, CollectionFilters, CollectionStats
  wishlist/     # WishlistItem, WishlistBuyButton
  onboarding/   # OnboardingWizard, WizardStep, WizardProgress
  profile/      # PublicProfile, ProfileWishlist
  admin/        # ContributionQueue, AffiliateClickDashboard
  ui/           # Button, Toast, Badge, Input, Skeleton, EmptyState, Modal — stateless primitives only
  layout/       # Header, Footer, Nav, AuthNav
```

**Server Actions — one file per domain:**
```
src/app/actions/
  puzzles.ts        # toggleStatus, fetchUserPuzzleStates, createCustomPuzzle, editCustomPuzzle, deleteCustomPuzzle
  collection.ts     # getCollection, exportCollectionCsv, importCollectionCsv
  contributions.ts  # submitContribution
  onboarding.ts     # addPuzzleFromWizard, completeOnboarding, skipOnboarding
  admin.ts          # approveContribution, rejectContribution, getAffiliateClickReport
  profile.ts        # updateUsername, updateSettings, deleteAccount
  search.ts         # searchPuzzles, fetchUserPuzzleStates (batch)
```

**Database queries — reusable query functions separate from schema:**
```
src/lib/db/
  schema.ts         # All Drizzle table definitions (single file)
  index.ts          # drizzle(pool) singleton
  types.ts          # Re-exported inferred types with domain names
  queries/
    puzzles.ts      # findPuzzleBySlug, searchPuzzles, findSoftDeleted
    user-puzzle.ts  # getUserCollection, getUserWishlist, getUserPuzzleStatus
    profiles.ts     # getProfile, updatePremiumUntil
    clicks.ts       # insertClick, getClickReport
```

**Test co-location:**
- Unit/integration tests: same directory as the file — `PuzzleCard.tsx` → `PuzzleCard.test.tsx`
- E2E tests: `e2e/` at project root

---

### Shared Utilities

**`src/lib/action-response.ts` — typed Server Action return helper:**
```typescript
export type ActionResult<T> = ActionSuccess<T> | ActionError
export type ActionSuccess<T> = { success: true; data: T }
export type ActionError = { success: false; error: string; code?: string }

export function ok<T>(data: T): ActionSuccess<T> {
  return { success: true, data }
}
export function err(error: string, code?: string): ActionError {
  return { success: false, error, code }
}
```

**`src/lib/auth/get-user.ts` — auth utilities:**
```typescript
// requireUser: returns User or returns { success: false } — NEVER throws
export async function requireUser(): Promise<User | null>

// useRequireUser: Server Action wrapper — returns err() if unauthenticated
export async function useRequireUser(): Promise<User | ActionError>

// requirePremium: checks profiles.premium_until > NOW()
export async function requirePremium(userId: string): Promise<boolean>
```
- `requireUser()` returns `null` on unauthenticated — does NOT throw
- All Server Actions must call `requireUser()` and handle the `null` case explicitly

**`src/lib/env.ts` — validated environment variables:**
```typescript
// All process.env access goes through this file — never inline process.env calls
export const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
  // ... validated at module load; missing vars throw at startup, not at runtime
}
```

---

### Format Patterns

**Server Action return — discriminated union, always typed:**
```typescript
// CORRECT — data typed, undefined excluded via early return
export async function getPuzzle(slug: string): Promise<ActionResult<Puzzle>> {
  try {
    const user = await requireUser()
    if (!user) return err('Not authenticated', 'UNAUTHENTICATED')

    const puzzle = await db.query.puzzles.findFirst({
      where: and(eq(puzzlesTable.slug, slug), isNull(puzzlesTable.deletedAt))
    })
    if (!puzzle) return err('Not found', 'NOT_FOUND')  // ← exclude undefined before ok()

    return ok(puzzle)  // T = Puzzle, never Puzzle | undefined
  } catch (e) {
    console.error('[getPuzzle]', e)
    return err('Something went wrong', 'INTERNAL')
  }
}
```
- Every Server Action has a top-level try/catch
- `ok()` is only called after null/undefined checks — `data` is never `undefined` on success
- Error codes: SCREAMING_SNAKE_CASE — `NOT_FOUND`, `UNAUTHENTICATED`, `FORBIDDEN`, `INTERNAL`

**API (Route Handler) error format:**
```typescript
return NextResponse.json({ error: 'Human readable message' }, { status: 404 })
// NOT: return NextResponse.json({ success: false, error: '...' })  ← union format is Server Actions only
```

**HTTP status codes:**
| Condition | Status |
|---|---|
| Unauthenticated | 401 |
| Authenticated but not authorized | 403 |
| Resource not found (including soft-deleted) | 404 |
| Out-of-stock affiliate link | 410 |
| Validation error | 400 |
| Server error | 500 |

**Dates:** `TIMESTAMPTZ` in DB always; ISO 8601 strings in JSON (`"2026-05-22T14:30:00.000Z"`); formatted client-side with `Intl.DateTimeFormat` — never server-side

**Null handling at boundaries:** DB nullable columns remain `null` through Server Action return — never transformed to `undefined`. Component props for DB-sourced nullable fields typed as `string | null`, not `string | undefined`.

---

### Process Patterns

**Auth guard — two-step: authn then authz:**
```typescript
export async function updateCustomPuzzle(puzzleId: string, data: UpdateData): Promise<ActionResult<CustomPuzzle>> {
  try {
    const user = await requireUser()
    if (!user) return err('Not authenticated', 'UNAUTHENTICATED')

    // AUTHZ: verify ownership — not just authentication
    const puzzle = await db.query.customPuzzles.findFirst({
      where: and(
        eq(customPuzzlesTable.id, puzzleId),
        eq(customPuzzlesTable.userId, user.id),  // ← ownership check
        isNull(customPuzzlesTable.deletedAt)
      )
    })
    if (!puzzle) return err('Forbidden', 'FORBIDDEN')

    // ... mutation
    return ok(updated)
  } catch (e) {
    console.error('[updateCustomPuzzle]', e)
    return err('Something went wrong', 'INTERNAL')
  }
}
```

**Soft-delete filter — applies to SELECT, UPDATE, and DELETE on all soft-deleted tables:**
```typescript
// SELECT — always include deletedAt IS NULL
db.select().from(puzzlesTable).where(isNull(puzzlesTable.deletedAt))

// JOINS — filter on every joined table that has deletedAt
db.select().from(userPuzzleTable)
  .innerJoin(puzzlesTable, eq(userPuzzleTable.puzzleId, puzzlesTable.id))
  .where(and(
    eq(userPuzzleTable.userId, userId),
    isNull(puzzlesTable.deletedAt)  // ← required on joined table too
  ))

// UPDATE — never mutate soft-deleted rows unless intentional (with comment)
db.update(puzzlesTable)
  .set({ title: newTitle })
  .where(and(eq(puzzlesTable.id, id), isNull(puzzlesTable.deletedAt)))  // ← required

// FORBIDDEN — querying without filter
db.select().from(puzzlesTable)  // ← never
```

**Optimistic UI — always wrap await in try/catch inside startTransition:**
```typescript
const [optimisticStatus, setOptimisticStatus] = useOptimistic(currentStatus)
const [isPending, startTransition] = useTransition()

async function handleToggle(newStatus: Status) {
  startTransition(async () => {
    setOptimisticStatus(newStatus)
    try {
      const result = await togglePuzzleStatus(puzzleId, newStatus)
      if (!result.success) throw new Error(result.error)
      // useOptimistic auto-reverts if action settles with original state
    } catch {
      setOptimisticStatus(currentStatus)  // explicit rollback on throw or !success
      toast.error('Could not update status. Try again.')
    }
  })
}
```
- `useOptimistic` auto-reverts on Server Action completion; explicit rollback handles throws and `!success`
- `isPending` from `useTransition` → button `disabled={isPending}`, never local `isLoading` boolean

**Form validation — Zod schemas, server-authoritative:**
```typescript
// src/lib/validations/puzzles.ts
export const createCustomPuzzleSchema = z.object({
  title: z.string().min(1).max(200),
  pieceCount: z.number().int().positive().optional(),
})

// Server Action: validate first, before any DB work
const parsed = createCustomPuzzleSchema.safeParse(input)
if (!parsed.success) return err(parsed.error.issues[0].message, 'VALIDATION')

// Client: mirror with zodResolver (react-hook-form) for inline feedback
// import { zodResolver } from '@hookform/resolvers/zod'
```

**Data fetching — Server Components read directly; no Route Handlers for UI data:**
```typescript
// CORRECT — Server Component fetches via Drizzle query function
// src/app/puzzles/[slug]/page.tsx (Server Component)
const puzzle = await findPuzzleBySlug(slug)
if (!puzzle) notFound()

// FORBIDDEN for UI data — no GET Route Handler for things only the UI reads
// GET /api/puzzles/[slug] ← do not build this
```

**User feedback — decision matrix:**
| Scenario | Pattern |
|---|---|
| Form validation error | Inline field error (via react-hook-form + zodResolver) |
| Server Action failure (transient) | Toast — `toast.error(result.error)`, auto-dismiss 4s |
| Resource not found | `notFound()` from Next.js → custom 404 page |
| Unexpected server error | Error boundary → custom error page |
| Premium feature on free account | Inline upsell prompt, not toast |

**Loading and empty states — shared components from `src/components/ui/`:**
- Loading: `<Skeleton>` component — column/card/list variants, not ad-hoc opacity
- Empty state: `<EmptyState message={string} cta={ReactNode}>` — used across all zero-result surfaces
- `isPending` from `useTransition` controls button `disabled` state — never local `isLoading`

**Error logging format:**
```typescript
console.error('[functionName]', error)  // always prefixed with [functionName]
// Examples:
console.error('[togglePuzzleStatus]', e)
console.error('[affiliateRedirect]', { linkId, error: e })
```

---

### Enforcement — MUST / MUST NOT

**All agents MUST:**
- Use `ActionResult<T>` from `src/lib/action-response.ts` as the return type of every Server Action
- Call `requireUser()` as the first auth check in every protected Server Action; handle `null` explicitly — never assume it throws
- Verify resource ownership (authz) as a separate step after authentication in any mutation touching user-owned records
- Include `isNull(table.deletedAt)` on every SELECT, UPDATE, and JOIN touching a soft-deleted table
- Wrap the `await` of a Server Action inside `startTransition` in try/catch for rollback safety
- Access environment variables only via `src/lib/env.ts` — never inline `process.env`
- Define Zod schemas in `src/lib/validations/[domain].ts`; validate in Server Action before DB work
- Use `<Skeleton>` for loading states and `<EmptyState>` for zero-result states — no ad-hoc implementations
- Log errors with `console.error('[functionName]', error)` prefix
- Type all DB-sourced nullable props as `string | null` — never transform to `undefined`

**All agents MUST NOT:**
- Return `ok(undefined)` or `ok(null)` — if the query returns nothing, return `err('Not found', 'NOT_FOUND')`
- Use `throw` inside a Server Action to signal expected error conditions — return `err()` instead
- Query a soft-deleted table without `isNull(table.deletedAt)` — including joins and updates
- Use `useEffect` to fetch data available via Server Component or Server Action
- Create Supabase clients directly in components — use `src/lib/supabase/server.ts` or `client.ts`
- Mix Server Action return format (`{ success, data/error }`) with Route Handler format (`NextResponse.json`)
- Add `is_deleted` boolean columns — use `deleted_at TIMESTAMPTZ` for all soft-deletes
- Await the affiliate click insert in `/r/[link_id]/route.ts`
- Expose raw DB error messages or stack traces in any client-facing response
- Place feature logic in `src/components/ui/` — that folder is stateless primitives only
- Access `process.env` inline — always use `src/lib/env.ts`

---

## Project Structure & Boundaries

### Complete Directory Tree

```
my-puzzle-inventory/                         # project root
├── .env.local                               # local secrets — never committed
├── .env.example                             # committed template with all keys, no values
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── package.json
├── drizzle.config.ts                        # Drizzle ORM + drizzle-kit config
├── vitest.config.ts                         # Vitest test runner config
├── sentry.client.config.ts                  # Sentry browser instrumentation
├── sentry.server.config.ts                  # Sentry Node instrumentation
├── sentry.edge.config.ts                    # Sentry Edge Runtime instrumentation
│
├── src/
│   ├── middleware.ts                        # LOAD-BEARING — Supabase SSR session refresh on every request
│   │
│   ├── app/                                # Next.js App Router root
│   │   ├── layout.tsx                      # root layout — fonts, global CSS, Toaster provider
│   │   ├── global-error.tsx                # global error boundary (catches root layout errors)
│   │   ├── not-found.tsx                   # global 404 page
│   │   │
│   │   ├── (public)/                       # unauthenticated pages — no session required
│   │   │   ├── layout.tsx                  # public shell layout (nav, footer)
│   │   │   ├── page.tsx                    # / — landing page (static)
│   │   │   ├── puzzles/
│   │   │   │   ├── page.tsx                # /puzzles — catalog browse (ISR 1hr)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx            # /puzzles/[slug] — puzzle detail (ISR 1hr, FR-1)
│   │   │   ├── search/
│   │   │   │   └── page.tsx                # /search?q= — catalog search (force-dynamic, FR-2)
│   │   │   └── u/
│   │   │       └── [username]/
│   │   │           └── page.tsx            # /u/[username] — public profile (ISR 5min, FR-23–24)
│   │   │
│   │   ├── (auth)/                         # auth pages — redirect to /collection if already signed in
│   │   │   ├── layout.tsx                  # auth shell layout (centered card)
│   │   │   ├── login/
│   │   │   │   └── page.tsx                # /login — email/password + Google OAuth (FR-5–6)
│   │   │   ├── register/
│   │   │   │   └── page.tsx                # /register — create account (FR-5)
│   │   │   └── onboarding/
│   │   │       └── page.tsx                # /onboarding — post-signup wizard (FR-12–15)
│   │   │
│   │   ├── (app)/                          # authenticated pages — middleware guards; redirect to /login if not
│   │   │   ├── layout.tsx                  # app shell layout (sidebar/nav with user context)
│   │   │   ├── collection/
│   │   │   │   └── page.tsx                # /collection — My Collection (FR-16–17)
│   │   │   ├── wishlist/
│   │   │   │   └── page.tsx                # /wishlist — My Wishlist (FR-18–19)
│   │   │   ├── import/
│   │   │   │   └── page.tsx                # /import — CSV import flow (FR-26)
│   │   │   ├── settings/
│   │   │   │   └── page.tsx                # /settings — account, username, export (FR-25)
│   │   │   └── premium/
│   │   │       └── page.tsx                # /premium — upgrade / manage subscription (FR-31–35)
│   │   │
│   │   ├── (admin)/                        # admin pages — requireAdmin() guard
│   │   │   ├── layout.tsx                  # admin shell layout
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx            # /admin/dashboard — affiliate click stats (FR-22)
│   │   │   │   └── contributions/
│   │   │   │       └── page.tsx            # /admin/contributions — review queue (FR-28)
│   │   │
│   │   └── api/                            # Route Handlers — external-facing endpoints only
│   │       ├── auth/
│   │       │   └── callback/
│   │       │       └── route.ts            # OAuth callback from Supabase (FR-6)
│   │       ├── r/
│   │       │   └── [link_id]/
│   │       │       └── route.ts            # /r/[link_id] — affiliate redirect <200ms (FR-20–21)
│   │       └── stripe/
│   │           └── webhook/
│   │               └── route.ts            # Stripe webhook — subscription lifecycle (FR-35)
│   │
│   ├── actions/                            # Server Actions — all UI mutations
│   │   ├── puzzles.ts                      # catalog: search, fetch detail
│   │   ├── user-puzzles.ts                 # collection: toggle status, batch fetch ownership (FR-9–11)
│   │   ├── profile.ts                      # username set, public profile fetch (FR-23–24)
│   │   ├── import.ts                       # CSV import: parse, preview, confirm (FR-26)
│   │   ├── export.ts                       # CSV export generation (FR-25)
│   │   ├── custom-puzzles.ts               # user's custom puzzle CRUD (FR-29–30)
│   │   ├── contributions.ts                # submit + admin approve/reject (FR-27–28)
│   │   ├── images.ts                       # Supabase Storage upload — custom puzzle images (FR-30)
│   │   └── stripe.ts                       # create checkout session, portal session (FR-31–35)
│   │
│   ├── components/
│   │   ├── ui/                             # stateless primitives — no feature logic, no DB calls
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Skeleton.tsx                # loading states — column/card/list variants
│   │   │   ├── EmptyState.tsx              # zero-result states — message + optional CTA
│   │   │   ├── Badge.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── index.ts                    # barrel export
│   │   │
│   │   ├── catalog/
│   │   │   ├── PuzzleCard.tsx              # grid card — image, title, brand, piece count
│   │   │   ├── PuzzleGrid.tsx              # responsive grid wrapper
│   │   │   ├── PuzzleFilters.tsx           # brand/piece/theme filter bar (client, nuqs)
│   │   │   ├── SearchBar.tsx               # search input + submit
│   │   │   └── BuyLinks.tsx                # affiliate link list with /r/ redirect URLs
│   │   │
│   │   ├── collection/
│   │   │   ├── StatusToggle.tsx            # Own/Want/Completed toggle (client, useOptimistic)
│   │   │   ├── OwnershipBadge.tsx          # CLIENT COMPONENT — two-phase render badge (FR-9, FR-11)
│   │   │   ├── DuplicateWarning.tsx        # "You already own this" alert (FR-11)
│   │   │   ├── CollectionGrid.tsx          # authenticated collection view
│   │   │   └── CollectionFilters.tsx       # sort/filter bar (client, nuqs)
│   │   │
│   │   ├── onboarding/
│   │   │   ├── WizardShell.tsx             # multi-step wizard container
│   │   │   ├── WizardStep.tsx              # individual step wrapper
│   │   │   └── MagicMomentTracker.tsx      # tracks 5-puzzle threshold (FR-14)
│   │   │
│   │   └── layout/
│   │       ├── Nav.tsx                     # top navigation (public + authenticated variants)
│   │       ├── Sidebar.tsx                 # authenticated app sidebar
│   │       └── Footer.tsx
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts                    # single Drizzle client export — import { db } from '@/lib/db'
│   │   │   └── schema/
│   │   │       ├── index.ts                # re-exports all table schemas
│   │   │       ├── puzzles.ts              # puzzles, retailer_links, brands
│   │   │       ├── users.ts                # profiles (extends Supabase auth.users)
│   │   │       ├── user-puzzles.ts         # user_puzzle (status, soft-delete)
│   │   │       ├── custom-puzzles.ts       # custom_puzzles (user-scoped)
│   │   │       ├── contributions.ts        # contribution_requests queue
│   │   │       └── affiliate.ts            # affiliate_clicks (append-only analytics)
│   │   │
│   │   ├── supabase/
│   │   │   ├── server.ts                   # createServerClient() — Server Components, Actions, Route Handlers
│   │   │   └── client.ts                   # createBrowserClient() — Client Components only
│   │   │
│   │   ├── auth/
│   │   │   └── guards.ts                   # requireUser(), requireAdmin() — shared auth guard functions
│   │   │
│   │   ├── validations/
│   │   │   ├── puzzle.ts                   # Zod schemas: search, filter, slug
│   │   │   ├── user-puzzle.ts              # Zod schemas: status toggle, batch fetch
│   │   │   ├── profile.ts                  # Zod schemas: username, onboarding
│   │   │   ├── import.ts                   # Zod schemas: CSV row shape, column mapping
│   │   │   ├── custom-puzzle.ts            # Zod schemas: create/update custom puzzle
│   │   │   └── contribution.ts             # Zod schemas: submission, admin review
│   │   │
│   │   ├── env.ts                          # validated env variable access — ONLY place process.env is read
│   │   ├── action-response.ts              # ActionResult<T>, ok(), err() helpers
│   │   └── test-utils.ts                   # shared test helpers (db reset, factory fns)
│   │
│   ├── types/
│   │   ├── database.ts                     # Drizzle-inferred types re-exported (InferSelectModel etc.)
│   │   └── route-params.ts                 # typed Next.js route params (SlugParams, UsernameParams, LinkIdParams)
│   │
│   └── tests/
│       ├── setup.ts                        # Vitest global setup (env, db seed/teardown)
│       ├── actions/                        # Server Action integration tests
│       └── api/                            # Route Handler integration tests
│
├── migrations/                             # Drizzle-generated SQL migration files
│   └── 0001_initial.sql
│
└── scripts/                                # one-off operational scripts
    └── seed-dev.ts                         # development database seed
```

---

### Architectural Boundaries

#### Boundary 1: Scraper ↔ App

The scraper is a **separate repository** with its own deployment. It connects directly to the same Postgres database but is restricted to a dedicated `scraper` Postgres role with INSERT/UPDATE permissions only on `puzzles` and `retailer_links`. The app never imports scraper code; the scraper never imports app code. Data flows one direction: scraper writes → app reads.

| Boundary rule | Detail |
|---|---|
| No shared code | Scraper has its own `package.json`, types, and utilities |
| DB role isolation | `scraper` role: INSERT/UPDATE on `puzzles`, `retailer_links` only |
| No app imports | Scraper cannot import from `src/` — enforced by separate repo |
| Catalog ownership | Scraper is the sole writer to the global catalog tables |

#### Boundary 2: `src/components/ui/` — Stateless Primitives

`src/components/ui/` contains only stateless presentation components. No Server Actions, no `db` imports, no `useOptimistic`, no feature logic of any kind. It is the design system. Feature components live in `src/components/catalog/`, `src/components/collection/`, etc.

#### Boundary 3: Server Actions ↔ Route Handlers

**Server Actions** (`src/actions/`) handle all UI-initiated mutations and data fetches that require auth context. **Route Handlers** (`src/app/api/`) handle only external-facing endpoints: OAuth callback (Supabase), affiliate redirect (`/r/[link_id]`), and Stripe webhooks. No Route Handler should be created for data that UI pages could fetch via Server Components or Server Actions.

#### Boundary 4: Auth ↔ App Code

`src/lib/auth/guards.ts` is the only place that calls Supabase Auth directly. All other files call `requireUser()` or `requireAdmin()` from guards. This prevents Supabase client instantiation from scattering across the codebase and ensures session checking is consistent.

#### Boundary 5: `src/lib/env.ts` — Environment Access

`process.env` is **only read in `src/lib/env.ts`**. All other files import validated constants from this module. This enforces startup failure on missing config rather than silent runtime errors.

---

### Requirements → File Mapping

| FR Group | FRs | Primary Files |
|---|---|---|
| Catalog browse/detail | FR-1–4 | `app/(public)/puzzles/`, `app/(public)/search/`, `actions/puzzles.ts`, `lib/db/schema/puzzles.ts` |
| Authentication | FR-5–8 | `app/(auth)/login/`, `app/(auth)/register/`, `app/api/auth/callback/`, `lib/auth/guards.ts`, `lib/supabase/` |
| Collection management | FR-9–11 | `actions/user-puzzles.ts`, `components/collection/StatusToggle.tsx`, `components/collection/OwnershipBadge.tsx`, `components/collection/DuplicateWarning.tsx` |
| Onboarding wizard | FR-12–15 | `app/(auth)/onboarding/`, `components/onboarding/` |
| My Collection / Wishlist | FR-16–19 | `app/(app)/collection/`, `app/(app)/wishlist/`, `components/collection/CollectionGrid.tsx`, `components/collection/CollectionFilters.tsx` |
| Affiliate redirect | FR-20–22 | `app/api/r/[link_id]/route.ts`, `lib/db/schema/affiliate.ts`, `app/(admin)/admin/dashboard/` |
| Public profile | FR-23–24 | `app/(public)/u/[username]/`, `actions/profile.ts` |
| Data import/export | FR-25–26 | `app/(app)/settings/`, `app/(app)/import/`, `actions/export.ts`, `actions/import.ts` |
| Contributions | FR-27–28 | `actions/contributions.ts`, `app/(admin)/admin/contributions/`, `lib/db/schema/contributions.ts` |
| Custom puzzles | FR-29–30 | `actions/custom-puzzles.ts`, `actions/images.ts`, `lib/db/schema/custom-puzzles.ts` |
| Premium / Stripe | FR-31–35 | `app/(app)/premium/`, `app/api/stripe/webhook/route.ts`, `actions/stripe.ts` |

---

### Route Caching Strategy

| Route | Caching | Reason |
|---|---|---|
| `/puzzles/[slug]` | ISR 1hr (`revalidate = 3600`) | Stable catalog data; SEO critical |
| `/u/[username]` | ISR 5min (`revalidate = 300`) | Public profile; can tolerate brief stale |
| `/puzzles` | ISR 1hr | Catalog browse; stable |
| `/search` | `dynamic = 'force-dynamic'` | Unbounded query params = unbounded cache keys; never ISR |
| `/collection`, `/wishlist` | `no-store` | Always auth-gated, always user-specific |
| `/onboarding` | `no-store` | Post-signup only, highly dynamic |
| `/admin/*` | `no-store` | Admin dashboards require live data |
| `/r/[link_id]` | No Next.js cache | Route Handler — 302 redirect + async click log |
| `/api/stripe/webhook` | No Next.js cache | Route Handler — Stripe push events |

---

### Integration Points

#### Supabase Auth Integration

- `src/middleware.ts` — refreshes session on every request using `@supabase/ssr`. **Must exist**; SSR sessions break without it.
- `src/lib/supabase/server.ts` — `createServerClient()` called in Server Components, Server Actions, Route Handlers
- `src/lib/supabase/client.ts` — `createBrowserClient()` called only in Client Components
- `src/app/api/auth/callback/route.ts` — handles the OAuth code exchange after Google OAuth redirect

#### Supabase Storage Integration

- `src/actions/images.ts` — the only file that calls Supabase Storage upload APIs
- Image URLs stored as full transform-capable paths; resize via URL params (e.g., `?width=400&quality=80`)
- Custom puzzle images: `custom-puzzles/{userId}/{puzzleId}.jpg` path convention
- Catalog images: managed by scraper, stored at `catalog/{brand}/{slug}.jpg`

#### Stripe Integration

- `src/app/api/stripe/webhook/route.ts` — receives `customer.subscription.created/updated/deleted` events; updates `profiles.premium_until`
- `src/actions/stripe.ts` — creates Stripe Checkout sessions and Customer Portal sessions
- Webhook signature verification uses `STRIPE_WEBHOOK_SECRET` from `src/lib/env.ts`
- **Stripe webhook lives at `app/api/stripe/webhook/` (public, not inside `(app)` route group)** — Stripe push does not carry a user session

#### Drizzle + Postgres

- `drizzle.config.ts` at project root — points to `src/lib/db/schema/index.ts`; migration output to `migrations/`
- `src/lib/db/index.ts` exports the single `db` instance; all queries import from here
- `pg_trgm` + `tsvector` extensions enabled in DB for catalog full-text search (FR-2)
