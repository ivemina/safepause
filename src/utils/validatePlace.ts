import type { Place } from '../types/place'

export function validatePlace(place: Place): string[] {
  const problems: string[] = []

  if (place.id.trim() === '') problems.push('Missing id')
  if (place.name.trim() === '') problems.push('Missing name')

  if (
    !Number.isFinite(place.latitude) ||
    place.latitude < -90 ||
    place.latitude > 90
  ) {
    problems.push('Latitude must be a number between -90 and 90')
  }

  if (
    !Number.isFinite(place.longitude) ||
    place.longitude < -180 ||
    place.longitude > 180
  ) {
    problems.push('Longitude must be a number between -180 and 180')
  }

  if (
    place.lastVerifiedAt !== null &&
    Number.isNaN(new Date(place.lastVerifiedAt).getTime())
  ) {
    problems.push('lastVerifiedAt is not a valid date')
  }

  return problems
}

export function keepValidPlaces(places: Place[]): Place[] {
  return places.filter((place) => validatePlace(place).length === 0)
}