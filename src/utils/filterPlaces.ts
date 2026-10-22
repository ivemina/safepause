import type { Place, PlaceCategory } from '../types/place'
import { getOpenStatus } from './openingStatus'

export type CategoryFilter = PlaceCategory | 'all'

export type Filters = {
  query: string
  category: CategoryFilter
  seatingConfirmed: boolean
  stepFreeConfirmed: boolean
  openNow: boolean
}

export function searchPlaces(places: Place[], query: string): Place[] {
  const text = query.trim().toLowerCase()
  if (text === '') return places

  return places.filter(
    (place) =>
      place.name.toLowerCase().includes(text) ||
      place.description.toLowerCase().includes(text),
  )
}

export function filterPlaces(places: Place[], filters: Filters): Place[] {
  return searchPlaces(places, filters.query).filter((place) => {
    if (filters.category !== 'all' && place.category !== filters.category) {
      return false
    }
    if (filters.seatingConfirmed && place.seating !== 'yes') {
      return false
    }
    if (filters.stepFreeConfirmed && place.stepFreeAccess !== 'yes') {
      return false
    }
    if (filters.openNow && getOpenStatus(place.openingHours) !== 'open') {
  return false
}
    return true
  })
}