import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import {
  Footprints, Shield, Radio, AlertTriangle,
  ChevronDown, ChevronUp, Coffee, Cross, Beer, Store, Lightbulb,
  Compass, Loader2, MapPin as MapPinIcon,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { MapView } from '@/components/MapView'
import { SearchBar } from '@/components/SearchBar'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { useLocation } from '@/lib/useLocation'
import {
  useRoutes, DEFAULT_DESTINATION,
  type LngLat, type RouteId, type Route,
} from '@/data/routes'

const QUICK_START_POINTS: (LngLat & { id: string })[] = [
  { id: 'nova-sbe', lat: 38.6781, lng: -9.3262, label: 'Nova SBE Carcavelos' },
  { id: 'carcavelos-st', lat: 38.6824, lng: -9.3331, label: 'Carcavelos Station' },
  { id: 'cais-sodre', lat: 38.7060, lng: -9.1445, label: 'Cais do Sodré' },
  { id: 'santos', lat: 38.7065, lng: -9.1550, label: 'Santos' },
]

export function MapPage() {
  const { coords } = useLocation()
  const [searchParams] = useSearchParams()
  const urlLat = searchParams.get('lat')
  const urlLng = searchParams.get('lng')
  const toLat = searchParams.get('toLat')
  const toLng = searchParams.get('toLng')
  const toLabel = searchParams.get('toLabel')

  // Derive initial values
  const getInitialOrigin = () => {
    if (urlLat && urlLng) return { lat: Number(urlLat), lng: Number(urlLng), label: 'Your Current Location' }
    // Default to Nova SBE for the demo
    return QUICK_START_POINTS[0]
  }

  const getInitialDestination = () => {
    if (toLat && toLng) return { lat: Number(toLat), lng: Number(toLng), label: toLabel ?? 'Destination' }
    return DEFAULT_DESTINATION
  }

  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [from, setFrom] = useState<LngLat | null>(getInitialOrigin())
  const [to, setTo] = useState<LngLat | null>(getInitialDestination())
  const [isChoosingStart, setIsChoosingStart] = useState(false)

  // Sync if URL change
  useEffect(() => {
    if (urlLat && urlLng) {
      setFrom({ lat: Number(urlLat), lng: Number(urlLng), label: 'Your Current Location' })
    }
    
    if (toLat && toLng) {
      setTo({ lat: Number(toLat), lng: Number(toLng), label: toLabel ?? 'Destination' })
    }
  }, [urlLat, urlLng, toLat, toLng, toLabel])

  const [selectedId, setSelectedId] = useState<RouteId>('safest')
  const [showLegend, setShowLegend] = useState(false)
  const [drawerExpanded, setDrawerExpanded] = useState(true)
  const { data: routes, loading: routesLoading, error: routesError } = useRoutes(from, to)

  // If the chosen route disappears (e.g. fewer alternatives returned) fall back.
  const routeById = (id: RouteId) => routes?.find(r => r.id === id)
  const selectedRoute = routeById(selectedId) ?? routes?.[0]
  const selectedIdSafe = selectedRoute?.id ?? 'safest'

  /* ───────────────────────── DESKTOP ───────────────────────── */
  if (isDesktop) {
    return (
      <div className="relative h-full">
        <MapView
          routes={routes ?? []}
          selectedRouteId={selectedIdSafe}
          from={from ?? undefined}
          to={to ?? undefined}
          onGetDirections={(lat, lng, label) => {
            setTo({ lat, lng, label })
          }}
        />

        {/* Floating search */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[520px] z-20">
          <SearchBar
            destination={to as LngLat}
            onDestinationChange={setTo}
            onLegendClick={() => setShowLegend(v => !v)}
            legendActive={showLegend}
          />
        </div>

        <ActionMenu />

        <RouteOptionsCard
          routes={routes}
          loading={routesLoading}
          error={routesError}
          selectedId={selectedIdSafe}
          onSelect={setSelectedId}
        />

        {showLegend && <LegendCard onClose={() => setShowLegend(false)} />}
      </div>
    )
  }

  /* ───────────────────────── MOBILE ────────────────────────── */
  return (
    <div className={cn(
      'grid h-full transition-[grid-template-rows] duration-200',
      drawerExpanded ? 'grid-rows-[2fr_3fr]' : 'grid-rows-[5fr_auto]',
    )}>
      <div className="relative">
        <MapView
          routes={routes ?? []}
          selectedRouteId={selectedIdSafe}
          from={from ?? undefined}
          to={to ?? undefined}
          onSelectionChange={(has) => { if (has) setDrawerExpanded(false) }}
          onGetDirections={(lat, lng, label) => {
            setTo({ lat, lng, label })
            setDrawerExpanded(true)
          }}
        />
        <div className="absolute top-3 inset-x-3 z-10 flex flex-col gap-2">
          <SearchBar
            destination={to as LngLat}
            onDestinationChange={(d) => { setTo(d); setDrawerExpanded(true) }}
            onLegendClick={() => setShowLegend(v => !v)}
            legendActive={showLegend}
          />
          
          {/* Starting Point Selector */}
          <div className="flex flex-col gap-1.5">
            <button 
              onClick={() => setIsChoosingStart(v => !v)}
              className="flex items-center justify-between gap-2 px-3 py-2 bg-white rounded-xl text-xs font-semibold shadow-sm border border-neutral-200 w-full active:bg-neutral-50"
            >
              <div className="flex items-center gap-2 truncate">
                <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                <span className="text-neutral-500 font-medium">From:</span>
                <span className="truncate text-neutral-900">{from?.label}</span>
              </div>
              <ChevronDown size={14} className={cn("text-neutral-400 transition", isChoosingStart && "rotate-180")} />
            </button>

            {isChoosingStart && (
              <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 grid grid-cols-1 gap-1">
                  {QUICK_START_POINTS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setFrom(p); setIsChoosingStart(false) }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition",
                        from?.label === p.label ? "bg-brand-50 text-brand-700 font-semibold" : "hover:bg-neutral-50 text-neutral-700"
                      )}
                    >
                      <MapPinIcon size={16} className={from?.label === p.label ? "text-brand-500" : "text-neutral-400"} />
                      {p.label}
                    </button>
                  ))}
                  <div className="h-px bg-neutral-100 my-1" />
                  <button
                    onClick={() => {
                      if (coords) {
                        setFrom({ ...coords, label: 'Your Current Location' })
                      } else {
                        // If no GPS, we just close and maybe show a hint
                        alert("Please enable location services in your browser settings.")
                      }
                      setIsChoosingStart(false)
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-neutral-50 text-neutral-700"
                  >
                    <Compass size={16} className="text-brand-500" />
                    <div>
                      <p className="font-medium">Use my current location</p>
                      <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-tight">Beta Flow</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {!from && !routesLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 grid place-items-center p-8 text-center">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-neutral-100 max-w-xs">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl grid place-items-center mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Location Required</h3>
              <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
                We could not access your current location. Please enable location or choose a starting point manually.
              </p>
              <button 
                onClick={() => setFrom({ ...DEFAULT_DESTINATION, label: 'Manual Start' })}
                className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold active:scale-95 transition"
              >
                Set manual start
              </button>
            </div>
          </div>
        )}
        
        {showLegend && <LegendCard onClose={() => setShowLegend(false)} compact />}
      </div>

      <div className="bg-white border-t border-neutral-200 flex flex-col overflow-hidden">
        <button
          onClick={() => setDrawerExpanded(v => !v)}
          className="py-2 flex flex-col items-center text-neutral-400 hover:text-neutral-600"
          aria-label={drawerExpanded ? 'Collapse route options' : 'Expand route options'}
        >
          <span className="w-10 h-1 bg-neutral-300 rounded-full" aria-hidden="true" />
          <span className="text-xs mt-1 inline-flex items-center gap-1">
            {drawerExpanded ? <>Hide <ChevronDown size={12} /></> : <>Route Options <ChevronUp size={12} /></>}
          </span>
        </button>

        {drawerExpanded && (
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <RouteOptionsHeader />
            <RouteList
              routes={routes}
              loading={routesLoading}
              error={routesError}
              selectedId={selectedIdSafe}
              onSelect={setSelectedId}
            />
            <div className="grid grid-cols-4 gap-2 mt-4">
              <ActionChip to="/walk"     icon={Footprints}     label="Walk" />
              <ActionChip to="/sanctuary" icon={Shield}         label="Sanctuary" />
              <ActionChip to="/mesh"      icon={Radio}          label="Mesh" />
              <ActionChip to="/audit"     icon={AlertTriangle}  label="Report" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Shared building blocks
   ───────────────────────────────────────────────────────────────────────── */

function ScoreBadge({ score, tone }: { score: number; tone: 'safe' | 'warn' | 'risk' }) {
  const bg = tone === 'safe' ? 'bg-safe' : tone === 'warn' ? 'bg-warn' : 'bg-risk'
  return (
    <span className={cn('w-10 h-10 grid place-items-center rounded-lg text-white font-bold text-sm tabular-nums', bg)}>
      {score}
    </span>
  )
}

function RouteRow({ r, active, onClick }: { r: Route; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-xl border p-3 text-left transition w-full',
        active ? 'bg-brand-50 border-brand-300 shadow-sm' : 'border-neutral-200 hover:bg-neutral-50',
      )}
    >
      <ScoreBadge score={r.score} tone={r.tone} />
      <div className="flex-1">
        <div className="font-semibold text-[14px]">{r.label}</div>
        <div className="text-xs text-neutral-500">{r.minutes} min · {r.km} km</div>
        {r.summary && <div className="text-[10px] text-brand-600 font-medium mt-0.5 line-clamp-1 italic">{r.summary}</div>}
      </div>
      <ChevronDown size={18} className={cn('text-neutral-400 transition', active && 'rotate-180 text-brand-500')} />
    </button>
  )
}

function ActionChip({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1 rounded-xl bg-brand-50 py-2.5 text-xs text-brand-700 hover:bg-brand-100 transition">
      <Icon size={18} />
      {label}
    </Link>
  )
}

function RouteOptionsHeader() {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <h2 className="font-display text-[16px] font-medium text-[#14101c]">Route Options</h2>
      <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">Lisboa</span>
    </div>
  )
}

