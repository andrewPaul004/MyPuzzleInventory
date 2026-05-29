# Epic 1 — Foundation & User Authentication: Test Plan

**Epic:** Epic 1 — Foundation & User Authentication
**FRs covered:** FR-5, FR-6, FR-7, FR-8
**Date:** 2026-05-29

---

## Overview

This test plan covers all six stories in Epic 1. The epic establishes the project scaffold, design system foundation, auth infrastructure (email/password and Google OAuth), session persistence, username management, and the `BottomSheetAuth` overlay component. Every subsequent epic depends on correctness here.

**Test tooling:**
- Unit/integration: Vitest (co-located with source files)
- E2E: Playwright (in `e2e/` at project root)
- Test DB: `DATABASE_URL_TEST` — hard failure if unset

---

## Story 1.1: Project Scaffold & Auth Infrastructure

**Story GH Issue:** #2

### Unit Tests

| ID | Test Name | Type | Description |
|----|-----------|------|-------------|
| 1.1-U-01 | `env.ts throws on missing required var` | Unit | Import `src/lib/env.ts` in an env where a required variable is absent; assert process throws before any request handling. |
| 1.1-U-02 | `requireUser returns User or redirects — never throws` | Unit | Call `requireUser()` with a mocked Supabase client returning a valid user; assert return value matches `User` shape. Call with no session; assert `redirect('/login')` is invoked — not a throw. |
| 1.1-U-03 | `requireUser must be called before try/catch — structural lint` | Unit | Static analysis or code-review check: in every Server Action file, `requireUser()` appears before any `try` block. |
| 1.1-U-04 | `ok(data) returns ActionResult success shape` | Unit | Call `ok({ id: '1' })`; assert `{ success: true, data: { id: '1' } }`. |
| 1.1-U-05 | `err(message, code) returns ActionResult error shape` | Unit | Call `err('Not found', 'NOT_FOUND')`; assert `{ success: false, error: 'Not found', code: 'NOT_FOUND' }`. |
| 1.1-U-06 | `withActive(table) returns deleted_at IS NULL condition` | Unit | Call `withActive(puzzles)`; assert the generated Drizzle `where` expression evaluates to `deleted_at IS NULL`. |
| 1.1-U-07 | `DATABASE_URL_TEST unset causes hard test failure` | Unit | Unset `DATABASE_URL_TEST` in test env; run a db-touching test; assert a clear error is thrown before any query executes — never falls back to `DATABASE_URL`. |

### Integration Tests

| ID | Test Name | Type | Description |
|----|-----------|------|-------------|
| 1.1-I-01 | `middleware refreshes session and passes through — never redirects` | Integration | Send a request with an expired but refreshable session token; assert middleware updates the cookie and the response is a 200 passthrough, not a redirect. |
| 1.1-I-02 | `on_auth_user_created trigger inserts profiles row` | Integration | Insert a row into `auth.users` on test DB; assert a `profiles` row with matching `id` exists within the same transaction. |
| 1.1-I-03 | `pg_trgm and tsvector extensions present after migrations` | Integration | Run `SELECT extname FROM pg_extension WHERE extname IN ('pg_trgm', 'unaccent')` plus `SELECT column_name FROM information_schema.columns WHERE table_name = 'puzzles' AND column_name = 'search_vector'`; assert both pass. |
| 1.1-I-04 | `auth callback exchanges code for session and redirects` | Integration | POST to `GET /api/auth/callback` with a valid Supabase auth code; assert HTTP redirect (302/303) to post-login destination and a `Set-Cookie` header containing the session. |
| 1.1-I-05 | `Sentry captures uncaught server error` | Integration | Trigger a deliberate unhandled server error in a test route; assert the Sentry SDK `captureException` was called (use Sentry test DSN or spy). |

### Acceptance Criteria Mapping

