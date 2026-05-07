// OpenRouteService Geocoding (Pelias) for the search bar.
// Bias results to Lisbon but allow universal searching.

import { useEffect, useState } from 'react'

export type GeocodeHit = {
  id: string
  label: string         // primary line — bold
  context: string       // secondary — muted (city, country)
  lng: number
  lat: number
}

const LISBON_FOCUS = { lon: -9.1393, lat: 38.7138, radius: 40 }

export function useGeocode(query: string): { data: GeocodeHit[] | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<GeocodeHit[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) { 
      setData(null); setLoading(false); setError(null); return 
    }
    
    let cancelled = false
    setLoading(true)
    setError(null)
    
    const t = setTimeout(() => {
      fetchHits(q).then(hits => {
        if (cancelled) return
        setData(hits)
        setLoading(false)
      }).catch((err) => { 
        console.error('[Geocoder] Critical error:', err)
        if (!cancelled) { 
          setData([])
          setLoading(false)
          setError(err.message || 'Search service unavailable')
        } 
      })
    }, 400) // Increased debounce slightly
    
    return () => { cancelled = true; clearTimeout(t) }
  }, [query])

  return { data, loading, error }
}

async function fetchHits(q: string): Promise<GeocodeHit[]> {
  const apiKey = import.meta.env.VITE_ORS_API_KEY
  console.log(`[Geocoder] Starting search for "${q}"`)
  
  if (!apiKey) {
    console.error('[Geocoder] API KEY MISSING')
    throw new Error('VITE_ORS_API_KEY is not defined in .env')
  }

  // Simplified params for maximum compatibility
  const params = new URLSearchParams({
    api_key: apiKey,
    text: q,
    size: '10',
    'focus.point.lon': String(LISBON_FOCUS.lon),
    'focus.point.lat': String(LISBON_FOCUS.lat),
    'boundary.circle.lon': String(LISBON_FOCUS.lon),
    'boundary.circle.lat': String(LISBON_FOCUS.lat),
    'boundary.circle.radius': String(LISBON_FOCUS.radius),
  })

  const url = `https://api.openrouteservice.org/geocode/autocomplete?${params.toString()}`
  console.log('[Geocoder] Fetching:', url.replace(apiKey, '***'))

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  })

  console.log('[Geocoder] HTTP Status:', res.status)

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    console.error('[Geocoder] API Error Body:', body)
    throw new Error(body.error?.message || `API Error ${res.status}`)
  }

  const json = await res.json()
  const features = json.features ?? []
  console.log(`[Geocoder] API returned ${features.length} features`)

  const hits = features.map((f: any) => {
    const p = f.properties
    // Pelias label is usually the most reliable full address
    const name = p.name || p.label?.split(',')[0] || 'Unknown'
    return {
      id: p.id || String(Math.random()),
      label: name,
      context: p.label ? p.label.replace(name + ', ', '') : 'Lisbon Area',
      lng: f.geometry.coordinates[0],
      lat: f.geometry.coordinates[1],
    }
  })

  console.log('[Geocoder] Successfully mapped hits:', hits.length)
  return hits
}
