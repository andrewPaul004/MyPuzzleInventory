/**
 * Test Plan: 1.1-U-01
 * AC: #2 — env.ts throws on missing required var
 *
 * These tests verify that `src/lib/env.ts` hard-fails at module load time
 * when any required environment variable is absent.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('src/lib/env.ts — Zod-validated environment variables', () => {
  describe('1.1-U-01: env.ts throws on missing required var', () => {
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'DATABASE_URL',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_PREMIUM_PRICE_ID',
      'NEXT_PUBLIC_APP_URL',
    ]

    beforeEach(() => {
      // Clear module registry so env.ts re-evaluates on each import
      vi.resetModules()
    })

    it('throws at module load when a required env var is absent', async () => {
      // TODO: Save all required env vars, unset one, re-import env.ts, assert throw.
      // Implementation note: use vi.stubEnv() to remove a required var, then
      // dynamically import '@/lib/env' and expect it to throw (ZodError or similar).
      // Example:
      //   vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', undefined)
      //   await expect(() => import('@/lib/env')).rejects.toThrow()
      expect.fail('TODO: implement 1.1-U-01')
    })

    it.each(requiredVars)(
      'throws when %s is missing',
      async (varName) => {
        // TODO: For each required var, unset it and confirm env.ts throws.
        // vi.stubEnv(varName, undefined)
        // vi.resetModules()
        // await expect(() => import('@/lib/env')).rejects.toThrow()
        expect.fail(`TODO: implement 1.1-U-01 for ${varName}`)
      }
    )

    it('succeeds when all required env vars are present', async () => {
      // TODO: Stub all required vars with valid dummy values and assert the
      // module loads without throwing.
      expect.fail('TODO: implement happy-path for 1.1-U-01')
    })

    it('DATABASE_URL_TEST is optional — absence does not throw in env.ts', async () => {
      // TODO: Ensure DATABASE_URL_TEST absence does not cause env.ts to throw.
      // The hard-fail for DATABASE_URL_TEST lives in src/tests/setup.ts, not env.ts.
      expect.fail('TODO: implement 1.1-U-01 optional-var check')
    })
  })
})
