import { useMemo, useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { Coffee, Cross, Beer, Store, X, MapPin, Phone, Clock as ClockIcon, Navigation } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useSanctuaries, type Sanctuary } from '@/data/sanctuaries'

const iconFor = (k: Sanctuary['kind']) =>
  k === 'cafe' ? Coffee : k === 'pharmacy' ? Cross : k === 'bar' ? Beer : Store

const supportFor = (k: Sanctuary['kind']) => {
  switch (k) {
    case 'cafe': return 'Wait inside, free water, help arrange transport'
    case 'pharmacy': return 'First aid kits, help call emergency services'
    case 'bar': return 'Wait inside, staff trained in bystander intervention'
    case 'store': return 'Safe haven, staff will help you call home'
    default: return 'Wait inside and call for help'
  }
}

// Demo origin (Rua de São José area).
const DEFAULT_ORIGIN = { lat: 38.7165, lng: -9.1396 }

function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return Math.round(2 * R * Math.asin(Math.sqrt(x)))
}

export function SanctuaryPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const origin = lat && lng ? { lat: Number(lat), lng: Number(lng) } : DEFAULT_ORIGIN

  const [filter, setFilter] = useState<'all' | 'open'>('all')
  const [selected, setSelected] = useState<Sanctuary & { distanceM: number } | null>(null)
  const { data, loading, error } = useSanctuaries()

  const list = useMemo(() => {
    if (!data) return []
    const filtered = filter === 'all' ? data : data.filter(s => s.is_open_now)
    return filtered
      .map(s => ({ ...s, distanceM: distanceMeters(origin, { lat: s.lat!, lng: s.lng! }) }))
      .sort((a, b) => a.distanceM - b.distanceM)
  }, [data, filter, origin])

  // Automatically select nearest if mode is 'nearest'
  useEffect(() => {
    if (list.length > 0 && !selected && searchParams.get('mode') === 'nearest') {
      setSelected(list[0])
    }
  }, [list, selected, searchParams])

  const originLabel = lat && lng ? "your selected start" : "Lisbon center"

  return (
    <div className="p-4 flex flex-col gap-4 relative min-h-full pb-20">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Sanctuary Network</h1>
          <p className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider">Distances from {originLabel}</p>
        </div>
        <button 
          onClick={() => navigate('/map')}
          className="px-3 py-1 rounded-full bg-brand-50 text-[10px] font-bold text-brand-600 uppercase tracking-tight hover:bg-brand-100 transition"
        >
          Change Start
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
        <Chip active={filter === 'open'} onClick={() => setFilter('open')}>Open Now</Chip>
      </div>

      <button 
        onClick={() => { if (list.length > 0) setSelected(list[0]) }}
        className="flex items-center justify-center gap-2 rounded-2xl bg-brand-600 text-white py-4 font-bold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition"
      >
        <Navigation size={18} /> Find Nearest Safe Space
      </button>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm p-3">
          Couldn't load sanctuary spaces: {error}
        </div>
      )}

      {loading && (
        <ul className="flex flex-col gap-3" aria-busy>
          {[0, 1, 2].map(i => (
            <li key={i} className="h-20 rounded-2xl bg-neutral-100 animate-pulse" />
          ))}
        </ul>
      )}

      <ul className="flex flex-col gap-3">
        {list.map((s) => {
          const Icon = iconFor(s.kind!)
          return (
            <li 
              key={s.id} 
              onClick={() => setSelected(s)}
              className="flex gap-3 rounded-2xl border border-neutral-200 bg-white p-3 cursor-pointer active:bg-neutral-50 transition-colors"
            >
              <span className="w-10 h-10 rounded-lg bg-brand-50 grid place-items-center text-brand-600 shrink-0">
                <Icon size={20} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{s.name}</h3>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    s.is_open_now ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500',
                  )}>{s.is_open_now ? 'Open' : 'Closed'}</span>
                </div>
                <p className="text-xs text-neutral-500">{s.address} · {s.distanceM}m</p>
                <p className="text-xs text-neutral-600 mt-1 line-clamp-2">{s.description}</p>
              </div>
            </li>
          )
        })}
      </ul>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 sm:items-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-xl bg-brand-50 grid place-items-center text-brand-600">
                  {(() => { const Icon = iconFor(selected.kind!); return <Icon size={24} /> })()}
                </span>
                <div>
                  <h2 className="text-xl font-bold leading-tight">{selected.name}</h2>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium inline-block mt-1',
                    selected.is_open_now ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500',
                  )}>{selected.is_open_now ? 'Open Now' : 'Closed'}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 grid place-items-center text-neutral-500 hover:bg-neutral-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex gap-3 text-neutral-600">
                <MapPin size={18} className="shrink-0 text-brand-500" />
                <p>{selected.address} · <span className="font-medium text-neutral-900">{selected.distanceM}m away</span></p>
              </div>

              <div className="bg-brand-50 rounded-2xl p-4">
                <p className="font-semibold text-brand-700 mb-1">Support Offered:</p>
                <p className="text-brand-900 leading-snug">{supportFor(selected.kind!)}</p>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-neutral-900">Why it's a safe space:</p>
                <p className="text-neutral-600 leading-relaxed">{selected.description}</p>
              </div>

              {selected.hours_text && (
                <div className="flex gap-3 text-neutral-600 pt-2 border-t border-neutral-100">
                  <ClockIcon size={18} className="shrink-0" />
                  <p>{selected.hours_text}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <button 
                onClick={() => {
                  if (!selected) return
                  const params = new URLSearchParams()
                  if (lat && lng) {
                    params.set('lat', lat)
                    params.set('lng', lng)
                  }
                  params.set('toLat', String(selected.lat))
                  params.set('toLng', String(selected.lng))
                  params.set('toLabel', selected.name || 'Sanctuary')
                  
                  navigate(`/map?${params.toString()}`)
                }}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-500 text-white font-bold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition"
              >
                <Navigation size={18} /> Get directions
              </button>
              <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-brand-100 text-brand-600 font-bold hover:bg-brand-50 active:scale-[0.98] transition">
                <Phone size={18} /> Call
              </button>
            </div>
            
            <p className="text-[10px] text-center text-neutral-400 mt-4 uppercase tracking-widest font-medium">
              Verified Sanctuary Space
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm border font-medium transition-colors',
        active ? 'bg-brand-500 text-white border-brand-500 shadow-sm' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300',
      )}
    >
      {children}
    </button>
  )
}
