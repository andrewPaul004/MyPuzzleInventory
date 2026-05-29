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

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock the Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('src/app/api/auth/callback/route.ts — OAuth code exchange', () => {
  describe('1.1-I-04: auth callback exchanges code for session and redirects', () => {
    const mockExchangeCodeForSession = vi.fn()

    beforeEach(() => {
      vi.resetModules()
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    const setupSupabaseMock = async (error: Error | null = null) => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          exchangeCodeForSession: mockExchangeCodeForSession.mockResolvedValue({ error }),
        },
      } as ReturnType<Awaited<typeof createClient>>)
    }

    it('returns a 302 redirect to /collection when no `next` param is provided', async () => {
      await setupSupabaseMock(null)

      const { GET } = await import('@/app/api/auth/callback/route')
      const req = new NextRequest('http://localhost:3000/api/auth/callback?code=abc123')
      const res = await GET(req)

      expect(res.status).toBe(302)
      expect(res.headers.get('Location')).toBe('http://localhost:3000/collection')
    })

    it('returns a 302 redirect to the `next` param destination on success', async () => {
      await setupSupabaseMock(null)

      const { GET } = await import('@/app/api/auth/callback/route')
      const req = new NextRequest(
        'http://localhost:3000/api/auth/callback?code=abc123&next=/dashboard'
      )
      const res = await GET(req)

      expect(res.status).toBe(302)
      expect(res.headers.get('Location')).toBe('http://localhost:3000/dashboard')
    })

    it('redirects to /auth/auth-code-error when no code param is provided', async () => {
      await setupSupabaseMock(null)

      const { GET } = await import('@/app/api/auth/callback/route')
      const req = new NextRequest('http://localhost:3000/api/auth/callback')
      const res = await GET(req)

      expect(res.status).toBe(302)
      expect(res.headers.get('Location')).toBe('http://localhost:3000/auth/auth-code-error')
    })

    it('redirects to /auth/auth-code-error when exchangeCodeForSession returns an error', async () => {
      await setupSupabaseMock(new Error('invalid_grant'))

      const { GET } = await import('@/app/api/auth/callback/route')
      const req = new NextRequest('http://localhost:3000/api/auth/callback?code=invalid-code')
      const res = await GET(req)

      expect(res.status).toBe(302)
      expect(res.headers.get('Location')).toBe('http://localhost:3000/auth/auth-code-error')
    })

    it('does not have an auth guard — no session exists at callback time', async () => {
      // Structural check: the route file must not import or call requireUser()
      const fs = await import('fs')
      const path = await import('path')

      const routePath = path.resolve(
        process.cwd(),
        'src/app/api/auth/callback/route.ts'
      )
      const content = fs.readFileSync(routePath, 'utf-8')

      // requireUser must NOT be imported or called in this route
      expect(content).not.toContain('requireUser')
      expect(content).not.toContain('requireAdmin')
    })

    it('calls exchangeCodeForSession with the code from the URL', async () => {
      await setupSupabaseMock(null)

      const { GET } = await import('@/app/api/auth/callback/route')
      const req = new NextRequest('http://localhost:3000/api/auth/callback?code=my-test-code')
      await GET(req)

      expect(mockExchangeCodeForSession).toHaveBeenCalledWith('my-test-code')
    })
  })
})
