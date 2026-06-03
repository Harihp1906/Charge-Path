import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Navbar from '../components/Navbar'
import '../styles/Map.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const chargingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const hotelIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

function LocationSetter({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.setView(position, 14)
    }
  }, [position, map])
  return null
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return (R * c).toFixed(1)
}

function Map() {
  const [position, setPosition] = useState(null)
  const [mode, setMode] = useState('charging')
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [locationError, setLocationError] = useState(false)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setPosition([latitude, longitude])
        fetchPlaces(latitude, longitude, 'charging')
      },
      () => {
        setLocationError(true)
        setLoading(false)
      }
    )
  }, [])

  const fetchPlaces = async (lat, lon, type) => {
    setLoading(true)
    setPlaces([])
    const amenity = type === 'charging' ? 'charging_station' : 'hotel'
    const query = `
      [out:json];
      node["amenity"="${amenity}"](around:50000,${lat},${lon});
      out body;
    `
    try {
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      })
      const data = await res.json()
      const results = data.elements.map((el) => ({
        id: el.id,
        name: el.tags.name || (type === 'charging' ? 'EV Charging Station' : 'Hotel'),
        lat: el.lat,
        lon: el.lon,
        distance: getDistance(lat, lon, el.lat, el.lon),
      }))
      results.sort((a, b) => a.distance - b.distance)
      setPlaces(results.slice(0, 15))
    } catch (error) {
      console.error('Failed to fetch places:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModeSwitch = (newMode) => {
    setMode(newMode)
    if (position) {
      fetchPlaces(position[0], position[1], newMode)
    }
  }

  return (
    <div className="map-page">
      <Navbar />
      <div className="map-container">
        <div className="map-sidebar">
          <div className="sidebar-header">
            <div className="mode-toggle">
              <button
                className={`mode-btn ${mode === 'charging' ? 'active' : ''}`}
                onClick={() => handleModeSwitch('charging')}
              >
                Charging
              </button>
              <button
                className={`mode-btn ${mode === 'hotels' ? 'active' : ''}`}
                onClick={() => handleModeSwitch('hotels')}
              >
                Hotels
              </button>
            </div>
            <p className="sidebar-count">
              {loading ? 'Searching...' : `${places.length} places found`}
            </p>
          </div>

          <div className="sidebar-list">
            {locationError && (
              <div className="sidebar-error">
                Location access denied. Please allow location to find nearby places.
              </div>
            )}
            {loading && (
              <div className="sidebar-loading">
                <div className="loading-spinner" />
                <p>Finding nearby {mode === 'charging' ? 'stations' : 'hotels'}...</p>
              </div>
            )}
            {!loading && places.map((place) => (
              <div key={place.id} className="place-card">
                <div className="place-info">
                  <span className="place-name">{place.name}</span>
                  <span className="place-distance">{place.distance} km away</span>
                </div>
                <button className="place-book-btn">Book</button>
              </div>
            ))}
            {!loading && places.length === 0 && !locationError && (
              <div className="sidebar-empty">
                No {mode === 'charging' ? 'charging stations' : 'hotels'} found nearby.
              </div>
            )}
          </div>
        </div>

        <div className="map-view">
          {locationError ? (
            <div className="map-error">
              <p>Please allow location access to use the map.</p>
            </div>
          ) : (
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              className="leaflet-map"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {position && (
                <>
                  <LocationSetter position={position} />
                  <Marker position={position} icon={userIcon}>
                    <Popup>You are here</Popup>
                  </Marker>
                </>
              )}
              {places.map((place) => (
                <Marker
                  key={place.id}
                  position={[place.lat, place.lon]}
                  icon={mode === 'charging' ? chargingIcon : hotelIcon}
                >
                  <Popup>
                    <strong>{place.name}</strong><br />
                    {place.distance} km away
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  )
}

export default Map