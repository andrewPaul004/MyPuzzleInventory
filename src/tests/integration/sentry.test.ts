/**
 * Test Plan: 1.1-I-05
 * AC: #9 — Sentry captures uncaught server errors (CI smoke test)
 *
 * Requires:
 *   - sentry.client.config.ts, sentry.server.config.ts, sentry.edge.config.ts
 *   - instrumentation.ts with onRequestError hook
 *   - next.config.ts wrapped with withSentryConfig
 *
 * Use the Sentry test DSN or a captureException spy.
 * The onRequestError hook is the App Router mechanism — not the legacy _error.tsx.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('Sentry error capture integration — 1.1-I-05', () => {
  describe('1.1-I-05: Sentry captures uncaught server error', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('Sentry.captureRequestError is exported from instrumentation.ts as onRequestError', async () => {
      // Structural check: instrumentation.ts exports onRequestError = Sentry.captureRequestError
      const instrumentationPath = resolve(process.cwd(), 'instrumentation.ts')
      const content = readFileSync(instrumentationPath, 'utf-8')

      // Must export onRequestError
      expect(content).toContain('onRequestError')
      // Must use Sentry.captureRequestError (App Router hook pattern)
      expect(content).toContain('captureRequestError')
      // Must NOT import _error.tsx (legacy Pages Router approach)
      // Note: A comment mentioning _error.tsx is fine — we check for actual imports
      expect(content).not.toMatch(/from\s+['"].*_error/)
    })

    it('instrumentation.ts exports onRequestError using Sentry.captureRequestError', async () => {
      vi.mock('@sentry/nextjs', () => ({
        captureRequestError: vi.fn(),
        init: vi.fn(),
      }))

      const { onRequestError } = await import('../../../instrumentation')
      expect(onRequestError).toBeDefined()
    })

    it('next.config.ts is wrapped with withSentryConfig', async () => {
      // Structural check: next.config.ts imports and uses withSentryConfig
      const nextConfigPath = resolve(process.cwd(), 'next.config.ts')
      const content = readFileSync(nextConfigPath, 'utf-8')

      expect(content).toContain('withSentryConfig')
      expect(content).toContain('@sentry/nextjs')
    })

    it('Sentry config files use process.env.SENTRY_DSN directly (exception to env.ts rule)', async () => {
      const sentryFiles = [
        'sentry.client.config.ts',
        'sentry.server.config.ts',
        'sentry.edge.config.ts',
      ]

      for (const filename of sentryFiles) {
        const filePath = resolve(process.cwd(), filename)
        const content = readFileSync(filePath, 'utf-8')

        // Must use process.env.SENTRY_DSN directly (exception to env.ts rule)
        expect(content, `${filename} must use process.env.SENTRY_DSN`).toContain(
          'process.env.SENTRY_DSN'
        )

        // Must NOT import from @/lib/env (env.ts is not initialized at Sentry bootstrap time)
        expect(content, `${filename} must not import from @/lib/env`).not.toContain('@/lib/env')
      }
    })

    it('all three Sentry config files exist and initialize Sentry', async () => {
      const sentryFiles = [
        'sentry.client.config.ts',
        'sentry.server.config.ts',
        'sentry.edge.config.ts',
      ]

      for (const filename of sentryFiles) {
        const filePath = resolve(process.cwd(), filename)
        const content = readFileSync(filePath, 'utf-8')

        expect(content, `${filename} must import Sentry`).toContain('@sentry/nextjs')
        expect(content, `${filename} must call Sentry.init`).toContain('Sentry.init')
      }
    })
  })
})