function RouteList({
  routes, loading, error, selectedId, onSelect,
}: {
  routes: Route[] | null
  loading: boolean
  error: string | null
  selectedId: RouteId
  onSelect: (id: RouteId) => void
}) {
  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm p-3">
        Couldn't get routes. {error}
      </div>
    )
  }
  if (loading || !routes) {
    return (
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-[64px] rounded-xl bg-neutral-100 animate-pulse" />
        ))}
      </div>
    )
  }
  if (routes.length === 0) {
    return (
      <p className="text-sm text-neutral-500">No routes found between these points.</p>
    )
  }
  return (
    <div className="flex flex-col gap-2">
      {routes.map(r => (
        <RouteRow key={r.id} r={r} active={selectedId === r.id} onClick={() => onSelect(r.id)} />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Desktop-only — Action menu (top-left floating)
   ───────────────────────────────────────────────────────────────────────── */

function ActionMenu() {
  const items: { to: string; icon: React.ElementType; label: string; sub: string }[] = [
    { to: '/walk',      icon: Footprints,     label: 'Start Walk',       sub: 'Begin guided navigation' },
    { to: '/sanctuary', icon: Shield,         label: 'Nearest Sanctuary', sub: 'Vetted safe places nearby' },
    { to: '/mesh',      icon: Radio,          label: 'Guardian Mesh',     sub: 'Anonymous BLE network' },
    { to: '/audit',     icon: AlertTriangle,  label: 'Report Hazard',     sub: 'Streetlight, blocked path…' },
  ]
  return (
    <div className="absolute top-20 left-4 z-10 w-[260px]">
      <div className="rounded-2xl bg-surface/95 backdrop-blur-md border border-black/5 overflow-hidden shadow-[var(--shadow-float)]">
        <div className="px-4 pt-3 pb-2 flex items-center gap-2 border-b border-black/5">
          <Compass size={14} className="text-brand-500" />
          <span className="font-display text-[13px] tracking-wide text-[#14101c]">Quick actions</span>
        </div>
        <ul>
          {items.map((it) => (
            <li key={it.to}>
              <Link to={it.to} className="group flex items-center gap-3 px-4 py-3 hover:bg-brand-50/60 transition">
                <span className="w-8 h-8 rounded-lg bg-brand-50 group-hover:bg-brand-100 grid place-items-center text-brand-600 transition">
                  <it.icon size={16} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-medium text-[#14101c] truncate">{it.label}</span>
                  <span className="block text-[11px] text-neutral-500 truncate">{it.sub}</span>
                </span>
                <ChevronDown size={14} className="-rotate-90 text-neutral-300 group-hover:text-brand-500 transition" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Desktop-only — Route Options card (bottom-right floating)
   ───────────────────────────────────────────────────────────────────────── */

function RouteOptionsCard({
  routes, loading, error, selectedId, onSelect,
}: {
  routes: Route[] | null
  loading: boolean
  error: string | null
  selectedId: RouteId
  onSelect: (id: RouteId) => void
}) {
  return (
    <div className="absolute bottom-6 right-6 z-10 w-[340px]">
      <div className="rounded-2xl bg-surface/96 backdrop-blur-md border border-black/5 p-4 shadow-[var(--shadow-float)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <h2 className="font-display text-[15px] font-medium text-[#14101c]">Route Options</h2>
            <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">Lisboa</span>
          </div>
          {loading && <Loader2 size={14} className="text-neutral-400 animate-spin" />}
        </div>
        <RouteList
          routes={routes}
          loading={loading}
          error={error}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Legend card
   ───────────────────────────────────────────────────────────────────────── */

function LegendCard({ onClose, compact = false }: { onClose: () => void; compact?: boolean }) {
  return (
    <div
      className={cn(
        'z-10 bg-surface rounded-2xl border border-black/5 p-4 text-xs',
        compact
          ? 'absolute top-16 right-3 w-56 shadow-lg'
          : 'absolute top-20 right-4 w-72 shadow-[var(--shadow-float)]',
      )}
    >
      <div className="flex items-center justify-between mb-2.5">
        <p className="font-display text-[13px] font-medium text-[#14101c]">Legend</p>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-700 -mr-1 -mt-1 w-6 h-6 rounded-full grid place-items-center hover:bg-neutral-100 transition"
          aria-label="Close legend"
        >
          ×
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        <LegendRow color="bg-gradient-to-br from-brand-500 to-brand-700" icon={Coffee} label="Café · sanctuary" />
        <LegendRow color="bg-gradient-to-br from-brand-500 to-brand-700" icon={Cross}  label="Pharmacy · sanctuary" />
        <LegendRow color="bg-gradient-to-br from-brand-500 to-brand-700" icon={Beer}   label="Bar · sanctuary" />
        <LegendRow color="bg-gradient-to-br from-brand-500 to-brand-700" icon={Store}  label="Store · sanctuary" />
        <LegendRow color="bg-warn"                                         icon={Lightbulb} label="Hazard report" />
      </ul>
      <p className="mt-3 text-neutral-500 leading-relaxed">
        The soft purple ring is the ~80m sanctuary radius — within it you're inside a
        verified safe zone.
      </p>
    </div>
  )
}

function LegendRow({ color, icon: Icon, label }: { color: string; icon: React.ElementType; label: string }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className={cn('w-7 h-7 rounded-lg grid place-items-center text-white shadow-sm shrink-0', color)}>
        <Icon size={13} />
      </span>
      <span className="text-[13px] text-neutral-700">{label}</span>
    </li>
  )
}
