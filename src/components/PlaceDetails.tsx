import type { Place } from '../types/place'
import { freshnessNote, getFreshness } from '../utils/freshness'
import { getOpenStatus } from '../utils/openingStatus'
import { useEffect, useRef } from 'react'
import {
  categoryLabel,
  confirmationLabel,
  formatCheckedDate,
} from '../utils/labels'

type PlaceDetailsProps = {
  place: Place
  onClose: () => void
}

function PlaceDetails({ place, onClose }: PlaceDetailsProps) {
  const note = freshnessNote(getFreshness(place.lastVerifiedAt))
  const openStatus = getOpenStatus(place.openingHours)
const openText =
  openStatus === 'open'
    ? 'Open now (based on listed hours)'
    : openStatus === 'closed'
      ? 'Closed now (based on listed hours)'
      : 'Opening status not verified'
  const headingRef = useRef<HTMLHeadingElement>(null)

useEffect(() => {
  headingRef.current?.focus()
}, [place.id])
      return (
    <section className="place-details" aria-labelledby="details-heading">
      <div className="details-top">
        <div>
          <p className="place-category">{categoryLabel(place.category)}</p>
          <h2
  id="details-heading"
  ref={headingRef}
  tabIndex={-1}
  className="place-name"
>
            {place.name}
          </h2>
        </div>
        <button type="button" className="button-quiet" onClick={onClose}>
          Close
        </button>
      </div>

      <p>{place.description}</p>

      <dl className="place-facts">
        <div>
          <dt>Public access</dt>
          <dd>{confirmationLabel(place.publicAccess)}</dd>
        </div>
        <div>
          <dt>Seating</dt>
          <dd>{confirmationLabel(place.seating)}</dd>
        </div>
        <div>
          <dt>Step-free access</dt>
          <dd>{confirmationLabel(place.stepFreeAccess)}</dd>
        </div>
        <div>
          <dt>Opening hours</dt>
          <dd>
  {place.openingHours ?? 'Not confirmed yet'}
  <br />
  <small>{openText}</small>
</dd>
        </div>
        <div>
          <dt>Noise</dt>
          <dd>{place.noiseInformation ?? 'Not confirmed yet'}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>
            {place.sourceUrl ? (
              <a href={place.sourceUrl} target="_blank" rel="noopener noreferrer">
                Visit source
              </a>
            ) : (
              'No source listed'
            )}
          </dd>
        </div>
      </dl>

      <p className="stamp">Checked: {formatCheckedDate(place.lastVerifiedAt)}</p>
      {note && <p className="fresh-note">{note}</p>}
      {place.isDemo && (
        <p className="demo-tag">
          This is a fictional demo place. Do not rely on it.
        </p>
      )}
    </section>
  )
}

export default PlaceDetails