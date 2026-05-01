// Real walking routes via OpenRouteService (primary) or OSRM (fallback).
//
// SCORING is calculated based on sanctuary coverage and hazards.
// The provider is tracked and logged for developer debugging.

import { useEffect, useState } from 'react'
import type { FeatureCollection, LineString } from 'geojson'
import { supabase } from '@/lib/supabase'
import { FALLBACK_SANCTUARIES } from './fallback_sanctuaries'

export type RouteId = 'safest' | 'balanced' | 'fastest'
export type RoutingProvider = 'ors' | 'osrm' | 'none'

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
  provider: RoutingProvider
}

export const DEFAULT_ORIGIN: LngLat = {
  lng: -9.3255, lat: 38.6775, label: 'Nova SBE Carcavelos',
}
export const DEFAULT_DESTINATION: LngLat = {
  lng: -9.3331, lat: 38.6824, label: 'Carcavelos Station',
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

const SCORE_LEVELS = (score: number) => {
  if (score >= 90) return 'Very safe'
  if (score >= 70) return 'Safer'
  if (score >= 50) return 'Moderate'
  return 'Use caution'
}

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
  let baseScore = 60
  const nearbySanctuaryIds = new Set<string>()
  const nearbyHazardIds = new Set<string>()
  
  let verifiedCount = 0
  let candidateCount = 0
  let hazardCount = 0

  const points = geometry.coordinates

  for (const [lng, lat] of points) {
    for (const s of sanctuaries) {
      if (s.lat && s.lng && !nearbySanctuaryIds.has(s.id)) {
        if (distanceMeters(lat, lng, s.lat, s.lng) <= 100) { 
          nearbySanctuaryIds.add(s.id)
          if (s.status === 'candidate') {
            candidateCount++
            baseScore += 5
          } else {
            verifiedCount++
            baseScore += 12
          }
        }
      }
    }

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

type State = { 
  data: Route[] | null; 
  loading: boolean; 
  error: string | null; 
  provider: RoutingProvider;
}

export function useRoutes(from: LngLat | null, to: LngLat | null): State {
  const [state, setState] = useState<State>({ data: null, loading: false, error: null, provider: 'none' })

  const fromKey = from ? `${from.lng},${from.lat}` : ''
  const toKey   = to   ? `${to.lng},${to.lat}`     : ''

  useEffect(() => {
    if (!from || !to) { setState({ data: null, loading: false, error: null, provider: 'none' }); return }
    let cancelled = false
    setState(s => ({ ...s, loading: true, error: null, provider: 'none' }))
    
    async function load() {
      try {
        const safetyData = await fetchSafetyData()
        let routes: Omit<Route, 'id' | 'label' | 'tone' | 'provider'>[] = []
        let provider: RoutingProvider = 'none'

        try {
          routes = await fetchOpenRouteService(from!, to!)
          provider = 'ors'
        } catch (err: any) {
          console.group('Routing Provider Error')
          console.warn('OpenRouteService primary provider failed:', err.message)
          console.log('Attempting OSRM fallback...')
          console.groupEnd()
          
          routes = await fetchOsrm(from!, to!)
          provider = 'osrm'
        }

        if (cancelled) return

        const scoredRoutes = routes.map(r => {
          const metrics = calculateSafetyMetrics(r.geometry, safetyData.sanctuaries, safetyData.hazards)
          const safeTotal = metrics.verifiedCount + metrics.candidateCount
          const level = SCORE_LEVELS(metrics.score)
          
          let why = ''
          if (safeTotal > 0) why += `Passes near ${safeTotal} safe spot${safeTotal === 1 ? '' : 's'}`
          if (metrics.hazardCount > 0) why += why ? ` and avoids ${metrics.hazardCount} hazard${metrics.hazardCount === 1 ? '' : 's'}` : `Avoids ${metrics.hazardCount} hazard${metrics.hazardCount === 1 ? '' : 's'}`
          if (!why) why = 'Direct walking path'

          return {
            ...r,
            score: metrics.score,
            summary: `${level} — ${why}.`
          }
        })

        const sortedByTime = [...scoredRoutes].sort((a, b) => a.minutes - b.minutes)
        const fastest = sortedByTime[0]
        const sortedBySafety = [...scoredRoutes].sort((a, b) => b.score - a.score)
        const safest = sortedBySafety[0]

        const finalRoutes: Route[] = []
        const seenIds = new Set<RouteId>()
        
        scoredRoutes.forEach(r => {
          let id: RouteId = 'balanced'
          if (r === safest && r === fastest) id = 'safest'
          else if (r === fastest) id = 'fastest'
          else if (r === safest) id = 'safest'
          
          if (seenIds.has(id)) {
            if (!seenIds.has('balanced')) id = 'balanced'
            else return
          }

          finalRoutes.push({ ...r, id, label: LABELS[id], tone: TONES[id], provider } as Route)
          seenIds.add(id)
        })

        const displayOrder: Record<RouteId, number> = { safest: 0, balanced: 1, fastest: 2 }
        setState({ 
          data: finalRoutes.sort((a, b) => displayOrder[a.id] - displayOrder[b.id]), 
          loading: false, 
          error: null,
          provider
        })

      } catch (err: any) {
        if (!cancelled) setState({ data: null, loading: false, error: err.message ?? 'Routing failed', provider: 'none' }) 
      }
    }

    load()
    return () => { cancelled = true }
  }, [fromKey, toKey])

  return state
}

async function fetchOpenRouteService(from: LngLat, to: LngLat): Promise<Omit<Route, 'id' | 'label' | 'tone' | 'provider'>[]> {
  const apiKey = import.meta.env.VITE_ORS_API_KEY
  if (!apiKey) throw new Error('VITE_ORS_API_KEY is missing from environment.')

  const url = 'https://api.openrouteservice.org/v2/directions/foot-walking/geojson'
  
  const body = {
    coordinates: [[from.lng, from.lat], [to.lng, to.lat]],
    alternative_routes: { target_count: 3 },
    units: 'm'
  }

  console.group('Developer Debug: OpenRouteService Request')
  console.log('Provider: OpenRouteService')
  console.log('Profile: foot-walking')
  console.log('Start Coords [lng, lat]:', [from.lng, from.lat])
  console.log('End Coords [lng, lat]:', [to.lng, to.lat])
  console.log('Request Body:', body)
  console.groupEnd()

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey
    },
    body: JSON.stringify(body)
  })

  console.log('ORS Response Status:', res.status)

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    console.error('ORS Error Response:', errorBody)
    throw new Error(errorBody.error?.message || `ORS failed with ${res.status}`)
  }

  const json = await res.json()
  const features = json.features ?? []
  
  console.log(`ORS Found ${features.length} routes`)

  return features.map((f: any, i: number) => {
    const props = f.properties.summary
    const km = Math.round((props.distance / 1000) * 10) / 10
    const durationMin = Math.round(props.duration / 60)
    // Fallback calculation if duration is missing or unrealistic
    const calcMinutes = durationMin > 0 ? durationMin : Math.max(1, Math.round((km / 4.8) * 60))

    console.log(`ORS Route ${i+1}: ${km} km, ${calcMinutes} min`)

    return {
      score: 0,
      minutes: calcMinutes,
      km,
      geometry: f.geometry,
    }
  })
}

