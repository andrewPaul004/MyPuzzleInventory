# Product Brief: MyPuzzleInventory

## Executive Summary

MyPuzzleInventory is a canonical, in-house-maintained catalog of commercially available jigsaw puzzles, paired with personal collection tracking, wishlist management, and affiliate-linked purchasing — the Discogs of jigsaw puzzles. It is built as a side project targeting passive income, not venture scale — the financial model works at 10,000–20,000 MAU without outside investment or a team.

The puzzle market is a passionate but fragmented niche. Collectors buy from a dozen brands, discover new puzzles across Instagram, Reddit, and scattered brand websites, and manage their growing collections with screenshots, Notes apps, and memory alone. There is no central reference: no single place to browse what exists, confirm what you own, or find where to buy it. MyPuzzleInventory fills that gap.

The timing is right because the pandemic-era puzzle resurgence created a durable wave of serious collectors who now own 50–200+ puzzles and feel the pain of this fragmentation daily. The core value — preventing duplicate purchases and surfacing what to buy next — is simple enough to build in weeks and compelling enough to retain daily.

## The Problem

Megan owns 80+ puzzles and buys 1–3 more per month. She has accidentally bought duplicates. She maintains wishlists across Pinterest, screenshot folders, and her memory. When she finds a puzzle she likes online, she has to leave the site to search for where to buy it. There is no reliable way to browse the full catalog of what exists by brand, artist, style, or piece count. She cannot easily show her collection to other puzzlers.

Five distinct pain points, ranked by frequency of occurrence:

1. **"Do I already own this?"** — Highest frequency. The fear of the duplicate purchase is present every time she browses.
2. **"What should I buy next?"** — Drives purchase decisions and affiliate revenue.
3. **"Where can I buy this specific one?"** — Forces users off-platform; a solved problem for MyPuzzleInventory.
4. **"What does my collection look like?"** — Vanity need, but drives word-of-mouth sharing and organic growth.
5. **"Is this still in print?"** — Lower frequency but high-value signal when present.

The cost of the status quo is real: wasted money on duplicates, wasted time searching across retailer sites, and a collection that is invisible to friends and the community.

## The Solution

MyPuzzleInventory is a searchable puzzle catalog and personal collection tracker. Users find any puzzle by brand, piece count, artist, or theme. On each puzzle page they see the full spec, a high-quality image, and direct affiliate buy links. With one tap they mark a puzzle as **Owned**, **Wanted**, or **Completed**.

The magic is in two moments:
- **Prevention:** "You already own this" appears as they browse — saving the $30 duplicate purchase.
- **Discovery:** A single "What should I buy next?" session on the wishlist produces a curated shortlist with buy-now links.

The public shareable collection profile (`mypuzzleinventory.com/u/megan`) turns a private hobby into a social artifact — the primary organic growth driver.

## What Makes This Different

**The primary competitor is IPDb, not MySpeedPuzzling.** IPDb (ipdb.plus) is a free, non-profit community database with ~39,000+ puzzle records, image-recognition box scanning, and iOS/Android apps. It is the closest functional competitor. Its structural weaknesses: volunteer-dependent catalog quality (sparse database complaints in early reviews), zero commerce layer, no affiliate buy links, and platform-shutdown fear among users. MySpeedPuzzling is identity-locked to competitive speed puzzling and is not a meaningful threat for the casual collector audience. "Pieces by Lisa" does not exist as a tracking tool — PuzzlesbyLiza (puzzlesbyliza.com) is a static Ravensburger-only fan site with no accounts or tracking.

**The commerce layer is a structural moat vs IPDb.** IPDb cannot add affiliate buy links without becoming something it has explicitly chosen not to be as a non-profit. That gap is not a UX gap — it is a structural one. The window to establish MyPuzzleInventory's commerce identity is 12–18 months before a well-funded alternative appears.

**Catalog maintained in-house, not crowdsourced.** The catalog is built and maintained via scheduled scrapers from brand and manufacturer sources — not volunteer contributions. This ensures consistent quality and coverage on the anchor brands collectors actually buy, independent of community activity.

**Duplicate prevention as a daily-use hook.** Most collection trackers are journaling tools you visit monthly. The duplicate-prevention use case turns MyPuzzleInventory into something you open every time you see a puzzle you might buy. That daily-use frequency is the retention unlock.

**Affiliate-native design.** Buy links are not an afterthought bolted onto a community site. They are placed prominently on every puzzle page, sorted by availability — not by affiliate rate — reducing friction from discovery to purchase to near zero.

**Honest moat assessment:** The moat at launch is the commerce layer and duplicate-prevention UX — not catalog depth (IPDb already has more). The defensibility builds through SEO indexing of puzzle pages, user collection lock-in, and affiliate relationships over time.

## Who This Serves

