import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  // Next.js configuration
}

export default withSentryConfig(nextConfig, {
  // Sentry webpack plugin options
  silent: true,
  org: process.env.SENTRY_ORG ?? 'my-puzzle-inventory',
  project: process.env.SENTRY_PROJECT ?? 'my-puzzle-inventory',
  // Disable Sentry build-time uploads if token not set
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Disable source map uploads in local dev
  disableLogger: true,
})
