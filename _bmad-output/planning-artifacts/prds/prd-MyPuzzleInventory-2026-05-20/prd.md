---
title: "MyPuzzleInventory"
status: final
created: 2026-05-20
updated: 2026-05-20
inputs:
  - _bmad-output/planning-artifacts/product-brief.md
  - _bmad-output/planning-artifacts/prfaq-MyPuzzleInventory.md
  - _bmad-output/planning-artifacts/research/market-jigsaw-puzzle-collection-tracking-research-2026-05-20.md
---

# PRD: MyPuzzleInventory

## 0. Document Purpose

This PRD is the authoritative requirements reference for MyPuzzleInventory v1 — written for the builder (Andrew), any future contributor, and downstream artifacts (UX design, architecture, implementation stories). It draws on the product brief, the PRFAQ, and the market research; those documents are the source of record for rationale and competitive analysis and are not duplicated here. Where this PRD infers without direct confirmation, it is tagged `[ASSUMPTION]`. All open items are indexed in §8 and all assumptions in §9.

Vocabulary is defined in §3 (Glossary). FRs, UJs, and SMs use Glossary terms verbatim. A synonym anywhere in this document is a discipline violation.

---

## 1. Vision

MyPuzzleInventory is the canonical catalog and collection tracker for serious jigsaw puzzle collectors — the Discogs of jigsaw puzzles. It is the first tool to combine a comprehensive, actively maintained puzzle database with duplicate-prevention UX and affiliate-linked retailer routing in a single product built for the casual collector.

The product solves a specific daily pain: every time Megan sees a puzzle she might want, she relies on memory, a Notes app, or a screenshot folder to answer "Do I already own this?" MyPuzzleInventory is what she opens instead — answering the question in two taps and routing her from "I want this" to "bought" without leaving the app.

The business model is affiliate-native and free-at-launch. The catalog attracts collectors; duplicate prevention is the daily-use retention hook; affiliate buy links are the revenue engine. The moat is not catalog size alone — IPDb already has more puzzles — but the commerce layer that IPDb has structurally chosen not to build, paired with a UX built around the collector's daily workflow rather than the competitive puzzler's.

---

## 2. Target User

### 2.1 Primary Persona — Megan, the 4-Shelf Collector

Megan is 34, has been puzzling for five years, and owns 80+ puzzles. She buys 1–3 per month, spends $300–600/year, and follows six puzzle Instagram accounts. She lurks in r/Jigsawpuzzles, has accidentally bought duplicates, and splits her wishlist across a Pinterest board, a Notes app, and phone screenshots. She is not a competitive puzzler — puzzling is a ritual and a hobby identity, not a sport.

MyPuzzleInventory meets her at two moments: (1) when she sees a puzzle online and needs to know immediately whether she already owns it, and (2) when she is deciding what to buy next. She is also proud of her collection and would share a link to it if one existed.

### 2.2 Secondary Persona — Dan, the Competitive Puzzler

Dan uses the Completed status to track which puzzles he has done in timed practice and avoid repeating them. The same data model that serves Megan serves him — no separate feature set is required. Build for Megan; Dan benefits from the same product.

### 2.3 Jobs To Be Done

- **Functional:** Know immediately whether I own a puzzle I just saw online.
- **Functional:** Maintain a single wishlist I can browse and act on without leaving the tool.
- **Functional:** Route from "I want this" to "bought" in under 30 seconds.
- **Functional:** Import my existing collection without hours of manual data entry.
- **Functional:** Show a gift-giver what to buy me without them needing an account.
- **Social:** Share my collection as a public identity artifact I'm proud of.
- **Emotional:** Never waste money on a duplicate again.
- **Emotional:** Trust that my data will still exist if this product shuts down.

### 2.4 Non-Users (v1)

- Casual puzzlers who own fewer than 10 puzzles and do not feel the collection-management pain.
- Collectors primarily interested in trading or reselling — PuzzleSwaps is the right tool for that workflow.
- Users who require a native mobile app at launch.

### 2.5 Key User Journeys

**UJ-1. Megan checks a puzzle she saw on Instagram before buying.**
- **Persona + context:** Megan, authenticated, browsing Instagram on her phone.
- **Entry state:** Authenticated via a prior session. Opens MyPuzzleInventory from a bookmark or browser history.
- **Path:** (1) Taps the search bar on the catalog home page. (2) Types the puzzle title she just saw. (3) The puzzle detail page loads, showing image, specs, and her status badge. (4) The badge reads "In Your Collection" — she already owns it. (5) She closes the app.
- **Climax:** She sees "In Your Collection" before committing to a purchase. The duplicate is prevented.
- **Resolution:** She returns to Instagram; the purchase is abandoned. She did not spend $35.
- **Edge case:** The puzzle is not in the catalog. She sees the zero-results state with a "Help us add this puzzle" prompt. She submits the title and piece count. Her session ends without prevention, but her submission enters the contribution queue.

**UJ-2. Megan onboards and logs her first five puzzles.**
- **Persona + context:** Megan, newly registered, landing on the post-signup screen for the first time.
- **Entry state:** Just completed email/password signup or Google OAuth. Not yet authenticated on any prior session.
- **Path:** (1) Onboarding wizard opens with a prompt: "Let's add your first puzzle." (2) She searches for a puzzle she knows she owns by title. (3) She taps "Own" — the puzzle is added to her Collection with a confirmation. (4) The wizard prompts: "Great! Add another?" (5) She adds four more puzzles. (6) The wizard closes and her Collection page is shown with five puzzles listed.
- **Climax:** She sees her Collection page populated with real puzzles. The product has immediate value.
- **Resolution:** She is left on her Collection page, which shows 5 puzzles and a prompt to keep adding. Retention is unlocked — she has passed the Magic Moment threshold.
- **Edge case:** One of the puzzles she searches for is not in the catalog. The zero-results state appears mid-wizard; she submits a contribution prompt and the wizard continues to the next search step without blocking progress.