| AC | Test IDs |
|----|----------|
| AC-1: scaffold structure matches architecture layout | Manual verification at scaffold time |
| AC-2: env.ts throws on missing required var | 1.1-U-01 |
| AC-3: middleware refreshes session, never redirects | 1.1-I-01 |
| AC-4: requireUser returns User or null, never throws/redirects | 1.1-U-02 |
| AC-5: ok() / err() return ActionResult | 1.1-U-04, 1.1-U-05 |
| AC-6: withActive returns deleted_at IS NULL | 1.1-U-06 |
| AC-7: on_auth_user_created trigger fires atomically | 1.1-I-02 |
| AC-8: pg_trgm and tsvector extensions present | 1.1-I-03 |
| AC-9: Sentry captures uncaught server errors | 1.1-I-05 |
| AC-10: auth callback exchanges code for session | 1.1-I-04 |
| AC-11: route groups exist (structural) | Manual / directory check |
| AC-12: DATABASE_URL_TEST unset = hard failure | 1.1-U-07 |

---

## Story 1.2: Design System Foundation

**Story GH Issue:** #3

### Unit Tests

| ID | Test Name | Type | Description |
|----|-----------|------|-------------|
| 1.2-U-01 | `brand-owned token resolves to hsl(38 85% 55%)` | Unit | Parse `tailwind.config.ts` and `app/globals.css`; assert `--brand-owned` value equals `hsl(38 85% 55%)` in both files in light and dark modes. |
| 1.2-U-02 | `brand-wanted token resolves to hsl(210 70% 60%)` | Unit | Same as above for `--brand-wanted`. |
| 1.2-U-03 | `brand-neutral token resolves to hsl(24 5% 40%)` | Unit | Same as above for `--brand-neutral`. |
| 1.2-U-04 | `brand-destructive token resolves to hsl(0 65% 55%)` | Unit | Same as above for `--brand-destructive`. |
| 1.2-U-05 | `Framer Motion importable without build errors` | Unit | Run `npm run build`; assert exit code 0 and no Framer Motion import errors in the build log. |
| 1.2-U-06 | `dark mode background is Void Walnut hsl(24 8% 8%)` | Unit | Parse `globals.css` dark mode block; assert `--background` is `hsl(24 8% 8%)` and body text is `#F0EDE8`. |
| 1.2-U-07 | `minimum font size floor is 0.75rem` | Unit | Parse the typography scale definitions; assert no `clamp()` minimum value is below `0.75rem` (12px). |

### Component Tests

| ID | Test Name | Type | Description |
|----|-----------|------|-------------|
| 1.2-C-01 | `dark mode does not FOUC` | Component | Render root layout in jsdom with dark mode active; assert `<html>` has `suppressHydrationWarning` attribute and `data-theme` or `class="dark"` is set synchronously. |
| 1.2-C-02 | `Fraunces font applied to heading elements` | Component | Render a page heading; inspect computed class; assert Fraunces CSS variable is referenced (not Inter). |
| 1.2-C-03 | `components/ui/ files not hand-edited after init` | Component | Git diff `components/ui/` against baseline commit; assert no manual edits to generated shadcn files. |

### Acceptance Criteria Mapping

| AC | Test IDs |
|----|----------|
| AC-1: components/ui/ generated and committed as-is | 1.2-C-03 |
| AC-2: four semantic tokens in tailwind.config + globals.css | 1.2-U-01, 1.2-U-02, 1.2-U-03, 1.2-U-04 |
| AC-3: owned ring box-shadow applied | Covered in Story 3.1 (component renders glow) |
| AC-4: ThemeProvider wraps layout with suppressHydrationWarning | 1.2-C-01 |
| AC-5: dark background Void Walnut, body text #F0EDE8 | 1.2-U-06 |
| AC-6: Fraunces for headings, Inter for UI | 1.2-C-02 |
| AC-7: modular scale clamp() floor >= 0.75rem | 1.2-U-07 |
| AC-8: Framer Motion importable after build | 1.2-U-05 |

---

## Story 1.3: Email/Password Signup & Login

