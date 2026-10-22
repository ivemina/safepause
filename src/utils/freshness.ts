export type Freshness = 'recent' | 'stale' | 'never'

const STALE_AFTER_DAYS = 90
const DAY_MS = 24 * 60 * 60 * 1000

export function getFreshness(
  lastVerifiedAt: string | null,
  now: Date = new Date(),
): Freshness {
  if (lastVerifiedAt === null) return 'never'
  const checked = new Date(lastVerifiedAt)
  if (Number.isNaN(checked.getTime())) return 'never'
  const ageInDays = (now.getTime() - checked.getTime()) / DAY_MS
  return ageInDays > STALE_AFTER_DAYS ? 'stale' : 'recent'
}

export function freshnessNote(freshness: Freshness): string | null {
  if (freshness === 'never') return 'Not checked yet. Details may be unreliable.'
  if (freshness === 'stale') return 'Worth re-checking. Details may have changed.'
  return null
}