**UJ-3. Megan browses her wishlist and buys a puzzle.**
- **Persona + context:** Megan, authenticated, on the My Wishlist page.
- **Entry state:** Authenticated. Navigates to My Wishlist from the main navigation.
- **Path:** (1) She sees her wishlist sorted by default (recently added first). (2) She sees a Puzzle she added last week shows "In Stock" with a price. (3) She taps "Buy." (4) She is routed via the Affiliate Redirect to the retailer page for that puzzle. (5) She completes the purchase on the retailer's site.
- **Climax:** She purchased the puzzle she wanted without opening a separate browser tab, searching a retailer, or losing her place.
- **Resolution:** She returns to MyPuzzleInventory. She can now change the Puzzle's status from "Wanted" to "Owned."
- **Edge case:** The puzzle shows "Out of Stock" at all linked retailers. She sees the out-of-stock state; no Buy button is shown. An `[OPEN: OI-5]` notification mechanism may alert her when it returns to stock.

**UJ-4. Megan shares her collection with a family member for gift ideas.**
- **Persona + context:** Megan, authenticated, on her Public Profile page.
- **Entry state:** Her collection includes 80+ Owned puzzles and a Wishlist of 12 Wanted puzzles.
- **Path:** (1) She navigates to her Public Profile at `/u/megan`. (2) She copies the URL from the address bar. (3) She sends it to her mother via iMessage.
- **Climax:** Her mother opens the link (no account required), sees Megan's wishlist, and clicks "Buy" on a puzzle — routed through the Affiliate Redirect.
- **Resolution:** Megan receives the puzzle as a gift. Her mother had a frictionless gift-discovery experience. MyPuzzleInventory captured an affiliate commission from a non-user.

---

## 3. Glossary

- **Puzzle** — A single catalog entry representing a commercially available jigsaw puzzle product. Has: title, brand, piece count, image, artist (if known), theme tags, in-print status, and at least one Retailer Link. One Puzzle can be associated with many Users via User Puzzle records. Synonyms prohibited: *product*, *item*, *SKU*.

- **User Puzzle** — The junction record between a User and a Puzzle. Carries: status (Owned, Wanted, Completed), and optionally a note and acquisition date. One User Puzzle per (User, Puzzle) pair. Synonyms prohibited: *collection item*, *tracked puzzle*, *entry*.

- **Collection** — The set of all User Puzzle records for a given User where status = Owned. Displayed on the My Collection page and the Public Profile. Synonyms prohibited: *library*, *inventory*.

- **Wishlist** — The set of all User Puzzle records for a given User where status = Wanted. Displayed on the My Wishlist page and the Public Profile. Synonyms prohibited: *want list*, *favorites*.

- **Status** — The value on a User Puzzle record. One of: **Owned**, **Wanted**, **Completed**. A Puzzle can have only one Status per User at a time; changing Status replaces it.

- **Duplicate Warning** — A visual indicator displayed on a Puzzle detail page or in search results when the authenticated User has a User Puzzle record for that Puzzle with Status = Owned. Synonyms prohibited: *already own*, *owned badge* (the badge is the visual component; Duplicate Warning is the functional concept).

- **Retailer Link** — A URL pointing to a specific Puzzle on a specific retailer's site, associated with availability (in-stock / out-of-stock) and price metadata where available. Each Puzzle may have zero or more Retailer Links.

- **Affiliate Redirect** — The tracked URL at `/r/[link_id]` that logs a click event and then redirects the User to a Retailer Link's destination. The mechanism by which affiliate commissions are attributed. Synonyms prohibited: *buy link*, *affiliate link* (Affiliate Redirect is the functional mechanism; Retailer Links may or may not be affiliate-enrolled).

- **Public Profile** — A user-facing page at `/u/[username]` showing a User's Collection, Wishlist (if not hidden), and basic stats. Accessible without authentication. Synonyms prohibited: *profile page*, *user page*.

- **Magic Moment** — The point at which a new User has added 5 or more Puzzles to their Collection or Wishlist within a single session. The primary retention threshold.

- **Anchor Brand** — One of the four puzzle manufacturers whose catalogs are scraped and maintained in-house at launch: Ravensburger, Buffalo Games, Cobble Hill, White Mountain.

- **Custom Puzzle** — A Puzzle record created manually by a User for a puzzle not found in the catalog. Has: user-supplied title, optional brand, optional piece count, optional image upload. A Custom Puzzle belongs only to the creating User; it is not a canonical catalog record and is not visible to other Users. Carries all the same Status options as a catalog Puzzle. Synonyms prohibited: *manual entry*, *custom entry*.

- **Contribution Prompt** — The UI element shown on the zero-results search state inviting the User to submit metadata for a Puzzle not yet in the catalog.

- **Premium** — The paid subscription tier ($4/month) that unlocks features not available to Free users. See §4.12.

---

## 4. Features

### 4.1 Puzzle Catalog

**Description:** The searchable, browsable database of Puzzles — the core asset of the product. At launch, the catalog holds 3,000–5,000 Puzzles sourced from the four Anchor Brands via scheduled scrapers. Each Puzzle has a public detail page accessible without authentication. Catalog data is maintained in-house (not crowdsourced): scrapers run on a schedule and import via an internal API, producing consistent data quality independent of community activity. Each Puzzle detail page is SEO-optimized with structured metadata so that Google searches for "[puzzle title] buy" surface MyPuzzleInventory as a result.

**Functional Requirements:**

#### FR-1: Puzzle Detail Page
Any visitor (authenticated or not) can view a Puzzle's full detail page including: title, brand, piece count, image, artist (if known), theme tags, in-print status, and all associated Retailer Links sorted by availability then price. Realizes UJ-1, UJ-3, UJ-4.

**Consequences:**
- Page is publicly accessible without authentication.
- Page URL is stable and canonical (e.g., `/puzzles/[slug]`).
- Page renders with valid Open Graph meta tags (title, image, description) for social sharing.
- Page includes structured data (JSON-LD schema.org/Product) sufficient for Google rich results indexing.
- Retailer Links are sorted: in-stock links first, out-of-stock links second; within each group, sorted by price ascending.

#### FR-2: Catalog Search
Any visitor can search the Puzzle catalog by title, brand, piece count, artist, or theme tag. Results are ranked in this priority order: (1) exact title match, (2) fuzzy title match (title contains all query tokens), (3) brand or artist name match, (4) theme tag match. Within each tier, results are sorted by title ascending. Puzzle image thumbnail, title, brand, and piece count are visible in each result row. Realizes UJ-1, UJ-2.

