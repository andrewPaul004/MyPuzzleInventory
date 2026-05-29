/**
 * Test Plan: 1.1-I-02, 1.1-I-03
 * AC: #7 — on_auth_user_created trigger inserts profiles row atomically
 * AC: #8 — pg_trgm and tsvector extensions present after migrations
 *
 * REQUIRES: DATABASE_URL_TEST must be set. These tests hit a real test DB.
 * They rely on migrations/0001_initial.sql and migrations/0002_profiles_trigger.sql
 * having been applied to the test database.
 *
 * DO NOT mock Drizzle or Postgres in these tests — use the real test DB.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('Database migration integration tests', () => {
  // TODO: Import db from '@/lib/db' and configure it to use DATABASE_URL_TEST.
  // Use beforeAll to establish the connection and afterAll to close it.

  describe('1.1-I-02: on_auth_user_created trigger inserts profiles row', () => {
    it('inserts a profiles row with the correct id when a new auth.users row is created', async () => {
      // TODO: Insert a test user directly into auth.users using the admin client
      // (SUPABASE_SERVICE_ROLE_KEY via src/lib/db/admin/ — NOT via src/actions/).
      // Then query the profiles table and assert a row exists with the same id.
      //
      // IMPORTANT: Clean up (DELETE the test user) in afterEach or try/finally.
      //
      // Example assertion:
      //   const profile = await db.select().from(profiles).where(eq(profiles.id, testUserId)).limit(1)
      //   expect(profile).toHaveLength(1)
      //   expect(profile[0].id).toBe(testUserId)
      expect.fail('TODO: implement 1.1-I-02 — trigger creates profiles row')
    })

    it('the profiles row is inserted atomically in the same transaction', async () => {
      // TODO: After inserting to auth.users, query profiles within the same
      // transaction context and assert the row is immediately visible.
      // This verifies the trigger fires synchronously (AFTER INSERT).
      expect.fail('TODO: implement 1.1-I-02 — trigger is atomic (same transaction)')
    })

    it('does not create duplicate profiles row on re-auth (ON CONFLICT DO NOTHING)', async () => {
      // TODO: Insert a user to auth.users (which triggers profiles insert).
      // Manually trigger a second insert attempt with the same id.
      // Assert still only one profiles row exists.
      expect.fail('TODO: implement 1.1-I-02 — ON CONFLICT DO NOTHING')
    })
  })

  describe('1.1-I-03: pg_trgm and tsvector extensions present after migrations', () => {
    it('pg_trgm extension is present in the test database', async () => {
      // TODO: Query pg_extension:
      //   SELECT extname FROM pg_extension WHERE extname = 'pg_trgm'
      // Assert the result is non-empty.
      expect.fail('TODO: implement 1.1-I-03 — pg_trgm extension present')
    })

    it('unaccent extension is present in the test database', async () => {
      // TODO: Query pg_extension:
      //   SELECT extname FROM pg_extension WHERE extname = 'unaccent'
      // Assert the result is non-empty.
      // Note: tsvector is a built-in PostgreSQL type, not an extension.
      // The story uses unaccent alongside pg_trgm for full-text search.
      expect.fail('TODO: implement 1.1-I-03 — unaccent extension present')
    })
  })
})
