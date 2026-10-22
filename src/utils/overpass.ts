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

export async function fetchNearbyPlaces(bounds: Bounds): Promise<Place[]> {
  const box = `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`
  const query = `[out:json][timeout:20];
(
  nwr["amenity"="library"]["name"](${box});
  nwr["leisure"="park"]["name"](${box});
  nwr["leisure"="garden"]["name"](${box});
);
out center 60;`

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: 'data=' + encodeURIComponent(query),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  if (!response.ok) throw new Error('Place lookup failed')

  const data: { elements: OsmElement[] } = await response.json()
  const places: Place[] = []
  for (const element of data.elements) {
    const place = elementToPlace(element)
    if (place) places.push(place)
  }
  return places
}