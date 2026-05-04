import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import {
  Footprints, Shield, Radio, AlertTriangle,
  ChevronDown, ChevronUp, Coffee, Cross, Beer, Store, Lightbulb,
  Compass, Loader2, MapPin as MapPinIcon, BookOpen, X, Search, Info
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
  { id: 'nova-sbe', lat: 38.6775, lng: -9.3255, label: 'Nova SBE Carcavelos' },
  { id: 'carcavelos-st', lat: 38.6824, lng: -9.3331, label: 'Carcavelos Station' },
  { id: 'pingo-doce', lat: 38.6780, lng: -9.3250, label: 'Pingo Doce Nova SBE' },
  { id: 'cais-sodre', lat: 38.7060, lng: -9.1445, label: 'Cais do Sodré' },
  { id: 'santos', lat: 38.7065, lng: -9.1550, label: 'Santos' },
  { id: 'lx-factory', lat: 38.7035, lng: -9.1785, label: 'LX Factory' },
]

const ACTIVE_START_KEY = 'safestep:active_start'

export function MapPage() {
  const { coords, status: locationStatus } = useLocation()
  const [searchParams] = useSearchParams()
  const urlLat = searchParams.get('lat')
  const urlLng = searchParams.get('lng')
  const toLat = searchParams.get('toLat')
  const toLng = searchParams.get('toLng')
  const toLabel = searchParams.get('toLabel')

  // Derive initial values
  const getInitialOrigin = () => {
    // 1. URL params (direct navigation/routing)
    if (urlLat && urlLng) return { lat: Number(urlLat), lng: Number(urlLng), label: 'Your Current Location' }
    
    // 2. Persisted active start
    const saved = localStorage.getItem(ACTIVE_START_KEY)
    if (saved) return JSON.parse(saved) as LngLat

    // 3. Live GPS
    if (coords) return { ...coords, label: 'Your Current Location' }
    
    // 4. Default fallback
    return QUICK_START_POINTS[0]
  }

  const getInitialDestination = () => {
    if (toLat && toLng) return { lat: Number(toLat), lng: Number(toLng), label: toLabel ?? 'Destination' }
    return null
  }

  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [from, setFrom] = useState<LngLat | null>(getInitialOrigin())
  const [to, setTo] = useState<LngLat | null>(getInitialDestination())
  const [isChoosingStart, setIsChoosingStart] = useState(false)
  const [drawerExpanded, setDrawerExpanded] = useState(true)
  const [searchTrigger, setSearchTrigger] = useState(0)
  const [mapCenter, setMapCenter] = useState<LngLat | null>(null)

  // Persist "from" whenever it changes
  useEffect(() => {
    if (from) {
      localStorage.setItem(ACTIVE_START_KEY, JSON.stringify(from))
    }
  }, [from])

  // Sync if URL change or GPS enabled
  useEffect(() => {
    if (urlLat && urlLng) {
      setFrom({ lat: Number(urlLat), lng: Number(urlLng), label: 'Your Current Location' })
    } else if (coords && (!from || from.label === QUICK_START_POINTS[0].label)) {
      setFrom({ ...coords, label: 'Your Current Location' })
    }
    
    if (toLat && toLng) {
      setTo({ lat: Number(toLat), lng: Number(toLng), label: toLabel ?? 'Destination' })
      setDrawerExpanded(true)
    }
  }, [urlLat, urlLng, toLat, toLng, toLabel, coords])

  const handleUseCurrentLocation = () => {
    if (coords) {
      const newFrom = { ...coords, label: 'Your Current Location' }
      setFrom(newFrom)
      setMapCenter({ ...coords })
      setIsChoosingStart(false)
    } else {
      alert("Please enable location services in your browser settings to use this feature.")
    }
  }

  // Only calculate routes if both points are clearly selected
  const hasBothPoints = from && to && (from.lat !== to.lat || from.lng !== to.lng)
  const { 
    data: routes, 
    loading: routesLoading, 
    error: routesError, 
    provider: routingProvider 
  } = useRoutes(
    hasBothPoints ? from : null, 
    hasBothPoints ? to : null
  )

  const [selectedId, setSelectedId] = useState<RouteId>('safest')
  const [showLegend, setShowLegend] = useState(false)

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
          centerOverride={mapCenter ?? undefined}
        />

        {/* Floating search */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[520px] z-20 flex flex-col gap-2">
          <div className="bg-surface/98 backdrop-blur-md rounded-2xl border border-black/5 shadow-[var(--shadow-float)] overflow-hidden">
            <div className="p-3 flex items-center gap-3">
              {/* Start Input (Desktop) */}
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-100 cursor-pointer" onClick={() => setIsChoosingStart(true)}>
                <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-tight leading-none mb-0.5">Start</p>
                  <p className="text-[13px] text-[#14101c] font-medium truncate">{from?.label ?? 'Choose start...'}</p>
                </div>
              </div>
              
              <div className="w-px h-8 bg-neutral-200" />

              {/* Destination Input (Desktop) */}
              <div className="flex-[1.5] flex flex-col min-w-0">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-tight leading-none mb-0.5 ml-1">Destination</p>
                <SearchBar
                  destination={to as LngLat}
                  onDestinationChange={setTo}
                  className="p-0"
                  isMinimal
                  placeholder="Where to?"
                  triggerOpen={searchTrigger}
                />
              </div>
              
              <button 
                onClick={() => setShowLegend(v => !v)}
                className={cn(
                  "p-2 rounded-xl transition",
                  showLegend ? "bg-brand-100 text-brand-700" : "text-neutral-400 hover:bg-neutral-100"
                )}
                title="Legend"
              >
                <BookOpen size={20} />
              </button>
            </div>
          </div>

          {/* Location Picker Overlay (Desktop) */}
          {isChoosingStart && (
            <div className="bg-white rounded-2xl shadow-2xl border border-brand-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 bg-brand-50 border-b border-brand-100 flex items-center justify-between">
                <h3 className="font-bold text-brand-900 text-sm">Choose starting point</h3>
                <button onClick={() => setIsChoosingStart(false)} className="text-neutral-400 p-1 hover:bg-black/5 rounded-full transition">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-3 border-b border-neutral-100">
                <SearchBar
                  destination={from as LngLat}
                  onDestinationChange={(d) => { setFrom(d); setIsChoosingStart(false) }}
                  className="p-0 shadow-none border-neutral-200 bg-neutral-50 rounded-xl"
                  isMinimal
                  placeholder="Search start address..."
                />
              </div>

              <div className="p-2 grid grid-cols-2 gap-1 max-h-[40vh] overflow-y-auto">
                <button
                  onClick={handleUseCurrentLocation}
                  className="col-span-2 flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-left bg-white border border-brand-100 shadow-sm text-brand-700 font-bold hover:bg-brand-50 transition"
                >
                  <Compass size={18} className="text-brand-500" />
                  <div>
                    <p>Use my current location</p>
                    <p className="text-[10px] text-brand-400 uppercase tracking-tight">Immediate GPS Centering</p>
                  </div>
                </button>
                
                {QUICK_START_POINTS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setFrom(p); setIsChoosingStart(false) }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-left transition",
                      from?.label === p.label ? "bg-brand-50 text-brand-700 font-semibold" : "hover:bg-neutral-50 text-neutral-700"
                    )}
                  >
                    <MapPinIcon size={14} className={from?.label === p.label ? "text-brand-500" : "text-neutral-400"} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <ActionMenu from={from} destination={to} />

        <RouteOptionsCard
          routes={routes}
          loading={routesLoading}
          error={routesError}
          selectedId={selectedIdSafe}
          onSelect={setSelectedId}
          toSet={!!to}
          provider={routingProvider}
          onSearchClick={() => setSearchTrigger(v => v + 1)}
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
          centerOverride={mapCenter ?? undefined}
        />
        <div className="absolute top-3 inset-x-3 z-10 flex flex-col gap-2">
          {/* Dual Input Search Area */}
          <div className="bg-surface/98 backdrop-blur-md rounded-2xl border border-black/5 shadow-[var(--shadow-float)] overflow-hidden">
            <div className="p-3 flex flex-col gap-2">
              {/* Start Input */}
              <div className="flex items-center gap-3 px-2 py-1.5 bg-neutral-50 rounded-xl border border-neutral-100 group focus-within:border-brand-200 transition">
                <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mx-1" />
                <div className="flex-1 flex flex-col min-w-0">
                  <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider leading-none mb-0.5">Start</span>
                  <input
                    type="text"
                    readOnly
                    onClick={() => setIsChoosingStart(true)}
                    value={from?.label ?? ''}
                    placeholder="Where are you starting from?"
                    className="bg-transparent outline-none text-[13px] text-[#14101c] placeholder:text-neutral-400 cursor-pointer"
                  />
                </div>
                {from?.label === 'Your Current Location' && (
                  <Compass size={14} className="text-brand-500 animate-pulse shrink-0" />
                )}
              </div>

              {/* Destination Input */}
              <div className="flex items-center gap-3 px-2 py-1.5 bg-neutral-50 rounded-xl border border-neutral-100 group focus-within:border-brand-200 transition">
                <MapPinIcon size={14} className="text-rose-500 shrink-0 mx-0.5" />
                <div className="flex-1 flex flex-col min-w-0">
                  <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider leading-none mb-0.5">Destination</span>
                  <SearchBar
                    destination={to as LngLat}
                    onDestinationChange={(d) => { setTo(d); setDrawerExpanded(true) }}
                    className="p-0"
                    isMinimal
                    triggerOpen={searchTrigger}
                  />
                </div>
              </div>
            </div>
            
            {/* Quick Actions Bar */}
            <div className="px-3 pb-3 flex items-center justify-between border-t border-neutral-50 pt-2">
              <button 
                onClick={() => setShowLegend(v => !v)}
                className={cn(
                  "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tight px-2.5 py-1 rounded-full transition",
                  showLegend ? "bg-brand-100 text-brand-700" : "text-neutral-500 hover:bg-neutral-100"
                )}
              >
                <BookOpen size={12} /> Legend
              </button>
              
              <div className="flex items-center gap-2">
                {/* Location Status Bar (Mobile Inline) */}
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-tight transition shadow-sm border",
                  locationStatus === 'success' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                )}>
                  {locationStatus === 'success' ? (
                    <><MapPinIcon size={10} /> GPS On</>
                  ) : (
                    <><Info size={10} /> GPS Off</>
                  )}
                </div>

                <button 
                  onClick={() => setIsChoosingStart(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-[10px] font-bold uppercase tracking-tight hover:bg-brand-100 transition shadow-sm border border-brand-100"
                >
                  <MapPinIcon size={10} /> Change Start
                </button>
              </div>
            </div>
          </div>

          {/* Location Picker Overlay */}
          {isChoosingStart && (
            <div className="bg-white rounded-2xl shadow-2xl border border-brand-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 bg-brand-50 border-b border-brand-100 flex items-center justify-between">
                <h3 className="font-bold text-brand-900 text-sm">Where are you starting?</h3>
                <button onClick={() => setIsChoosingStart(false)} className="text-neutral-400 p-1 hover:bg-black/5 rounded-full transition">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-3 border-b border-neutral-100">
                <SearchBar
                  destination={from as LngLat}
                  onDestinationChange={(d) => { setFrom(d); setIsChoosingStart(false) }}
                  className="p-0 shadow-none border-neutral-200 bg-neutral-50 rounded-xl"
                  isMinimal
                  placeholder="Type starting point..."
                />
              </div>

              <div className="p-2 grid grid-cols-1 gap-1 max-h-[50vh] overflow-y-auto">
                <button
                  onClick={handleUseCurrentLocation}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-left bg-white border border-brand-100 shadow-sm text-brand-700 font-bold hover:bg-brand-50 transition"
                >
                  <Compass size={18} className="text-brand-500" />
                  <div>
                    <p>Use my current location</p>
                    <p className="text-[10px] text-brand-400 uppercase tracking-tight">Immediate GPS Centering</p>
                  </div>
                </button>
                
                <div className="px-3 pt-3 pb-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Quick Start Points</span>
                </div>

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
              </div>
            </div>
          )}
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
            <RouteOptionsHeader provider={routingProvider} />
            <RouteList
              routes={routes}
              loading={routesLoading}
              error={routesError}
              selectedId={selectedIdSafe}
              onSelect={setSelectedId}
              toSet={!!to}
              provider={routingProvider}
              onSearchClick={() => setSearchTrigger(v => v + 1)}
            />
            <div className="grid grid-cols-4 gap-2 mt-4">
              <ActionChip to="/walk"      icon={Footprints}     label="Walk"      from={from} destination={to} />
              <ActionChip to="/sanctuary" icon={Shield}         label="Sanctuary" from={from} />
              <ActionChip to="/mesh"       icon={Radio}          label="Mesh"      from={from} />
              <ActionChip to="/audit"      icon={AlertTriangle}  label="Report"    from={from} />
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
    <div className="flex flex-col items-center gap-1 shrink-0">
      <span className={cn('w-10 h-10 grid place-items-center rounded-lg text-white font-bold text-sm tabular-nums shadow-sm', bg)}>
        {score}
      </span>
      <span className="text-[8px] uppercase font-bold tracking-tighter text-neutral-400">Score</span>
    </div>
  )
}

