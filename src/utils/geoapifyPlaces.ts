import type { Confirmation, Place, PlaceCategory } from '../types/place'
import type { Bounds } from './overpass'

type GeoapifyFeature = {
  properties?: {
    name?: string
    lat?: number
    lon?: number
    place_id?: string
    categories?: string[]
  }
}

export function featureToPlace(feature: GeoapifyFeature): Place | null {
  const p = feature.properties
  if (!p || !p.name || !p.place_id) return null
  if (typeof p.lat !== 'number' || typeof p.lon !== 'number') return null

  const categories = p.categories ?? []
  let category: PlaceCategory
  if (categories.includes('education.library')) category = 'library'
  else if (categories.includes('leisure.park')) category = 'park'
  else return null

  // Only an explicit condition counts. Missing stays unknown.
  const stepFreeAccess: Confirmation = categories.includes('wheelchair.yes')
    ? 'yes'
    : 'unknown'

  return {
    id: `geo-${p.place_id}`,
    name: p.name,
    category,
    latitude: p.lat,
    longitude: p.lon,
    description: 'Listed via Geoapify (OpenStreetMap data). Details are not independently checked.',
    publicAccess: 'unknown',
    seating: 'unknown',
    stepFreeAccess,
    noiseInformation: null,
    openingHours: null,
    sourceUrl: null,
    lastVerifiedAt: null,
    isDemo: false,
  }
}

export async function fetchNearbyPlaces(bounds: Bounds): Promise<Place[]> {
  const latSpan = bounds.north - bounds.south
  const lonSpan = bounds.east - bounds.west
  if (latSpan > 0.06 || lonSpan > 0.1) throw new Error('AREA_TOO_BIG')

  const key = import.meta.env.VITE_GEOAPIFY_KEY as string | undefined
  if (!key) throw new Error('NO_KEY')

  // Geoapify's rectangle is west, south, east, north (longitude first).
  const rect = `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`
  const url =
    'https://api.geoapify.com/v2/places' +
    '?categories=leisure.park,education.library' +
    `&filter=rect:${rect}` +
    '&limit=60' +
    `&apiKey=${encodeURIComponent(key)}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error('SERVICE_BUSY')

    const data: { features?: GeoapifyFeature[] } = await response.json()
    const seen = new Set<string>()
    const places: Place[] = []
    for (const feature of data.features ?? []) {
      const place = featureToPlace(feature)
      if (place && !seen.has(place.id)) {
        seen.add(place.id)
        places.push(place)
      }
    }
    return places
  } catch (error) {
    if (error instanceof Error && error.message === 'SERVICE_BUSY') throw error
    throw new Error('SERVICE_BUSY')
  } finally {
    clearTimeout(timer)
  }
}