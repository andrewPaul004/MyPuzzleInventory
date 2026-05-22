---
title: "PRFAQ Distillate: MyPuzzleInventory"
type: llm-distillate
source: "prfaq-MyPuzzleInventory.md"
created: "2026-05-20"
purpose: "Token-efficient context for downstream PRD creation"
---

# PRFAQ Distillate: MyPuzzleInventory

## Product Identity

- Positioning: "The Discogs of jigsaw puzzles" — canonical catalog + personal collection tracking + affiliate-linked purchasing
- Concept type: Commercial side project targeting passive income; not a venture bet
- Core use case: "Do I already own this?" — duplicate-prevention warning as a daily-use trigger, not a monthly journaling feature
- Secondary use case: Wishlist → Buy in one session without leaving the tool
- Tagline: "Find Any Puzzle. Track What You Own. Buy What You Don't."

## Primary Persona

- Megan, 34, owns 80+ puzzles, buys 1–3/month, spends $300–600/year
- Accidentally bought duplicates; wishlist lives across Pinterest, Notes app, and screenshots
- Discovers puzzles on Instagram/TikTok/YouTube; searches across 3+ retailer sites to find where to buy
- Skews female, Millennial, $50k+ income — confirmed by Ipsos/Ravensburger and Statista survey data
- Secondary: Dan, competitive speed puzzler — served by Completed status tracking, no separate feature needed

## Competitive Intelligence

- **IPDb (ipdb.plus)**: Primary competitor. Non-profit, free, ~39,418 puzzles, image-recognition box scanning, iOS/Android. Structurally cannot add commerce layer without becoming something it has chosen not to be. Sparse database complaints in App Store reviews (July 2025). Volunteer-dependent catalog quality. Platform shutdown fear documented in German puzzle-forum.de. UX: emoji-heavy, no dark mode, confusing taxonomy.
- **MySpeedPuzzling**: De facto standard for competitive speed puzzlers. Identity locked to speed/competition — alienates casual collector audience. No wishlist, no affiliate links, no duplicate-prevention UX. Community features are strong. Free + optional undisclosed membership.
- **"Pieces by Lisa"**: Does not exist as a tracking tool. PuzzlesbyLiza (puzzlesbyliza.com) is a static Ravensburger-only fan catalog. No user accounts, no tracking. Remove from any competitive framing.
- **iCollect Everything**: $70/year generic inventory tool. Data loss complaints, broken barcode scanner, confusing per-category pricing. Not a meaningful threat.
- **Puzzle Tracker App**: Personal collection app, no shared catalog, decent UX patterns to learn from. Free + Premium.
- **PuzzleSwaps**: Trade/swap community with incidental tracking. Complementary, not competitive.

## The Competitive Gap (Verified)

- Zero tools combine: casual-first collection management + duplicate-prevention UX + affiliate-integrated buy links
- Zero tools have SEO-indexed public puzzle pages capturing "Ravensburger [title] buy" search intent
- Zero tools offer a shareable wishlist readable by non-app-using gift-givers

## Catalog

- Launch brands: Ravensburger, Buffalo Games, Cobble Hill, White Mountain
- Launch target: 3,000–5,000 puzzles
- Maintained in-house (scraping), not crowdsourced — key differentiator vs IPDb's volunteer model
- Zero-results UX: "Help us add this puzzle" prompt → community contribution mechanism → user notified when added
- Long-tail indie brands (Artifact Puzzles, Liberty, Cloudberries): post-launch via community contributions
- Manual entry supported for secondhand puzzles without a box

## Technical Decisions (Confirmed)

- Stack: Next.js (App Router) + Tailwind + shadcn/ui, Postgres (Supabase/Neon), Supabase Auth, Cloudflare R2 for images
- Scrapers: Separate repo, scheduled via GitHub Actions, output JSON imported via API — never coupled to main app
- Affiliate tracking: Custom `/r/[link_id]` redirect endpoint for click attribution — no SaaS tool
- Mobile: Responsive web at launch. **React Native app on roadmap** (user confirmed preference)
- Auth: Google OAuth + email/password at launch

## Monetization Model

