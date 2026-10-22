import type { Place } from '../types/place'
import { categoryLabel, formatCheckedDate } from '../utils/labels'
import { freshnessNote, getFreshness } from '../utils/freshness'
type PlaceCardProps = {
  place: Place
  isSelected: boolean
  onSelect: (id: string) => void
}

function PlaceCard({ place, isSelected, onSelect }: PlaceCardProps) {
 const note = freshnessNote(getFreshness(place.lastVerifiedAt))
  return (
    <article className={isSelected ? 'place-card is-selected' : 'place-card'}>
      <p className="place-category">{categoryLabel(place.category)}</p>
      <h2 className="place-name">{place.name}</h2>
      <p className="place-description">{place.description}</p>

      <p className="stamp">Checked: {formatCheckedDate(place.lastVerifiedAt)}</p>
      {note && <p className="fresh-note">{note}</p>}
      {place.isDemo && <p className="demo-tag">Demo place, not real</p>}

      <button
        type="button"
        className="button-main"
        aria-pressed={isSelected}
        onClick={() => onSelect(place.id)}
      >
        {isSelected ? 'Showing details' : 'View details'}
      </button>
    </article>
  )
}

export default PlaceCard