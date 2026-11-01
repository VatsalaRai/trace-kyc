import { describe, it, expect } from 'vitest'
import { next, can, validPan } from './machine'
describe('status machine', () => {
  it('follows the happy path', () => {
    let s = next('not_started', 'SAVE'); s = next(s, 'SUBMIT'); s = next(s, 'REVIEW'); s = next(s, 'VERIFY')
    expect(s).toBe('verified')
  })
  it('blocks impossible transitions', () => {
    expect(next('draft', 'VERIFY')).toBe('draft')
    expect(can('verified', 'REJECT')).toBe(false)
  })
  it('allows recovery from rejection and info request', () => {
    expect(next('rejected', 'RESUBMIT')).toBe('resubmitted')
    expect(next('action_required', 'RESUBMIT')).toBe('resubmitted')
  })
  it('validates PAN format only', () => { expect(validPan('ABCDE1234F')).toBe(true); expect(validPan('abc')).toBe(false) })
})
