/**
 * Test Plan: 1.1-U-07
 * AC: #12 — DATABASE_URL_TEST unset causes hard test failure before any query
 *
 * The test infrastructure must NEVER silently fall back to DATABASE_URL (the production DB).
 * If DATABASE_URL_TEST is unset, src/tests/setup.ts throws immediately at module evaluation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('src/tests/setup.ts — test DB safety guard', () => {
  describe('1.1-U-07: DATABASE_URL_TEST unset causes hard test failure', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    it('throws a clear error when DATABASE_URL_TEST is not set', async () => {
      vi.stubEnv('DATABASE_URL_TEST', '')
      vi.resetModules()

      await expect(() => import('@/tests/setup')).rejects.toThrow()
      vi.unstubAllEnvs()
    })

    it('error message explicitly mentions DATABASE_URL_TEST', async () => {
      vi.stubEnv('DATABASE_URL_TEST', '')
      vi.resetModules()

      await expect(() => import('@/tests/setup')).rejects.toThrow('DATABASE_URL_TEST')
      vi.unstubAllEnvs()
    })

    it('error message warns against falling back to DATABASE_URL', async () => {
      vi.stubEnv('DATABASE_URL_TEST', '')
      vi.resetModules()

      await expect(() => import('@/tests/setup')).rejects.toThrow('DATABASE_URL')
      vi.unstubAllEnvs()
    })

    it('does NOT throw when DATABASE_URL_TEST is set to a valid connection string', async () => {
      vi.stubEnv('DATABASE_URL_TEST', 'postgresql://localhost:5432/test_db')
      vi.resetModules()

      // Should not throw — only the guard is tested here, not an actual DB connection
      await expect(import('@/tests/setup')).resolves.toBeDefined()
      vi.unstubAllEnvs()
    })

    it('never silently uses DATABASE_URL as fallback', async () => {
      // DATABASE_URL is set to a real-looking URL but DATABASE_URL_TEST is unset
      vi.stubEnv('DATABASE_URL', 'postgresql://localhost:5432/production_db')
      vi.stubEnv('DATABASE_URL_TEST', '')
      vi.resetModules()

      // setup.ts must still throw — it does not fall back to DATABASE_URL
      await expect(() => import('@/tests/setup')).rejects.toThrow('DATABASE_URL_TEST')
      vi.unstubAllEnvs()
    })
  })
})