**Consequences:**
- Search is available from a persistent search bar in the site header on all pages.
- Results appear within 500ms for queries under 100 characters on a cold cache.
- Authenticated Users see Status badges (Owned / Wanted / Completed) on search results for Puzzles they have logged.
- A search that returns zero results shows the Contribution Prompt (see FR-27).

#### FR-3: Catalog Browse and Filter
Any visitor can browse the Puzzle catalog filtered by: brand, piece count (range), in-print status, theme tag. Multiple filters can be active simultaneously. Realizes UJ-1.

**Consequences:**
- Filter state is reflected in the URL query string, making filtered views shareable and bookmarkable.
- Filter combinations that produce zero results show the Contribution Prompt with context ("No puzzles matched your filters").

#### FR-4: Catalog Ingestion Pipeline
The system maintains scheduled scrapers for each Anchor Brand that extract Puzzle metadata and images, deduplicate via image hash, and import to the catalog database via an internal API. Scrapers run independently of the application — scraper failure does not affect the app; the app runs on cached catalog data.

**Consequences:**
- Each scraper produces a JSON manifest per run (puzzle count, new additions, updated records, errors).
- Image deduplication uses perceptual hash comparison; records with hash collision above threshold are flagged for manual review, not auto-merged.
- No duplicate Puzzle records are introduced by a scraper run.
- Scraper failure generates an alert but does not degrade the user-facing catalog.

**Out of Scope:** Community-submitted catalog edits (v2). Real-time price tracking (v2). Barcode scanning (v2).

---

### 4.2 User Authentication and Accounts

**Description:** Users can create accounts with email/password or Google OAuth. Authentication is required to write User Puzzle records (Own, Want, Completed), access My Collection and My Wishlist, and manage account settings. Browsing the catalog and viewing Public Profiles requires no authentication. Supabase Auth handles the authentication infrastructure.

**Functional Requirements:**

#### FR-5: Email/Password Signup and Login
A visitor can create an account with a valid email address and password (minimum 8 characters). A registered User can log in with their email and password. Realizes UJ-2.

**Consequences:**
- Email addresses are validated for format at signup.
- Passwords are never stored in plaintext; Supabase Auth handles hashing.
- Duplicate email addresses at signup return a clear error ("An account with this email already exists").
- A "Forgot password" flow sends a reset email via Supabase Auth.

#### FR-6: Google OAuth Signup and Login
A visitor can create an account or log in using Google OAuth 2.0. The resulting User record is indistinguishable in behavior from an email/password User. Realizes UJ-2.

**Consequences:**
- Google OAuth and email/password accounts with the same email address are treated as the same User (accounts linked automatically).
- No password is required for Google OAuth users; the "Forgot password" flow is not shown to them.

#### FR-7: Session Persistence
A User who has logged in remains authenticated across browser sessions until they explicitly log out or the session expires (30-day idle timeout). Realizes UJ-1 (user is "already authenticated via a prior session").

**Consequences:**
- Session state is stored in a secure, httpOnly cookie.
- Session expiry shows a re-authentication prompt rather than a silent failure.

#### FR-8: Username Assignment
At signup, the User is assigned a username used for their Public Profile URL (`/u/[username]`). The username defaults to the portion of their email before `@` and can be changed once in account settings. Usernames are unique across all Users.

**Consequences:**
- Username uniqueness is validated in real time during signup and settings update.
- Username change updates the Public Profile URL immediately; the previous URL returns 404.
- Username constraints: 3–30 characters, alphanumeric plus hyphens, no leading/trailing hyphen.

**Feature-specific NFRs:**
- All auth flows must handle the case where JavaScript is disabled (server-side form submission fallback).

---

### 4.3 Collection Management (Own / Want / Completed)

**Description:** Authenticated Users record their relationship to any Puzzle by setting a Status: **Owned** (in their Collection), **Wanted** (on their Wishlist), or **Completed** (assembled at least once). Each action is available as a prominent button on the Puzzle detail page and as a row action in search results. Status changes are instant and optimistically rendered. Realizes UJ-1, UJ-2, UJ-3.

**Functional Requirements:**

#### FR-9: Set Puzzle Status
An authenticated User can set Status = Owned, Wanted, or Completed on any Puzzle. Setting a Status creates a User Puzzle record if one does not exist; changes Status if one does. Only one Status is active per (User, Puzzle) pair at a time.

**Consequences:**
- Status buttons are visible and enabled only for authenticated Users; unauthenticated visitors see the buttons as disabled with a "Sign in to track" tooltip.
- Optimistic UI: the button state changes immediately on tap before the server responds.
- On server error, the optimistic change is rolled back and a brief error message is shown.
- A User Puzzle record can be deleted (Status removed entirely) via a "Remove from collection" action.

#### FR-10: Status Visibility in Search and Browse
When an authenticated User views search results or browse pages, each Puzzle in the results displays their current Status badge (Owned / Wanted / Completed) if a User Puzzle record exists. Realizes UJ-1.

**Consequences:**
- Status badges are fetched in a single batch query per results page; they do not trigger per-Puzzle requests.
- Status badges are not visible to unauthenticated visitors.

#### FR-11: Duplicate Warning
When an authenticated User views the detail page of a Puzzle they have Status = Owned, a Duplicate Warning is displayed prominently above the fold before the Retailer Links. Realizes UJ-1.

**Consequences:**
- Duplicate Warning reads: "You already own this puzzle." (exact copy `[ASSUMPTION]`).
- Warning is shown even if the User navigated to the page directly (e.g., from a Google search) — it does not require prior browse context.
- Warning is not shown for Status = Wanted or Completed — only Owned triggers it.

---

### 4.4 Onboarding Wizard

**Description:** New users step through an "add your first puzzle" wizard immediately after signup. The wizard's goal is the Magic Moment: 5 or more Puzzles added to the Collection within the first session. It is the primary retention mechanism at launch. `[ASSUMPTION: Detailed screen-by-screen flow and copy require UX design before implementation — see OI-4.]`

**Functional Requirements:**

