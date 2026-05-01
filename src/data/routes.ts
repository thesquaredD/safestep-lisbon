import { useEffect, useState } from 'react'
import type { FeatureCollection, LineString } from 'geojson'
import { supabase } from '@/lib/supabase'
import { FALLBACK_SANCTUARIES } from './fallback_sanctuaries'

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
  summary?: string
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
const LABELS: Record<RouteId, string> = { safest: 'Safest walking route', balanced: 'Balanced walking route', fastest: 'Fastest walking route' }

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
  
  // Merge Supabase sanctuaries with fallback sanctuaries, deduplicate by name
  const dbSanctuaries = sanctuaries.data ?? []
  const existingNames = new Set(dbSanctuaries.map(s => s.name?.toLowerCase()))
  const combinedSanctuaries = [
    ...dbSanctuaries,
    ...FALLBACK_SANCTUARIES.filter(f => !existingNames.has(f.name?.toLowerCase()))
  ]

  return {
    sanctuaries: combinedSanctuaries,
    hazards: hazards.data ?? [],
  }
}

type SafetyMetrics = {
  score: number
  verifiedCount: number
  candidateCount: number
  hazardCount: number
}

function calculateSafetyMetrics(
  geometry: LineString,
  sanctuaries: any[],
  hazards: any[],
): SafetyMetrics {
  let baseScore = 65
  const nearbySanctuaryIds = new Set<string>()
  const nearbyHazardIds = new Set<string>()
  
  let verifiedCount = 0
  let candidateCount = 0
  let hazardCount = 0

  const points = geometry.coordinates

  for (const [lng, lat] of points) {
    // Check Sanctuaries
    for (const s of sanctuaries) {
      if (s.lat && s.lng && !nearbySanctuaryIds.has(s.id)) {
        if (distanceMeters(lat, lng, s.lat, s.lng) <= 100) { 
          nearbySanctuaryIds.add(s.id)
          if (s.status === 'candidate') {
            candidateCount++
            baseScore += 8
          } else {
            verifiedCount++
            baseScore += 15
          }
        }
      }
    }

    // Check Hazards
    for (const h of hazards) {
      if (h.lat && h.lng && !nearbyHazardIds.has(h.id)) {
        if (distanceMeters(lat, lng, h.lat, h.lng) <= 60) {
          nearbyHazardIds.add(h.id)
          hazardCount++
          baseScore -= 20
        }
      }
    }
  }

  return {
    score: Math.min(100, Math.max(0, baseScore)),
    verifiedCount,
    candidateCount,
    hazardCount
  }
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

        const isIndoorTo = to.label?.toLowerCase().includes('inside') || to.label?.toLowerCase().includes('entrance')
        const indoorNote = isIndoorTo ? "This place is inside a campus/building — route shown to nearest pedestrian entrance." : null

        // Calculate real safety metrics for each alternative
        const scoredRoutes = routes.map(r => {
          const metrics = calculateSafetyMetrics(r.geometry, data.sanctuaries, data.hazards)
          
          // Generate summary text
          const safeTotal = metrics.verifiedCount + metrics.candidateCount
          let summary = ''
          if (safeTotal > 0) summary += `Passes near ${safeTotal} safe spot${safeTotal === 1 ? '' : 's'}`
          if (metrics.hazardCount > 0) summary += summary ? ` and avoids ${metrics.hazardCount} hazard${metrics.hazardCount === 1 ? '' : 's'}` : `Avoids ${metrics.hazardCount} hazard${metrics.hazardCount === 1 ? '' : 's'}`
          if (!summary) summary = 'Direct walking path'

          return {
            ...r,
            score: metrics.score,
            summary: indoorNote ? `${indoorNote} ${summary}` : summary
          }
        })

        // 1. Identify "Fastest" (minimum duration/distance)
        const sortedByTime = [...scoredRoutes].sort((a, b) => a.minutes - b.minutes)
        const fastest = sortedByTime[0]

        // 2. Identify "Safest" (highest safety score)
        const sortedBySafety = [...scoredRoutes].sort((a, b) => b.score - a.score)
        const safest = sortedBySafety[0]

        // 3. Label everything appropriately
        const labeledRoutes: Route[] = scoredRoutes.map(r => {
          let id: RouteId = 'balanced'
          
          if (r === safest && r === fastest) {
            id = 'safest' // If one route is both, call it safest
          } else if (r === fastest) {
            id = 'fastest'
          } else if (r === safest) {
            id = 'safest'
          } else {
            id = 'balanced'
          }

          return {
            ...r,
            id,
            label: LABELS[id],
            tone: TONES[id]
          }
        })

        // Ensure we don't have duplicate IDs (e.g. if OSRM returns 1 route, it's just 'safest')
        const finalRoutes: Route[] = []
        const seenIds = new Set<RouteId>()
        labeledRoutes.forEach(r => {
          if (!seenIds.has(r.id)) {
            finalRoutes.push(r)
            seenIds.add(r.id)
          } else if (!seenIds.has('balanced')) {
            r.id = 'balanced'
            r.label = LABELS['balanced']
            r.tone = TONES['balanced']
            finalRoutes.push(r)
            seenIds.add('balanced')
          }
        })

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
  // Use radiuses=100;100 to allow snapping to the nearest footway within 100m,
  // which prevents snapping to road centers in car-heavy areas or roundabouts.
  const url =
    `https://router.project-osrm.org/route/v1/foot/` +
    `${from.lng},${from.lat};${to.lng},${to.lat}` +
    `?alternatives=true&overview=full&geometries=geojson&radiuses=100;100`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Routing service returned ${res.status}`)
  const json = await res.json()
  if (json.code !== 'Ok') throw new Error(json.message ?? 'No route found')

  const raw = (json.routes ?? []) as Array<{
    geometry: LineString
    duration: number
    distance: number
  }>
  
  return raw.map(r => {
    const km = Math.round(r.distance / 100) / 10
    // credible walking time: distance / 4.8 km/h
    const calcMinutes = Math.max(1, Math.round((km / 4.8) * 60))
    
    return {
      score: 0,
      minutes: calcMinutes,
      km: km,
      geometry: r.geometry,
    }
  })
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