**Primary — Megan, the 4-shelf collector**
34 years old. Has been puzzling for 5 years. Owns 80+ puzzles. Has accidentally bought duplicates. Follows 6 puzzle Instagram accounts. Buys 1–3 puzzles per month. Lurks in r/Jigsawpuzzles. Maintains a wishlist spread across Notes, Pinterest, and screenshots. Spends $300–600/year on puzzles. Not competitive — she loves puzzles as a hobby and a ritual.

Success for Megan: She opens MyPuzzleInventory instead of her screenshot folder. She never buys a duplicate again. Her collection page becomes something she's proud to share.

**Secondary — Dan, the competitive puzzler**
Needs to track which puzzles he has completed to avoid repetition in timed practice. Smaller audience, higher engagement. Served by the Completed status on the same `user_puzzle` row — no separate feature needed.

Build for Megan first. Dan benefits from the same core product.

## Success Criteria

**User success signals:**
- User adds 5+ puzzles to their collection within the first 10 minutes (the "magic moment" for retention)
- Returning users open the app when they see a puzzle they might buy (duplicate-check behavior)
- Collection profiles are shared organically on social platforms

**Business metrics:**
- 5,000 MAU within 6 months of launch
- 5% of MAU click through to an affiliate purchase link
- Average affiliate commission of $1.50 per click-through (~$375/mo at 5k MAU)
- 3–5% MAU conversion to premium tier ($4/mo) by month 9
- 20,000 MAU milestone unlocks brand sponsorship conversations ($1–5k/year per brand)

**Catalog quality signals:**
- 3,000–5,000 puzzles from 4 anchor brands at launch
- Puzzle pages indexed and ranking in Google within 60 days of launch
- Zero known duplicate puzzle entries (image_hash deduplication active)

## Scope

### In for v1 (the 4-week MVP)

- Puzzle catalog: ~3,000–5,000 puzzles from 4 brands (Ravensburger, Buffalo, Cobble Hill, White Mountain)
- Search and filter: brand, piece count, artist, theme, in/out-of-print status
- Public puzzle detail pages with image, specs, and affiliate buy links
- User accounts: email/password and Google OAuth
- Three user actions per puzzle: **Own**, **Want**, **Completed**
- My Collection page with sort/filter and collection totals
- My Wishlist page with price/in-stock signals
- Duplicate-prevention warning ("You already own this") when browsing
- Public profile page at `/u/[username]`
- CSV export of collection (always free, never paywalled)
- CSV import of existing collections (from spreadsheets, Notes exports, other apps)
- Open/documented export data format
- Zero-results "Help us add this puzzle" prompt — community contribution mechanism
- Affiliate click tracking via `/r/[link_id]` redirect endpoint

### Explicitly out of v1

- User-generated reviews, ratings, or photos
- Social features: following, feeds, comments
- Photo-based puzzle identification (PuzzleSnap)
- Trading or lending marketplace
- Native mobile app — responsive web at launch; **React Native app is on the roadmap for v2**
- Barcode scanner
- Price history tracking
- Integrations with MySpeedPuzzling or external solve trackers
- Community catalog editing (Wikipedia-style)
- Multiple collections per user
- Loaning/lending log

Any feature not on the In list waits for v2. If a week-3 impulse to add one of the above arises, ship the MVP first.

## Before You Build

Three actions required before writing a line of code — in this order:

1. **Verify Amazon Associates ToS** (30 minutes). Read the Operating Agreement section 5 for catalog and comparison-style sites. This is the primary monetization risk. If Associates doesn't work for this use case, identify the anchor affiliate program before building the infrastructure.

2. **Design the onboarding flow** (before building auth). Sketch the experience from account creation to puzzle #5 logged. The "magic moment" — 5+ puzzles added in the first 10 minutes — is the entire retention argument. It needs to be designed deliberately, not discovered after auth is shipped.

3. **Treat the Ravensburger scraper as deliverable #1**. Not task 3 of 12. Catalog quality is the kill condition: if 40% of searches return zero results in month one, word of mouth turns negative and no UX polish recovers it. Everything else waits until the scraper is stable and producing clean data.

## Vision

In two to three years, MyPuzzleInventory is the canonical puzzle database — the reference that brands, retailers, and creators link to. The catalog has grown past 20,000 puzzles across 30+ brands, contributed in part by a community-edit system with light moderation. Brand dashboard subscriptions provide recurring revenue as puzzle makers pay for catalog control, product launch visibility, and conversion analytics.

PuzzleSnap launches as a premium feature: photograph a box, identify the puzzle, log it instantly. The shareable profile evolves into a light social layer — not a feed, but a gallery-style portfolio that puzzle collectors send to friends as an identity signal. A React Native app brings the duplicate-prevention use case fully native — open from Instagram, check in two taps, close.

The long-term bet: puzzles are a $1B+ global market with no digital-native home. MyPuzzleInventory becomes that home.