**Story GH Issue:** #4

**FR-5 coverage, NFR-3 security**

### Unit Tests

| ID | Test Name | Type | Description |
|----|-----------|------|-------------|
| 1.3-U-01 | `signUp returns err on duplicate email` | Unit | Call underlying signup business logic with a duplicate email; assert `err("An account with this email already exists.")`. |
| 1.3-U-02 | `signIn returns err on invalid credentials` | Unit | Call signin logic with wrong password; assert `err("Invalid email or password.")` — no detail about which field. |
| 1.3-U-03 | `requestPasswordReset returns success regardless of email existence` | Unit | Call reset logic with an unknown email and with a known email; assert both return success response (no enumeration). |
| 1.3-U-04 | `signUp validates password minimum length client-side` | Unit | Submit signup form with a 7-character password via `userEvent`; assert inline field error appears before form submission. |
| 1.3-U-05 | `requireUser called before try/catch in all auth Server Actions` | Unit | Static / AST check on `src/actions/auth.ts`; assert `requireUser()` invocation precedes the first `try {` in every exported function. |

### Integration Tests

| ID | Test Name | Type | Description |
|----|-----------|------|-------------|
| 1.3-I-01 | `signUp creates user and profiles row, redirects to onboarding` | Integration | Call `signUp` action with valid email/password on test DB; assert Supabase user created, `profiles` row exists, redirect target is `/onboarding`. |
| 1.3-I-02 | `signIn sets secure httpOnly session cookie` | Integration | Call `signIn` action with correct credentials; inspect `Set-Cookie` header; assert `HttpOnly`, `SameSite=Strict`, `Secure` flags are all present. |
| 1.3-I-03 | `session expires after 30-day idle` | Integration | Create a session with `expires_at` set to 30+ days ago; make a request with that session cookie; assert a re-authentication prompt is returned (session is not silently renewed for an expired-idle session). |

### E2E Tests

| ID | Test Name | Type | Description |
|----|-----------|------|-------------|
| 1.3-E-01 | `email signup happy path ends at onboarding wizard` | E2E | Navigate to `/signup`, fill valid email + 8-char password, submit; assert redirect to `/onboarding`. |
| 1.3-E-02 | `login happy path redirects to /collection` | E2E | Navigate to `/login`, fill registered credentials, submit; assert redirect to `/collection`. |
| 1.3-E-03 | `duplicate email signup shows clear error` | E2E | Sign up with an already-registered email; assert error message visible on page without navigation. |
| 1.3-E-04 | `password reset flow shows confirmation without revealing email existence` | E2E | Enter unknown email in forgot-password form; assert confirmation message shown — no error indicating email is unknown. |

### Acceptance Criteria Mapping

| AC | Test IDs |
|----|----------|
| AC-1: signUp creates user + profiles row, redirect to onboarding | 1.3-I-01, 1.3-E-01 |
| AC-2: duplicate email returns clear err() | 1.3-U-01, 1.3-E-03 |
| AC-3: password < 8 chars shows inline field error | 1.3-U-04 |
| AC-4: signIn sets secure cookie, redirect to /collection | 1.3-I-02, 1.3-E-02 |
| AC-5: invalid credentials returns err without field detail | 1.3-U-02 |
| AC-6: requestPasswordReset no enumeration | 1.3-U-03, 1.3-E-04 |
| AC-7: session expires after 30-day idle | 1.3-I-03 |
| AC-8: requireUser() before try/catch in auth actions | 1.3-U-05 |

---

## Story 1.4: Google OAuth Authentication

**Story GH Issue:** #5

**FR-6 coverage**

### Integration Tests

