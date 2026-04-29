import { useMemo } from 'react'
import { Map, Marker, Source, Layer } from 'react-map-gl/maplibre'
import type { LayerProps } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Coffee, Cross, Beer, Store, MapPin } from 'lucide-react'
import { useSanctuaries, type Sanctuary } from '@/data/sanctuaries'
import { ORIGIN, DESTINATION, allRoutesFeature, routeFeature, ROUTE_COLORS, type RouteId } from '@/data/routes'

// Free-tier vector style — no API key required.
const TILES = 'https://tiles.openfreemap.org/styles/positron'

const iconFor = (k: Sanctuary['kind']) =>
  k === 'cafe' ? Coffee : k === 'pharmacy' ? Cross : k === 'bar' ? Beer : Store

type Props = {
  /** When set, only this route is drawn (used in active-walk view). */
  selectedRoute?: RouteId
  /** When false, hide the destination marker (e.g., browsing mode). */
  showDestination?: boolean
  /** Optional inline style for the map container. */
  className?: string
}

export function MapView({ selectedRoute, showDestination = true, className }: Props) {
  const { data: sanctuaries } = useSanctuaries()

  const routesFC = useMemo(
    () => (selectedRoute ? routeFeature(selectedRoute) : allRoutesFeature()),
    [selectedRoute],
  )

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Map
        initialViewState={{ longitude: -9.1381, latitude: 38.7122, zoom: 13.8 }}
        mapStyle={TILES}
        attributionControl={{ compact: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <Source id="routes" type="geojson" data={routesFC}>
          {/* casing first (wider, darker) for visual separation from base map */}
          <Layer {...({
            id: 'routes-casing',
            type: 'line',
            paint: {
              'line-color': '#ffffff',
              'line-width': 7,
              'line-opacity': 0.9,
            },
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

        {/* Origin */}
        <Marker longitude={ORIGIN.lng} latitude={ORIGIN.lat} anchor="bottom">
          <Pin tone="brand" />
        </Marker>

        {/* Destination */}
        {showDestination && (
          <Marker longitude={DESTINATION.lng} latitude={DESTINATION.lat} anchor="bottom">
            <Pin tone="risk" />
          </Marker>
        )}

        {/* Sanctuary markers */}
        {sanctuaries?.map(s => {
          if (s.lat == null || s.lng == null) return null
          const Icon = iconFor(s.kind!)
          return (
            <Marker key={s.id} longitude={s.lng} latitude={s.lat} anchor="center">
              <span
                title={s.name ?? undefined}
                className="block w-7 h-7 rounded-full bg-white border-2 border-brand-500 grid place-items-center text-brand-600 shadow"
              >
                <Icon size={14} />
              </span>
            </Marker>
          )
        })}
      </Map>
    </div>
  )
}

function Pin({ tone }: { tone: 'brand' | 'risk' }) {
  const bg = tone === 'brand' ? '#7c3aed' : '#ef4444'
  return (
    <span
      style={{ background: bg }}
      className="block w-8 h-8 rounded-full grid place-items-center text-white shadow-lg"
    >
      <MapPin size={16} />
    </span>
  )
}
