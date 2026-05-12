import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ChevronLeft, Lightbulb, Footprints, Store, CheckCircle2, RotateCcw, X, Shield, Phone, AlertTriangle, Navigation, Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { MapView } from '@/components/MapView'
import { useLocation } from '@/lib/useLocation'
import { useRoutes, DEFAULT_DESTINATION, type LngLat } from '@/data/routes'

const CONTACT_KEY = 'safestep:emergency_contact'
const LAST_CHECK_IN_KEY = 'safestep:last_check_in'
const CHECK_IN_INTERVAL_KEY = 'safestep:check_in_interval'

export function WalkPage() {
  const { coords } = useLocation()
  const [searchParams] = useSearchParams()
  
  // Destination from URL
  const toLat = searchParams.get('toLat')
  const toLng = searchParams.get('toLng')
  const toLabel = searchParams.get('toLabel')

  const to = useMemo<LngLat>(() => {
    if (toLat && toLng) return { lat: Number(toLat), lng: Number(toLng), label: toLabel ?? 'Destination' }
    return DEFAULT_DESTINATION
  }, [toLat, toLng, toLabel])

  const [refreshKey, setRefreshKey] = useState(0)
  
  // Create unique keys for origin and destination to trigger re-fetch
  // We include refreshKey to force a recalculation when Reroute is clicked
  const from = useMemo(() => {
    const base = coords ? { ...coords, label: 'Your Current Location' } : null
    if (!base) return null
    return { ...base, _refresh: refreshKey } // Subtle change to trigger useEffect
  }, [coords, refreshKey])

  const { data: routes, provider: routingProvider, loading: routesLoading } = useRoutes(from, to)
  
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [isRerouting, setIsRerouting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [contact, setContact] = useState<{ name: string; phone: string } | null>(null)

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

  useEffect(() => {
    const saved = localStorage.getItem(CONTACT_KEY)
    setContact(saved ? JSON.parse(saved) : null)
  }, [])

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

  const handleReroute = () => {
    if (!from || !to) {
      setToast('Choose a start and destination first.')
      setTimeout(() => setToast(null), 3000)
      return
    }
    
    setIsRerouting(true)
    setRefreshKey(v => v + 1)
    
    // Artificial delay for UX "recalculating" feel
    setTimeout(() => {
      setIsRerouting(false)
      setToast('Route refreshed.')
      setTimeout(() => setToast(null), 3000)
    }, 1200)
  }

  const handleCheckIn = () => {
    setIsCheckInOpen(true)
  }

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
          selectedRouteId="safer" 
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

        {/* Rerouting Overlay */}
        {isRerouting && (
          <div className="absolute inset-0 z-30 bg-white/40 backdrop-blur-sm grid place-items-center">
            <div className="bg-white px-6 py-4 rounded-3xl shadow-2xl border border-neutral-100 flex items-center gap-3 animate-in fade-in zoom-in duration-200">
              <RotateCcw size={20} className="text-brand-500 animate-spin" />
              <span className="font-bold text-neutral-900">Updating route...</span>
            </div>
          </div>
        )}

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

      <div className="grid grid-cols-2 gap-3 p-4 border-t border-neutral-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
        <button 
          onClick={handleCheckIn}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-50 text-brand-700 font-bold active:scale-[0.97] transition shadow-sm border border-brand-100"
        >
          <CheckCircle2 size={18} /> Share Status
        </button>
        <button 
          onClick={handleReroute}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-600 text-white font-bold active:scale-[0.97] transition shadow-lg shadow-brand-500/20"
        >
          <RotateCcw size={18} /> Reroute
        </button>
      </div>

      {/* Check-in Modal */}
      {isCheckInOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 sm:items-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 grid place-items-center">
                  <Navigation size={20} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Safety Check-in</h2>
              </div>
              <button 
                onClick={() => setIsCheckInOpen(false)}
                className="w-10 h-10 rounded-full bg-neutral-100 grid place-items-center text-neutral-500 hover:bg-neutral-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            {contact ? (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white grid place-items-center text-emerald-600 shadow-sm shrink-0">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-900 text-lg leading-tight">Status shared</p>
                    <p className="text-emerald-700 text-sm mt-1 leading-relaxed">
                      Check-in shared with your trusted contact — prototype.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <Phone size={16} className="text-neutral-400" />
                  <p className="text-xs text-neutral-500 font-medium leading-none">
                    SMS simulated to <span className="text-neutral-900 font-bold">{contact.name} ({contact.phone})</span>
                  </p>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <p className="text-[11px] text-neutral-600 leading-relaxed italic">
                    Prototype note: this check-in is saved locally on this device. Future versions can notify your emergency contact if you miss a check-in.
                  </p>
                </div>

                <button 
                  onClick={() => setIsCheckInOpen(false)}
                  className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white grid place-items-center text-amber-600 shadow-sm shrink-0">
                    <AlertTriangle size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-amber-900 text-lg leading-tight">Contact required</p>
                    <p className="text-amber-700 text-sm mt-1 leading-relaxed">
                      Add an emergency contact in Profile to use Check-in.
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <p className="text-[11px] text-neutral-600 leading-relaxed italic">
                    Prototype: emergency alerts will require a saved contact in the next version.
                  </p>
                </div>

                <Link 
                  to="/profile"
                  className="w-full flex items-center justify-center py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition"
                >
                  Go to Profile
                </Link>
              </div>
            )}
            
            <p className="text-center text-[10px] text-neutral-400 mt-8 uppercase tracking-[0.2em] font-bold">
              Prototype — Design for Inclusion
            </p>
          </div>
        </div>
      )}
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


