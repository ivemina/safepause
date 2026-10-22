export type GeocodeResult = {
  name: string
  latitude: number
  longitude: number
}

export async function geocode(query: string): Promise<GeocodeResult | null> {
  const text = query.trim()
  if (text === '') return null

  const url =
    'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=' +
    encodeURIComponent(text)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Location search failed')
  }

  const results: { display_name: string; lat: string; lon: string }[] =
    await response.json()
  if (results.length === 0) return null

  const first = results[0]
  const latitude = Number(first.lat)
  const longitude = Number(first.lon)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null

  return { name: first.display_name, latitude, longitude }
}