#### FR-12: Post-Signup Wizard Launch
The onboarding wizard launches automatically after a new User completes signup (either path: email/password or Google OAuth). The wizard is skippable at any time via an explicit "Skip for now" action. Realizes UJ-2.

**Consequences:**
- Wizard launches only on the first authenticated session — never shown again after dismissal or completion.
- Skipping the wizard sets a `onboarding_completed` flag on the User record; future sessions are not interrupted.

#### FR-13: Wizard Search and Add Flow
Within the wizard, the User can search the Puzzle catalog by title. Selecting a Puzzle from results and tapping "Add to My Collection" sets Status = Owned and advances the wizard step with a confirmation. Realizes UJ-2.

**Consequences:**
- The wizard search uses the same catalog search (FR-2) — no separate implementation.
- After each successful add, the wizard shows a running count ("You've added 3 puzzles!") and prompts to add another.
- `[ASSUMPTION: The wizard suggests 3 seed searches based on the most commonly owned brands (Ravensburger, Buffalo) if the User hasn't typed anything within 5 seconds.]`

#### FR-14: Magic Moment Completion
When the User adds their 5th Puzzle within the wizard session, the wizard shows a completion state ("Your collection is off to a great start!") before transitioning to the My Collection page. Realizes UJ-2.

**Consequences:**
- Magic Moment events are logged for analytics tracking (SM-3).
- Users who exit the wizard before the 5th puzzle are still shown their My Collection page — the wizard does not block them.

#### FR-15: Wizard Zero-Results State
If a search within the wizard returns zero results, the Contribution Prompt (FR-27) is shown inline within the wizard context. The User can submit the contribution and continue searching for their next puzzle without exiting the wizard. Realizes UJ-2 edge case.

**Consequences:**
- Contribution submission within the wizard does not exit the wizard flow.
- The submitted puzzle is not added to the User's Collection immediately (it is pending catalog addition).

---

### 4.5 My Collection Page

**Description:** The My Collection page shows all Puzzles with Status = Owned, with sort and filter controls and collection summary stats. It is the destination after successful onboarding and a primary navigation destination for returning Users.

**Functional Requirements:**

#### FR-16: Collection Display
An authenticated User can view all Owned Puzzles in a grid or list layout with: Puzzle image thumbnail, title, brand, piece count, and Status badge. Realizes UJ-2, UJ-4.

**Consequences:**
- Default sort: most recently added first.
- Available sorts: recently added, title A–Z, brand, piece count.
- Available filters: brand, piece count range, theme tag.
- Collection summary header shows: total puzzle count, total piece count across Collection, number of brands represented.
- Empty state (zero Owned Puzzles) shows the wizard launch prompt and a search bar.

#### FR-17: Collection Quick Actions
From the My Collection page, a User can change Status or remove a Puzzle from their Collection without navigating to the Puzzle detail page. Realizes UJ-2.

**Consequences:**
- Changing Status from Owned (e.g., to Completed or removing) is available as a row/card action.
- Confirmations are not required for Status changes (optimistic, reversible within the same session via undo toast).

---

### 4.6 My Wishlist Page

**Description:** The My Wishlist page shows all Puzzles with Status = Wanted, with sort, filter, and buy-action controls. It is the primary path from desire to purchase. Realizes UJ-3.

**Functional Requirements:**

#### FR-18: Wishlist Display
An authenticated User can view all Wanted Puzzles with: Puzzle image, title, brand, piece count, in-stock status, and lowest available price. Realizes UJ-3.

**Consequences:**
- Default sort: recently added first.
- Available sorts: recently added, title A–Z, price (ascending), in-stock first.
- In-stock status and price are derived from Retailer Links; if no Retailer Links exist, "Availability unknown" is shown.
- Out-of-stock Puzzles are visually distinguished (muted opacity) but not hidden by default.

#### FR-19: Wishlist Buy Action
From the My Wishlist page, a User can initiate a purchase of any in-stock Wanted Puzzle by tapping a "Buy" button that routes them through the Affiliate Redirect to the lowest-price in-stock Retailer Link. Realizes UJ-3, UJ-4.

**Consequences:**
- "Buy" button is only shown if at least one Retailer Link is in-stock.
- The Affiliate Redirect click event is logged before the redirect fires (FR-24).
- Redirect opens in a new tab to preserve the User's Wishlist session.

---

### 4.7 Affiliate Buy Links and Click Tracking

**Description:** Every Puzzle with at least one Retailer Link displays a Buy section listing all affiliated retailers. Each Buy click routes through the Affiliate Redirect endpoint, which logs the click and redirects to the retailer. Retailer Links are sorted by availability then price — not by commission rate. This constraint is the primary trust signal of the affiliate model and must not be violated. Realizes UJ-3, UJ-4.

**Functional Requirements:**

#### FR-20: Retailer Link Display
Any visitor to a Puzzle detail page can see all Retailer Links for that Puzzle, sorted: in-stock links first by price ascending; out-of-stock links second by price. Each link shows: retailer name, price, in-stock / out-of-stock status, and a "Buy" button. Realizes UJ-3.

**Consequences:**
- Retailer link sort order is by availability then price — never by commission rate (this constraint is hard-coded, not configurable).
- "Buy" buttons on out-of-stock links are replaced with "Out of stock" labels; no Affiliate Redirect fires for out-of-stock links.
- If no Retailer Links exist for a Puzzle, the Buy section is omitted entirely (no empty section shown).
- A visible affiliate disclosure label appears near the Buy section: "We may earn a referral fee on purchases made through these links." This is required by affiliate program ToS (Amazon Associates) and is a committed trust signal from the PRFAQ (FAQ Q4).

#### FR-21: Affiliate Redirect Endpoint
`[NOTE FOR PM: BLOCKER — before building this FR or any affiliate infrastructure, verify Amazon Associates Operating Agreement §5 permits catalog/comparison-style sites. See OI-1 in §13. If Associates does not apply, identify the anchor affiliate program before proceeding.]`

The system exposes a `/r/[link_id]` endpoint that: (1) resolves the Retailer Link by `link_id`, (2) logs a click event (timestamp, puzzle_id, retailer, user_id if authenticated, referrer), and (3) issues a 302 redirect to the Retailer Link's destination URL.

