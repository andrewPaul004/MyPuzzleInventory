import { z } from 'zod'

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  // NOTE: SUPABASE_SERVICE_ROLE_KEY is intentionally absent here.
  // It must only be accessed in src/lib/db/admin/ — never in the general env object.
  DATABASE_URL: z.string().url(),

  // Stripe (required at startup — set dummy values for local dev if not configuring Stripe yet)
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  STRIPE_PREMIUM_PRICE_ID: z.string().min(1),

  // Sentry (optional)
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Testing (optional in env.ts — test runner checks this separately in setup.ts)
  DATABASE_URL_TEST: z.string().optional(),
})

export const env = envSchema.parse(process.env)
