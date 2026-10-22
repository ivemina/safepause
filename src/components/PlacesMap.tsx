import { useEffect, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import type { Marker as LeafletMarker } from 'leaflet'
import type { Place } from '../types/place'

type PlacesMapProps = {
  places: Place[]
  selectedId: string | null
  onSelect: (id: string) => void
}

// Central Leeds. Used as the default demo area.
const DEFAULT_CENTER: [number, number] = [53.7997, -1.5492]
const DEFAULT_ZOOM = 14

function hasValidCoordinates(place: Place): boolean {
  return (
    Number.isFinite(place.latitude) &&
    Number.isFinite(place.longitude) &&
    place.latitude >= -90 &&
    place.latitude <= 90 &&
    place.longitude >= -180 &&
    place.longitude <= 180
  )
}

// Moves the map to the selected place when the selection changes.
function FlyToSelected({ place }: { place: Place | null }) {
  const map = useMap()
  useEffect(() => {
    if (place) {
      map.flyTo([place.latitude, place.longitude], Math.max(map.getZoom(), 15))
    }
  }, [place, map])
  return null
}

function PlaceMarker({
  place,
  isSelected,
  onSelect,
}: {
  place: Place
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  const markerRef = useRef<LeafletMarker | null>(null)

  useEffect(() => {
    if (isSelected) markerRef.current?.openPopup()
  }, [isSelected])

  return (
    <Marker
      ref={markerRef}
      position={[place.latitude, place.longitude]}
      eventHandlers={{ click: () => onSelect(place.id) }}
    >
      <Popup>{place.name}</Popup>
    </Marker>
  )
}

function PlacesMap({ places, selectedId, onSelect }: PlacesMapProps) {
  const mappablePlaces = places.filter(hasValidCoordinates)
  const selectedPlace =
    mappablePlaces.find((place) => place.id === selectedId) ?? null

  return (
    <div className="map-wrap">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        className="map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToSelected place={selectedPlace} />
        {mappablePlaces.map((place) => (
          <PlaceMarker
            key={place.id}
            place={place}
            isSelected={place.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </MapContainer>
    </div>
  )
}

export default PlacesMap