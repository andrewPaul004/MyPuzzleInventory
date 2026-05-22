# Reconcile: PRFAQ vs PRD
**Date:** 2026-05-20

## Gaps Found

1. **Manual entry for secondhand/unmatched puzzles — FAQ Q6 commitment missing from PRD.**
   FAQ Q6 states: "For secondhand puzzles without a box, you can add them manually with whatever details you have — title, piece count, a photo. It won't always match a catalog entry, but your collection stays complete." The PRD has no FR for manually adding a non-catalog puzzle to a user's Collection. The only path for a missing puzzle is the Contribution Prompt (FR-27), which submits to an admin queue and does NOT add the puzzle to the user's Collection. This breaks the "your collection stays complete" promise. A manual/custom User Puzzle record FR is absent.

2. **Photo upload for manual puzzle entries — FAQ Q6 commitment missing from PRD.**
   FAQ Q6 explicitly mentions the user can supply "a photo" when adding a secondhand puzzle manually. Even if a manual-entry FR is added (gap #1), no FR covers photo upload or storage for user-supplied images on custom puzzle records. This is a distinct capability requirement (file upload, storage, rendering) not currently scoped anywhere.

3. **Affiliate disclosure label on puzzle pages — FAQ Q4 commitment not reflected as an FR.**
   FAQ Q4 states: "We do earn a small referral fee on purchases made through our links — that's what keeps the catalog free." This is positioned as a trust signal and is also required for affiliate program compliance (confirmed in the Internal FAQ legal section and coaching notes). The PRD has no FR requiring a visible disclosure statement (e.g., "We may earn a referral fee") on Puzzle detail pages, Wishlist, or Public Profile near Buy buttons. This is both a legal compliance requirement and an explicit customer-facing promise.

4. **Open data format published as a documented spec — launch commitment understated.**
   FAQ Q3 states: "We also publish our data format openly so your export is readable by any future tool, not just ours." Coaching notes Stage 3 and Stage 4 both list "open data format documentation (launch)" as a locked launch commitment. The PRD mentions the format is documented at "a stable public URL" (FR-25 consequence) but this is a single bullet in consequences — not an explicit FR, not assigned an FR number, and not included in the MVP in-scope list (§6.1). It needs to be an explicit, verifiable launch deliverable.

5. **Notification when a contributed puzzle is added to catalog — FAQ Q2 implicit promise not carried forward.**
   FAQ Q2 states: "Suggest it, and we'll prioritize it." This creates an implied expectation of follow-through communication. The PRD acknowledges this as OI-5 and defers it, but the FAQ answer goes further than the PRD's framing — the FAQ implies the user who suggested the puzzle will know when it is acted on. The PRFAQ coaching notes (Stage 3) call out "zero-results UX — community contribution mechanism" as shaping catalog defensibility. OI-5 should be elevated from a deferred open item to at minimum a v1.5 committed feature with a defined trigger, rather than an indefinitely deferred consideration.

---

## Confirmed Covered

- Catalog search by title, brand, piece count, artist, theme (FR-2)
- Duplicate Warning ("In Your Collection" badge) on detail pages and search results (FR-10, FR-11)
- Retailer links sorted by availability then price, never by commission rate (FR-20 — constraint hard-coded)
- CSV export always free, no paywall, available from day one (FR-25)
- CSV import of existing spreadsheets with column-mapping (FR-26)
- Zero-results Contribution Prompt at launch (FR-27, FR-28)
- Public Profile shareable at `/u/[username]`, no account required for visitors (FR-23, FR-24)
- Google OAuth + email/password auth (FR-5, FR-6)
- Onboarding wizard targeting Magic Moment of 5+ puzzles (FR-12 through FR-15)
- Affiliate Redirect click logging (FR-21)
- GDPR data deletion mechanism at launch (§8 Data Portability and Privacy NFR)
- Responsive web app at launch; React Native on roadmap (§10, §5 Non-Goals)
- Premium tier deferred to month 3 post-launch (§6.2, §4.11)
- Amazon Associates ToS compliance flagged as open item before build (OI-1)
- In-house maintained catalog, not crowdsourced — scraper architecture (FR-4)
- Privacy policy required before first user account (§8 NFR)
