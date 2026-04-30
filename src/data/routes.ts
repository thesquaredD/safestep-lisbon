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
import { supabase } from '@/lib/supabase'

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

export const DEFAULT_ORIGIN: LngLat = {
  lng: -9.1396, lat: 38.7165, label: 'Home — Rua de São José, Lisboa',
}
export const DEFAULT_DESTINATION: LngLat = {
  lng: -9.1366, lat: 38.7079, label: 'Praça do Comércio, Lisboa',
}

export const ORIGIN = DEFAULT_ORIGIN
export const DESTINATION = DEFAULT_DESTINATION

export const ROUTE_COLORS: Record<RouteId, string> = {
  safest:   '#22c55e',
  balanced: '#f59e0b',
  fastest:  '#ef4444',
}

const TONES: Record<RouteId, 'safe' | 'warn' | 'risk'> = { safest: 'safe', balanced: 'warn', fastest: 'risk' }
const LABELS: Record<RouteId, string> = { safest: 'Safest', balanced: 'Balanced', fastest: 'Fastest' }

/* ─────────────────────────────────────────────────────────────────────────
   Utility Functions
   ─────────────────────────────────────────────────────────────────────── */

function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return Math.round(2 * R * Math.asin(Math.sqrt(x)))
}

async function fetchSafetyData() {
  const [sanctuaries, hazards] = await Promise.all([
    supabase.from('sanctuary_spaces_geo').select('*'),
    supabase.from('hazard_reports_geo').select('*'),
  ])
  return {
    sanctuaries: sanctuaries.data ?? [],
    hazards: hazards.data ?? [],
  }
}

function calculateSafetyScore(
  geometry: LineString,
  sanctuaries: any[],
  hazards: any[],
): number {
  let baseScore = 60
  const nearbySanctuaryIds = new Set<string>()
  const nearbyHazardIds = new Set<string>()

  // Optimization: only check points every ~20 meters or so? 
  // For now, let's just check the nodes. OSRM full overview is dense.
  const points = geometry.coordinates

  for (const [lng, lat] of points) {
    // Check Sanctuaries
    for (const s of sanctuaries) {
      if (s.lat && s.lng && !nearbySanctuaryIds.has(s.id)) {
        if (distanceMeters(lat, lng, s.lat, s.lng) <= 80) { // 80m radius as per legend
          nearbySanctuaryIds.add(s.id)
          baseScore += s.is_open_now ? 15 : 10
        }
      }
    }

    // Check Hazards
    for (const h of hazards) {
      if (h.lat && h.lng && !nearbyHazardIds.has(h.id)) {
        if (distanceMeters(lat, lng, h.lat, h.lng) <= 50) {
          nearbyHazardIds.add(h.id)
          baseScore -= 25
        }
      }
    }
  }

  return Math.min(100, Math.max(0, baseScore))
}

/* ─────────────────────────────────────────────────────────────────────────
   Hook — fetches routes whenever from/to change.
   ─────────────────────────────────────────────────────────────────────── */

type State = { data: Route[] | null; loading: boolean; error: string | null }

export function useRoutes(from: LngLat | null, to: LngLat | null): State {
  const [state, setState] = useState<State>({ data: null, loading: false, error: null })

  const fromKey = from ? `${from.lng},${from.lat}` : ''
  const toKey   = to   ? `${to.lng},${to.lat}`     : ''

  useEffect(() => {
    if (!from || !to) { setState({ data: null, loading: false, error: null }); return }
    let cancelled = false
    setState(s => ({ ...s, loading: true, error: null }))
    
    Promise.all([fetchOsrm(from, to), fetchSafetyData()])
      .then(([routes, data]) => {
        if (cancelled) return

        // Calculate real safety scores
        const scoredRoutes = routes.map(r => ({
          ...r,
          score: calculateSafetyScore(r.geometry, data.sanctuaries, data.hazards),
        }))

        // Sort by safety score (highest first) to re-assign labels
        const sortedBySafety = [...scoredRoutes].sort((a, b) => b.score - a.score)
        
        const finalRoutes: Route[] = sortedBySafety.map((r, i) => {
          const id = i === 0 ? 'safest' : i === 1 ? 'balanced' : 'fastest'
          // Standard walking speed: 4.8 km/h
          // minutes = distanceKm / 4.8 * 60
          const calcMinutes = Math.max(1, Math.round((r.km / 4.8) * 60))
          
          return {
            ...r,
            id,
            label: LABELS[id],
            tone: TONES[id],
            minutes: calcMinutes,
          }
        })

        // Sort back to standard Safest -> Balanced -> Fastest display order
        const displayOrder: Record<RouteId, number> = { safest: 0, balanced: 1, fastest: 2 }
        setState({ 
          data: finalRoutes.sort((a, b) => displayOrder[a.id] - displayOrder[b.id]), 
          loading: false, 
          error: null 
        })
      })
      .catch(err => { 
        if (!cancelled) setState({ data: null, loading: false, error: err.message ?? 'Routing failed' }) 
      })

    return () => { cancelled = true }
  }, [fromKey, toKey])

  return state
}

async function fetchOsrm(from: LngLat, to: LngLat): Promise<Omit<Route, 'id' | 'label' | 'tone'>[]> {
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
    duration: number
    distance: number
  }>
  
  return raw.map(r => ({
    score: 0, // Placeholder, will be calculated
    minutes: Math.max(1, Math.round(r.duration / 60)),
    km: Math.round(r.distance / 100) / 10,
    geometry: r.geometry,
  }))
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

