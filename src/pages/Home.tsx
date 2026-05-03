import { useNavigate } from 'react-router'
import { Footprints, Shield, AlertTriangle, Navigation, MapPin, Compass } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useLocation } from '@/lib/useLocation'

export function HomePage() {
  const navigate = useNavigate()
  const { coords, status, requestLocation } = useLocation()

  const handleAction = (type: 'route' | 'sanctuary' | 'report') => {
    const params = new URLSearchParams()
    if (coords) {
      params.set('lat', String(coords.lat))
      params.set('lng', String(coords.lng))
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : ''

    switch (type) {
      case 'route':
        navigate(`/map${queryString}`)
        break
      case 'sanctuary':
        const mode = params.toString() ? '&mode=nearest' : '?mode=nearest'
        navigate(`/sanctuary${queryString}${mode}`)
        break
      case 'report':
        navigate(`/audit${queryString}`)
        break
    }
  }

  const showPermissionCard = status === 'prompt' || status === 'denied' || status === 'loading'

  return (
    <div className="p-6 flex flex-col gap-8 h-full bg-white">
      {/* Brand Section */}
      <div className="mt-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 mb-4 bg-brand-50 rounded-3xl grid place-items-center">
          <LogoLarge />
        </div>
        <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">
          SafeStep <span className="text-brand-600">Lisbon</span>
        </h1>
        <p className="mt-2 text-neutral-500 max-w-[280px]">
          Empowering your movement with community-vetted safety data.
        </p>
      </div>

      {showPermissionCard ? (
        <div className="bg-brand-50 rounded-3xl p-6 border border-brand-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white grid place-items-center text-brand-600 shadow-sm">
              <MapPin size={20} />
            </div>
            <h2 className="font-bold text-neutral-900 leading-tight">Enable Location</h2>
          </div>
          
          <p className="text-sm text-neutral-600 leading-relaxed mb-6">
            SafeStep uses your location to calculate safer routes from where you are, 
            find nearby Sanctuary Spaces, and report hazards at your current spot.
          </p>

          {status === 'denied' ? (
            <div className="bg-white/80 p-4 rounded-2xl mb-6 flex items-start gap-3">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-xs font-bold text-neutral-900">Location is off</p>
                <p className="text-[11px] text-neutral-500 leading-snug">
                  You can still use SafeStep by choosing a starting point manually on the map.
                </p>
              </div>
            </div>
          ) : null}

          <button 
            onClick={requestLocation}
            disabled={status === 'loading'}
            className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <><Compass className="animate-spin" size={20} /> Locating...</>
            ) : (
              <><Navigation size={20} /> Use current location</>
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Location Status Badge */}
          <div className="mx-auto flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-100 text-emerald-700">
            <MapPin size={14} /> Using your current location
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col gap-4">
            <ActionButton 
              icon={Footprints}
              title="Plan a safer route"
              description="Find paths with better lighting and safe spaces."
              onClick={() => handleAction('route')}
              primary
            />
            
            <div className="grid grid-cols-2 gap-4">
              <ActionButton 
                icon={Shield}
                title="Sanctuaries"
                description="Find nearest safe zone"
                onClick={() => handleAction('sanctuary')}
              />
              <ActionButton 
                icon={AlertTriangle}
                title="Report"
                description="Flag a local hazard"
                onClick={() => handleAction('report')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Manual Start Fallback (Visible when location is denied or user wants manual) */}
      {status === 'denied' && (
        <button 
          onClick={() => handleAction('route')}
          className="mx-auto text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Continue with manual starting point →
        </button>
      )}

      <div className="mt-auto text-center pb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
          Design for Inclusion · Lisboa
        </p>
      </div>
    </div>
  )
}

function ActionButton({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  primary = false 
}: { 
  icon: any, 
  title: string, 
  description: string, 
  onClick: () => void,
  primary?: boolean 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start p-4 rounded-2xl border text-left transition-all active:scale-[0.98]",
        primary 
          ? "bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-200" 
          : "bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl grid place-items-center mb-3",
        primary ? "bg-white/20" : "bg-brand-50 text-brand-600"
      )}>
        <Icon size={20} />
      </div>
      <h3 className="font-bold text-base leading-tight">{title}</h3>
      <p className={cn(
        "text-xs mt-1 leading-snug",
        primary ? "text-brand-100" : "text-neutral-500"
      )}>
        {description}
      </p>
    </button>
  )
}

function LogoLarge() {
  return (
    <svg viewBox="0 0 32 32" width="48" height="48" fill="none" stroke="currentColor" className="text-brand-500">
      <path
        d="M22 9c-3.5 0-3.5 4-7 4s-3.5 4-7 4"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="22" cy="9" r="2" fill="currentColor" />
      <circle cx="8" cy="17" r="2" fill="currentColor" />
    </svg>
  )
}