- **Free forever** for core collection tracking — never paywall the duplicate-prevention use case
- **Affiliate revenue**: ~$375/mo at 5k MAU (5% click-through × $1.50 avg commission) — costs covered
- **Premium tier ($4/mo or $36/yr)**: Collection valuation, advanced export, lent-out tracking — ~$1,500/mo at 10k MAU
- **Brand sponsorships**: $1–5k/year per brand — unlocked at 20k MAU scale
- Passive income milestones: 5k MAU = self-sustaining, 10k MAU = genuinely passive, 20k MAU = real income

## Commitments Made (Must Reflect in PRD)

- CSV export always free, no premium gating
- CSV import of existing collections at launch
- Open/documented export data format at launch
- All retailers shown on puzzle pages, sorted by availability not affiliate rate
- Affiliate disclosure: "We earn a small referral fee" — end of FAQ answer, not foregrounded
- React Native app on product roadmap

## Scope: In for MVP

- Puzzle catalog (3,000–5,000 puzzles, 4 anchor brands)
- Search and filter (brand, piece count, artist, theme, in/out-of-print)
- Public puzzle detail pages with images, specs, affiliate buy links
- User accounts (email/password + Google OAuth)
- Own / Want / Completed actions on each puzzle
- My Collection page (sort/filter, totals)
- My Wishlist page (price/in-stock signals prominent)
- Duplicate-prevention warning ("You already own this")
- Public profile at `/u/[username]`
- CSV export (free, always)
- CSV import of existing collections
- Affiliate click tracking via `/r/[link_id]` redirect
- Zero-results "Help us add this puzzle" prompt

## Scope: Explicitly Out of MVP

- React Native app (roadmap)
- User-generated reviews, ratings, photos
- Social features (following, feeds, comments)
- PuzzleSnap photo-based puzzle identification
- Trading/lending marketplace
- Barcode scanner
- Price history tracking
- MySpeedPuzzling integration
- Community catalog editing (Wikipedia-style)
- Multiple collections per user
- Premium tier (build after launch, validate demand first)

## Build Priorities (Sequenced by Kill Condition)

1. **Ravensburger scraper** — week 1, highest risk, everything depends on it
2. Puzzle detail pages + search (public, no auth)
3. Auth + user_puzzle table + Own/Want/Completed
4. Duplicate-prevention warning UX
5. Affiliate link infrastructure + click tracking
6. My Collection + My Wishlist pages
7. Public profile page
8. CSV export + import
9. SEO pass (meta, OG images, sitemap)
10. Zero-results "Help us add this puzzle" prompt

## Realistic Timeline

- Full-time sprint: 4 weeks
- Evenings/weekends (8–12 hrs/week): 8–12 weeks
- Do not announce launch date until week 8

## Unresolved / Needs Verification Before Building

- **Amazon Associates ToS**: Verify catalog/comparison site rules in Operating Agreement section 5 before writing affiliate code — this is the primary monetization risk
- **5% affiliate click-through rate**: Assumed from general benchmarks, not puzzle-catalog data. Validate in first 30 days post-launch
- **Onboarding flow design**: "Magic moment" of 5+ puzzles in first 10 minutes is the retention unlock — needs detailed UX design before auth is built, not after
- **Zero-results UX detail**: "Help us add this puzzle" needs full flow design (pending wishlist entry? email notification when added?)
- **Premium tier feature validation**: Talk to 5 collectors before building — ask what they'd pay $4/month for

## Open Questions Flagged During PRFAQ

- What happens if IPDb pivots or gets acquired by a well-funded player? (12–18 month window assumption)
- Is scraping defensible long-term or does the model need official brand feeds within 12 months?
- How aggressively to pursue brand affiliate partnerships pre-launch vs post-traction?

## Verdict Summary

- **Forged in steel**: Daily-use hook, Discogs positioning, commerce layer vs IPDb, passive income model, FAQ transparency
- **Needs more heat**: Onboarding flow design, zero-results UX, premium tier feature validation
- **Cracks to address**: Amazon Associates ToS (verify before building), 5% CTR assumption (validate post-launch), catalog quality as kill condition (Ravensburger scraper = week 1 priority #1)
- **Overall**: GO. Cracks are fixable. Proceed to PRD.
