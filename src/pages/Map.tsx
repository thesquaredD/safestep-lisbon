import { useState } from 'react'
import { Link } from 'react-router'
import { Search, Footprints, Shield, Radio, AlertTriangle, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { MapView } from '@/components/MapView'

type RouteOption = { id: 'safest' | 'balanced' | 'fastest'; label: string; score: number; minutes: number; km: number; tone: 'safe' | 'warn' | 'risk' }
const routes: RouteOption[] = [
  { id: 'safest', label: 'Safest', score: 92, minutes: 18, km: 1.4, tone: 'safe' },
  { id: 'balanced', label: 'Balanced', score: 76, minutes: 14, km: 1.1, tone: 'warn' },
  { id: 'fastest', label: 'Fastest', score: 54, minutes: 10, km: 0.8, tone: 'risk' },
]

export function MapPage() {
  const [open, setOpen] = useState<RouteOption['id']>('safest')

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 bg-white rounded-full border border-neutral-200 px-4 py-2.5">
          <Search size={16} className="text-neutral-500" />
          <span className="text-sm flex-1 truncate">Home — Rua de São José, Lisboa</span>
          <span className="text-xs flex items-center gap-1 text-neutral-600">📋 Legend</span>
        </div>
      </div>

      <div className="mx-4 mt-3 h-56 rounded-2xl overflow-hidden border border-neutral-200">
        <MapView selectedRoute={open} />
      </div>

      {/* Route options */}
      <div className="m-4 mt-3 rounded-2xl bg-white border border-neutral-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Route Options</h2>
          <span className="text-xs text-neutral-500">Lisboa</span>
        </div>
        <div className="flex flex-col gap-2">
          {routes.map((r) => (
            <button
              key={r.id}
              onClick={() => setOpen(r.id)}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-3 text-left transition',
                open === r.id ? 'bg-brand-50 border-brand-300' : 'border-neutral-200 hover:bg-neutral-50',
              )}
            >
              <ScoreBadge score={r.score} tone={r.tone} />
              <div className="flex-1">
                <div className="font-semibold">{r.label}</div>
                <div className="text-xs text-neutral-500">{r.minutes} min · {r.km} km</div>
              </div>
              <ChevronDown size={18} className={cn('text-neutral-400 transition', open === r.id && 'rotate-180')} />
            </button>
          ))}
        </div>

        {/* Action chips */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <Action to="/walk" icon={Footprints} label="Walk" />
          <Action to="/sanctuary" icon={Shield} label="Sanctuary" />
          <Action to="/mesh" icon={Radio} label="Mesh" />
          <Action to="/audit" icon={AlertTriangle} label="Report" />
        </div>
      </div>
    </div>
  )
}

function ScoreBadge({ score, tone }: { score: number; tone: 'safe' | 'warn' | 'risk' }) {
  const bg = tone === 'safe' ? 'bg-safe' : tone === 'warn' ? 'bg-warn' : 'bg-risk'
  return (
    <span className={cn('w-10 h-10 grid place-items-center rounded-lg text-white font-bold text-sm', bg)}>
      {score}
    </span>
  )
}

function Action({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1 rounded-xl bg-brand-50 py-2.5 text-xs text-brand-700">
      <Icon size={18} />
      {label}
    </Link>
  )
}
