import type { Confirmation, Place, PlaceCategory } from '../types/place'

export type Bounds = {
  south: number
  west: number
  north: number
  east: number
}

type OsmElement = {
  type: 'node' | 'way' | 'relation'
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

const STRICT_HOURS =
  /^(Daily|[A-Z][a-z]{2}(?:-[A-Z][a-z]{2})?) \d{2}:\d{2}-\d{2}:\d{2}$/

function tagToConfirmation(
  value: string | undefined,
  yes: string[],
  no: string[],
): Confirmation {
  if (value === undefined) return 'unknown'
  if (yes.includes(value)) return 'yes'
  if (no.includes(value)) return 'no'
  return 'unknown'
}

export function elementToPlace(element: OsmElement): Place | null {
  const tags = element.tags ?? {}
  const name = tags.name
  if (!name) return null

  const latitude = element.lat ?? element.center?.lat
  const longitude = element.lon ?? element.center?.lon
  if (latitude === undefined || longitude === undefined) return null

  let category: PlaceCategory
  if (tags.amenity === 'library') category = 'library'
  else if (tags.leisure === 'park' || tags.leisure === 'garden') category = 'park'
  else return null

  const hours = tags.opening_hours
  const website = tags.website ?? tags['contact:website']

  return {
    id: `osm-${element.type}-${element.id}`,
    name,
    category,
    latitude,
    longitude,
    description: 'Listed on OpenStreetMap. Details are not independently checked.',
    publicAccess: tagToConfirmation(tags.access, ['yes', 'public'], ['private', 'no']),
    seating: tagToConfirmation(tags.bench, ['yes'], []),
    stepFreeAccess: tagToConfirmation(tags.wheelchair, ['yes'], ['no']),
    noiseInformation: null,
    openingHours: hours && STRICT_HOURS.test(hours) ? hours : null,
    sourceUrl: website && /^https?:\/\//.test(website) ? website : null,
    lastVerifiedAt: null,
    isDemo: false,
  }
}

const SERVERS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]

export async function fetchNearbyPlaces(bounds: Bounds): Promise<Place[]> {
  const latSpan = bounds.north - bounds.south
  const lonSpan = bounds.east - bounds.west
  if (latSpan > 0.1 || lonSpan > 0.15) {
    throw new Error('AREA_TOO_BIG')
  }

  const box = `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`
  const query = `[out:json][timeout:15];
(
  nwr["amenity"="library"]["name"](${box});
  nwr["leisure"="park"]["name"](${box});
  nwr["leisure"="garden"]["name"](${box});
);
out center 60;`

  let lastError: unknown = null
  for (const server of SERVERS) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 20000)
      const response = await fetch(server, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(query),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: controller.signal,
      })
      clearTimeout(timer)
      if (!response.ok) throw new Error('Server returned ' + response.status)

      const data: { elements: OsmElement[] } = await response.json()
      const places: Place[] = []
      for (const element of data.elements) {
        const place = elementToPlace(element)
        if (place) places.push(place)
      }
      return places
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}