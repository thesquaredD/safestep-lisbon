import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ChevronLeft, Lightbulb, Footprints, Store, CheckCircle2, Shield, AlertTriangle, Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { MapView } from '@/components/MapView'
import { useLocation } from '@/lib/useLocation'
import { useRoutes, DEFAULT_DESTINATION, type LngLat } from '@/data/routes'

const LAST_CHECK_IN_KEY = 'safestep:last_check_in'
const CHECK_IN_INTERVAL_KEY = 'safestep:check_in_interval'

export function WalkPage() {
  const { coords } = useLocation()
  const [searchParams] = useSearchParams()
  
  // Destination from URL
  const toLat = searchParams.get('toLat')
  const toLng = searchParams.get('toLng')
  const toLabel = searchParams.get('toLabel')
  const selectedRouteId = searchParams.get('routeId') ?? 'safer'

  const to = useMemo<LngLat>(() => {
    if (toLat && toLng) return { lat: Number(toLat), lng: Number(toLng), label: toLabel ?? 'Destination' }
    return DEFAULT_DESTINATION
  }, [toLat, toLng, toLabel])

  // Create unique keys for origin and destination to trigger re-fetch
  const from = useMemo(() => {
    const base = coords ? { ...coords, label: 'Your Current Location' } : null
    if (!base) return null
    return base
  }, [coords])

  const { data: routes, provider: routingProvider, loading: routesLoading } = useRoutes(from, to)
  
  const [toast, setToast] = useState<string | null>(null)

  // I'm OK State
  const [lastCheckIn, setLastCheckIn] = useState<number>(() => {
    const saved = localStorage.getItem(LAST_CHECK_IN_KEY)
    return saved ? parseInt(saved, 10) : Date.now()
  })
  const [intervalMin, setIntervalMin] = useState<number>(() => {
    const saved = localStorage.getItem(CHECK_IN_INTERVAL_KEY)
    return saved ? parseInt(saved, 10) : 1
  })
  const [isOverdue, setIsOverdue] = useState(false)
  const [now, setNow] = useState(Date.now())

  // Timer and overdue check
  useEffect(() => {
    const timer = setInterval(() => {
      const current = Date.now()
      setNow(current)
      
      const elapsedMs = current - lastCheckIn
      if (elapsedMs > intervalMin * 60 * 1000) {
        setIsOverdue(true)
      } else {
        setIsOverdue(false)
      }
    }, 1000)
    
    return () => clearInterval(timer)
  }, [lastCheckIn, intervalMin])

  const handleImOk = () => {
    const timestamp = Date.now()
    setLastCheckIn(timestamp)
    localStorage.setItem(LAST_CHECK_IN_KEY, timestamp.toString())
    setIsOverdue(false)
    setToast('Check-in confirmed — you’re OK.')
    setTimeout(() => setToast(null), 3000)
  }

  const handleIntervalChange = (val: number) => {
    setIntervalMin(val)
    localStorage.setItem(CHECK_IN_INTERVAL_KEY, val.toString())
  }

  const timeSinceLast = useMemo(() => {
    const seconds = Math.floor((now - lastCheckIn) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min ago`
  }, [lastCheckIn, now])

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 bg-white">
        <Link to="/map" className="text-neutral-500 hover:bg-neutral-50 p-1 rounded-full transition"><ChevronLeft size={20} /></Link>
        <div className="flex-1">
          <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider leading-none mb-1">Walking to</p>
          <p className="font-bold text-sm text-[#14101c] truncate">{to.label}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-brand-50 text-brand-700 text-[10px] font-bold uppercase tracking-wider">
          <Shield size={10} /> Active Guidance
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 border-b border-neutral-200 bg-white">
        <Stat icon={Lightbulb} label="Lighting" value="Good" tone="safe" />
        <Stat icon={Footprints} label="Traffic" value="Moderate" tone="warn" />
        <Stat icon={Store} label="Stores" value="2 open" tone="safe" />
      </div>

      <div className="flex-1 relative bg-neutral-100">
        <MapView 
          routes={routes ?? []} 
          selectedRouteId={selectedRouteId as any} 
          from={from}
          to={to}
        />
        
        {/* Routing Provider Label */}
        {routingProvider !== 'none' && !routesLoading && (
          <div className="absolute top-4 right-4 z-10">
            <span className={cn(
              "px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider shadow-sm border",
              routingProvider === 'ors' ? "bg-white text-brand-600 border-brand-100" : "bg-white text-brand-400 border-brand-100"
            )}>
              {routingProvider === 'ors' ? 'OpenRouteService' : 'Fallback route'}
            </span>
          </div>
        )}

        {/* I'm OK Floating Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-3 pointer-events-none">
          {isOverdue && (
            <div className="bg-risk text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg animate-bounce pointer-events-auto border border-white/20 flex items-center gap-2">
              <AlertTriangle size={14} /> Please confirm you’re OK.
            </div>
          )}
          
          <div className="flex flex-col gap-2 pointer-events-auto items-end">
            <button
              onClick={handleImOk}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-xl transition-all active:scale-95",
                isOverdue ? "bg-risk text-white shadow-risk/40" : "bg-brand-600 text-white shadow-brand-500/40"
              )}
            >
              <Check size={18} />
              I'm OK
            </button>
            
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-neutral-200 shadow-lg flex flex-col gap-2 min-w-[140px]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Check-in</span>
                <span className="text-[10px] font-bold text-neutral-900">{timeSinceLast}</span>
              </div>
              <div className="flex items-center gap-1.5 p-1 bg-neutral-50 rounded-lg border border-neutral-100">
                {[1, 3, 5].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleIntervalChange(m)}
                    className={cn(
                      "flex-1 py-1 text-[10px] font-bold rounded transition",
                      intervalMin === m ? "bg-brand-600 text-white shadow-sm" : "text-neutral-500 hover:bg-neutral-100"
                    )}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-top-4 duration-300 w-full max-w-[90%] flex justify-center">
            <div className="bg-neutral-900/95 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2 border border-white/10 text-center">
              {toast === 'Check-in confirmed — you’re OK.' ? <CheckCircle2 size={16} className="text-emerald-400" /> : 
               toast === 'Route refreshed.' ? <CheckCircle2 size={16} className="text-emerald-400" /> : 
               <AlertTriangle size={16} className="text-amber-400" />}
              {toast}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value, tone }: { icon: React.ElementType; label: string; value: string; tone: 'safe' | 'warn' | 'risk' }) {
  const dot = tone === 'safe' ? 'bg-brand-500' : tone === 'warn' ? 'bg-brand-300' : 'bg-brand-800'
  return (
    <div className="rounded-2xl bg-neutral-50 px-3 py-2.5 border border-neutral-100">
      <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-400 flex items-center gap-1 mb-0.5">
        <Icon size={11} /> {label}
      </p>
      <p className="text-[13px] font-bold text-[#14101c] flex items-center gap-1.5"><span className={`w-1.5 h-1.5 rounded-full ${dot}`} />{value}</p>
    </div>
  )
}


