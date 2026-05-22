# PRD Quality Review — MyPuzzleInventory

## Overall verdict

This PRD is well above average for a solo/hobby product: the thesis is stated and defended, personas are load-bearing, the glossary is tight, and the affiliate model is treated honestly including its compliance risk. The two areas that hold it back from a green-light-to-build rating are (1) incomplete done-ness on several high-traffic FRs — "graceful handling" and undersized edge-case coverage — and (2) a small cluster of open items (OI-1, OI-2) that are blockers on the primary revenue stream, not deferrable. Fix those and this PRD is ready to drive UX and architecture work.

---

## 1. Decision-readiness — adequate

The PRD names real trade-offs and stakes claims: affiliate-sort-by-price-not-commission is committed and described as hard-coded (§4.7); Premium is explicitly deferred to month 3 with rationale (§6.2); the catalog moat versus IPDb is argued, not asserted. Open Questions are genuinely open — OI-1 and OI-2 are honest blockers, not rhetorical checkboxes.

Two gaps reduce the rating from strong to adequate:

### Findings
- **critical** OI-1 has no build gate attached (§13, OI-1) — The Amazon Associates ToS risk is flagged as "must be verified before any affiliate infrastructure is built," but there is no `[NOTE FOR PM]` callout in §4.7 or §6 making this a hard prerequisite. A reader who skips §13 will proceed to build affiliate infrastructure without knowing the anchor program may not be available. *Fix:* Add a `[NOTE FOR PM: BLOCKER — do not build FR-21 or FR-20 until OI-1 is resolved]` in §4.7.
- **high** Username-change URL invalidation is a decision, not just a consequence (§4.2, FR-8) — The PRD states the old URL returns 404 with no redirect, which may kill SEO and shared links silently. This is a real trade-off (implementation simplicity vs. broken links) that is presented as a consequence rather than a decided question. *Fix:* Add a `[NOTE FOR PM: conscious decision — no redirect on username change; prior URL goes dark. Revisit before public launch if sharing is a growth vector.]`

---

## 2. Substance over theater — strong

Personas are not furniture. Megan drives every UJ and is invoked by name in the FR-level narrative. Dan (§2.2) is handled correctly — one paragraph, explicitly "served incidentally," no separate feature set. The product has only two personas and they both do work.

The Vision statement (§1) is specific to this product: "the Discogs of jigsaw puzzles" + "first to combine … duplicate-prevention UX and affiliate-linked retailer routing" is a falsifiable claim. It could not swap into another PRD without editing.

NFRs in §8 have product-specific thresholds: TTFB < 300ms, search < 500ms, redirect < 200ms. "Reliable" and "secure" appear only with concrete qualifiers.

No findings warranting a change.

---

## 3. Strategic coherence — strong

The thesis is clear: the moat is the commerce layer IPDb cannot build, not catalog size. The feature set follows from it — the duplicate-prevention UX drives retention; the affiliate redirect drives revenue; the public profile drives referral conversion from non-users. The MVP scope does not include features that don't serve the thesis.

Counter-metrics (SM-C1, SM-C2) are the strongest signal of strategic discipline in this PRD. Naming what not to optimize is rare and earns the "strong" rating.

The one coherence gap:

### Findings
- **medium** SM-4 (Day-7 retention) is attributed to FR-11 (Duplicate Warning) as the "re-engagement hook" (§12), but duplicate prevention is a one-shot event per purchase decision, not a recurring engagement driver. A user who hasn't bought a new puzzle in 7 days won't be pulled back by the Duplicate Warning. The Day-7 retention mechanism is actually the Collection page and the onboarding wizard momentum — which is FR-16 and FR-12–14, not FR-11. *Fix:* Correct the SM-4 FR cross-reference to FR-16/FR-12 and add a sentence explaining what actually drives Day-7 re-engagement.

---

## 4. Done-ness clarity — thin

This is the PRD's weakest dimension. Most FRs have consequences, but several high-traffic FRs have consequences that are incomplete, adjective-based, or missing measurable bounds. Downstream story creation will need to negotiate scope rather than extract it.

