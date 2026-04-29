import { useMemo, useState } from 'react'
import {
  Map,
  Marker,
  Popup,
  Source,
  Layer,
  NavigationControl,
} from 'react-map-gl/maplibre'
import type { LayerProps } from 'react-map-gl/maplibre'
import type { FeatureCollection, Point } from 'geojson'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Coffee, Cross, Beer, Store, AlertTriangle, Lightbulb, Construction, Eye, AlertCircle } from 'lucide-react'
import { useSanctuaries, type Sanctuary } from '@/data/sanctuaries'
import { useHazards, type Hazard } from '@/data/hazards'
import { ORIGIN, DESTINATION, allRoutesFeature, routeFeature, ROUTE_COLORS, type RouteId } from '@/data/routes'

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

type Selection =
  | { kind: 'origin' }
  | { kind: 'destination' }
  | { kind: 'sanctuary'; data: Sanctuary }
  | { kind: 'hazard'; data: Hazard }
  | null

type Props = {
  /** When set, only this route is drawn (used in active-walk view). */
  selectedRoute?: RouteId
  /** When false, hide the destination marker (e.g., browsing mode). */
  showDestination?: boolean
  /** When false, hide the on-map nav controls (small previews). */
  showControls?: boolean
  className?: string
}

export function MapView({
  selectedRoute,
  showDestination = true,
  showControls = true,
  className,
}: Props) {
  const { data: sanctuaries } = useSanctuaries()
  const { data: hazards } = useHazards()
  const [selection, setSelection] = useState<Selection>(null)

  const routesFC = useMemo(
    () => (selectedRoute ? routeFeature(selectedRoute) : allRoutesFeature()),
    [selectedRoute],
  )

  // Geo features for the safety-zone halo around each sanctuary.
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
        onClick={() => setSelection(null)}
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
          onClick={(e) => { e.originalEvent.stopPropagation(); setSelection({ kind: 'origin' }) }}
        >
          <button
            type="button"
            className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-full"
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
            onClick={(e) => { e.originalEvent.stopPropagation(); setSelection({ kind: 'destination' }) }}
          >
            <button
              type="button"
              className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-risk rounded-full"
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
              onClick={(e) => { e.originalEvent.stopPropagation(); setSelection({ kind: 'sanctuary', data: s }) }}
            >
              <button
                type="button"
                aria-label={s.name ?? 'Sanctuary'}
                className="cursor-pointer block w-9 h-9 rounded-xl bg-brand-500 grid place-items-center text-white shadow-md ring-2 ring-white hover:scale-110 active:scale-95 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300"
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
              onClick={(e) => { e.originalEvent.stopPropagation(); setSelection({ kind: 'hazard', data: h }) }}
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

        {/* Single popup for whatever's currently selected */}
        {selection && <SelectionPopup selection={selection} onClose={() => setSelection(null)} />}
      </Map>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function SelectionPopup({ selection, onClose }: { selection: Selection; onClose: () => void }) {
  if (!selection) return null

  if (selection.kind === 'origin') {
    return (
      <Popup longitude={ORIGIN.lng} latitude={ORIGIN.lat} anchor="bottom" offset={28} onClose={onClose} closeOnClick={false} closeButton>
        <PopupCard title="Home" subtitle={ORIGIN.label.replace(/^Home — /, '')} />
      </Popup>
    )
  }
  if (selection.kind === 'destination') {
    return (
      <Popup longitude={DESTINATION.lng} latitude={DESTINATION.lat} anchor="bottom" offset={28} onClose={onClose} closeOnClick={false} closeButton>
        <PopupCard title="Destination" subtitle={DESTINATION.label} />
      </Popup>
    )
  }
  if (selection.kind === 'sanctuary') {
    const s = selection.data
    if (s.lat == null || s.lng == null) return null
    return (
      <Popup longitude={s.lng} latitude={s.lat} anchor="bottom" offset={20} onClose={onClose} closeOnClick={false} closeButton>
        <PopupCard
          title={s.name ?? 'Sanctuary'}
          subtitle={s.address ?? undefined}
          body={s.description ?? undefined}
          tag={s.is_open_now ? 'Open now' : 'Closed'}
          tagTone={s.is_open_now ? 'safe' : 'neutral'}
        />
      </Popup>
    )
  }
  // hazard
  const h = selection.data
  if (h.lat == null || h.lng == null) return null
  return (
    <Popup longitude={h.lng} latitude={h.lat} anchor="bottom" offset={18} onClose={onClose} closeOnClick={false} closeButton>
      <PopupCard
        title={h.title ?? 'Hazard'}
        subtitle={h.description ?? undefined}
        tag={h.status ?? undefined}
        tagTone={h.status === 'resolved' ? 'safe' : h.status === 'verified' ? 'warn' : 'warn'}
      />
    </Popup>
  )
}

function PopupCard({
  title, subtitle, body, tag, tagTone = 'neutral',
}: {
  title: string; subtitle?: string; body?: string;
  tag?: string; tagTone?: 'safe' | 'warn' | 'risk' | 'neutral'
}) {
  const tagBg =
    tagTone === 'safe' ? 'bg-emerald-100 text-emerald-800'
    : tagTone === 'warn' ? 'bg-amber-100 text-amber-800'
    : tagTone === 'risk' ? 'bg-red-100 text-red-800'
    : 'bg-neutral-100 text-neutral-700'
  return (
    <div className="px-1 pb-1 max-w-[200px]">
      <div className="flex items-start justify-between gap-2 mb-0.5">
        <p className="font-semibold text-sm leading-tight">{title}</p>
        {tag && <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${tagBg}`}>{tag}</span>}
      </div>
      {subtitle && <p className="text-xs text-neutral-500 leading-snug">{subtitle}</p>}
      {body && <p className="text-xs text-neutral-700 mt-1 leading-snug line-clamp-3">{body}</p>}
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