async function fetchOsrm(from: LngLat, to: LngLat): Promise<Omit<Route, 'id' | 'label' | 'tone' | 'provider'>[]> {
  const url =
    `https://router.project-osrm.org/route/v1/foot/` +
    `${from.lng},${from.lat};${to.lng},${to.lat}` +
    `?alternatives=true&overview=full&geometries=geojson`

  console.group('Developer Debug: OSRM Request (Fallback)')
  console.log('Provider: OSRM')
  console.log('Profile: foot')
  console.log('Start Coords [lng, lat]:', [from.lng, from.lat])
  console.log('End Coords [lng, lat]:', [to.lng, to.lat])
  console.log('Request URL:', url)
  console.groupEnd()

  const res = await fetch(url)
  console.log('OSRM Response Status:', res.status)

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new Error(`OSRM failed (${res.status}): ${errorBody.message || res.statusText}`)
  }
  const json = await res.json()
  if (json.code !== 'Ok') throw new Error(json.message ?? 'No route found')

  const routes = json.routes ?? []
  console.log(`OSRM Found ${routes.length} routes`)

  return routes.map((r: any, i: number) => {
    const km = Math.round(r.distance / 100) / 10
    const calcMinutes = Math.max(1, Math.round((km / 4.8) * 60))
    console.log(`OSRM Route ${i+1}: ${km} km, ${calcMinutes} min`)
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
