import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Map,
  Marker,
  Source,
  Layer,
  NavigationControl,
} from 'react-map-gl/maplibre'
import type { LayerProps, MapRef } from 'react-map-gl/maplibre'
import type { FeatureCollection, Point } from 'geojson'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  Coffee, Cross, Beer, Store,
  AlertTriangle, Lightbulb, Construction, Eye, AlertCircle,
  Navigation, MapPin as MapPinIcon,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useSanctuaries, type Sanctuary } from '@/data/sanctuaries'
import { useHazards, type Hazard } from '@/data/hazards'
import {
  routesToFeatureCollection, ROUTE_COLORS,
  type RouteId, type Route, type LngLat,
} from '@/data/routes'
import { MapPopup, type PopupSelection } from './MapPopup'

const TILES = 'https://tiles.openfreemap.org/styles/positron'

const sanctuaryIconFor = (k: Sanctuary['kind']) =>
  k === 'cafe' ? Coffee : k === 'pharmacy' ? Cross : k === 'bar' ? Beer : Store

const hazardIconFor = (k: Hazard['kind']) =>
  k === 'broken_light' ? Lightbulb
  : k === 'blocked_walkway' ? Construction
  : k === 'poor_visibility' ? Eye
  : k === 'unsafe_crossing' ? AlertCircle
  : AlertTriangle

type Props = {
  /** All routes returned by the routing engine — colored polylines on the map. */
  routes?: Route[]
  /** Which route to highlight; others render dim. If absent, all show colored. */
  selectedRouteId?: RouteId
  /** Origin marker location (defaults to the demo origin). */
  from?: LngLat | null
  /** Destination marker location (defaults to the demo destination). */
  to?: LngLat | null
  /** Hide the destination marker entirely (e.g. during free exploration). */
  showDestination?: boolean
  showControls?: boolean
  /** Notify parent so a mobile drawer can collapse when popup opens. */
  onSelectionChange?: (hasSelection: boolean) => void
  onGetDirections?: (lat: number, lng: number, label: string) => void
  centerOverride?: LngLat | null
  className?: string
}

