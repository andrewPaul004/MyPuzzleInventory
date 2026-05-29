/**
 * Test Plan: 1.1-U-06
 * AC: #6 — withActive(table) returns a Drizzle `where` condition filtering deleted_at IS NULL
 *
 * All SELECTs, JOINs, and aggregates on soft-deletable tables must use withActive().
 * No global filter exists — every query author is responsible.
 */

import { describe, it, expect } from 'vitest'
import { withActive } from '@/lib/db/filters'

describe('src/lib/db/filters.ts', () => {
  describe('1.1-U-06: withActive(table) returns deleted_at IS NULL condition', () => {
    it('returns a Drizzle SQL expression for deleted_at IS NULL', () => {
      // TODO: Create a mock table object with a deletedAt column compatible with Drizzle's isNull().
      // Call withActive(mockTable) and assert the result is a Drizzle SQL expression
      // that evaluates to `deleted_at IS NULL`.
      //
      // Hint: Drizzle's isNull() returns a SQL object. You can check its type or
      // serialize it via sql`...`.toSQL() and assert the SQL string contains "IS NULL".
      //
      // Example mock:
      //   import { pgTable, timestamp } from 'drizzle-orm/pg-core'
      //   const mockTable = pgTable('mock', { deletedAt: timestamp('deleted_at') })
      //   const condition = withActive(mockTable)
      //   expect(condition).toBeDefined()
      //   // Assert it serializes to something containing "IS NULL"
      expect.fail('TODO: implement 1.1-U-06 — withActive returns IS NULL expression')
    })

    it('works with the profiles table schema', () => {
      // TODO: Import the real profiles table from src/lib/db/schema/profiles.ts
      // and call withActive(profiles). Assert the result is a valid Drizzle expression.
      expect.fail('TODO: implement 1.1-U-06 — withActive with real profiles table')
    })

    it('the returned condition is falsy for rows where deleted_at IS NOT NULL', () => {
      // TODO: If possible with Drizzle test utilities, evaluate the expression
      // against a mock row with deleted_at set vs. null and confirm filtering behavior.
      // This may require a real DB or Drizzle's SQL evaluation helpers.
      expect.fail('TODO: implement 1.1-U-06 — condition evaluation on non-null deleted_at')
    })
  })
})
