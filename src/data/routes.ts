// Real walking routes via OSRM's public demo server.
//
//   GET /route/v1/foot/{lng1},{lat1};{lng2},{lat2}?alternatives=true&overview=full&geometries=geojson
//
// The public demo (router.project-osrm.org) is rate-limited and is fine for
// a class demo — for any production deployment swap to OpenRouteService with
// an API key. See `recipes/wire-real-routing.md`.
//
// SCORING is intentionally a placeholder right now. OSRM returns 1–3
// alternatives sorted by duration; we map them to safest/balanced/fastest
// as a first-pass proxy. The team's first Gemini exercise is to replace
// the scoring with sanctuary coverage + lighting + slider weights.

import { useEffect, useState } from 'react'
import type { FeatureCollection, LineString } from 'geojson'

export type RouteId = 'safest' | 'balanced' | 'fastest'

export type LngLat = { lng: number; lat: number; label?: string }

export type Route = {
  id: RouteId
  label: string
  score: number
  minutes: number
  km: number
  tone: 'safe' | 'warn' | 'risk'
  geometry: LineString
}

/* ─────────────────────────────────────────────────────────────────────────
   Defaults — used when the user hasn't yet picked an origin/destination.
   ─────────────────────────────────────────────────────────────────────── */

export const DEFAULT_ORIGIN: LngLat = {
  lng: -9.1396, lat: 38.7165, label: 'Home — Rua de São José, Lisboa',
}
export const DEFAULT_DESTINATION: LngLat = {
  lng: -9.1366, lat: 38.7079, label: 'Praça do Comércio, Lisboa',
}

// Backwards-compat aliases (older imports).
export const ORIGIN = DEFAULT_ORIGIN
export const DESTINATION = DEFAULT_DESTINATION

export const ROUTE_COLORS: Record<RouteId, string> = {
  safest:   '#22c55e',
  balanced: '#f59e0b',
  fastest:  '#ef4444',
}

const PLACEHOLDER_SCORE: Record<RouteId, number> = { safest: 92, balanced: 76, fastest: 54 }
const TONES: Record<RouteId, 'safe' | 'warn' | 'risk'> = { safest: 'safe', balanced: 'warn', fastest: 'risk' }
const LABELS: Record<RouteId, string> = { safest: 'Safest', balanced: 'Balanced', fastest: 'Fastest' }

/* ─────────────────────────────────────────────────────────────────────────
   Hook — fetches routes whenever from/to change.
   ─────────────────────────────────────────────────────────────────────── */

type State = { data: Route[] | null; loading: boolean; error: string | null }

export function useRoutes(from: LngLat | null, to: LngLat | null): State {
  const [state, setState] = useState<State>({ data: null, loading: false, error: null })

  // Stable cache key — undefined inputs short-circuit
  const fromKey = from ? `${from.lng},${from.lat}` : ''
  const toKey   = to   ? `${to.lng},${to.lat}`     : ''

  useEffect(() => {
    if (!from || !to) { setState({ data: null, loading: false, error: null }); return }
    let cancelled = false
    setState(s => ({ ...s, loading: true, error: null }))
    fetchOsrm(from, to)
      .then(routes => { if (!cancelled) setState({ data: routes, loading: false, error: null }) })
      .catch(err => { if (!cancelled) setState({ data: null, loading: false, error: err.message ?? 'Routing failed' }) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromKey, toKey])

  return state
}

async function fetchOsrm(from: LngLat, to: LngLat): Promise<Route[]> {
  const url =
    `https://router.project-osrm.org/route/v1/foot/` +
    `${from.lng},${from.lat};${to.lng},${to.lat}` +
    `?alternatives=true&overview=full&geometries=geojson`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Routing service returned ${res.status}`)
  const json = await res.json()
  if (json.code !== 'Ok') throw new Error(json.message ?? 'No route found')

  const raw = (json.routes ?? []) as Array<{
    geometry: LineString
    duration: number   // seconds
    distance: number   // metres
  }>
  if (raw.length === 0) throw new Error('No route found')

  // Sort ascending by duration, then map: shortest = fastest, longest = safest.
  // (Pure proxy until the team plugs in real scoring.)
  const ordered = raw.slice().sort((a, b) => a.duration - b.duration)
  const idsByPosition: RouteId[] =
    ordered.length === 1 ? ['safest']
    : ordered.length === 2 ? ['fastest', 'safest']
    : ['fastest', 'balanced', 'safest']

  const built: Route[] = ordered.map((r, i) => {
    const id = idsByPosition[i]
    return {
      id,
      label: LABELS[id],
      score: PLACEHOLDER_SCORE[id],
      minutes: Math.max(1, Math.round(r.duration / 60)),
      km: Math.round(r.distance / 100) / 10,  // 1.42 → "1.4"
      tone: TONES[id],
      geometry: r.geometry,
    }
  })

  // Final display order: Safest → Balanced → Fastest.
  const order: Record<RouteId, number> = { safest: 0, balanced: 1, fastest: 2 }
  return built.sort((a, b) => order[a.id] - order[b.id])
}

/* ─────────────────────────────────────────────────────────────────────────
   GeoJSON helpers consumed by MapView.
   ─────────────────────────────────────────────────────────────────────── */

export function routesToFeatureCollection(
  routes: Route[],
  selectedId?: RouteId,
): FeatureCollection<LineString> {
  const list = selectedId
    ? routes.filter(r => r.id === selectedId)
    : routes
  return {
    type: 'FeatureCollection',
    features: list.map(r => ({
      type: 'Feature',
      properties: { id: r.id, color: ROUTE_COLORS[r.id] },
      geometry: r.geometry,
    })),
  }
}