| ID | Test Name | Type | Description |
|----|-----------|------|-------------|
| 1.4-I-01 | `OAuth callback creates new user and profiles row for first-time Google sign-in` | Integration | Simulate Supabase OAuth callback with a new Google identity on test DB; assert user record and `profiles` row created; redirect to `/onboarding`. |
| 1.4-I-02 | `OAuth callback links accounts for matching email` | Integration | Simulate OAuth callback with an email already registered via email/password; assert no duplicate `auth.users` row is created; existing `profiles` row is returned. |
| 1.4-I-03 | `OAuth session cookie format matches email/password session` | Integration | Complete OAuth flow; inspect `Set-Cookie`; assert same `HttpOnly`, `SameSite=Strict`, `Secure` flags as email/password sessions. |
| 1.4-I-04 | `OAuth callback returns ActionResult on error — does not throw` | Integration | Simulate a failed token exchange (invalid code); assert the callback route handler returns an error response, not an unhandled exception. |

### Component Tests

| ID | Test Name | Type | Description |
|----|-----------|------|-------------|
| 1.4-C-01 | `OAuth user settings page omits password fields` | Component | Render account settings for a user with `app_metadata.provider = 'google'`; assert no "Change password" or "Forgot password" UI elements are present. |

### E2E Tests

| ID | Test Name | Type | Description |
|----|-----------|------|-------------|
| 1.4-E-01 | `Google OAuth button redirects to Google consent screen` | E2E | Navigate to `/login`, click "Continue with Google"; assert browser URL changes to `accounts.google.com` (verify redirect only — do not complete OAuth in E2E). |

### Acceptance Criteria Mapping

| AC | Test IDs |
|----|----------|
| AC-1: OAuth initiates redirect to Google | 1.4-E-01 |
| AC-2: first-time OAuth creates user + profiles, redirects to onboarding | 1.4-I-01 |
| AC-3: same-email accounts linked automatically | 1.4-I-02 |
| AC-4: OAuth user settings has no password fields | 1.4-C-01 |
| AC-5: OAuth session cookie matches email/password format | 1.4-I-03 |
| AC-6: callback returns ActionResult on error | 1.4-I-04 |

---

## Story 1.5: Username Assignment & Account Settings

**Story GH Issue:** #6

**FR-8 coverage**

### Unit Tests

| ID | Test Name | Type | Description |
|----|-----------|------|-------------|
| 1.5-U-01 | `email prefix is sanitized to [a-z0-9-]{3,30} no leading/trailing hyphen` | Unit | Pass various email prefixes to the username sanitizer in `src/lib/username.ts`; assert output matches the regex and never starts/ends with a hyphen. |
| 1.5-U-02 | `conflicting username gets numeric suffix` | Unit | Call username generation with `megan` already in DB; assert result is `megan-2` (or `megan-3` if `megan-2` also taken). |
| 1.5-U-03 | `updateUsername validates 3–30 chars, alphanumeric+hyphen, no leading/trailing hyphen` | Unit | Call `updateUsername` with a 2-char name, a name with a leading hyphen, a name with `@` in it, and a 31-char name; assert all return `err('...', 'VALIDATION')`. |
| 1.5-U-04 | `updateUsername blocked after first change` | Unit | Set `username_changed_at` on the test profile; call `updateUsername`; assert `err("Username can only be changed once.")`. |
| 1.5-U-05 | `updateUsername returns err on taken username` | Unit | Call `updateUsername` with a username already owned by another user; assert `err("That username is already taken.")`. |
| 1.5-U-06 | `requireUser() called before try/catch in updateUsername` | Unit | AST / static check on `src/actions/settings.ts`; assert `requireUser()` precedes any `try {` block in `updateUsername`. |

### Integration Tests

| ID | Test Name | Type | Description |
|----|-----------|------|-------------|
| 1.5-I-01 | `profiles row has username set from email prefix on signup` | Integration | Sign up with `puzzle.fan@example.com` on test DB; assert `profiles.username` is `puzzle-fan` (or sanitized equivalent). |
| 1.5-I-02 | `username change sets username_changed_at timestamp` | Integration | Call `updateUsername` with a valid new name; assert `profiles.username_changed_at IS NOT NULL` in DB. |
| 1.5-I-03 | `old username returns 404 immediately after change` | Integration | Change username from `alice` to `alice-new`; request `/u/alice`; assert HTTP 404 with no redirect. |
| 1.5-I-04 | `username UNIQUE constraint enforced at DB level` | Integration | Attempt two concurrent inserts with the same username; assert only one succeeds. |

