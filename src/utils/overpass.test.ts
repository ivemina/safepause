import { describe, expect, it } from 'vitest'
import { elementToPlace } from './overpass'

describe('elementToPlace', () => {
  it('keeps missing tags as unknown', () => {
    const place = elementToPlace({
      type: 'node',
      id: 1,
      lat: 53.4,
      lon: -2.9,
      tags: { name: 'Test Park', leisure: 'park' },
    })
    expect(place?.seating).toBe('unknown')
    expect(place?.stepFreeAccess).toBe('unknown')
    expect(place?.lastVerifiedAt).toBeNull()
    expect(place?.isDemo).toBe(false)
  })

  it('does not treat wheelchair=limited as step-free', () => {
    const place = elementToPlace({
      type: 'node',
      id: 2,
      lat: 53.4,
      lon: -2.9,
      tags: { name: 'Test Library', amenity: 'library', wheelchair: 'limited' },
    })
    expect(place?.stepFreeAccess).toBe('unknown')
  })

  it('maps wheelchair=yes to confirmed', () => {
    const place = elementToPlace({
      type: 'node',
      id: 3,
      lat: 53.4,
      lon: -2.9,
      tags: { name: 'Test Library', amenity: 'library', wheelchair: 'yes' },
    })
    expect(place?.stepFreeAccess).toBe('yes')
  })

  it('skips unnamed features', () => {
    expect(
      elementToPlace({ type: 'node', id: 4, lat: 1, lon: 1, tags: { leisure: 'park' } }),
    ).toBeNull()
  })
})