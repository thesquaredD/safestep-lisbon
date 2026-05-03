import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { ChevronLeft, Lightbulb, Footprints, Store, CheckCircle2, RotateCcw, X, Shield, Phone, AlertTriangle } from 'lucide-react'
import { MapView } from '@/components/MapView'
import { useLocation } from '@/lib/useLocation'
import { useRoutes, DEFAULT_DESTINATION } from '@/data/routes'

const CONTACT_KEY = 'safestep:emergency_contact'

export function WalkPage() {
  const { coords } = useLocation()
  const from = coords ? { ...coords, label: 'Your Current Location' } : null
  const { data: routes } = useRoutes(from, DEFAULT_DESTINATION)
  
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [isRerouting, setIsRerouting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [contact, setContact] = useState<{ name: string; phone: string } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(CONTACT_KEY)
    setContact(saved ? JSON.parse(saved) : null)
  }, [])

  const handleReroute = () => {
    setIsRerouting(true)
    setTimeout(() => {
      setIsRerouting(false)
      setToast('Route refreshed.')
      setTimeout(() => setToast(null), 3000)
    }, 1500)
  }

  const handleCheckIn = () => {
    setIsCheckInOpen(true)
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 bg-white">
        <Link to="/map" className="text-neutral-500"><ChevronLeft size={20} /></Link>
        <div className="flex-1">
          <p className="text-xs text-neutral-500 font-medium">Walking to</p>
          <p className="font-bold text-sm text-[#14101c]">{DEFAULT_DESTINATION.label}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
          <Shield size={10} /> Guided
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 border-b border-neutral-200 bg-white">
        <Stat icon={Lightbulb} label="Lighting" value="Good" tone="safe" />
        <Stat icon={Footprints} label="Traffic" value="Moderate" tone="warn" />
        <Stat icon={Store} label="Stores" value="2 open" tone="safe" />
      </div>

      <div className="flex-1 relative">
        <MapView 
          routes={routes ?? []} 
          selectedRouteId="safest" 
          from={from}
          to={DEFAULT_DESTINATION}
        />
        
        {/* Rerouting Overlay */}
        {isRerouting && (
          <div className="absolute inset-0 z-30 bg-white/40 backdrop-blur-sm grid place-items-center">
            <div className="bg-white px-6 py-4 rounded-2xl shadow-xl border border-neutral-100 flex items-center gap-3">
              <RotateCcw size={20} className="text-brand-500 animate-spin" />
              <span className="font-bold text-neutral-900">Recalculating...</span>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-neutral-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              {toast}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 border-t border-neutral-200 bg-white">
        <button 
          onClick={handleCheckIn}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-50 text-brand-700 font-bold active:scale-95 transition shadow-sm"
        >
          <CheckCircle2 size={18} /> Check-in
        </button>
        <button 
          onClick={handleReroute}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-600 text-white font-bold active:scale-95 transition shadow-lg shadow-brand-500/20"
        >
          <RotateCcw size={18} /> Reroute
        </button>
      </div>

      {/* Check-in Modal */}
      {isCheckInOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 sm:items-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight">Check-in</h2>
              <button 
                onClick={() => setIsCheckInOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 grid place-items-center text-neutral-500"
              >
                <X size={18} />
              </button>
            </div>

            {contact ? (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white grid place-items-center text-emerald-600 shadow-sm shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-900 text-lg leading-tight">Status shared</p>
                    <p className="text-emerald-700 text-sm mt-1">
                      Check-in shared with <strong>{contact.name}</strong> — prototype.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <Phone size={16} className="text-neutral-400" />
                  <p className="text-xs text-neutral-500 font-medium">
                    Automated SMS sent to <span className="text-neutral-700">{contact.phone}</span>
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
                <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white grid place-items-center text-amber-600 shadow-sm shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-amber-900 text-lg leading-tight">No contact found</p>
                    <p className="text-amber-700 text-sm mt-1">
                      Add an emergency contact in Profile to use Check in.
                    </p>
                  </div>
                </div>

                <Link 
                  to="/profile"
                  className="w-full flex items-center justify-center py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition"
                >
                  Go to Profile
                </Link>
              </div>
            )}
            
            <p className="text-center text-[10px] text-neutral-400 mt-6 uppercase tracking-widest font-medium">
              Prototype Feature
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ icon: Icon, label, value, tone }: { icon: React.ElementType; label: string; value: string; tone: 'safe' | 'warn' | 'risk' }) {
  const dot = tone === 'safe' ? 'bg-safe' : tone === 'warn' ? 'bg-warn' : 'bg-risk'
  return (
    <div className="rounded-xl bg-surface-3 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-neutral-500 flex items-center gap-1">
        <Icon size={12} /> {label}
      </p>
      <p className="text-sm font-semibold flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${dot}`} />{value}</p>
    </div>
  )
}

