import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type LngLat = { lat: number; lng: number }

type LocationContextType = {
  coords: LngLat | null
  status: 'prompt' | 'loading' | 'success' | 'denied' | 'error'
  error: string | null
  requestLocation: () => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [coords, setCoords] = useState<LngLat | null>(null)
  const [status, setStatus] = useState<LocationContextType['status']>('prompt')
  const [error, setError] = useState<string | null>(null)

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus('error')
      setError('Geolocation not supported')
      return
    }

    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus('success')
        setError(null)
      },
      (err) => {
        setStatus('denied')
        setError(err.message)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  useEffect(() => {
    // Auto-request if permission was already granted
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
        if (result.state === 'granted') {
          requestLocation()
        }
        
        result.onchange = () => {
          if (result.state === 'granted') requestLocation()
          else if (result.state === 'denied') setStatus('denied')
        }
      })
    }
  }, [])

  return (
    <LocationContext.Provider value={{ coords, status, error, requestLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}