**Consequences:**
- Click event is persisted before the redirect fires; a failed log write does not block the redirect.
- The endpoint responds within 200ms in the p95 case.
- Bot traffic (identified by user agent or click rate anomalies) is excluded from affiliate reporting but not blocked.

#### FR-22: Affiliate Click Dashboard (Internal)
Andrew can view a simple internal dashboard showing: total Affiliate Redirect clicks per day, clicks by puzzle, clicks by retailer, and estimated revenue (clicks × average commission rate). `[ASSUMPTION: Commission rate is entered manually per retailer program; no API integration with affiliate networks at launch.]`

**Consequences:**
- Dashboard is accessible only to the admin account; not exposed to regular Users.
- Data is updated daily, not real-time.

---

### 4.8 Public Profile Page

**Description:** Each User has a Public Profile at `/u/[username]` showing their Collection and Wishlist. The page requires no authentication. It is the primary sharing artifact and organic growth driver — the link Megan sends to her mother so she can buy a gift without creating an account. Affiliate Redirects fired from a Public Profile are attributed as referral conversions. Realizes UJ-4.

**Functional Requirements:**

#### FR-23: Public Profile Display
Any visitor (authenticated or not) can view a User's Public Profile, which shows: username, collection count, wishlist count (if not hidden), a grid of Owned Puzzle images, and their Wishlist with Buy buttons. Realizes UJ-4.

**Consequences:**
- The profile owner can toggle Wishlist visibility (public / hidden) in account settings; default is public.
- Collection is always public (there is no private collection mode in v1).
- Buy buttons on the Public Profile use Affiliate Redirects and are attributed to the profile owner's referral where the affiliate program supports referral attribution.
- The page renders without JavaScript for social media preview crawlers (server-side rendering required).

#### FR-24: Profile URL
A User's Public Profile is accessible at `/u/[username]`. The URL is shareable and stable as long as the username is unchanged. Realizes UJ-4.

**Consequences:**
- Changing username (FR-8) immediately invalidates the prior URL.
- A 404 on a profile URL shows a "This profile doesn't exist" state, not a generic error.

---

### 4.9 Data Import and Export

**Description:** Users can export their full Collection and Wishlist to CSV at any time — free, no subscription required, no friction. Users can also import an existing puzzle list from a CSV file. Both features honor the trust commitment in the PRFAQ: your data is yours, always. The export format is documented publicly.

**Functional Requirements:**

#### FR-25: CSV Export
An authenticated User can download their full Collection and Wishlist as a CSV file at any time. Export is available for Free and Premium Users; it is never paywalled. Realizes UJ-3 (trust).

**Consequences:**
- Export file includes: puzzle_id, title, brand, piece_count, artist, status, date_added.
- File format is UTF-8 CSV with a header row.
- Export file and data format are documented at a stable public URL.
- Export completes within 10 seconds for collections of up to 1,000 Puzzles.

#### FR-26: CSV Import
An authenticated User can upload a CSV file to bulk-import Puzzles into their Collection. The import flow attempts to match each CSV row to a catalog Puzzle by title and piece count; matched rows create User Puzzle records; unmatched rows are surfaced for review. Realizes UJ-2 (reducing data entry friction for users with existing spreadsheets).

**Consequences:**
- `[ASSUMPTION: Import accepts the MyPuzzleInventory export format natively (columns: puzzle_id, title, brand, piece_count, artist, status, date_added). For other CSV formats, a column-mapping step presents detected column headers and lets the User assign each to the import schema fields; only title is required to proceed.]`
- Matching rule: a CSV row matches a catalog Puzzle if title AND piece count both match exactly (case-insensitive); title-only match is shown as a lower-confidence match requiring User confirmation.
- Before committing, the User sees a preview table: matched rows (with catalog thumbnail), low-confidence matches (requiring per-row confirmation), and unmatched rows. The User can deselect any row before import.
- Unmatched rows can be submitted as Contribution Prompts in bulk after the import step, or individually converted to Custom Puzzle records (FR-34).
- Import handles up to 500 rows per file; larger files show an error with instructions to split the file.
- Duplicate User Puzzle records (where the User already has that Puzzle in their Collection with the same status) are skipped, not duplicated. Rows with a different status than the existing record are flagged for User decision (keep existing / overwrite).

---

### 4.10 Zero-Results Contribution Prompt

**Description:** When a search returns no results, the system shows the Contribution Prompt — an invitation to submit information about the missing Puzzle. This is the community catalog expansion mechanism. Submissions enter an admin review queue; they do not create Puzzle records automatically. Realizes UJ-1 edge case, UJ-2 edge case.

**Functional Requirements:**

#### FR-27: Contribution Prompt Display
When a catalog search returns zero results, the system displays the Contribution Prompt: a brief message ("We don't have this puzzle yet") and a form to submit the puzzle's title, brand, piece count, and an optional image URL. Available to authenticated and unauthenticated visitors; authenticated submissions are pre-populated with the User's account. Realizes UJ-1 edge case.

**Consequences:**
- Contribution form is inline on the zero-results page; no navigation required.
- Unauthenticated submissions are accepted but not associated with a User.
- Submission confirmation is shown immediately; no email confirmation is sent `[OPEN: OI-5 — consider email notification when submitted puzzle is added to catalog]`.

#### FR-28: Contribution Queue (Internal)
Submitted Contributions appear in an admin-facing queue where Andrew can review, enrich, and approve or reject them. Approved Contributions create Puzzle records in the catalog.

**Consequences:**
- Queue shows: submission title, brand, piece count, submitter username (or "anonymous"), submission timestamp.
- Approved Contributions send no automatic notification to the submitter at launch `[OPEN: OI-5]`.
- Rejected Contributions are deleted from the queue; the submitter is not notified.

---

### 4.11 Custom Puzzle Records

**Description:** Users can create a Custom Puzzle for any puzzle not found in the catalog — a secondhand purchase with no box, a puzzle from a small or indie brand not yet scraped, or any puzzle the User wants to track before the catalog catches up. A Custom Puzzle is a private record belonging only to the creating User; it is not submitted for catalog review and does not become a canonical Puzzle entry. It carries the same Status options as a catalog Puzzle and appears in the User's Collection, Wishlist, and Public Profile identically, but is visually marked as user-added. This feature fulfills the commitment in the PRFAQ (FAQ Q6): "Your collection stays complete" regardless of catalog gaps.

