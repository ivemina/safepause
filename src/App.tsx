import { useCallback, useRef, useState } from 'react'
import Header from './components/Header'
import LocationSearch from './components/LocationSearch'
import PlaceCard from './components/PlaceCard'
import PlaceDetails from './components/PlaceDetails'
import PlacesMap from './components/PlacesMap'
import type { Place } from './types/place'
import { filterPlaces } from './utils/filterPlaces'
import type { CategoryFilter } from './utils/filterPlaces'
import type { GeocodeResult } from './utils/geocode'
import { fetchNearbyPlaces } from './utils/overpass'
import type { Bounds } from './utils/overpass'
import { keepValidPlaces } from './utils/validatePlace'

const places: Place[] = []

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [seatingConfirmed, setSeatingConfirmed] = useState(false)
  const [stepFreeConfirmed, setStepFreeConfirmed] = useState(false)
  const [openNow, setOpenNow] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [target, setTarget] = useState<GeocodeResult | null>(null)
  const [livePlaces, setLivePlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const boundsGetter = useRef<(() => Bounds) | null>(null)

  // Stable function, so the map doesn't re-register it on every redraw.
  const handleBoundsReady = useCallback((getter: () => Bounds) => {
    boundsGetter.current = getter
  }, [])

  async function findPlacesHere() {
    if (!boundsGetter.current) return
    setLoading(true)
    setLoadError('')
    try {
      const found = await fetchNearbyPlaces(boundsGetter.current())
      setLivePlaces(found)
    } catch (error) {
  if (error instanceof Error && error.message === 'AREA_TOO_BIG') {
    setLoadError('The map area is too large. Zoom in a little, then try again.')
  } else {
    setLoadError('The place service is busy. Please wait a minute and try again.')
  }
}
  }

  const allPlaces = [...places, ...keepValidPlaces(livePlaces)]

  const visiblePlaces = filterPlaces(allPlaces, {
    query,
    category,
    seatingConfirmed,
    stepFreeConfirmed,
    openNow,
  })

  const selectedPlace =
    visiblePlaces.find((place) => place.id === selectedId) ?? null

  return (
    <>
      <Header />
      <main className="content">
        <LocationSearch onFound={setTarget} />

        <label className="search-label" htmlFor="place-search">
          Search places
        </label>
        <input
          id="place-search"
          className="search-input"
          type="search"
          placeholder="Try “library” or “garden”"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <div className="filters">
          <div className="filter-field">
            <label htmlFor="category-filter">Type of place</label>
            <select
              id="category-filter"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as CategoryFilter)
              }
            >
              <option value="all">All types</option>
              <option value="park">Park or garden</option>
              <option value="library">Library</option>
              <option value="indoor">Indoor space</option>
              <option value="quiet-room">Quiet room</option>
            </select>
          </div>

          <label className="filter-check">
            <input
              type="checkbox"
              checked={seatingConfirmed}
              onChange={(event) => setSeatingConfirmed(event.target.checked)}
            />
            Seating confirmed
          </label>

          <label className="filter-check">
            <input
              type="checkbox"
              checked={stepFreeConfirmed}
              onChange={(event) => setStepFreeConfirmed(event.target.checked)}
            />
            Step-free access confirmed
          </label>

          <label className="filter-check">
            <input
              type="checkbox"
              checked={openNow}
              onChange={(event) => setOpenNow(event.target.checked)}
            />
            Open now (listed hours)
          </label>
        </div>

        {selectedPlace && (
          <PlaceDetails
            place={selectedPlace}
            onClose={() => setSelectedId(null)}
          />
        )}

        <button
          type="button"
          className="button-main"
          onClick={findPlacesHere}
          disabled={loading}
        >
          {loading ? 'Looking…' : 'Find places here'}
        </button>
        <p className="result-count" role="status">
          {loadError}
        </p>

        <PlacesMap
          places={visiblePlaces}
          selectedId={selectedId}
          onSelect={setSelectedId}
          target={target}
          onBoundsReady={handleBoundsReady}
        />

        <h2>Places to pause</h2>
        <p className="result-count">
          Showing {visiblePlaces.length} of {allPlaces.length}
        </p>

        {visiblePlaces.length === 0 ? (
          <p className="empty-state">
            No places match these filters. Try removing one.
          </p>
        ) : (
          <div className="place-list">
            {visiblePlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isSelected={place.id === selectedId}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default App