const getScoreLabel = (score: number) => {
  if (score >= 90) return 'Very safe route'
  if (score >= 70) return 'Safer route'
  if (score >= 50) return 'Moderate safety'
  return 'Use caution'
}

function RouteRow({ r, active, onClick }: { r: Route; active: boolean; onClick: () => void }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <button
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 rounded-xl border p-3 text-left transition w-full',
          active ? 'bg-brand-50 border-brand-300 shadow-sm' : 'border-neutral-200 hover:bg-neutral-50',
        )}
      >
        <ScoreBadge score={r.score} tone={r.tone} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-[14px]">{r.label}</div>
            <span className={cn(
              "text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tight",
              r.tone === 'safe' ? "bg-emerald-100 text-emerald-700" : r.tone === 'warn' ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
            )}>
              {getScoreLabel(r.score)}
            </span>
          </div>
          <div className="text-xs text-neutral-500">{r.minutes} min · {r.km} km</div>
          {r.summary && <div className="text-[10px] text-brand-600 font-medium mt-0.5 line-clamp-1 italic">{r.summary}</div>}
        </div>
        <ChevronDown size={18} className={cn('text-neutral-400 transition', active && 'rotate-180 text-brand-500')} />
      </button>
      
      {active && (
        <div className="px-3 pb-3 -mt-2 pt-4 bg-white border border-t-0 border-brand-200 rounded-b-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 rounded-full bg-brand-500" />
              <p className="text-[11px] font-bold text-neutral-900">Why this score?</p>
            </div>
            <p className="text-[11px] text-neutral-600 leading-relaxed pl-3 italic border-l border-neutral-100">
              "This route has a {r.score}/100 safety rating. {r.summary}. It focuses on well-lit, active streets to maximize visibility."
            </p>
            <div className="flex gap-4 mt-1 pl-3">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-safe" />
                <span className="text-[9px] text-neutral-500">Safe Spot</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-warn" />
                <span className="text-[9px] text-neutral-500">Hazard</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionChip({ to, icon: Icon, label, from, destination }: { to: string; icon: React.ElementType; label: string; from?: LngLat | null; destination?: LngLat | null }) {
  let url = from ? `${to}?lat=${from.lat}&lng=${from.lng}&fromLabel=${encodeURIComponent(from.label ?? '')}` : to
  if (to === '/sanctuary') {
    url += (url.includes('?') ? '&' : '?') + 'mode=nearest'
  }
  if (to === '/walk' && destination) {
    url += (url.includes('?') ? '&' : '?') + `toLat=${destination.lat}&toLng=${destination.lng}&toLabel=${encodeURIComponent(destination.label ?? 'Destination')}`
  }
  return (
    <Link to={url} className="flex flex-col items-center gap-1 rounded-xl bg-brand-50 py-2.5 text-xs text-brand-700 hover:bg-brand-100 transition border border-brand-100/50">
      <Icon size={18} />
      {label}
    </Link>
  )
}

function RouteOptionsHeader({ provider }: { provider: string }) {
  const providerLabel = provider === 'ors' 
    ? 'OpenRouteService walking route' 
    : provider === 'osrm' 
      ? 'Prototype fallback route' 
      : ''

  return (
    <div className="flex flex-col mb-3">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[16px] font-medium text-[#14101c]">Route Options</h2>
        <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">Lisboa</span>
      </div>
      {providerLabel && (
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-wider mt-1",
          provider === 'ors' ? "text-emerald-600" : "text-amber-600"
        )}>
          {providerLabel}
        </span>
      )}
    </div>
  )
}

function RouteList({
  routes, loading, error, selectedId, onSelect, toSet, provider, onSearchClick
}: {
  routes: Route[] | null
  loading: boolean
  error: string | null
  selectedId: RouteId
  onSelect: (id: RouteId) => void
  toSet: boolean
  provider: string
  onSearchClick?: () => void
}) {
  if (!toSet) {
    return (
      <button 
        onClick={onSearchClick}
        className="w-full py-8 flex flex-col items-center text-center gap-3 bg-neutral-50/50 border-2 border-dashed border-neutral-100 rounded-2xl hover:bg-brand-50/50 hover:border-brand-100 transition-all"
      >
        <div className="w-12 h-12 bg-brand-50 rounded-2xl grid place-items-center text-brand-500 shadow-sm">
          <Search size={24} />
        </div>
        <div>
          <p className="font-bold text-neutral-900">Where are you going?</p>
          <p className="text-xs text-neutral-500 max-w-[200px] mx-auto leading-relaxed">Select a destination to find the safest walking routes for students.</p>
        </div>
      </button>
    )
  }
  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm p-3 font-medium">
          Routing failed. {error}
        </div>
        <div className="text-[10px] text-neutral-400 uppercase tracking-widest text-center">
          No routing available
        </div>
      </div>
    )
  }
  if (loading && !routes) {
    return (
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-[64px] rounded-xl bg-neutral-100 animate-pulse" />
        ))}
      </div>
    )
  }
  if (routes && routes.length === 0 && !loading) {
    return (
      <p className="text-sm text-neutral-500">No walking routes found between these points.</p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {provider === 'osrm' && import.meta.env.VITE_ORS_API_KEY && (
        <div className="px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl text-[11px] text-amber-700 leading-tight mb-1">
          <strong>OpenRouteService failed</strong> — using prototype fallback route.
        </div>
      )}
      {routes && routes.map(r => (
        <RouteRow key={r.id} r={r} active={selectedId === r.id} onClick={() => onSelect(r.id)} />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Desktop-only — Action menu (top-left floating)
   ───────────────────────────────────────────────────────────────────────── */

function ActionMenu({ from, destination }: { from?: LngLat | null, destination?: LngLat | null }) {
  const params = from ? `?lat=${from.lat}&lng=${from.lng}&fromLabel=${encodeURIComponent(from.label ?? '')}` : ''
  const destParams = destination ? `${params ? '&' : '?'}toLat=${destination.lat}&toLng=${destination.lng}&toLabel=${encodeURIComponent(destination.label ?? 'Destination')}` : ''

  const items: { to: string; icon: React.ElementType; label: string; sub: string }[] = [
    { to: `/walk${params}${destParams}`,                       icon: Footprints,     label: 'Start Walk',       sub: 'Begin guided navigation' },
    { to: `/sanctuary${params}${params ? '&' : '?'}mode=nearest`, icon: Shield,         label: 'Nearest Sanctuary', sub: 'Vetted safe places nearby' },
    { to: `/mesh${params}`,                       icon: Radio,          label: 'Guardian Mesh',     sub: 'Anonymous BLE network' },
    { to: `/audit${params}`,                      icon: AlertTriangle,  label: 'Report Hazard',     sub: 'Streetlight, blocked path…' },
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
  routes, loading, error, selectedId, onSelect, toSet, provider, onSearchClick
}: {
  routes: Route[] | null
  loading: boolean
  error: string | null
  selectedId: RouteId
  onSelect: (id: RouteId) => void
  toSet: boolean
  provider: string
  onSearchClick?: () => void
}) {
  return (
    <div className="absolute bottom-6 right-6 z-10 w-[340px]">
      <div className="rounded-2xl bg-surface/96 backdrop-blur-md border border-black/5 p-4 shadow-[var(--shadow-float)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <h2 className="font-display text-[15px] font-medium text-[#14101c]">Route Options</h2>
              <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">Lisboa</span>
            </div>
            {provider !== 'none' && !loading && (
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-wider mt-0.5",
                provider === 'ors' ? "text-emerald-600" : "text-amber-600"
              )}>
                {provider === 'ors' ? 'OpenRouteService walking route' : 'Prototype fallback route'}
              </span>
            )}
          </div>
          {loading && <Loader2 size={14} className="text-neutral-400 animate-spin" />}
        </div>
        <RouteList
          routes={routes}
          loading={loading}
          error={error}
          selectedId={selectedId}
          onSelect={onSelect}
          toSet={toSet}
          provider={provider}
          onSearchClick={onSearchClick}
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
