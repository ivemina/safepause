// The three honest answers for any detail we might not know.
export type Confirmation = 'yes' | 'no' | 'unknown'

// What kind of place it is.
export type PlaceCategory = 'park' | 'library' | 'indoor' | 'quiet-room'

// One place in SafePause.
export interface Place {
  id: string
  name: string
  category: PlaceCategory
  latitude: number
  longitude: number
  description: string
  publicAccess: Confirmation
  seating: Confirmation
  stepFreeAccess: Confirmation
  noiseInformation: string | null // null means nothing is documented
  openingHours: string | null // null means unknown
  sourceUrl: string | null
  lastVerifiedAt: string | null // ISO date string, or null if never checked
  isDemo: boolean // true for fictional example places
}