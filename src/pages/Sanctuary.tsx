import { useMemo, useState } from 'react'
import { Coffee, Cross, Beer, Store, Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useSanctuaries, type Sanctuary } from '@/data/sanctuaries'

const iconFor = (k: Sanctuary['kind']) =>
  k === 'cafe' ? Coffee : k === 'pharmacy' ? Cross : k === 'bar' ? Beer : Store

// Demo origin (Rua de São José area). Replace with user's real position when geolocation lands.
const ORIGIN = { lat: 38.7165, lng: -9.1396 }

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
  const [filter, setFilter] = useState<'all' | 'open'>('all')
  const { data, loading, error } = useSanctuaries()

  const list = useMemo(() => {
    if (!data) return []
    const filtered = filter === 'all' ? data : data.filter(s => s.is_open_now)
    return filtered
      .map(s => ({ ...s, distanceM: distanceMeters(ORIGIN, { lat: s.lat!, lng: s.lng! }) }))
      .sort((a, b) => a.distanceM - b.distanceM)
  }, [data, filter])

  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">Sanctuary Network</h1>
        <p className="text-sm text-neutral-500">Vetted safe spaces near you</p>
      </div>

      <div className="flex items-center gap-2">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
        <Chip active={filter === 'open'} onClick={() => setFilter('open')}>Open Now</Chip>
      </div>

      <button className="flex items-center justify-center gap-2 rounded-full bg-brand-500 text-white py-3 font-semibold shadow-lg shadow-brand-500/30">
        <Search size={16} /> Find Nearest Sanctuary Space
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
            <li key={s.id} className="flex gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
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
    </div>
  )
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm border',
        active ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-neutral-600 border-neutral-200',
      )}
    >
      {children}
    </button>
  )
}
