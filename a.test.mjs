import { expect, test } from 'vitest'
import { outer } from './lib.mjs'

// Loads lib.mjs through the Vitest module runner.
test('exercises lib.mjs through the Vitest module runner', () => {
  expect(outer(2)).toBe(5)
  expect(outer(3)).toBe(7)
  expect(outer(4)).toBe(9)
  expect(outer(5)).toBe(11)
  expect(outer(6)).toBe(13)
  expect(outer(7)).toBe(15)
})
