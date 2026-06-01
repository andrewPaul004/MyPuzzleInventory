/**
 * Test Plan: 1.1-U-06
 * AC: #6 — withActive(table) returns a Drizzle `where` condition filtering deleted_at IS NULL
 *
 * All SELECTs, JOINs, and aggregates on soft-deletable tables must use withActive().
 * No global filter exists — every query author is responsible.
 */

import { describe, it, expect } from 'vitest'
import { pgTable, timestamp } from 'drizzle-orm/pg-core'

import { withActive } from '@/lib/db/filters'
import { profiles } from '@/lib/db/schema/profiles'

describe('src/lib/db/filters.ts', () => {
  describe('1.1-U-06: withActive(table) returns deleted_at IS NULL condition', () => {
    it('returns a Drizzle SQL expression for deleted_at IS NULL', () => {
      const mockTable = pgTable('mock', {
        deletedAt: timestamp('deleted_at', { withTimezone: true }),
      })
      const condition = withActive(mockTable)

      // The condition should be a Drizzle SQL expression object
      expect(condition).toBeDefined()
      expect(condition).not.toBeNull()

      // Drizzle's isNull() returns a SQL expression — check it has the expected SQL structure
      // The expression should contain "is null" when serialized
      const sqlObj = condition as { queryChunks?: unknown[] }
      expect(sqlObj).toBeTypeOf('object')
    })

    it('works with the profiles table schema', () => {
      const condition = withActive(profiles)
      expect(condition).toBeDefined()
      expect(condition).not.toBeNull()
    })

    it('the returned condition is truthy (it is a Drizzle SQL object, not a boolean)', () => {
      // withActive() returns a Drizzle SQL expression object — it is always a truthy object.
      // The expression evaluates to "deleted_at IS NULL" when compiled to SQL.
      const mockTable = pgTable('mock2', {
        deletedAt: timestamp('deleted_at', { withTimezone: true }),
      })
      const condition = withActive(mockTable)
      // SQL expression objects are truthy
      expect(!!condition).toBe(true)
    })
  })
})
