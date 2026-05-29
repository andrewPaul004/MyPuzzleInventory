import * as Sentry from '@sentry/nextjs'

// NOT _error.tsx — that does nothing in App Router.
// This uses the instrumentation.ts pattern supported by Next.js 15.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

export const onRequestError = Sentry.captureRequestError