### Acceptance Criteria Mapping

| AC | Test IDs |
|----|----------|
| AC-1: username set from email prefix, sanitized to regex | 1.5-I-01, 1.5-U-01 |
| AC-2: conflicting username gets numeric suffix | 1.5-U-02 |
| AC-3: updateUsername validates all constraints | 1.5-U-03 |
| AC-4: second username change blocked | 1.5-U-04, 1.5-I-02 |
| AC-5: taken username returns clear err | 1.5-U-05 |
| AC-6: old username 404 immediately — no redirect | 1.5-I-03 |
| AC-7: requireUser() before try/catch | 1.5-U-06 |

---

## Story 1.6: BottomSheetAuth — Frictionless Auth Overlay

**Story GH Issue:** #7

### Unit / Component Tests

| ID | Test Name | Type | Description |
|----|-----------|------|-------------|
| 1.6-C-01 | `BottomSheetAuth slides up on trigger — does not navigate page away` | Component | Render a page with a trigger element; fire trigger event; assert `BottomSheetAuth` is present in the DOM and `window.location.href` has not changed. |
| 1.6-C-02 | `BottomSheetAuth renders Google and email/password auth options` | Component | Open `BottomSheetAuth`; assert both "Continue with Google" and email/password form fields are present. |
| 1.6-C-03 | `queryClient.invalidateQueries called before pendingAction on auth success` | Component | Pass a mock `pendingAction` spy; simulate successful auth; assert `queryClient.invalidateQueries()` resolves before `pendingAction` is called (order assertion via mock call sequence). |
| 1.6-C-04 | `pendingAction error after auth surfaces as Sonner toast` | Component | Pass a `pendingAction` that rejects; simulate successful auth; assert a Sonner toast error appears — the sheet is closed and the page has not navigated. |
| 1.6-C-05 | `dismissing BottomSheetAuth without auth dispatches no action` | Component | Open sheet; dismiss without authenticating; assert `pendingAction` spy was never called. |
| 1.6-C-06 | `keyboard focus is trapped inside BottomSheetAuth` | Component | Open sheet; tab repeatedly from the last focusable element; assert focus cycles back inside the sheet — no background element receives focus. |
| 1.6-C-07 | `BottomSheetAuth accepts pendingAction prop of type () => Promise<void>` | Component | TypeScript type check: assert the component's props type includes `pendingAction: () => Promise<void>` — compile-time assertion. |

### E2E Tests

| ID | Test Name | Type | Description |
|----|-----------|------|-------------|
| 1.6-E-01 | `unauthenticated ownership tap opens BottomSheetAuth overlay` | E2E | Navigate to a puzzle detail page as unauthenticated user; tap an ownership pill; assert `BottomSheetAuth` is visible and the URL has not changed. |
| 1.6-E-02 | `auth inside BottomSheetAuth completes pending action without page reload` | E2E | Tap ownership, complete email auth inside the sheet; assert ownership state is set correctly and no full page reload occurred. |

### Acceptance Criteria Mapping

| AC | Test IDs |
|----|----------|
| AC-1: sheet slides up, page does not navigate | 1.6-C-01, 1.6-E-01 |
| AC-2: sheet presents both auth methods | 1.6-C-02 |
| AC-3: invalidateQueries resolves before pendingAction | 1.6-C-03 |
| AC-4: pendingAction error shows Sonner toast | 1.6-C-04 |
| AC-5: dismiss without auth dispatches nothing | 1.6-C-05 |
| AC-6: focus trapped inside sheet | 1.6-C-06 |
| AC-7: pendingAction prop API accepted by Epic 2 | 1.6-C-07 |

---

