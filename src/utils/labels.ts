import type { Confirmation, PlaceCategory } from '../types/place'

export function confirmationLabel(value: Confirmation): string {
  if (value === 'yes') return 'Confirmed'
  if (value === 'no') return 'Confirmed: none'
  return 'Not confirmed yet'
}

export function categoryLabel(category: PlaceCategory): string {
  switch (category) {
    case 'park':
      return 'Park or garden'
    case 'library':
      return 'Library'
    case 'indoor':
      return 'Indoor space'
    case 'quiet-room':
      return 'Quiet room'
  }
}

export function formatCheckedDate(iso: string | null): string {
  if (iso === null) return 'Never checked'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Date not valid'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}