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
      // TODO: Unset DATABASE_URL_TEST, then dynamically import src/tests/setup.ts.
      // Assert it throws before any query can execute.
      //
      // Example:
      //   vi.stubEnv('DATABASE_URL_TEST', undefined)
      //   await expect(() => import('@/tests/setup')).rejects.toThrow(
      //     /DATABASE_URL_TEST is not set/
      //   )
      expect.fail('TODO: implement 1.1-U-07 — missing DATABASE_URL_TEST throws')
    })

    it('error message explicitly mentions DATABASE_URL_TEST', async () => {
      // TODO: Assert the thrown error message includes the string "DATABASE_URL_TEST"
      // so developers immediately know what to set.
      expect.fail('TODO: implement 1.1-U-07 — error message mentions var name')
    })

    it('error message warns against falling back to DATABASE_URL', async () => {
      // TODO: Assert the thrown error message includes guidance such as
      // "NEVER fall back to DATABASE_URL" or similar language.
      expect.fail('TODO: implement 1.1-U-07 — error message anti-fallback warning')
    })

    it('does NOT throw when DATABASE_URL_TEST is set to a valid connection string', async () => {
      // TODO: Set DATABASE_URL_TEST to a valid (or dummy) URL and confirm setup.ts
      // does not throw at module load time.
      //
      // Note: This test does NOT require an actual DB connection — only that the
      // module-level guard passes.
      expect.fail('TODO: implement 1.1-U-07 — happy path when var is set')
    })

    it('never silently uses DATABASE_URL as fallback', async () => {
      // TODO: Set DATABASE_URL to a real-looking URL but leave DATABASE_URL_TEST unset.
      // Assert that setup.ts still throws — it does not read DATABASE_URL as a fallback.
      expect.fail('TODO: implement 1.1-U-07 — no silent fallback to DATABASE_URL')
    })
  })
})
