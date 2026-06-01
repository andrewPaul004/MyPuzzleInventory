// EXCEPTION to env.ts rule: Sentry config files run at module bootstrap time,
// before Next.js initialises src/lib/env.ts. Direct process.env access is acceptable here only.
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
})
