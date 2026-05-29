/**
 * Test Plan: 1.1-I-04
 * AC: #10 — auth callback exchanges code for session and redirects to post-login destination
 *
 * The route at src/app/api/auth/callback/route.ts must:
 *   1. Extract `code` and `next` from URL search params
 *   2. Call supabase.auth.exchangeCodeForSession(code)
 *   3. On success: redirect to `next` param (default: /collection)
 *   4. On failure: redirect to /auth/auth-code-error
 *   5. NEVER have a Supabase auth guard — no session exists yet at callback time
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('src/app/api/auth/callback/route.ts — OAuth code exchange', () => {
  describe('1.1-I-04: auth callback exchanges code for session and redirects', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    it('returns a 302 redirect to /collection when no `next` param is provided', async () => {
      // TODO: Mock supabase.auth.exchangeCodeForSession() to return { error: null }.
      // Call the GET handler with a request URL containing only `?code=valid-code`.
      // Assert the response status is 302 and Location header is `<origin>/collection`.
      //
      // Example:
      //   import { GET } from '@/app/api/auth/callback/route'
      //   import { NextRequest } from 'next/server'
      //   const req = new NextRequest('http://localhost:3000/api/auth/callback?code=abc123')
      //   const res = await GET(req)
      //   expect(res.status).toBe(302)
      //   expect(res.headers.get('Location')).toBe('http://localhost:3000/collection')
      expect.fail('TODO: implement 1.1-I-04 — redirect to /collection default')
    })

    it('returns a 302 redirect to the `next` param destination on success', async () => {
      // TODO: Call GET with `?code=valid-code&next=/dashboard`.
      // Assert Location header is `<origin>/dashboard`.
      expect.fail('TODO: implement 1.1-I-04 — redirect to custom `next` destination')
    })

    it('sets a session cookie (Set-Cookie header) after successful code exchange', async () => {
      // TODO: Assert the response includes a Set-Cookie header containing session data
      // after a successful exchangeCodeForSession call.
      expect.fail('TODO: implement 1.1-I-04 — Set-Cookie on success')
    })

    it('redirects to /auth/auth-code-error when no code param is provided', async () => {
      // TODO: Call GET with a URL containing no `code` param.
      // Assert redirect to /auth/auth-code-error.
      expect.fail('TODO: implement 1.1-I-04 — redirect on missing code')
    })

    it('redirects to /auth/auth-code-error when exchangeCodeForSession returns an error', async () => {
      // TODO: Mock supabase.auth.exchangeCodeForSession() to return { error: new Error('invalid') }.
      // Assert redirect to /auth/auth-code-error.
      expect.fail('TODO: implement 1.1-I-04 — redirect on exchange error')
    })

    it('does not have an auth guard — no session exists at callback time', async () => {
      // TODO: Confirm the route handler does not call requireUser() or check
      // for an existing session before calling exchangeCodeForSession().
      // This is a structural/code-review check: inspect the route file and
      // assert requireUser() is not imported or called.
      expect.fail('TODO: implement 1.1-I-04 — no auth guard on callback route')
    })
  })
})
