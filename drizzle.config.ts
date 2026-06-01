import { defineConfig } from 'drizzle-kit'
import { env } from './src/lib/env' // relative import — drizzle-kit runs outside Next.js

export default defineConfig({
  schema: './src/lib/db/schema/index.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
