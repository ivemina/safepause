import { useState } from 'react'
import { geocode } from '../utils/geocode'
import type { GeocodeResult } from '../utils/geocode'

type LocationSearchProps = {
  onFound: (result: GeocodeResult) => void
}

function LocationSearch({ onFound }: LocationSearchProps) {
  const [text, setText] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      const result = await geocode(text)
      if (result === null) {
        setMessage('No location found. Try a town or city name.')
      } else {
        onFound(result)
        setMessage('Showing: ' + result.name)
      }
    } catch {
      setMessage('Could not search right now. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="location-search" onSubmit={handleSubmit}>
      <label className="search-label" htmlFor="location-input">
        Go to a town or city
      </label>
      <div className="location-row">
        <input
          id="location-input"
          className="search-input"
          type="text"
          placeholder="e.g. Liverpool"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit" className="button-main" disabled={busy}>
          {busy ? 'Searching…' : 'Go'}
        </button>
      </div>
      <p className="result-count" role="status">
        {message}
      </p>
    </form>
  )
}

export default LocationSearch