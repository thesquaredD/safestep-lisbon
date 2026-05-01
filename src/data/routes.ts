// Real walking routes via OpenRouteService (primary) or OSRM (fallback).
//
// SCORING is calculated based on sanctuary coverage and hazards.
// The provider is tracked and logged for developer debugging.

import { useEffect, useState } from 'react'
import type { FeatureCollection, LineString } from 'geojson'
import { supabase } from '@/lib/supabase'

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
  provider: RoutingProvider
}

export const DEFAULT_ORIGIN: LngLat = {
  lng: -9.1396, lat: 38.7165, label: 'Home — Rua de São José, Lisboa',
}
export const DEFAULT_DESTINATION: LngLat = {
  lng: -9.1366, lat: 38.7079, label: 'Praça do Comércio, Lisboa',
}

// Specific test route coordinates (approximate entrances)
export const LX_FACTORY: LngLat = { lng: -9.1789, lat: 38.7037, label: 'LX Factory' }
export const VILA_GALE_OPERA: LngLat = { lng: -9.1774, lat: 38.7018, label: 'Vila Galé Ópera' }

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

  const points = geometry.coordinates

  for (const [lng, lat] of points) {
    // Check Sanctuaries
    for (const s of sanctuaries) {
      if (s.lat && s.lng && !nearbySanctuaryIds.has(s.id)) {
        if (distanceMeters(lat, lng, s.lat, s.lng) <= 80) {
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
    
    const orsKey = import.meta.env.VITE_ORS_API_KEY
    
    const fetchRoutes = async () => {
      try {
        let routes: Omit<Route, 'id' | 'label' | 'tone' | 'provider'>[] = []
        let provider: RoutingProvider = 'none'

        if (orsKey) {
          try {
            routes = await fetchOrs(from, to, orsKey)
            provider = 'ors'
          } catch (e) {
            console.error('ORS failed, falling back to OSRM:', e)
            routes = await fetchOsrm(from, to)
            provider = 'osrm'
          }
        } else {
          console.warn('VITE_ORS_API_KEY not found, using OSRM fallback')
          routes = await fetchOsrm(from, to)
          provider = 'osrm'
        }

        const data = await fetchSafetyData()
        if (cancelled) return

        // Calculate real safety scores
        const scoredRoutes = routes.map(r => ({
          ...r,
          provider,
          score: calculateSafetyScore(r.geometry, data.sanctuaries, data.hazards),
        }))

        // Sort by safety score (highest first) to re-assign labels
        const sortedBySafety = [...scoredRoutes].sort((a, b) => b.score - a.score)
        
        const finalRoutes: Route[] = sortedBySafety.map((r, i) => {
          const id = i === 0 ? 'safest' : i === 1 ? 'balanced' : 'fastest'
          const calcMinutes = Math.max(1, Math.round((r.km / 4.8) * 60))
          
          return {
            ...r,
            id,
            label: LABELS[id],
            tone: TONES[id],
            minutes: calcMinutes,
          } as Route
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

    fetchRoutes()

    return () => { cancelled = true }
  }, [fromKey, toKey])

  return state
}

async function fetchOrs(from: LngLat, to: LngLat, apiKey: string): Promise<Omit<Route, 'id' | 'label' | 'tone' | 'provider'>[]> {
  const url = 'https://api.openrouteservice.org/v2/directions/foot-walking/geojson'
  
  // Coordinates MUST be [longitude, latitude]
  const body = {
    coordinates: [
      [from.lng, from.lat],
      [to.lng, to.lat]
    ],
    alternatives: true,
    units: 'm'
  }

  console.group('Developer Debug: OpenRouteService Request')
  console.log('Provider: OpenRouteService')
  console.log('Start Coords (lng, lat):', [from.lng, from.lat])
  console.log('End Coords (lng, lat):', [to.lng, to.lat])
  console.log('Profile: foot-walking')
  console.log('Request URL:', url)
  console.log('Request Body (Key hidden):', { ...body, api_key: 'REDACTED' })
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
    const errorData = await res.json().catch(() => ({}))
    console.error('ORS Error Body:', errorData)
    throw new Error(`OpenRouteService returned ${res.status}: ${errorData.error?.message || res.statusText}`)
  }

  const json = await res.json()
  // ORS geojson returns features, each feature is a route
  const routes = (json.features ?? []) as Array<{
    geometry: LineString
    properties: {
      summary: {
        distance: number
        duration: number
      }
    }
  }>

  console.log(`ORS Found ${routes.length} routes`)

  return routes.map((r, i) => {
    const distKm = Math.round(r.properties.summary.distance / 100) / 10
    const durMin = Math.max(1, Math.round(r.properties.summary.duration / 60))
    
    console.log(`Route ${i + 1}: ${distKm} km, ${durMin} min`)
    
    return {
      score: 0,
      minutes: durMin,
      km: distKm,
      geometry: r.geometry,
    }
  })
}

async function fetchOsrm(from: LngLat, to: LngLat): Promise<Omit<Route, 'id' | 'label' | 'tone' | 'provider'>[]> {
  const url =
    `https://router.project-osrm.org/route/v1/foot/` +
    `${from.lng},${from.lat};${to.lng},${to.lat}` +
    `?alternatives=true&overview=full&geometries=geojson`

  console.group('Developer Debug: OSRM Request')
  console.log('Provider: OSRM (Fallback)')
  console.log('Start Coords (lng, lat):', [from.lng, from.lat])
  console.log('End Coords (lng, lat):', [to.lng, to.lat])
  console.log('Profile: foot')
  console.log('Request URL:', url)
  console.groupEnd()

  const res = await fetch(url)
  console.log('OSRM Response Status:', res.status)

  if (!res.ok) throw new Error(`Routing service returned ${res.status}`)
  const json = await res.json()
  if (json.code !== 'Ok') throw new Error(json.message ?? 'No route found')

  const raw = (json.routes ?? []) as Array<{
    geometry: LineString
    duration: number
    distance: number
  }>
  
  console.log(`OSRM Found ${raw.length} routes`)

  return raw.map((r, i) => {
    const distKm = Math.round(r.distance / 100) / 10
    const durMin = Math.max(1, Math.round(r.duration / 60))
    console.log(`Route ${i + 1}: ${distKm} km, ${durMin} min`)

    return {
      score: 0,
      minutes: durMin,
      km: distKm,
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