### Findings
- **high** FR-2 (Catalog Search) — "Search returns results ranked by relevance" (§4.1) — "relevance" is an adjective, not a testable consequence. What is the ranking algorithm or priority order (exact title match > partial title > brand > tag)? An engineer cannot implement this without a decision. *Fix:* Specify the relevance ranking rule (e.g., exact title match ranked first, then fuzzy title match, then brand/piece count match) or call it `[ASSUMPTION]` and add to OI.
- **high** FR-26 (CSV Import) — "a simple mapping UI allows users to label CSV columns from other formats" (§4.9) — "simple" is theater. What columns are required vs. optional? What happens to rows with no title match — are they held, skipped, or surfaced? The consequence list answers some of this but the mapping UI scope is undefined. *Fix:* Define the mapping UI scope (minimum: user labels which column is title, which is piece count) or gate it with `[ASSUMPTION: scope to be defined in UX design pass]`.
- **medium** FR-3 (Catalog Browse and Filter) — "Multiple filters can be active simultaneously" — no consequence specifying the AND/OR logic between filters. Two active filters: does the result set narrow (AND) or expand (OR)? *Fix:* Add a consequence: "Multiple active filters combine with AND logic — results must match all active filter criteria."
- **medium** FR-8 (Username Assignment) — "The username defaults to the portion of their email before `@`" — no consequence for what happens when two users have the same email prefix (common: john@gmail.com, john@outlook.com). *Fix:* Add a consequence for collision handling (e.g., append a random suffix, or prompt the user to choose a unique username at signup).
- **medium** FR-36 (Premium Subscription Management) — "Downgrade from Premium to Free does not delete any data — Premium-specific data is preserved but not accessible until re-subscribe" (§4.12) — this covers the data lifecycle but not the UX at the moment of downgrade. Does the user see a warning before cancellation? Is there a grace period? *Fix:* Add a consequence for the cancellation confirmation UX (minimum: "Cancellation confirmation screen must show what features will be lost and when access ends").
- **low** FR-23 (Public Profile Display) — "The page renders without JavaScript for social media preview crawlers (server-side rendering required)" is a technical constraint correctly placed, but the consequence is in the wrong section (it belongs in §8 SEO NFRs, not FR consequences). Minor — no action needed for downstream.

---

## 5. Scope honesty — strong

Non-Goals (§5) are specific and do work: they name why each item is cut (PuzzleSwaps for trading, IPDb weakness as model to avoid for crowdsourced catalog, etc.). The `[NON-GOAL for MVP]` callout pattern is present where it matters (§6.2). Out-of-scope callouts appear at the feature level (§4.1, §4.11).

The Assumptions Index (§14) is complete: every inline `[ASSUMPTION]` maps to an index entry. Spot-checked A-1 through A-7 — all present.

Open-item density (5 OIs on a solo hobby product) is appropriate — they are real blockers, not padding.

### Findings
- **low** FR-8 username change (§4.2) silently omits the redirect decision — covered under Decision-readiness above, not a scope-honesty issue per se, but worth noting that the Non-Goals section does not address URL redirect strategy.

---

## 6. Downstream usability — strong

The Glossary (§3) is one of the best in any PRD of this length. Synonyms are explicitly prohibited with specific banned terms for each concept. FR, UJ, and SM IDs are contiguous and unique (FR-1–FR-40, with gap at FR-29–FR-33 noted below; UJ-1–UJ-4; SM-1–SM-7 plus SM-C1–SM-C2). Every UJ names Megan or Dan by exact label. FR cross-references in Success Metrics (§12) are present and accurate (with the SM-4/FR-11 exception noted in §3).

### Findings
- **medium** FR ID gap FR-29 through FR-33 — The feature list jumps from FR-28 (§4.10) to FR-34 (§4.11) with no explanation. Either FRs were renumbered and not cleaned up, or five FR slots are reserved for an unlisted feature. Downstream tooling (story creation, traceability matrices) will flag these as broken references. *Fix:* Either fill the gap with the missing FRs, or add a note in §4.10/§4.11: "[FR-29–FR-33 reserved for admin features scoped in a separate internal spec]."

---

## 7. Shape fit — strong

This is a solo/hobby product that will also feed UX and architecture downstream. The PRD has correctly calibrated:
- Two personas, both doing work — not over-personified.
- UJs are 4 journeys matching the 4 primary use cases — appropriate density.
- Success metrics are outcome-oriented (Magic Moment rate, affiliate CTR, Day-7 retention) — not vanity metrics.
- Tech stack assumptions are tagged as assumptions, not mandated.
- Premium tier is correctly deferred with a validation gate.

The PRD is not over-formalized for a solo product. The rigor is justified by the chain-top role (feeds UX + architecture + stories).

No findings.

---

## Mechanical notes

- **Glossary drift:** None found. "Puzzle," "User Puzzle," "Collection," "Wishlist," "Status," "Affiliate Redirect," "Public Profile," "Magic Moment," "Anchor Brand," "Custom Puzzle," "Contribution Prompt," "Premium," "Retailer Link," "Duplicate Warning" are used consistently throughout.
- **ID continuity:** FR-29 through FR-33 are missing (gap between FR-28 and FR-34). All other FR, UJ, and SM IDs are contiguous. No duplicate IDs found.
- **Assumptions Index roundtrip:** All 7 assumptions (A-1 through A-7) verified inline-to-index. No orphans.
- **UJ persona linkage:** All four UJs reference "Megan" — exact label from §2.1. UJ-3 and UJ-4 reference both Megan and a non-user (Megan's mother) — the non-user role is handled correctly as a visitor, not a persona.
- **Required sections:** All sections present: Vision, Target User, Glossary, Features, Non-Goals, MVP Scope, Success Metrics, Open Questions, Assumptions Index. §7 (Why Now) and §10–§11 (Platform, IA) are present and add value.
- **Cross-reference accuracy:** SM-4 → FR-11 linkage is incorrect (noted in §3 findings). All other SM → FR cross-references verified.
- **FR-48 reference:** FR-2 (§4.1) references "FR-48 (Contribution Prompt)" but the Contribution Prompt is FR-27 (§4.10). This is a stale reference, likely from an earlier draft. *Fix:* Change "FR-48" to "FR-27" in FR-2 consequences.
