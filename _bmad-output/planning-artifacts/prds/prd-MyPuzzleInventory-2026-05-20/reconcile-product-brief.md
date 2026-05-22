# Reconcile: Product Brief vs PRD
**Date:** 2026-05-20

## Gaps Found

1. **"Before You Build" pre-conditions are not surfaced as blocking requirements.** The product brief explicitly mandates three ordered pre-build actions: (1) verify Amazon Associates ToS, (2) design the onboarding flow before writing auth, (3) treat the Ravensburger scraper as deliverable #1. The PRD converts these into open items and footnotes (OI-1, OI-4, a PM note) but never states that work on auth or buy-link infrastructure must be gated on ToS verification. The causal chain — "if affiliate ToS fails, the revenue model collapses" — is present in §13 as a question, not a hard gate.

2. **Catalog failure as a kill condition is understated.** The brief is emphatic: "if 40% of searches return zero results in month one, word of mouth turns negative and no UX polish recovers it." The PRD captures SM-5 (zero-results rate target <15%) but does not reflect the severity framing — that catalog inadequacy is a launch kill condition, not just a tracked metric. The Ravensburger scraper being deliverable #1 before anything else is implicit in the brief but absent as a sequencing constraint in the PRD.

3. **"Your data is always yours" as an explicit user-facing promise is partially lost.** The brief lists CSV export as "always free, never paywalled" and calls for an "open/documented export data format." The PRD captures the free export (FR-25) and the documented format consequence, but the framing as a trust promise — tied directly to the JTBD "Trust that my data will still exist if this product shuts down" — is only alluded to in §4.9's description. No FR or NFR commits to the export format being publicly documented at a stable URL *before launch*, nor does any requirement reference the open/documented format commitment as a launch gate.

4. **Retailer link sort order by availability-then-price (not commission rate) is a named trust signal, not just a sort rule.** The brief says: "Buy links are not an afterthought… sorted by availability — not by affiliate rate — reducing friction from discovery to purchase to near zero." FR-20 captures the sort order correctly and adds "this constraint is hard-coded, not configurable," which is good. However, the brief frames this as the product's primary trust differentiator vs. competitor affiliate sites — a customer-facing promise. The PRD treats it as an implementation constraint, not a brand commitment. This distinction matters: it should be called out in non-goals (e.g., "we will never reorder links by commission rate") and ideally referenced in the product vision statement.

5. **The 12–18 month window to establish commerce identity is not reflected as a time-sensitive launch urgency constraint.** The brief states: "The window to establish MyPuzzleInventory's commerce identity is 12–18 months before a well-funded alternative appears." The PRD's §7 (Why Now) mentions the window but does not translate it into any MVP timeline constraint or milestone requirement. There is no SM, NFR, or scope note tying the launch date or MVP feature set to this competitive clock. This is a strategic framing gap: the brief treats time-to-market as a first-order constraint; the PRD treats competitive timing as context only.

---

## Confirmed Covered

- Megan and Dan personas, JTBD, and the Magic Moment (5 puzzles in first session) — fully present in §2 and §4.4
- Duplicate Warning as the daily-use retention hook — captured in FR-11 and SM-4
- All v1 scope items (catalog, search, Own/Want/Completed, onboarding, Collection, Wishlist, Public Profile, CSV export/import, Contribution Prompt, Affiliate Redirect) — present in §4 and §6.1
- All v1 explicit out-of-scope items — present in §5 and §6.2
- Affiliate-native design with buy links on every puzzle page — FR-20, FR-21
- In-house scraper model (not crowdsourced) — FR-4
- Image-hash deduplication — FR-4 consequence
- Public shareable profile at `/u/[username]` as organic growth driver — FR-23, FR-24
- Premium tier at $4/month as second revenue pillar — §4.11 and §9
- Business success metrics (MAU targets, affiliate click-through rate, premium conversion rate) — §12
- Amazon Associates ToS as primary monetization risk — OI-1
- SEO requirements (JSON-LD, Open Graph, SSR, sitemap) — §8 NFRs
- Data portability and privacy (GDPR deletion mechanism, privacy policy before first account) — §8 NFRs
- React Native v2 roadmap — §10