export function MapView({
  routes,
  selectedRouteId,
  from,
  to,
  showDestination = true,
  showControls = true,
  onSelectionChange,
  onGetDirections,
  centerOverride,
  className,
}: Props) {
  const { data: sanctuaries } = useSanctuaries()
  const { data: hazards } = useHazards()
  const [selection, setSelection] = useState<PopupSelection | null>(null)
  const mapRef = useRef<MapRef | null>(null)

  // Fly to override if provided (Issue 4)
  useEffect(() => {
    if (centerOverride && mapRef.current) {
      mapRef.current.flyTo({
        center: [centerOverride.lng, centerOverride.lat],
        zoom: 15,
        essential: true,
        duration: 2000
      })
    }
  }, [centerOverride])

  const select = (s: PopupSelection | null) => {
    setSelection(s)
    onSelectionChange?.(s !== null)
  }

  const routesFC = useMemo(
    () => routesToFeatureCollection(routes ?? [], selectedRouteId),
    [routes, selectedRouteId],
  )

  // Fit map to the selected route (or all routes if none selected) whenever
  // routes change. Padding is clamped to the actual map container size — on
  // narrow viewports a hardcoded 220px bottom padding can exceed map height
  // and MapLibre returns NaN coords (it crashes inside cameraForBounds).
  useEffect(() => {
    const m = mapRef.current?.getMap()
    if (!m || !routes || routes.length === 0) return
    const c = m.getContainer()
    const w = c.offsetWidth, h = c.offsetHeight
    if (w < 100 || h < 100) return  // map not yet sized

    const coords = (selectedRouteId ? routes.filter(r => r.id === selectedRouteId) : routes)
      .flatMap(r => r.geometry.coordinates as [number, number][])
    if (coords.length < 2) return
    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity
    for (const [lng, lat] of coords) {
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue
      if (lng < minLng) minLng = lng
      if (lat < minLat) minLat = lat
      if (lng > maxLng) maxLng = lng
      if (lat > maxLat) maxLat = lat
    }
    if (!Number.isFinite(minLng) || !Number.isFinite(maxLng)) return

    // Cap padding at 25% of each axis so the camera always has room to fit.
    const padding = {
      top:    Math.min(90,  Math.floor(h * 0.10)),
      right:  Math.min(80,  Math.floor(w * 0.15)),
      bottom: Math.min(220, Math.floor(h * 0.25)),
      left:   Math.min(80,  Math.floor(w * 0.15)),
    }

    try {
      m.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
        padding,
        duration: 600,
        maxZoom: 16,
      })
    } catch {
      // Last-resort: don't crash the app if MapLibre still rejects the bounds
      // (very small map, broken geometry). Camera just stays where it is.
    }
  }, [routes, selectedRouteId])

  const sanctuariesFC = useMemo<FeatureCollection<Point>>(() => ({
    type: 'FeatureCollection',
    features: (sanctuaries ?? [])
      .filter(s => s.lat != null && s.lng != null)
      .map(s => ({
        type: 'Feature',
        properties: { id: s.id, kind: s.kind },
        geometry: { type: 'Point', coordinates: [s.lng!, s.lat!] },
      })),
  }), [sanctuaries])

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: -9.1381, latitude: 38.7122, zoom: 14 }}
        mapStyle={TILES}
        attributionControl={{ compact: true }}
        scrollZoom dragPan dragRotate={false} touchZoomRotate doubleClickZoom
        style={{ width: '100%', height: '100%' }}
        onClick={() => select(null)}
      >
        {showControls && (
          <NavigationControl position="bottom-right" showCompass={false} showZoom={true} />
        )}

        {/* Sanctuary halos */}
        <Source id="sanctuary-zones" type="geojson" data={sanctuariesFC}>
          <Layer {...({
            id: 'sanctuary-zone-halo',
            type: 'circle',
            paint: {
              'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                10, 6, 13, 22, 15, 55, 17, 130, 19, 280,
              ],
              'circle-color': '#7c3aed',
              'circle-opacity': 0.12,
              'circle-blur': 0.4,
            },
          } as LayerProps)} />
          <Layer {...({
            id: 'sanctuary-zone-edge',
            type: 'circle',
            paint: {
              'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                10, 6, 13, 22, 15, 55, 17, 130, 19, 280,
              ],
              'circle-color': 'transparent',
              'circle-stroke-color': '#7c3aed',
              'circle-stroke-width': 1,
              'circle-stroke-opacity': 0.35,
            },
          } as LayerProps)} />
        </Source>

        {/* Routes (casing + line). The line color comes from each feature's
            `color` property — set per-route in routesToFeatureCollection. */}
        <Source id="routes" type="geojson" data={routesFC}>
          <Layer {...({
            id: 'routes-casing',
            type: 'line',
            paint: { 'line-color': '#ffffff', 'line-width': 7, 'line-opacity': 0.9 },
            layout: { 'line-cap': 'round', 'line-join': 'round' },
          } as LayerProps)} />
          <Layer {...({
            id: 'routes',
            type: 'line',
            paint: {
              'line-color': selectedRouteId
                ? ROUTE_COLORS[selectedRouteId]
                : ['coalesce', ['get', 'color'], '#7c3aed'],
              'line-width': 4,
              'line-opacity': selectedRouteId ? 1 : 0.85,
            },
            layout: { 'line-cap': 'round', 'line-join': 'round' },
          } as LayerProps)} />
        </Source>

        {/* Origin pin */}
        {from && (
          <Marker
            longitude={from.lng} latitude={from.lat} anchor="bottom"
            onClick={(e) => { e.originalEvent.stopPropagation(); select({ kind: 'origin', from }) }}
          >
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="bg-white p-1.5 rounded-full shadow-lg border-2 border-brand-500 group-hover:scale-110 transition-transform">
                <Navigation size={14} className="text-brand-500 fill-brand-500" />
              </div>
              {from.label === 'Your Current Location' && (
                <div className="mt-1 px-2 py-0.5 bg-brand-600 text-white text-[10px] font-bold rounded shadow-sm whitespace-nowrap uppercase tracking-wider">
                  You are here
                </div>
              )}
            </div>
          </Marker>
        )}

        {/* Destination pin */}
        {showDestination && to && (
          <Marker
            longitude={to.lng} latitude={to.lat} anchor="bottom"
            onClick={(e) => { e.originalEvent.stopPropagation(); select({ kind: 'destination', to }) }}
          >
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="bg-brand-600 p-1.5 rounded-full shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                <MapPinIcon size={16} className="text-white fill-white" />
              </div>
              <div className="mt-1 px-2 py-0.5 bg-white text-neutral-900 text-[10px] font-bold rounded shadow-sm border border-neutral-100 whitespace-nowrap uppercase tracking-wider">
                {to.label ?? 'Destination'}
              </div>
            </div>
          </Marker>
        )}

        {/* User Location Marker (Live GPS) - Issue 4 */}
        {from?.label === 'Your Current Location' && (
          <Marker longitude={from.lng} latitude={from.lat} anchor="center">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping opacity-40" />
              <div className="relative w-4 h-4 bg-brand-600 rounded-full border-2 border-white shadow-md" />
            </div>
          </Marker>
        )}

        {sanctuaries?.map(s => {
          if (s.lat == null || s.lng == null) return null
          const Icon = sanctuaryIconFor(s.kind!)
          return (
            <Marker
              key={s.id}
              longitude={s.lng} latitude={s.lat} anchor="center"
              onClick={(e) => { e.originalEvent.stopPropagation(); select({ kind: 'sanctuary', data: s }) }}
            >
              <button
                type="button"
                aria-label={s.name ?? 'Sanctuary'}
                className="cursor-pointer block w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white shadow-md ring-2 ring-white hover:scale-110 active:scale-95 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300"
              >
                <Icon size={18} />
              </button>
            </Marker>
          )
        })}

        {hazards?.map(h => {
          if (h.lat == null || h.lng == null) return null
          const Icon = hazardIconFor(h.kind)
          const isPending = h.status === 'new'
          const tone = h.status === 'resolved' ? 'bg-safe' : 'bg-warn'
          
          return (
            <Marker
              key={h.id}
              longitude={h.lng} latitude={h.lat} anchor="center"
              onClick={(e) => { e.originalEvent.stopPropagation(); select({ kind: 'hazard', data: h }) }}
            >
              <button
                type="button"
                aria-label={h.title ?? 'Hazard'}
                className={cn(
                  'cursor-pointer block w-7 h-7 rounded-full grid place-items-center text-white shadow-md ring-2 ring-white hover:scale-110 active:scale-95 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300',
                  tone,
                  isPending && 'animate-pulse ring-amber-400 ring-offset-2'
                )}
              >
                <Icon size={13} />
              </button>
            </Marker>
          )
        })}

        {selection && (
          <MapPopup
            selection={selection}
            onClose={() => select(null)}
            onGetDirections={(lat, lng, label) => {
              select(null)
              onGetDirections?.(lat, lng, label)
            }}
          />
        )}
      </Map>
    </div>
  )
}
