import { useState } from 'react'
import Header from './components/Header'
import PlaceCard from './components/PlaceCard'
import PlaceDetails from './components/PlaceDetails'
import { demoPlaces } from './data/demoPlaces'
import { filterPlaces } from './utils/filterPlaces'
import type { CategoryFilter } from './utils/filterPlaces'
import PlacesMap from './components/PlacesMap'
import { keepValidPlaces } from './utils/validatePlace'

const places = keepValidPlaces(demoPlaces)
function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [seatingConfirmed, setSeatingConfirmed] = useState(false)
  const [stepFreeConfirmed, setStepFreeConfirmed] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [openNow, setOpenNow] = useState(false)
  const visiblePlaces = filterPlaces(places, {
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

        <PlacesMap
  places={visiblePlaces}
  selectedId={selectedId}
  onSelect={setSelectedId}
/>
        <h2>Places to pause</h2>
        <p className="result-count">
          Showing {visiblePlaces.length} of {places.length}
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