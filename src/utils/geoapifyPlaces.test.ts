import { describe, expect, it } from 'vitest'
import { featureToPlace } from './geoapifyPlaces'

const base = { name: 'Test Park', lat: 53.4, lon: -2.9, place_id: 'abc' }

describe('featureToPlace', () => {
  it('keeps unstated details as unknown and never marks them verified', () => {
    const place = featureToPlace({
      properties: { ...base, categories: ['leisure.park'] },
    })
    expect(place?.stepFreeAccess).toBe('unknown')
    expect(place?.seating).toBe('unknown')
    expect(place?.lastVerifiedAt).toBeNull()
    expect(place?.isDemo).toBe(false)
  })

  it('confirms step-free only for wheelchair.yes', () => {
    const place = featureToPlace({
      properties: {
        ...base,
        categories: ['education.library', 'wheelchair.yes'],
      },
    })
    expect(place?.stepFreeAccess).toBe('yes')
  })

  it('skips features without a name or place id', () => {
    expect(featureToPlace({ properties: { lat: 1, lon: 1 } })).toBeNull()
  })
})