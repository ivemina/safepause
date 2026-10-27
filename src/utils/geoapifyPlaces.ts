import type { Confirmation, Place, PlaceCategory } from '../types/place'
import type { Bounds } from './overpass'

type Tags = Record<string, unknown>

type GeoapifyFeature = {
  properties?: {
    name?: string
    lat?: number
    lon?: number
    place_id?: string
    categories?: string[]
    opening_hours?: string
    website?: string
    contact?: { website?: string }
    facilities?: { wheelchair?: boolean }
    datasource?: { raw?: Tags }
  }
}

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== ''
    ? value.trim()
    : null
}

function toConfirmation(
  value: string | null,
  yes: string[],
  no: string[],
): Confirmation {
  if (value === null) return 'unknown'
  if (yes.includes(value)) return 'yes'
  if (no.includes(value)) return 'no'
  return 'unknown'
}

export function featureToPlace(
  feature: GeoapifyFeature,
  stepFreeListed = false,
): Place | null {
  const p = feature.properties
  if (!p || !p.name || !p.place_id) return null
  if (typeof p.lat !== 'number' || typeof p.lon !== 'number') return null

  const categories = p.categories ?? []
  let category: PlaceCategory
  if (categories.includes('education.library')) category = 'library'
  else if (categories.includes('leisure.park')) category = 'park'
  else return null

  const raw: Tags = p.datasource?.raw ?? {}

  // Step-free: only an explicit statement counts.
  let stepFreeAccess: Confirmation = toConfirmation(
    text(raw.wheelchair),
    ['yes'],
    ['no'],
  )
  if (
    stepFreeListed ||
    categories.includes('wheelchair.yes') ||
    p.facilities?.wheelchair === true
  ) {
    stepFreeAccess = 'yes'
  }

  const hours = text(p.opening_hours) ?? text(raw.opening_hours)
  const site =
    text(p.website) ?? text(p.contact?.website) ?? text(raw.website)

  return {
    id: `geo-${p.place_id}`,
    name: p.name,
    category,
    latitude: p.lat,
    longitude: p.lon,
    description:
      'Listed via Geoapify (OpenStreetMap data). Details are not independently checked.',
    publicAccess: toConfirmation(
      text(raw.access),
      ['yes', 'public'],
      ['private', 'no'],
    ),
    seating: toConfirmation(text(raw.bench), ['yes'], []),
    stepFreeAccess,
    noiseInformation: null,
    openingHours: hours && hours.length <= 200 ? hours : null,
    sourceUrl: site && /^https?:\/\//.test(site) ? site : null,
    lastVerifiedAt: null,
    isDemo: false,
  }
}

async function getFeatures(
  url: string,
  signal: AbortSignal,
): Promise<GeoapifyFeature[]> {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('SERVICE_BUSY')
  const data: { features?: GeoapifyFeature[] } = await response.json()
  return data.features ?? []
}

export async function fetchNearbyPlaces(bounds: Bounds): Promise<Place[]> {
  const latSpan = bounds.north - bounds.south
  const lonSpan = bounds.east - bounds.west
  if (latSpan > 0.06 || lonSpan > 0.1) throw new Error('AREA_TOO_BIG')

  const key = import.meta.env.VITE_GEOAPIFY_KEY as string | undefined
  if (!key) throw new Error('NO_KEY')

  // Geoapify's rectangle is west, south, east, north (longitude first).
  const rect = `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`
  const base =
    'https://api.geoapify.com/v2/places' +
    '?categories=leisure.park,education.library' +
    `&filter=rect:${rect}` +
    '&limit=60' +
    `&apiKey=${encodeURIComponent(key)}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    // The second request lists only places stated as wheelchair accessible.
    // If it fails, we still show the main results.
    const [all, stepFree] = await Promise.all([
      getFeatures(base, controller.signal),
      getFeatures(base + '&conditions=wheelchair.yes', controller.signal).catch(
        () => [] as GeoapifyFeature[],
      ),
    ])

    const stepFreeIds = new Set(
      stepFree
        .map((f) => f.properties?.place_id)
        .filter((id): id is string => typeof id === 'string'),
    )

    const byId = new Map<string, Place>()
    for (const feature of all) {
      const id = feature.properties?.place_id
      const place = featureToPlace(feature, id ? stepFreeIds.has(id) : false)
      if (place) byId.set(place.id, place)
    }
    for (const feature of stepFree) {
      const place = featureToPlace(feature, true)
      if (place && !byId.has(place.id)) byId.set(place.id, place)
    }
    return [...byId.values()]
  } catch {
    throw new Error('SERVICE_BUSY')
  } finally {
    clearTimeout(timer)
  }
}