import { describe, expect, it } from 'vitest'
import { demoPlaces } from '../data/demoPlaces'
import { filterPlaces, searchPlaces } from './filterPlaces'
import type { Filters } from './filterPlaces'

const noFilters: Filters = {
  query: '',
  category: 'all',
  seatingConfirmed: false,
  stepFreeConfirmed: false,
  openNow: false,
}

describe('searchPlaces', () => {
  it('returns everything for an empty search', () => {
    expect(searchPlaces(demoPlaces, '   ')).toHaveLength(6)
  })

  it('ignores capital letters', () => {
    expect(searchPlaces(demoPlaces, 'LIBRARY')).toHaveLength(2)
  })

  it('returns nothing when no place matches', () => {
    expect(searchPlaces(demoPlaces, 'zzz')).toHaveLength(0)
  })
})

describe('filterPlaces', () => {
  it('keeps all places when no filters are active', () => {
    expect(filterPlaces(demoPlaces, noFilters)).toHaveLength(6)
  })

  it('seating filter keeps only confirmed seating', () => {
    const result = filterPlaces(demoPlaces, { ...noFilters, seatingConfirmed: true })
    expect(result.every((p) => p.seating === 'yes')).toBe(true)
    expect(result).toHaveLength(4)
  })

  it('unknown step-free access never passes the step-free filter', () => {
    const result = filterPlaces(demoPlaces, { ...noFilters, stepFreeConfirmed: true })
    expect(result.some((p) => p.stepFreeAccess === 'unknown')).toBe(false)
    expect(result).toHaveLength(3)
  })

  it('combines filters so a place must pass all of them', () => {
    const result = filterPlaces(demoPlaces, {
      ...noFilters,
      seatingConfirmed: true,
      stepFreeConfirmed: true,
    })
    expect(result).toHaveLength(2)
  })

  it('filters by category', () => {
    const result = filterPlaces(demoPlaces, { ...noFilters, category: 'library' })
    expect(result).toHaveLength(2)
  })
})