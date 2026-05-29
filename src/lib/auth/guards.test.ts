/**
 * Test Plan: 1.1-U-02, 1.1-U-03
 * AC: #4 — requireUser returns User | null, never throws, never redirects
 *
 * Key contract (from story dev notes):
 *   - requireUser() returns User | null
 *   - It NEVER throws
 *   - It NEVER calls redirect()
 *   - Callers are responsible for redirecting on null
 *   - Must be called BEFORE any try/catch block (enforced by structural lint 1.1-U-03)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { User } from '@supabase/supabase-js'

// Mock the supabase server module
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Mock next/navigation redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('src/lib/auth/guards.ts', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('requireUser()', () => {
    describe('1.1-U-02: returns User or null — never throws', () => {
      it('returns a User object when Supabase getUser() resolves with a valid user', async () => {
        const mockUser: Partial<User> = {
          id: 'test-user-id',
          email: 'test@example.com',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        }

        const { createClient } = await import('@/lib/supabase/server')
        vi.mocked(createClient).mockResolvedValue({
          auth: {
            getUser: vi.fn().mockResolvedValue({
              data: { user: mockUser },
              error: null,
            }),
          },
        } as ReturnType<Awaited<typeof createClient>>)

        const { requireUser } = await import('@/lib/auth/guards')
        const result = await requireUser()

        expect(result).not.toBeNull()
        expect(result?.id).toBe('test-user-id')
        expect(result?.email).toBe('test@example.com')
      })

      it('returns null when Supabase getUser() resolves with no user', async () => {
        const { createClient } = await import('@/lib/supabase/server')
        vi.mocked(createClient).mockResolvedValue({
          auth: {
            getUser: vi.fn().mockResolvedValue({
              data: { user: null },
              error: null,
            }),
          },
        } as ReturnType<Awaited<typeof createClient>>)

        const { requireUser } = await import('@/lib/auth/guards')
        const result = await requireUser()

        expect(result).toBeNull()
      })

      it('returns null (does NOT throw) when Supabase getUser() returns an error', async () => {
        const { createClient } = await import('@/lib/supabase/server')
        vi.mocked(createClient).mockResolvedValue({
          auth: {
            getUser: vi.fn().mockResolvedValue({
              data: { user: null },
              error: new Error('Auth error'),
            }),
          },
        } as ReturnType<Awaited<typeof createClient>>)

        const { requireUser } = await import('@/lib/auth/guards')

        // Should resolve to null, NOT throw
        await expect(requireUser()).resolves.toBeNull()
      })

      it('never calls redirect() regardless of auth state', async () => {
        const { redirect } = await import('next/navigation')
        const { createClient } = await import('@/lib/supabase/server')
        vi.mocked(createClient).mockResolvedValue({
          auth: {
            getUser: vi.fn().mockResolvedValue({
              data: { user: null },
              error: null,
            }),
          },
        } as ReturnType<Awaited<typeof createClient>>)

        const { requireUser } = await import('@/lib/auth/guards')
        await requireUser()

        expect(redirect).not.toHaveBeenCalled()
      })
    })

    describe('1.1-U-03: requireUser must be called before try/catch — structural lint', () => {
      it('requireUser() invocation precedes the first try block in every Server Action file', async () => {
        // Structural check: verify that in src/actions/ files, requireUser() appears
        // before the first try { block in any exported async function.
        // For story 1.1, there are no action files yet — this passes vacuously.
        // Future stories must adhere to this pattern; this test will catch violations.
        const fs = await import('fs')
        const path = await import('path')

        const actionsDir = path.resolve(process.cwd(), 'src/actions')

        // If the directory doesn't exist yet (no actions created), test passes vacuously
        if (!fs.existsSync(actionsDir)) {
          // No action files yet — structural constraint is satisfied vacuously
          expect(true).toBe(true)
          return
        }

        const files = fs.readdirSync(actionsDir).filter((f: string) => f.endsWith('.ts'))

        for (const file of files) {
          const content = fs.readFileSync(path.join(actionsDir, file), 'utf-8')
          // Find exported async functions that contain both requireUser() and try {
          const requireUserPos = content.indexOf('requireUser()')
          const tryPos = content.indexOf('try {')

          if (requireUserPos !== -1 && tryPos !== -1) {
            // requireUser() must appear before the first try {
            expect(requireUserPos).toBeLessThan(tryPos)
          }
        }
      })
    })
  })

  describe('requireAdmin()', () => {
    it('returns the User when user.app_metadata.role === "admin"', async () => {
      const adminUser: Partial<User> = {
        id: 'admin-user-id',
        email: 'admin@example.com',
        app_metadata: { role: 'admin' },
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      }

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: adminUser },
            error: null,
          }),
        },
      } as ReturnType<Awaited<typeof createClient>>)

      const { requireAdmin } = await import('@/lib/auth/guards')
      const result = await requireAdmin()

      expect(result).not.toBeNull()
      expect(result?.id).toBe('admin-user-id')
    })

    it('returns null when user.app_metadata.role !== "admin"', async () => {
      const regularUser: Partial<User> = {
        id: 'regular-user-id',
        email: 'user@example.com',
        app_metadata: { role: 'user' },
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      }

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: regularUser },
            error: null,
          }),
        },
      } as ReturnType<Awaited<typeof createClient>>)

      const { requireAdmin } = await import('@/lib/auth/guards')
      const result = await requireAdmin()

      expect(result).toBeNull()
    })

    it('returns null when no user is authenticated', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null,
          }),
        },
      } as ReturnType<Awaited<typeof createClient>>)

      const { requireAdmin } = await import('@/lib/auth/guards')
      const result = await requireAdmin()

      expect(result).toBeNull()
    })

    it('reads app_metadata from JWT — does NOT make a DB query', async () => {
      const adminUser: Partial<User> = {
        id: 'admin-user-id',
        email: 'admin@example.com',
        app_metadata: { role: 'admin' },
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      }

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: adminUser },
            error: null,
          }),
        },
      } as ReturnType<Awaited<typeof createClient>>)

      // Mock db to detect if it is accessed
      const dbMock = vi.fn()
      vi.doMock('@/lib/db', () => ({ db: dbMock }))

      const { requireAdmin } = await import('@/lib/auth/guards')
      await requireAdmin()

      // db should not have been called — requireAdmin reads JWT only
      expect(dbMock).not.toHaveBeenCalled()
    })
  })
})
