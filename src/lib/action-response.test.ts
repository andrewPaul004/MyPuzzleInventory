/**
 * Test Plan: 1.1-U-04, 1.1-U-05
 * AC: #5 — ok(data) and err(message) return ActionResult<T>
 *
 * All Server Actions in the project return ActionResult<T> and never throw
 * for expected conditions.
 */

import { describe, it, expect } from 'vitest'

import { ok, err } from '@/lib/action-response'

describe('src/lib/action-response.ts', () => {
  describe('1.1-U-04: ok(data) returns ActionResult success shape', () => {
    it('returns { success: true, data } for a plain object', () => {
      const result = ok({ id: '1' })
      expect(result).toEqual({ success: true, data: { id: '1' } })
    })

    it('returns { success: true, data } for a primitive value', () => {
      const result = ok(42)
      expect(result).toEqual({ success: true, data: 42 })
    })

    it('returns { success: true, data: undefined } when called with no data', () => {
      const result = ok(undefined)
      expect(result).toEqual({ success: true, data: undefined })
    })

    it('result.success is true — discriminant works for type narrowing', () => {
      const result = ok({ id: '1' })
      expect(result.success).toBe(true)
      if (result.success) {
        // TypeScript narrows to ActionSuccess<T> here
        expect(result.data).toEqual({ id: '1' })
      }
    })
  })

  describe('1.1-U-05: err(message, code) returns ActionResult error shape', () => {
    it('returns { success: false, error, code } when both args provided', () => {
      const result = err('Not found', 'NOT_FOUND')
      expect(result).toEqual({ success: false, error: 'Not found', code: 'NOT_FOUND' })
    })

    it('returns { success: false, error } with code undefined when code omitted', () => {
      const result = err('Something went wrong')
      expect(result).toEqual({ success: false, error: 'Something went wrong', code: undefined })
    })

    it('result.success is false — discriminant works for type narrowing', () => {
      const result = err('Unauthorized', 'UNAUTHENTICATED')
      expect(result.success).toBe(false)
      if (!result.success) {
        // TypeScript narrows to ActionError here
        expect(result.error).toBe('Unauthorized')
        expect(result.code).toBe('UNAUTHENTICATED')
      }
    })

    it('error string is preserved exactly as passed', () => {
      const message = 'Something went wrong: unexpected error @ line 42!'
      const result = err(message, 'INTERNAL')
      expect(result.error).toBe(message)
    })
  })
})
