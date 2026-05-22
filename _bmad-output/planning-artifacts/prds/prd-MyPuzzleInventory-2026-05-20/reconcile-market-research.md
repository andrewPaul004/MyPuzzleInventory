# Reconcile: Market Research vs PRD
**Date:** 2026-05-20

## Gaps Found

1. **Platform shutdown / trust signals not spec'd as a day-one UX requirement** — Research (Barriers to Adoption) identifies platform-shutdown fear as a Medium-priority barrier, recommending "CSV export and data portability on day one" *and* communicating it prominently. The PRD includes CSV export (FR-25) but has no requirement to surface data portability messaging on the signup, onboarding, or settings page. The trust signal is buried in a footnote; it needs a visible FR, not just a feature flag. [Research §: Barriers to Adoption / Pain Point Prioritization]

2. **"Do I own this?" check designed for mid-social-browse must be ≤2 taps — no FR enforces this** — Research calls out that the current competitive flow requires "4+ taps with any current tool" and the ideal is "1–2 taps." UJ-1 describes the flow but no FR or NFR mandates a measurable tap-count or time-to-answer bound for the authenticated duplicate check. The PRD caps it in prose (Vision: "answers the question in two taps") but never converts it to an enforceable constraint. [Research §: Barriers to Adoption / Customer Interaction Patterns]

3. **Social proof signals on puzzle pages ("X people own / completed this") are unaddressed** — Research explicitly surfaces "X people own this / Y people have completed this" as a novel social proof element that no competitor provides and that aligns with collector identity and community behavior. The PRD has no FR for aggregate ownership/completion counts on Puzzle detail pages, and it is not listed as a non-goal with rationale. Given its low implementation cost (a count query) and its alignment with the collector-identity emotional driver, this is a gap worth deliberate in/out scoping. [Research §: Decision Influencers and Touchpoints]

4. **In-print / availability as an urgency trigger is treated as display metadata, not a discovery/alert feature** — Research identifies discontinued and in-print status as a purchase-urgency trigger and lists "In-print / availability signals" as a competitive gap no tool fills. The PRD surfaces in-print status as a Puzzle field (FR-1) and a filter (FR-3), but there is no FR for proactive alerting (e.g., "Puzzles on your Wishlist that are going out of print") or for surfacing scarcity cues prominently. The wishlist out-of-stock state (UJ-3 edge case) defers the notification question to OI-5 but frames it only as stock return, not discontinuation. [Research §: Unmet Customer Needs / Purchase Decision Factors]

5. **GTM / community seeding strategy has no PRD hook — the Contribution Prompt is the only community touch, and it is passive** — Research recommends active pre-launch community presence in r/Jigsawpuzzles and Facebook groups (4–6 weeks pre-launch, value-first), and influencer outreach offering personalized collection showcase. The PRD is correctly scoped to product requirements, but the Contribution Prompt (FR-27/28) and the Public Profile (FR-23) are the only features that support community-driven growth. No FR captures a "shareable collection embed" or "invite a friend to view my collection" mechanism that research identifies as a viral growth driver. The gap: the PRD does not translate the influencer outreach strategy into even a minimal sharable/embeddable artifact requirement. [Research §: Go-to-Market Strategy / Customer Interaction Patterns]

6. **Barcode scanning deferred without a compensating fast-add path for existing collections** — Research ranks barcode scanner reliability as "High" priority for onboarding, and notes that manual entry of a 100+ puzzle collection causes abandonment before the value is felt. The PRD correctly defers barcode scanning (v2), but does not specify a compensating fast-bulk-add mechanism beyond CSV import (FR-26). The research context makes clear that the CSV import is not sufficient for the majority of collectors (who do not have spreadsheets) — a title-based rapid-add flow or guided "brand sweep" UX is needed to bridge this gap. The onboarding wizard (FR-12–15) partially addresses this, but only for 5 puzzles; there is no FR for a "claim all Ravensburger puzzles I own" bulk-by-brand flow. [Research §: Barriers to Adoption / Pain Point Prioritization]

---

## Confirmed Covered

- **Duplicate purchase prevention as daily-use retention hook** — FR-11 (Duplicate Warning) and UJ-1 directly implement this; prominently positioned above Retailer Links.
- **Affiliate-linked retailer routing as revenue engine** — FR-19 through FR-22 fully spec the Affiliate Redirect, click logging, and dashboard; monetization §9 codifies the model.
- **IPDb identified as primary competitor** — Vision §1 names IPDb explicitly; §7 (Why Now) articulates the commerce-layer moat.
- **Catalog depth as unlock condition** — FR-4 (ingestion pipeline), 3,000–5,000 puzzle launch target, and Anchor Brand strategy all directly address this.
- **Gift-giver shareable profile (no account required)** — UJ-4 and FR-23 fully address the "show a gift-giver what to buy me" JTBD including unauthenticated affiliate clicks.
- **CSV export as data portability / trust signal** — FR-25 specifies free, unfettered export from day one.
- **Magic Moment threshold (5 puzzles in first session)** — FR-14 and SM-1 specify and measure this directly.
- **SEO-indexed public puzzle pages** — FR-1, cross-cutting NFRs (§8 SEO), and SM-7 fully address the organic acquisition strategy.
- **Casual-collector persona over competitive-puzzler identity** — §2.1 (Megan), §2.4 (Dan as incidental), and Vision §1 lock the positioning.
- **Platform shutdown fear / data portability** — CSV export FR-25 covers the functional requirement (though the UX communication gap is noted above).
- **"Pieces by Lisa" corrected** — PRD makes no reference to the incorrect competitor; IPDb is the named threat throughout.
