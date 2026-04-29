// Nominatim geocoder for the search bar.
//
//   GET https://nominatim.openstreetmap.org/search?format=json&q={query}&limit=5&viewbox={...}&bounded=1
//
// Nominatim's usage policy: max 1 req/sec, identify yourself via User-Agent
// (the browser handles this for us), don't hammer it. Debounce is mandatory.
// For a class demo this is fine; for production swap to a paid geocoder
// (Mapbox / Google) or self-host Nominatim.

import { useEffect, useState } from 'react'

export type GeocodeHit = {
  id: string
  label: string         // primary line — bold
  context: string       // secondary — muted (city, country)
  lng: number
  lat: number
}

// Lisbon viewbox — bias the results to the metropolitan area.
const LISBON_VIEWBOX = '-9.30,38.65,-9.05,38.85'

export function useGeocode(query: string): { data: GeocodeHit[] | null; loading: boolean } {
  const [data, setData] = useState<GeocodeHit[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) { setData(null); setLoading(false); return }
    let cancelled = false
    setLoading(true)
    // 250ms debounce — well within Nominatim's 1 req/sec.
    const t = setTimeout(() => {
      fetchHits(q).then(hits => {
        if (cancelled) return
        setData(hits); setLoading(false)
      }).catch(() => { if (!cancelled) { setData([]); setLoading(false) } })
    }, 250)
    return () => { cancelled = true; clearTimeout(t) }
  }, [query])

  return { data, loading }
}

async function fetchHits(q: string): Promise<GeocodeHit[]> {
  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?format=json&q=${encodeURIComponent(q)}` +
    `&limit=6&viewbox=${LISBON_VIEWBOX}&bounded=1`
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
  if (!res.ok) throw new Error(`Nominatim ${res.status}`)
  const json = await res.json() as Array<{
    place_id: number; lat: string; lon: string; display_name: string
  }>
  return json.map(h => {
    const [first, ...rest] = h.display_name.split(', ')
    return {
      id: String(h.place_id),
      label: first,
      context: rest.join(', '),
      lng: parseFloat(h.lon),
      lat: parseFloat(h.lat),
    }
  })
}
