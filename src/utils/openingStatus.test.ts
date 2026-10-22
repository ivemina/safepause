import { describe, expect, it } from 'vitest'
import { getOpenStatus } from './openingStatus'

// Thursday 22 Oct 2026, 12:00 local time
const thursdayNoon = new Date(2026, 9, 22, 12, 0)

describe('getOpenStatus', () => {
  it('is unknown when hours are null', () => {
    expect(getOpenStatus(null, thursdayNoon)).toBe('unknown')
  })
  it('is unknown for text we cannot read', () => {
    expect(getOpenStatus('Open most days', thursdayNoon)).toBe('unknown')
  })
  it('is open inside the hours', () => {
    expect(getOpenStatus('Mon-Sat 09:00-17:00', thursdayNoon)).toBe('open')
  })
  it('is closed outside the hours', () => {
    expect(getOpenStatus('Mon-Sat 13:00-17:00', thursdayNoon)).toBe('closed')
  })
  it('is closed on a day not listed', () => {
    expect(getOpenStatus('Mon-Wed 09:00-17:00', thursdayNoon)).toBe('closed')
  })
})