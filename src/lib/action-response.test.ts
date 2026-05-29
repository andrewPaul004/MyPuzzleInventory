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
      // TODO: Call ok({ id: '1' }) and assert the returned shape.
      // Expected: { success: true, data: { id: '1' } }
      expect.fail('TODO: implement 1.1-U-04 — ok with object')
    })

    it('returns { success: true, data } for a primitive value', () => {
      // TODO: Call ok(42) and assert { success: true, data: 42 }
      expect.fail('TODO: implement 1.1-U-04 — ok with primitive')
    })

    it('returns { success: true, data: undefined } when called with no data', () => {
      // TODO: Call ok(undefined) and assert shape.
      expect.fail('TODO: implement 1.1-U-04 — ok with undefined')
    })

    it('result.success is true — discriminant works for type narrowing', () => {
      // TODO: Assert that (result.success === true) narrows type to ActionSuccess<T>
      // This is both a runtime and TypeScript compile-time assertion.
      expect.fail('TODO: implement 1.1-U-04 — discriminant check')
    })
  })

  describe('1.1-U-05: err(message, code) returns ActionResult error shape', () => {
    it('returns { success: false, error, code } when both args provided', () => {
      // TODO: Call err('Not found', 'NOT_FOUND') and assert:
      // { success: false, error: 'Not found', code: 'NOT_FOUND' }
      expect.fail('TODO: implement 1.1-U-05 — err with code')
    })

    it('returns { success: false, error } with code undefined when code omitted', () => {
      // TODO: Call err('Something went wrong') and assert:
      // { success: false, error: 'Something went wrong', code: undefined }
      expect.fail('TODO: implement 1.1-U-05 — err without code')
    })

    it('result.success is false — discriminant works for type narrowing', () => {
      // TODO: Assert that (result.success === false) narrows type to ActionError.
      expect.fail('TODO: implement 1.1-U-05 — discriminant check')
    })

    it('error string is preserved exactly as passed', () => {
      // TODO: Pass a multi-word error message with special characters and assert
      // the exact string is returned in result.error.
      expect.fail('TODO: implement 1.1-U-05 — error string fidelity')
    })
  })
})
