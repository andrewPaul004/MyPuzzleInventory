/**
 * Test Plan: 1.1-U-01
 * AC: #2 — env.ts throws on missing required var
 *
 * These tests verify that `src/lib/env.ts` hard-fails at module load time
 * when any required environment variable is absent.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

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

    // Valid dummy values for all required vars
    const validEnv: Record<string, string> = {
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
      DATABASE_URL: 'postgresql://localhost:5432/test',
      STRIPE_SECRET_KEY: 'sk_test_dummy',
      STRIPE_WEBHOOK_SECRET: 'whsec_test_dummy',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_dummy',
      STRIPE_PREMIUM_PRICE_ID: 'price_test_dummy',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    }

    beforeEach(() => {
      vi.resetModules()
    })

    it('throws at module load when a required env var is absent', async () => {
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
      await expect(() => import('@/lib/env')).rejects.toThrow()
      vi.unstubAllEnvs()
    })

    it.each(requiredVars)(
      'throws when %s is missing',
      async (varName) => {
        // Set all required vars to valid values
        Object.entries(validEnv).forEach(([key, value]) => {
          vi.stubEnv(key, value)
        })
        // Then remove the specific required var
        vi.stubEnv(varName, '')

        vi.resetModules()
        await expect(() => import('@/lib/env')).rejects.toThrow()
        vi.unstubAllEnvs()
      }
    )

    it('succeeds when all required env vars are present', async () => {
      Object.entries(validEnv).forEach(([key, value]) => {
        vi.stubEnv(key, value)
      })

      vi.resetModules()
      const { env } = await import('@/lib/env')
      expect(env).toBeDefined()
      expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe('https://test.supabase.co')
      vi.unstubAllEnvs()
    })

    it('DATABASE_URL_TEST is optional — absence does not throw in env.ts', async () => {
      // Set all required vars
      Object.entries(validEnv).forEach(([key, value]) => {
        vi.stubEnv(key, value)
      })
      // Explicitly unset DATABASE_URL_TEST
      vi.stubEnv('DATABASE_URL_TEST', '')

      vi.resetModules()
      // env.ts should NOT throw — DATABASE_URL_TEST is optional in env.ts
      // (The hard-fail for DATABASE_URL_TEST lives in src/tests/setup.ts)
      const { env } = await import('@/lib/env')
      expect(env).toBeDefined()
      vi.unstubAllEnvs()
    })
  })
})
