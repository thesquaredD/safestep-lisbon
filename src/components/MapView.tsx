import { useMemo, useState } from 'react'
import {
  Map,
  Marker,
  Source,
  Layer,
  NavigationControl,
} from 'react-map-gl/maplibre'
import type { LayerProps } from 'react-map-gl/maplibre'
import type { FeatureCollection, Point } from 'geojson'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  Coffee, Cross, Beer, Store,
  AlertTriangle, Lightbulb, Construction, Eye, AlertCircle,
} from 'lucide-react'
import { useSanctuaries, type Sanctuary } from '@/data/sanctuaries'
import { useHazards, type Hazard } from '@/data/hazards'
import {
  ORIGIN, DESTINATION,
  allRoutesFeature, routeFeature, ROUTE_COLORS, type RouteId,
} from '@/data/routes'
import { MapPopup, type PopupSelection } from './MapPopup'

// Free vector tiles, no API key.
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
  selectedRoute?: RouteId
  showDestination?: boolean
  showControls?: boolean
  /** Called when a marker is selected/deselected — lets the parent collapse a drawer if needed. */
  onSelectionChange?: (hasSelection: boolean) => void
  className?: string
}

export function MapView({
  selectedRoute,
  showDestination = true,
  showControls = true,
  onSelectionChange,
  className,
}: Props) {
  const { data: sanctuaries } = useSanctuaries()
  const { data: hazards } = useHazards()
  const [selection, setSelection] = useState<PopupSelection | null>(null)

  // Notify the parent so the mobile drawer can collapse and give the popup room.
  const select = (s: PopupSelection | null) => {
    setSelection(s)
    onSelectionChange?.(s !== null)
  }

  const routesFC = useMemo(
    () => (selectedRoute ? routeFeature(selectedRoute) : allRoutesFeature()),
    [selectedRoute],
  )

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
        initialViewState={{ longitude: -9.1381, latitude: 38.7122, zoom: 14 }}
        mapStyle={TILES}
        attributionControl={{ compact: true }}
        scrollZoom
        dragPan
        dragRotate={false}
        touchZoomRotate
        doubleClickZoom
        style={{ width: '100%', height: '100%' }}
        onClick={() => select(null)}
      >
        {showControls && (
          <NavigationControl position="bottom-right" showCompass={false} showZoom={true} />
        )}

        {/* Safety zones — soft purple halo around each sanctuary */}
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

        {/* Routes (casing + line) */}
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
              'line-color': selectedRoute
                ? ROUTE_COLORS[selectedRoute]
                : ['coalesce', ['get', 'color'], '#7c3aed'],
              'line-width': 4,
              'line-opacity': selectedRoute ? 1 : 0.85,
            },
            layout: { 'line-cap': 'round', 'line-join': 'round' },
          } as LayerProps)} />
        </Source>

        {/* Origin pin */}
        <Marker
          longitude={ORIGIN.lng}
          latitude={ORIGIN.lat}
          anchor="bottom"
          onClick={(e) => { e.originalEvent.stopPropagation(); select({ kind: 'origin' }) }}
        >
          <button
            type="button"
            className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-full transition hover:scale-105 active:scale-95"
            aria-label="Home"
          >
            <TeardropPin color="#7c3aed" />
          </button>
        </Marker>

        {/* Destination pin */}
        {showDestination && (
          <Marker
            longitude={DESTINATION.lng}
            latitude={DESTINATION.lat}
            anchor="bottom"
            onClick={(e) => { e.originalEvent.stopPropagation(); select({ kind: 'destination' }) }}
          >
            <button
              type="button"
              className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-risk rounded-full transition hover:scale-105 active:scale-95"
              aria-label="Destination"
            >
              <TeardropPin color="#ef4444" />
            </button>
          </Marker>
        )}

        {/* Sanctuary tiles */}
        {sanctuaries?.map(s => {
          if (s.lat == null || s.lng == null) return null
          const Icon = sanctuaryIconFor(s.kind!)
          return (
            <Marker
              key={s.id}
              longitude={s.lng}
              latitude={s.lat}
              anchor="center"
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

        {/* Hazard markers */}
        {hazards?.map(h => {
          if (h.lat == null || h.lng == null) return null
          const Icon = hazardIconFor(h.kind)
          const tone = h.status === 'resolved' ? 'bg-safe' : 'bg-warn'
          return (
            <Marker
              key={h.id}
              longitude={h.lng}
              latitude={h.lat}
              anchor="center"
              onClick={(e) => { e.originalEvent.stopPropagation(); select({ kind: 'hazard', data: h }) }}
            >
              <button
                type="button"
                aria-label={h.title ?? 'Hazard'}
                className={`cursor-pointer block w-7 h-7 rounded-full ${tone} grid place-items-center text-white shadow-md ring-2 ring-white hover:scale-110 active:scale-95 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300`}
              >
                <Icon size={13} />
              </button>
            </Marker>
          )
        })}

        {selection && <MapPopup selection={selection} onClose={() => select(null)} />}
      </Map>
    </div>
  )
}

function TeardropPin({ color }: { color: string }) {
  return (
    <svg width="32" height="40" viewBox="0 0 32 40" aria-hidden="true">
      <defs>
        <filter id="pin-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
        </filter>
      </defs>
      <path
        d="M16 1c-7.732 0-14 6.268-14 14 0 9.5 14 24 14 24s14-14.5 14-24c0-7.732-6.268-14-14-14z"
        fill={color}
        stroke="white"
        strokeWidth="2"
        filter="url(#pin-shadow)"
      />
      <circle cx="16" cy="15" r="5" fill="white" />
    </svg>
  )
}
