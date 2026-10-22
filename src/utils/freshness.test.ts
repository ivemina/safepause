import { describe, expect, it } from 'vitest'
import { getFreshness } from './freshness'

const now = new Date('2026-10-22T12:00:00Z')

describe('getFreshness', () => {
  it('returns "never" when there is no date', () => {
    expect(getFreshness(null, now)).toBe('never')
  })

  it('returns "never" for an invalid date', () => {
    expect(getFreshness('not-a-date', now)).toBe('never')
  })

  it('returns "recent" for a check 10 days ago', () => {
    expect(getFreshness('2026-10-12T12:00:00Z', now)).toBe('recent')
  })

  it('returns "stale" for a check 200 days ago', () => {
    expect(getFreshness('2026-04-05T12:00:00Z', now)).toBe('stale')
  })
})