**Functional Requirements:**

#### FR-29: Create Custom Puzzle
An authenticated User can create a Custom Puzzle by providing at minimum a title. Brand, piece count, and an image (file upload or URL) are optional. The Custom Puzzle is immediately added to their Collection with Status = Owned (default, changeable). Realizes UJ-2 edge case, UJ-1 edge case.

**Consequences:**
- Creation form is accessible from: (a) the zero-results search state ("Can't find it? Add it manually"), and (b) a persistent "Add manually" action on My Collection page.
- Title is required; all other fields are optional.
- Image upload accepts JPG/PNG up to 5MB; no image shows a default puzzle placeholder.
- The Custom Puzzle is assigned a user-scoped ID (not a canonical Puzzle ID) and is never surfaced in catalog search results for other Users.
- Custom Puzzles display a small "User-added" badge on thumbnails throughout the UI to distinguish them from catalog Puzzles.
- A Custom Puzzle created by User A is not visible to User B via catalog search or any public surface other than User A's Public Profile.
- Submitting the create form with no title shows an inline validation error; no record is created.
- A Custom Puzzle appears in CSV export with all populated fields; `puzzle_id` field contains the user-scoped ID prefixed `custom-`.

**Out of Scope:** Custom Puzzles submitted to the catalog review queue (that is the Contribution Prompt's job, FR-27). Auto-matching a Custom Puzzle to a catalog Puzzle if it is later added (v2 enhancement).

#### FR-30: Edit and Delete Custom Puzzle
An authenticated User can edit any field of a Custom Puzzle they created, or delete it entirely. Deleting a Custom Puzzle removes the User Puzzle record and the custom metadata; it cannot be recovered.

**Consequences:**
- Edit is available from the Custom Puzzle detail page and from a row action on My Collection page.
- Delete requires a confirmation dialog: "Remove this puzzle from your collection? This can't be undone."
- Catalog Puzzles cannot be edited by Users (edit is exclusive to Custom Puzzles).

---

### 4.12 Premium Tier

**Description:** A paid subscription tier at $4/month unlocking features for power users — serious collectors with large collections who have already validated the core product. The specific feature set below is a working hypothesis; validate it with 5+ collectors before building. `[ASSUMPTION — validate before building: see OI-3.]`

The premium tier is the second revenue pillar after affiliate commissions. It should launch no earlier than month 3, after affiliate economics are established and the user base is large enough to validate what collectors will actually pay for.

**Functional Requirements:**

#### FR-31: Premium Subscription Management
An authenticated User can subscribe to Premium ($4/month) via Stripe. A subscribed User can cancel at any time; access continues to the end of the billing period. Canceled subscribers revert to Free access.

**Consequences:**
- Stripe handles payment processing; no card data touches MyPuzzleInventory servers.
- Subscription status is synced via Stripe webhook and cached on the User record.
- Downgrade from Premium to Free does not delete any data — Premium-specific data (e.g., extra wishlists) is preserved but not accessible until re-subscribe.

#### FR-32: Collection Valuation `[ASSUMPTION]`
Premium Users can view an estimated total value of their Collection based on current lowest available prices across linked retailers.

**Consequences:**
- Valuation is labeled as an estimate and the calculation methodology is shown ("Based on lowest current price across linked retailers").
- Valuation is displayed on the My Collection page header for Premium Users only.
- Valuation updates when Retailer Link prices are refreshed (same cadence as catalog data).

#### FR-33: Lent-Out Tracking `[ASSUMPTION]`
Premium Users can mark a Puzzle in their Collection as "Lent to [name]" with an optional due-back date. Lent-out Puzzles remain in the Collection with a visible "On Loan" badge.

**Consequences:**
- "Lent to" is a free-text field; there is no user-to-user linking.
- A Puzzle's Status remains Owned when lent out; Lent is a sub-state, not a Status.
- Premium Users can filter their Collection by "Currently lent out."
- "On Loan" badge is visible on the Public Profile to the profile owner only (not shown to visitors).

#### FR-34: Multiple Wishlists `[ASSUMPTION]`
Premium Users can create up to 5 named Wishlists (e.g., "Birthday list," "Holiday list," "Dream list") in addition to the default Wishlist.

**Consequences:**
- Each Wishlist has its own shareable Public URL.
- A Puzzle can appear on multiple Wishlists simultaneously.
- The default Wishlist is renamed "My Wishlist" and cannot be deleted.
- Free Users see a single Wishlist only; if they downgrade, additional Wishlists become inaccessible (data preserved).

#### FR-35: Advanced Collection Stats `[ASSUMPTION]`
Premium Users can view an analytics dashboard on their Collection including: puzzles added per month trend, top brands by count, most-completed piece counts, and collection growth chart.

**Consequences:**
- Stats are computed at page load from the User Puzzle table; no separate analytics pipeline required at this scale.
- Stats are visible on a "Stats" tab on the My Collection page for Premium Users only.

---

## 5. Non-Goals (Explicit)

- **User-generated reviews, ratings, or photos.** The catalog image and specs are authoritative; user-submitted content creates a community moderation problem the project is not staffed to handle at launch.
- **Social features: following, feeds, comments.** MyPuzzleInventory is not a social network. The Public Profile is a sharing artifact, not a social graph.
- **Photo-based puzzle identification (PuzzleSnap).** Valuable but out of launch scope — requires ML infrastructure and training data.
- **Native mobile app at launch.** A responsive web app covers the core use case. React Native is v2.
- **Barcode scanning.** Unreliable for older puzzles (confirmed in market research); cut from v1.
- **Price history tracking.** Adds infrastructure complexity without a clear retention benefit at launch scale.
- **Trading or lending marketplace.** PuzzleSwaps serves this use case; duplicating it is out of scope.
- **Community catalog editing (Wikipedia-style).** Crowdsourced catalog quality is IPDb's primary weakness; v1 avoids it by design.
- **Multiple collections per user.** Single Collection, single Wishlist (multiple Wishlists are a Premium feature in the working hypothesis).
- **Integrations with MySpeedPuzzling or external solve trackers.**
- **Not a social network.** The product will not add feeds, follower counts, likes, or algorithmic content.
- **Not a price comparison engine.** Retailer Links show price as a buying convenience; MyPuzzleInventory does not scrape or guarantee pricing accuracy.

---

## 6. MVP Scope

### 6.1 In Scope (v1)

- Puzzle catalog: 3,000–5,000 Puzzles from 4 Anchor Brands (Ravensburger, Buffalo Games, Cobble Hill, White Mountain)
- Catalog search by title, brand, piece count, artist, theme
- Public Puzzle detail pages with image, specs, Retailer Links, and affiliate Buy buttons
- Public catalog browse with filters
- User accounts: email/password and Google OAuth
- Status actions per Puzzle: Own, Want, Completed
- Duplicate Warning on Puzzle detail pages for Owned Puzzles
- Onboarding wizard (post-signup, targeting Magic Moment)
- My Collection page with sort, filter, and collection stats
- My Wishlist page with sort, filter, and Buy buttons
- Public Profile page at `/u/[username]`
- Affiliate Redirect endpoint with click logging
- CSV export (always free)
- CSV import with match-and-confirm flow
- Zero-results Contribution Prompt with admin review queue
- Custom Puzzle records (manual add for non-catalog puzzles, including secondhand and indie brands)
- Internal affiliate click dashboard

### 6.2 Out of Scope for MVP

- Premium tier `[NOTE FOR PM: Premium should launch at month 3 — after affiliate economics are confirmed; include in build planning but not in launch checklist]`
- Native mobile app (React Native — v2)
- Photo-based puzzle identification (PuzzleSnap — v2/v3)
- Community catalog editing (v2)
- User-generated reviews, ratings, or photos (v2)
- Social features: following, feeds, comments (v2+)
- Price history tracking (v2)
- Trading/lending marketplace (out of scope indefinitely — not this product)
- Barcode scanner (v2, after reliable library identified)
- Multiple wishlists for free users (Premium feature in working hypothesis)
- Email notification when a contributed Puzzle is added to catalog `[NOTE FOR PM: OI-5 — this is a meaningful retention and trust signal; consider for v1.5]`

---

## 7. Why Now

The window to establish MyPuzzleInventory as the canonical puzzle catalog is open but narrowing. IPDb — the closest functional competitor with 39,000+ puzzles — is a recently launched, volunteer-run non-profit with no commerce layer and documented sparse-database complaints. It has not yet reached the brand recognition or catalog depth to own the category. MySpeedPuzzling is identity-locked to competitive speed puzzling and cannot pivot to the casual collector without alienating its core user base.

The structural moat is the commerce layer — affiliate buy links that IPDb cannot add without becoming something it has explicitly chosen not to be. That window is 12–18 months before a well-funded alternative claims the affiliate identity. SEO compounds over time; puzzle detail pages indexed now become durable acquisition assets. The catalog scraping infrastructure, once built, runs passively — making time to market the primary leverage point.

---

## 8. Cross-Cutting NFRs

### Performance
- Puzzle detail pages (public, unauthenticated) must render with Time to First Byte (TTFB) < 300ms at the p95 for SEO ranking.
- Catalog search results must appear within 500ms at p95 for queries returning up to 100 results.
- Affiliate Redirect endpoint must respond within 200ms at p95 (redirect latency directly impacts conversion).
- My Collection and My Wishlist pages must load within 1.5 seconds at p95 for collections up to 500 Puzzles.

### SEO
- Every Puzzle detail page must include: `<title>`, `<meta description>`, Open Graph tags (`og:title`, `og:image`, `og:description`), and JSON-LD structured data (schema.org/Product).
- Puzzle detail pages must be server-side rendered (or statically generated) — not client-side only.
- A sitemap.xml covering all Puzzle detail pages must be generated and submitted to Google Search Console within 7 days of launch.
- Canonical URLs must be set on all paginated browse pages to prevent duplicate-content penalties.

### Security
- No card data or payment credentials are stored on MyPuzzleInventory infrastructure — all payment processing via Stripe.
- Authentication tokens are stored in secure, httpOnly, SameSite=Strict cookies.
- All user-supplied input (search queries, contribution form, import CSV) is sanitized before persistence or display.
- The `/r/[link_id]` Affiliate Redirect endpoint validates `link_id` against known records; unknown IDs return 404, not open redirect.

### Data Portability and Privacy
- CSV export (FR-25) is available from day one of launch.
- A privacy policy covering email address collection and affiliate click logging is published before any user account is created.
- GDPR: a mechanism for EU users to request data deletion must be available at launch (can be manual/email-based for v1; automated in v2).

### Accessibility
- All interactive elements (buttons, forms, search) must be keyboard-navigable.
- Color is not the sole indicator of Status (badges include text labels in addition to color).
- Image thumbnails include meaningful alt text (Puzzle title + brand).

### Reliability
- Scraper failures do not degrade the user-facing application.
- The application must be deployable to Vercel (or equivalent) with zero-downtime deployments.

---

## 9. Monetization

| Tier | Price | Access |
|---|---|---|
| Free | $0 | Full catalog, search, browse, Own/Want/Completed, Collection, Wishlist, Public Profile, CSV export/import |
| Premium | $4/month | All Free features + collection valuation, lent-out tracking, multiple wishlists, advanced stats `[ASSUMPTION]` |

**Revenue streams (in priority order):**
1. **Affiliate commissions** — Primary. Buy-link clicks via Affiliate Redirect on Puzzle detail pages, Wishlist, and Public Profile. Target: ~5% affiliate click-through rate of MAU `[ASSUMPTION — unvalidated benchmark; OI-2]`.
2. **Premium subscriptions** — Secondary. $4/month recurring. Target: 3–5% of MAU by month 9.
3. **Brand sponsorships** — Long-term. Direct relationships with puzzle brands for catalog placement, product launch visibility, and conversion analytics. Unlocks at ~20,000 MAU.

**Affiliate program priority:** Amazon Associates (verify ToS compliance — OI-1), Puzzle Warehouse affiliate program, direct brand affiliate programs. Diversify across programs to avoid single-program dependency.

**Principle:** Core product value (catalog, tracking, export) is always free. Premium adds convenience; it never gates catalog access, tracking, or data portability.

---

## 10. Platform

- **v1:** Responsive web application. The core use case (search a puzzle, check if you own it, add to wishlist) must be fully functional on a mobile browser in under 10 seconds. No native app at launch.
- **v2 Roadmap:** React Native app — confirmed. Priority use case: duplicate-check from Instagram without a browser context switch.
- **Tech stack assumption:** Next.js + PostgreSQL + Supabase Auth on Vercel `[ASSUMPTION]`. Scraper infrastructure in a separate repo, schedule-triggered.

---

## 11. Information Architecture

**Primary surfaces:**
- `/` — Catalog home: featured puzzles, search bar, browse filters
- `/puzzles/[slug]` — Puzzle detail page (public)
- `/search` — Search results page (public)
- `/u/[username]` — Public Profile (public)
- `/collection` — My Collection (authenticated)
- `/wishlist` — My Wishlist (authenticated)
- `/import` — CSV import (authenticated)
- `/settings` — Account settings: username, password, Wishlist visibility, subscription
- `/r/[link_id]` — Affiliate Redirect endpoint
- `/admin` — Internal: affiliate dashboard, contribution queue (admin only)

**Navigation (authenticated):** Catalog | My Collection | My Wishlist | Profile | Settings

**Navigation (unauthenticated):** Catalog | Sign In | Sign Up

---

## 12. Success Metrics

*Each SM cross-references the FR(s) it validates.*

**Primary**
- **SM-1:** Magic Moment rate — % of new signups who add 5+ Puzzles in their first session. Target: >40%. Validates FR-12, FR-13, FR-14. Measures onboarding effectiveness; the primary retention predictor.
- **SM-2:** Monthly Active Users (MAU) — Users who perform at least one authenticated action per month. Targets: 1,000 MAU by month 2; 5,000 MAU by month 6. Validates overall product-market fit.
- **SM-3:** Affiliate click-through rate — % of MAU who click at least one Affiliate Redirect per month. Target: >5% `[ASSUMPTION — OI-2]`. Validates FR-21. Primary revenue signal.

**Secondary**
- **SM-4:** Day-7 retention — % of new signups who perform an authenticated action 7 days after signup. Target: >25%. Validates FR-11 (Duplicate Warning as re-engagement hook).
- **SM-5:** Catalog search zero-results rate — % of searches returning zero results. Target: <15% at launch, <10% by month 3. Validates FR-2, FR-4. Measures catalog adequacy for the collector audience.
- **SM-6:** Public Profile shares — # of unique visitors to Public Profiles who arrived via external referrer (not in-app navigation). No specific target at launch; trend tracked. Validates FR-23 as organic growth driver.
- **SM-7:** Google indexing coverage — % of Puzzle detail pages appearing in Google Search Console within 60 days of launch. Target: >80%. Validates FR-1, FR-2 (SEO NFR).

**Counter-metrics (do not optimize)**
- **SM-C1:** Affiliate link placement density — do not increase the number of Buy buttons per page beyond the current design to chase SM-3. Aggressive affiliate placement undermines the trust relationship that makes collectors return.
- **SM-C2:** Premium conversion pressure — do not gate core catalog or tracking features to drive SM premium conversion. Any premium prompt that reduces SM-1 or SM-4 is a net loss.

---

## 13. Open Questions

1. **OI-1: Amazon Associates ToS compliance.** Does the Amazon Associates Operating Agreement (section 5) permit catalog and comparison-style sites? This is the primary monetization risk. Must be verified before any affiliate infrastructure is built. If Associates does not apply, identify the anchor affiliate program (Puzzle Warehouse?) before proceeding.

2. **OI-2: Affiliate click-through rate benchmark.** The 5% MAU click-through assumption underpins all revenue projections. This figure comes from general affiliate benchmarks, not puzzle-catalog data. Validate within the first 30 days post-launch before building financial projections around it.

3. **OI-3: Premium tier feature validation.** The feature set in §4.12 is a working hypothesis. Talk to 5 active collectors before building: "What would you pay $4/month for?" The answer may differ significantly from the hypothesis.

4. **OI-4: Onboarding wizard detailed UX.** The wizard behavior in FR-12–FR-15 defines the flow contract; the detailed screen-by-screen design, copy, and edge case handling require a UX design pass before implementation. The Magic Moment (5+ puzzles in 10 min) is the entire retention argument — this is the highest-priority UX investment in the product.

5. **OI-5: Contribution Prompt notification mechanism.** Should users who submit a Contribution Prompt receive an email notification when their submitted puzzle is added to the catalog? This is a retention and trust signal. Current PRD defers it; consider for v1.5 or v2.

6. **OI-6: Retailer Link freshness.** How frequently are Retailer Link availability and price data refreshed? The answer affects the accuracy of Wishlist Buy buttons and collection valuation. At launch, daily refresh is assumed; real-time would require a different data pipeline.

---

## 14. Assumptions Index

Every `[ASSUMPTION]` from the document, surfaced for explicit confirmation:

| # | Section | Assumption |
|---|---|---|
| A-1 | §4.3, FR-11 | Duplicate Warning copy reads "You already own this puzzle." — requires copy review. |
| A-2 | §4.4, FR-13 | Onboarding wizard suggests 3 seed searches based on most commonly owned brands if the User hasn't typed within 5 seconds. |
| A-3 | §4.7, FR-22 | Affiliate commission rate is entered manually per retailer program; no API integration with affiliate networks at launch. |
| A-4 | §4.9, FR-26 | CSV import accepts MyPuzzleInventory export format by default; a column-mapping UI handles other formats. |
| A-5 | §4.12 (FR-31 through FR-35) | Premium tier feature set (collection valuation, lent-out tracking, multiple wishlists, advanced stats) is a working hypothesis requiring validation with 5+ collectors before build. |
| A-6 | §10 | Tech stack: Next.js + PostgreSQL + Supabase Auth on Vercel. Scraper infrastructure in a separate repo. |
| A-7 | §12, SM-3 | 5% affiliate click-through rate of MAU — unvalidated benchmark from general affiliate marketing data; not puzzle-catalog specific. (OI-2) |
