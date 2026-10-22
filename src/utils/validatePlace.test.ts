import { describe, expect, it } from 'vitest'
import { demoPlaces } from '../data/demoPlaces'
import { keepValidPlaces, validatePlace } from './validatePlace'

const good = demoPlaces[0]

describe('validatePlace', () => {
  it('accepts a good record', () => {
    expect(validatePlace(good)).toEqual([])
  })

  it('rejects a missing id', () => {
    expect(validatePlace({ ...good, id: '' })).toContain('Missing id')
  })

  it('rejects an impossible latitude', () => {
    expect(validatePlace({ ...good, latitude: 500 })).toHaveLength(1)
  })

  it('rejects a coordinate that is not a number', () => {
    expect(validatePlace({ ...good, longitude: NaN })).toHaveLength(1)
  })

  it('rejects an invalid date but allows null', () => {
    expect(validatePlace({ ...good, lastVerifiedAt: 'yesterday' })).toHaveLength(1)
    expect(validatePlace({ ...good, lastVerifiedAt: null })).toEqual([])
  })
})

describe('keepValidPlaces', () => {
  it('drops invalid records and keeps valid ones', () => {
    const result = keepValidPlaces([good, { ...good, id: '' }])
    expect(result).toHaveLength(1)
  })
})