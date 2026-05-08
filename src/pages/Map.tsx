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
  useRoutes, getRouteColor,
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
  const { coords, status: locationStatus, requestLocation } = useLocation()
  const [searchParams] = useSearchParams()
  const urlLat = searchParams.get('lat')
  const urlLng = searchParams.get('lng')
  const toLat = searchParams.get('toLat')
  const toLng = searchParams.get('toLng')
  const toLabel = searchParams.get('toLabel')

  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [from, setFrom] = useState<LngLat | null>(() => {
    if (urlLat && urlLng) return { lat: Number(urlLat), lng: Number(urlLng), label: 'Your Current Location' }
    const saved = localStorage.getItem(ACTIVE_START_KEY)
    if (saved) return JSON.parse(saved)
    return null
  })
  
  const [to, setTo] = useState<LngLat | null>(() => {
    if (toLat && toLng) return { lat: Number(toLat), lng: Number(toLng), label: toLabel ?? 'Destination' }
    return null
  })

  const [isChoosingStart, setIsChoosingStart] = useState(false)
  const [drawerExpanded, setDrawerExpanded] = useState(!!(toLat && toLng))
  const [searchTrigger, setSearchTrigger] = useState(0)
  const [mapCenter, setMapCenter] = useState<LngLat | null>(() => {
    if (urlLat && urlLng) return { lat: Number(urlLat), lng: Number(urlLng) }
    const saved = localStorage.getItem(ACTIVE_START_KEY)
    if (saved) return JSON.parse(saved)
    return null
  })

  // Auto-request location if we have a destination but no start
  useEffect(() => {
    if (to && !from && locationStatus === 'prompt') {
      requestLocation()
    }
  }, [to, from, locationStatus, requestLocation])

  // Initial mount sync - location hook fallback
  useEffect(() => {
    if (!from && coords) {
      const newFrom = { ...coords, label: 'Your Current Location' }
      setFrom(newFrom)
      setMapCenter({ ...coords })
    }
  }, [coords])

  // React to live GPS updates
  useEffect(() => {
    if (coords && (from?.label === 'Your Current Location' || !from)) {
      const newFrom = { ...coords, label: 'Your Current Location' }
      setFrom(newFrom)
      localStorage.setItem(ACTIVE_START_KEY, JSON.stringify(newFrom))
      // Only fly to location once when it first becomes available
      if (!mapCenter) setMapCenter({ ...coords })
    }
  }, [coords])

  const handleUseCurrentLocation = () => {
    if (locationStatus === 'prompt') {
      requestLocation()
      return
    }
    
    if (coords) {
      const newFrom = { ...coords, label: 'Your Current Location' }
      setFrom(newFrom)
      setMapCenter({ ...coords })
      setIsChoosingStart(false)
    } else {
      alert("Location services are unavailable. Please check your browser permissions.")
    }
  }

  // Persist "from" whenever it changes manually
  useEffect(() => {
    if (from) {
      localStorage.setItem(ACTIVE_START_KEY, JSON.stringify(from))
    }
  }, [from])

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

  const [selectedId, setSelectedId] = useState<RouteId>('safer')
  const [showLegend, setShowLegend] = useState(false)

  // If the chosen route disappears (e.g. fewer alternatives returned) fall back.
  const routeById = (id: RouteId) => routes?.find(r => r.id === id)
  const selectedRoute = routeById(selectedId) ?? routes?.[0]
  const selectedIdSafe = selectedRoute?.id ?? 'safer'

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

        {/* Universal Floating Search Area */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[520px] z-50 flex flex-col gap-2">
          <div className="bg-surface/98 backdrop-blur-md rounded-2xl border border-black/5 shadow-[var(--shadow-float)]">
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
                  isMinimal={false}
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
            <div className="bg-white rounded-2xl shadow-2xl border border-brand-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
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
                  isMinimal={false}
                  placeholder="Search start address..."
                />
              </div>

              <div className="p-2 grid grid-cols-2 gap-1 max-h-[40vh] overflow-y-auto">
                {/* Issue 1: Only show 'Use current location' if it's not already the active origin or if GPS is not yet active */}
                {(from?.label !== 'Your Current Location' || locationStatus !== 'success') && (
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
                )}
                
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

        {to && (
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
        )}

        {showLegend && <LegendCard onClose={() => setShowLegend(false)} />}
      </div>
    )
  }

  /* ───────────────────────── MOBILE ────────────────────────── */
  return (
    <div className="relative h-full overflow-hidden flex flex-col">
      <div className="flex-1 relative">
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
        
        {/* Ultra-Compact Floating Search Area */}
        <div className="absolute top-2 inset-x-2 z-50 flex flex-col gap-1">
          <div className="bg-white/95 backdrop-blur-md rounded-lg border border-neutral-100 shadow-sm">
            <div className="p-0.5 flex flex-col gap-0">
              {/* Start Input (Minimal) */}
              <button
                onClick={() => setIsChoosingStart(true)}
                className="flex items-center gap-2 px-2 py-0.5 bg-neutral-50/30 rounded-t-lg text-left transition"
              >
                <div className="w-1 h-1 rounded-full bg-brand-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-neutral-400 font-medium truncate uppercase tracking-tighter">
                    {from?.label === 'Your Current Location' ? 'My Current Location' : (from?.label ?? 'From...')}
                  </div>
                </div>
              </button>

              <div className="h-px bg-neutral-100 mx-1" />

              {/* Destination Input (Minimal) */}
              <div className="flex items-center gap-2 px-2 py-0.5 transition">
                <MapPinIcon size={10} className="text-brand-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <SearchBar
                    destination={to as LngLat}
                    onDestinationChange={(d) => { setTo(d); setDrawerExpanded(true) }}
                    className="p-0 text-[12px] h-7"
                    isMinimal={true}
                    placeholder="Where to?"
                    triggerOpen={searchTrigger}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Picker Overlay (Overlaying the map) */}
          {isChoosingStart && (
            <div className="bg-white rounded-xl shadow-2xl border border-brand-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
              <div className="p-2.5 bg-brand-50 border-b border-brand-100 flex items-center justify-between">
                <h3 className="font-bold text-brand-900 text-xs uppercase tracking-wider">Starting point</h3>
                <button onClick={() => setIsChoosingStart(false)} className="text-neutral-400 p-1 hover:bg-black/5 rounded-full transition">
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-2 border-b border-neutral-100">
                <SearchBar
                  destination={from as LngLat}
                  onDestinationChange={(d) => { setFrom(d); setIsChoosingStart(false) }}
                  className="p-0 shadow-none border-neutral-200 bg-neutral-50 rounded-lg"
                  isMinimal={true}
                  placeholder="Type starting point..."
                />
              </div>

              <div className="p-1 flex flex-col gap-0.5 max-h-[35vh] overflow-y-auto">
                <button
                  onClick={handleUseCurrentLocation}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-left bg-white border border-brand-100 shadow-sm text-brand-700 font-bold hover:bg-brand-50 transition"
                >
                  <Compass size={16} className="text-brand-500" />
                  <div>
                    <p className="text-[11px]">Use current location</p>
                    <p className="text-[8px] text-brand-400 uppercase tracking-tight font-normal">GPS Centering</p>
                  </div>
                </button>
                
                {QUICK_START_POINTS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setFrom(p); setIsChoosingStart(false) }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-1.5 rounded-lg text-[11px] text-left transition",
                      from?.label === p.label ? "bg-brand-50 text-brand-700 font-semibold" : "hover:bg-neutral-50 text-neutral-700"
                    )}
                  >
                    <MapPinIcon size={12} className={from?.label === p.label ? "text-brand-500" : "text-neutral-400"} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {!from && !routesLoading && (
          <div className="absolute top-24 inset-x-4 z-20 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-brand-100 max-w-[200px] mx-auto pointer-events-auto">
              <p className="text-[10px] font-bold text-brand-600 text-center uppercase tracking-wider">Set starting point</p>
              <p className="text-[9px] text-neutral-500 text-center mt-0.5 mb-2">Enable GPS to see your safest route.</p>
              <button 
                onClick={() => handleUseCurrentLocation()}
                className="w-full py-1.5 bg-brand-600 text-white rounded-lg text-[10px] font-bold active:scale-95 transition"
              >
                Use My Location
              </button>
            </div>
          </div>
        )}
        
        {showLegend && <LegendCard onClose={() => setShowLegend(false)} compact />}
        
        {/* Compact Bottom UI for Map (GPS/Legend) */}
        {!to && (
          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
            <button 
              onClick={() => setShowLegend(v => !v)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors border",
                showLegend ? "bg-brand-500 text-white border-brand-600" : "bg-white text-neutral-600 border-neutral-200"
              )}
            >
              <BookOpen size={18} />
            </button>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shadow-lg border text-[9px] font-bold",
              locationStatus === 'success' ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"
            )}>
              {locationStatus === 'success' ? 'GPS' : 'OFF'}
            </div>
          </div>
        )}
      </div>

      {/* Route Options Drawer (Only if destination selected) */}
      {to && (
        <div className={cn(
          "bg-white border-t border-neutral-100 flex flex-col transition-all duration-300 ease-in-out shadow-[0_-8px_30px_rgb(0,0,0,0.06)]",
          drawerExpanded ? "h-[45vh]" : "h-auto"
        )}>
          <button
            onClick={() => setDrawerExpanded(v => !v)}
            className="py-1 flex flex-col items-center text-neutral-200 hover:text-neutral-400"
            aria-label={drawerExpanded ? 'Collapse route options' : 'Expand route options'}
          >
            <span className="w-6 h-0.5 bg-neutral-100 rounded-full" aria-hidden="true" />
          </button>

          {drawerExpanded ? (
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <RouteOptionsHeader provider={routingProvider} />
                <button 
                  onClick={() => setShowLegend(v => !v)}
                  className={cn(
                    "p-1 rounded-lg border transition-colors",
                    showLegend ? "bg-brand-50 text-brand-600 border-brand-200" : "bg-neutral-50 text-neutral-400 border-neutral-100"
                  )}
                >
                  <BookOpen size={14} />
                </button>
              </div>
              <RouteList
                routes={routes}
                loading={routesLoading}
                error={routesError}
                selectedId={selectedIdSafe}
                onSelect={(id) => {
                  setSelectedId(id)
                  setDrawerExpanded(false)
                }}
                toSet={!!to}
                provider={routingProvider}
                onSearchClick={() => setSearchTrigger(v => v + 1)}
              />
            </div>
          ) : (
            <div className="px-3 py-1.5 flex items-center justify-between">
              {selectedRoute ? (
                <div className="flex items-center gap-2 flex-1">
                  <div 
                    className="w-8 h-8 rounded-lg grid place-items-center font-bold text-[11px] shadow-sm"
                    style={{ 
                      backgroundColor: getRouteColor(selectedRoute.score),
                      color: selectedRoute.score >= 70 ? '#2e1065' : '#ffffff' 
                    }}
                  >
                    {selectedRoute.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[11px] text-neutral-900 truncate">
                      {selectedRoute.label}
                    </div>
                    <div className="text-[9px] text-neutral-500 font-medium">
                      {selectedRoute.minutes} min · {selectedRoute.km} km
                    </div>
                  </div>
                  <button
                    onClick={() => setDrawerExpanded(true)}
                    className="px-2 py-1 bg-brand-50 text-brand-700 rounded-lg text-[9px] font-bold uppercase tracking-tight border border-brand-100 active:scale-95 transition"
                  >
                    Details
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Routes</span>
                </div>
              )}
              <button 
                onClick={() => setDrawerExpanded(true)}
                className="p-1 text-neutral-300 ml-1"
              >
                <ChevronUp size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Shared building blocks
   ───────────────────────────────────────────────────────────────────────── */

function ScoreBadge({ score }: { score: number }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const bgColor = getRouteColor(score)
  // Higher score = lighter background -> dark text
  // Lower score = darker background -> white text
  const textColor = score >= 70 ? 'text-brand-950' : 'text-white'
  
  return (
    <div className="flex flex-col items-center gap-0.5 shrink-0">
      <span 
        className={cn(
          'grid place-items-center rounded-lg font-bold tabular-nums shadow-sm', 
          isDesktop ? 'w-10 h-10 text-sm' : 'w-9 h-9 text-[13px]',
          textColor
        )}
        style={{ backgroundColor: bgColor }}
      >
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
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [showWhy, setShowWhy] = useState(isDesktop)

  // Collapse explanation when switching routes on mobile
  useEffect(() => {
    if (!isDesktop) setShowWhy(false)
  }, [active, isDesktop])

  const providerLabel = r.provider === 'ors' ? 'OpenRouteService' : 'Prototype'

  return (
    <div className="flex flex-col gap-1 w-full">
      <button
        onClick={onClick}
        className={cn(
          'flex items-center rounded-xl border text-left transition w-full',
          isDesktop ? 'gap-3 p-3' : 'gap-2 p-2',
          active ? 'bg-brand-50 border-brand-300 shadow-sm' : 'border-neutral-200 hover:bg-neutral-50',
        )}
      >
        <ScoreBadge score={r.score} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className={cn("font-semibold", isDesktop ? "text-[14px]" : "text-[13px]")}>{r.label}</div>
            <span className={cn(
              "px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tight",
              isDesktop ? "text-[9px]" : "text-[8px]",
              r.score >= 90 ? "bg-brand-100 text-brand-700" : 
              r.score >= 70 ? "bg-brand-200 text-brand-800" : 
              "bg-brand-300 text-brand-900"
            )}>
              {getScoreLabel(r.score)}
            </span>
          </div>
          <div className={cn("text-neutral-500", isDesktop ? "text-xs" : "text-[11px]")}>
            {r.minutes} min · {r.km} km
            <span className="mx-1.5 text-neutral-300">·</span>
            <span className="font-medium text-brand-600 uppercase text-[9px] tracking-wider">{providerLabel}</span>
          </div>
          {isDesktop && r.summary && <div className="text-[10px] text-brand-600 font-medium mt-0.5 line-clamp-1 italic">{r.summary}</div>}
        </div>
        <ChevronDown size={isDesktop ? 18 : 16} className={cn('text-neutral-400 transition', active && 'rotate-180 text-brand-500')} />
      </button>
      
      {active && (
        <div className="px-3 pb-3 -mt-2 pt-4 bg-white border border-t-0 border-brand-200 rounded-b-xl animate-in slide-in-from-top-2 duration-200">
          {!showWhy ? (
            <button 
              onClick={(e) => { e.stopPropagation(); setShowWhy(true) }}
              className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 px-1 py-0.5 rounded hover:bg-brand-50 transition"
            >
              <Info size={14} />
              Why this score?
            </button>
          ) : (
            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => setShowWhy(false)}
                className="flex items-center gap-2 text-left"
              >
                <div className="w-1 h-3 rounded-full bg-brand-500" />
                <p className="text-[11px] font-bold text-neutral-900">Why this score?</p>
                <ChevronUp size={12} className="text-neutral-400" />
              </button>
              
              <div className="space-y-2 pl-3 border-l-2 border-brand-100">
                <p className="text-[11px] text-neutral-600 leading-relaxed italic">
                  "This route has a <strong>{r.score}/100</strong> safety rating. {r.summary}"
                </p>
                <div className="space-y-1.5">
                  <p className="text-[10px] text-neutral-500 leading-normal">
                    The score is an automated estimate based on:
                  </p>
                  <ul className="text-[10px] text-neutral-500 space-y-1 ml-1">
                    <li className="flex items-start gap-1.5">
                      <Shield size={10} className="text-brand-500 mt-0.5 shrink-0" />
                      <span><strong>Verified Sanctuaries:</strong> Trusted, vetted safe spots.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Coffee size={10} className="text-brand-400 mt-0.5 shrink-0" />
                      <span><strong>Candidate Spots:</strong> Public places still needing verification.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <AlertTriangle size={10} className="text-brand-300 mt-0.5 shrink-0" />
                      <span><strong>Reported Hazards:</strong> Known issues like poor lighting.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-brand-50 p-2 rounded-lg border border-brand-100 mt-1">
                  <p className="text-[9px] text-brand-700 font-medium leading-tight">
                    <strong>Note:</strong> This is a prototype safety estimate, not a guarantee of safety. Always stay aware of your surroundings.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-1 pl-3">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  <span className="text-[9px] text-neutral-500">Safe Spot</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-300" />
                  <span className="text-[9px] text-neutral-500">Hazard</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RouteOptionsHeader({ provider }: { provider: string }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const providerLabel = provider === 'ors' 
    ? 'OpenRouteService walking route' 
    : provider === 'osrm' 
      ? 'Prototype fallback route' 
      : ''

  return (
    <div className={cn("flex flex-col", isDesktop ? "mb-3" : "mb-1.5")}>
      <div className="flex items-baseline justify-between">
        <h2 className={cn("font-display font-medium text-[#14101c]", isDesktop ? "text-[16px]" : "text-[14px]")}>Route Options</h2>
        {isDesktop && <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">Lisboa</span>}
      </div>
      {providerLabel && (
        <span className={cn(
          "font-bold uppercase tracking-wider",
          isDesktop ? "text-[10px] mt-1" : "text-[8px] mt-0.5",
          provider === 'ors' ? "text-brand-600" : "text-brand-400"
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
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (!toSet) {
    return (
      <button 
        onClick={onSearchClick}
        className={cn(
          "w-full flex flex-col items-center text-center gap-2 bg-neutral-50/50 border-2 border-dashed border-neutral-100 rounded-2xl hover:bg-brand-50/50 hover:border-brand-100 transition-all",
          isDesktop ? "py-8" : "py-5"
        )}
      >
        <div className={cn("bg-brand-50 rounded-2xl grid place-items-center text-brand-500 shadow-sm", isDesktop ? "w-12 h-12" : "w-10 h-10")}>
          <Search size={isDesktop ? 24 : 20} />
        </div>
        <div>
          <p className={cn("font-bold text-neutral-900", isDesktop ? "text-base" : "text-sm")}>Where are you going?</p>
          <p className="text-[11px] text-neutral-500 max-w-[200px] mx-auto leading-relaxed px-4">Select a destination for your safest route.</p>
        </div>
      </button>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-3 py-4 text-center">
        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full grid place-items-center mx-auto shadow-sm">
          <AlertTriangle size={24} />
        </div>
        <div>
          <p className="font-bold text-neutral-900">Routing failed</p>
          <p className="text-xs text-neutral-500 px-4 mt-1">Couldn't calculate route. {error}. Try again or choose another start.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mx-auto mt-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-bold rounded-lg transition"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (loading && !routes) {
    return (
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-[64px] rounded-xl bg-neutral-100 animate-pulse flex items-center px-4 gap-3">
             <div className="w-10 h-10 rounded-lg bg-neutral-200" />
             <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 bg-neutral-200 rounded" />
                <div className="h-2 w-1/3 bg-neutral-200 rounded" />
             </div>
          </div>
        ))}
        <p className="text-[10px] text-center text-neutral-400 font-bold uppercase tracking-widest mt-2 animate-pulse">Calculating safest path...</p>
      </div>
    )
  }

  if (!routes || routes.length === 0) {
    if (!loading) {
      return (
        <div className={cn("flex flex-col gap-2 text-center", isDesktop ? "py-6" : "py-4")}>
          <div className={cn("bg-amber-50 text-amber-500 rounded-full grid place-items-center mx-auto", isDesktop ? "w-12 h-12" : "w-10 h-10")}>
            <Compass size={isDesktop ? 24 : 20} className="animate-pulse" />
          </div>
          <div>
            <p className={cn("font-bold text-neutral-900", isDesktop ? "text-sm" : "text-[13px]")}>Waiting for start point</p>
            <p className="text-[11px] text-neutral-500 px-6 mt-1 leading-relaxed">
              Choose where you're starting from to calculate the route.
            </p>
          </div>
          <button 
            onClick={onSearchClick}
            className="mx-auto mt-2 px-4 py-2 bg-brand-600 text-white text-[11px] font-bold rounded-lg shadow-md active:scale-95 transition uppercase tracking-tight"
          >
            Select Start
          </button>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      {provider === 'osrm' && import.meta.env.VITE_ORS_API_KEY && (
        <div className="px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl text-[11px] text-amber-700 leading-tight mb-1">
          <strong>OpenRouteService failed</strong> — using prototype fallback route.
        </div>
      )}
      {routes.map(r => (
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
                provider === 'ors' ? "text-brand-600" : "text-brand-400"
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
        <LegendRow color="bg-brand-300"                                         icon={Lightbulb} label="Hazard report" />
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