## Cross-Cutting Test Requirements (Epic 1)

### Security Tests

| ID | Test Name | Description |
|----|-----------|-------------|
| SEC-01 | `SUPABASE_SERVICE_ROLE_KEY not referenced in src/actions/ or src/lib/db/queries/` | Static grep across all files; assert zero occurrences outside `src/lib/db/admin/` and migration scripts. |
| SEC-02 | `Auth tokens stored in secure httpOnly SameSite=Strict cookies` | Covered by 1.3-I-02 and 1.4-I-03. |
| SEC-03 | `No process.env inline usage outside src/lib/env.ts` | Static grep; assert `process.env` referenced only in `src/lib/env.ts`. |

### Soft-Delete Safeguard Tests

| ID | Test Name | Description |
|----|-----------|-------------|
| SD-01 | `profiles query excludes soft-deleted rows` | Create a profile, soft-delete it (`deleted_at = NOW()`), run `getProfile`; assert no result returned. |
| SD-02 | `withActive applied in all profile queries` | Code review / AST check: every SELECT and JOIN on `profiles` includes `withActive(profiles)`. |

### Accessibility Tests

| ID | Test Name | Description |
|----|-----------|-------------|
| A11Y-01 | `All interactive elements keyboard-navigable on auth pages` | Playwright accessibility scan of `/login` and `/signup`; assert all buttons/inputs reachable via Tab. |
| A11Y-02 | `Touch targets minimum 44×44px on auth forms` | Compute bounding boxes of submit buttons and form inputs in mobile viewport (375px); assert no dimension below 44px. |

### NFR Tests

| ID | Test Name | Description |
|----|-----------|-------------|
| NFR-01 | `Build passes with TypeScript strict mode` | `npm run build` — assert exit code 0, no `TS2xxx` errors. |
| NFR-02 | `npm run lint passes` | `npm run lint` — assert exit code 0. |
| NFR-03 | `DATABASE_URL_TEST unset causes hard failure — never silently uses DATABASE_URL` | Covered by 1.1-U-07. |

---

## Test Execution Order

Stories within Epic 1 have the following dependency order:

```
Story 1.1 (scaffold + infrastructure)
  └─► Story 1.2 (design system — needs scaffold)
        ├─► Story 1.3 (email/password auth — needs design system for forms)
        ├─► Story 1.4 (Google OAuth — parallel to 1.3)
        └─► Story 1.5 (username — needs profiles table from 1.1)
              └─► Story 1.6 (BottomSheetAuth — needs auth from 1.3/1.4)
```

Run tests in this order:
1. Story 1.1 integration tests (DB migration + middleware)
2. Story 1.2 unit tests (design tokens + build)
3. Stories 1.3 and 1.4 in parallel (both depend on 1.1 + 1.2)
4. Story 1.5 (depends on profiles schema from 1.1)
5. Story 1.6 (depends on auth from 1.3 + 1.4)
6. Cross-cutting security and accessibility tests

---

## Key Implementation Pitfalls to Test Against

The following are project-specific traps that standard tests miss. Each has a dedicated test above.

| Pitfall | Test ID(s) |
|---------|-----------|
| `requireUser()` inside a `try/catch` swallows the redirect throw | 1.1-U-03, 1.3-U-05, 1.5-U-06 |
| `getSession()` used instead of `getUser()` (stale cache) | 1.3-I-01 (asserts real user fetch) |
| Bare unawaited Promise for async operations | N/A in Epic 1 (applies to affiliate redirect in Epic 2) |
| `process.env` accessed inline outside `env.ts` | SEC-03 |
| `SUPABASE_SERVICE_ROLE_KEY` in wrong module | SEC-01 |
| `withActive()` omitted on aggregate queries | SD-01, SD-02 |
| `DATABASE_URL_TEST` silent fallback to production | 1.1-U-07, NFR-03 |
| OAuth callback has Supabase auth guard added (breaks PKCE) | Code review item — no session exists at callback time |
