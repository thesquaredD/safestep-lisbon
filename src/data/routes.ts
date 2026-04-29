// Demo route data — 3 hardcoded alternative polylines between two Lisbon points.
// Coordinates are [lng, lat] tuples (GeoJSON convention).
//
// In a real deployment, swap this for an OSRM/OpenRouteService call that returns
// alternatives, then score each by lighting/foot-traffic/sanctuary proximity.
// See `recipes/wire-real-routing.md` for the upgrade path.

import type { FeatureCollection, LineString } from 'geojson'

export type RouteId = 'safest' | 'balanced' | 'fastest'

export const ORIGIN = { lng: -9.1396, lat: 38.7165, label: 'Home — Rua de São José' }
export const DESTINATION = { lng: -9.1366, lat: 38.7079, label: 'Praça do Comércio' }

// Color tokens are kept in CSS (--color-safe / --color-warn / --color-risk).
// We replicate them here for MapLibre paint (which doesn't read CSS variables).
export const ROUTE_COLORS: Record<RouteId, string> = {
  safest:   '#22c55e',
  balanced: '#f59e0b',
  fastest:  '#ef4444',
}

// Hand-traced approximations of three alternative pedestrian paths
// from Rua de São José down to Praça do Comércio.
const ROUTES: Record<RouteId, [number, number][]> = {
  safest: [
    [-9.1396, 38.7165],
    [-9.1410, 38.7155],
    [-9.1419, 38.7140], // Chiado (well lit)
    [-9.1416, 38.7128],
    [-9.1408, 38.7112],
    [-9.1395, 38.7100],
    [-9.1380, 38.7088],
    [-9.1366, 38.7079],
  ],
  balanced: [
    [-9.1396, 38.7165],
    [-9.1390, 38.7150],
    [-9.1385, 38.7135],
    [-9.1378, 38.7118],
    [-9.1372, 38.7100],
    [-9.1366, 38.7079],
  ],
  fastest: [
    [-9.1396, 38.7165],
    [-9.1380, 38.7150],
    [-9.1370, 38.7128],
    [-9.1362, 38.7105],
    [-9.1366, 38.7079],
  ],
}

export function routeFeature(id: RouteId): FeatureCollection<LineString> {
  return {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', properties: { id }, geometry: { type: 'LineString', coordinates: ROUTES[id] } },
    ],
  }
}

export function allRoutesFeature(): FeatureCollection<LineString> {
  return {
    type: 'FeatureCollection',
    features: (Object.keys(ROUTES) as RouteId[]).map(id => ({
      type: 'Feature',
      properties: { id, color: ROUTE_COLORS[id] },
      geometry: { type: 'LineString', coordinates: ROUTES[id] },
    })),
  }
}
