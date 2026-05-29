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

describe('Sentry error capture integration — 1.1-I-05', () => {
  describe('1.1-I-05: Sentry captures uncaught server error', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('Sentry.captureException is called when an unhandled server error occurs', async () => {
      // TODO: Spy on Sentry.captureException (or use Sentry test DSN with local mock).
      // Trigger a deliberate unhandled error via the onRequestError hook from instrumentation.ts.
      // Assert captureException was called with the error.
      //
      // Approach 1 (spy):
      //   import * as Sentry from '@sentry/nextjs'
      //   const spy = vi.spyOn(Sentry, 'captureException')
      //   // Trigger error via instrumentation onRequestError
      //   expect(spy).toHaveBeenCalledWith(expect.any(Error))
      //
      // Approach 2 (Sentry test DSN):
      //   Configure Sentry with a test DSN that captures locally;
      //   trigger an error; assert the envelope was queued.
      expect.fail('TODO: implement 1.1-I-05 — captureException called on server error')
    })

    it('instrumentation.ts exports onRequestError using Sentry.captureRequestError', async () => {
      // TODO: Import onRequestError from instrumentation.ts and assert it is
      // Sentry.captureRequestError (or wraps it). This verifies the App Router
      // hook is wired correctly (not the legacy _error.tsx approach).
      expect.fail('TODO: implement 1.1-I-05 — onRequestError hook wired correctly')
    })

    it('next.config.ts is wrapped with withSentryConfig', async () => {
      // TODO: Import (or dynamically read) next.config.ts and assert that
      // it uses withSentryConfig as a wrapper. This can be a file content
      // check or a build-time assertion.
      expect.fail('TODO: implement 1.1-I-05 — withSentryConfig wraps next.config.ts')
    })

    it('Sentry config files use process.env.SENTRY_DSN directly (exception to env.ts rule)', async () => {
      // TODO: Read sentry.client.config.ts, sentry.server.config.ts, and sentry.edge.config.ts.
      // Assert they reference process.env.SENTRY_DSN and do NOT import from @/lib/env.
      // This exception is documented: Sentry configs run before Next.js initialises env.ts.
      expect.fail('TODO: implement 1.1-I-05 — Sentry configs use process.env.SENTRY_DSN')
    })
  })
})
