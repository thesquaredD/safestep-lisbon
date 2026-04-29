import { useState } from 'react'
import { Link } from 'react-router'
import {
  Search, Footprints, Shield, Radio, AlertTriangle,
  ChevronDown, ChevronUp, Map as MapIcon, Coffee, Cross, Beer, Store, Lightbulb,
} from 'lucide-react'
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
  const [drawerExpanded, setDrawerExpanded] = useState(true)
  const [showLegend, setShowLegend] = useState(false)

  return (
    // Two-pane vertical split — neither pane overlaps the other so map gets clean clicks.
    <div className={cn(
      'grid h-full transition-[grid-template-rows] duration-200',
      drawerExpanded ? 'grid-rows-[2fr_3fr]' : 'grid-rows-[5fr_auto]',
    )}>
      {/* TOP: Map area (everything inside is positioned over the map) */}
      <div className="relative">
        <MapView selectedRoute={open} />

        {/* Search bar overlay */}
        <div className="absolute top-3 inset-x-3 z-10">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur rounded-full border border-neutral-200 px-4 py-2.5 shadow-sm">
            <Search size={16} className="text-neutral-500" />
            <span className="text-sm flex-1 truncate">Home — Rua de São José, Lisboa</span>
            <button
              onClick={() => setShowLegend(v => !v)}
              className="text-xs flex items-center gap-1 text-neutral-600 shrink-0 px-2 py-1 -mr-1 rounded-md hover:bg-neutral-100"
              aria-label="Toggle legend"
            >
              <MapIcon size={14} /> Legend
            </button>
          </div>
        </div>

        {/* Legend popover */}
        {showLegend && (
          <div className="absolute top-16 right-3 z-10 bg-white rounded-xl border border-neutral-200 shadow-lg p-3 w-56 text-xs">
            <p className="font-semibold mb-2">Legend</p>
            <ul className="flex flex-col gap-1.5">
              <LegendRow color="bg-brand-500" icon={Coffee} label="Café (sanctuary)" />
              <LegendRow color="bg-brand-500" icon={Cross} label="Pharmacy" />
              <LegendRow color="bg-brand-500" icon={Beer} label="Bar" />
              <LegendRow color="bg-brand-500" icon={Store} label="Store" />
              <LegendRow color="bg-warn" icon={Lightbulb} label="Hazard report" />
            </ul>
            <p className="mt-2 text-neutral-500">Soft purple ring = ~80m sanctuary radius.</p>
          </div>
        )}
      </div>

      {/* BOTTOM: Route options drawer (fully separate area, no negative margin) */}
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

            <div className="grid grid-cols-4 gap-2 mt-4">
              <Action to="/walk" icon={Footprints} label="Walk" />
              <Action to="/sanctuary" icon={Shield} label="Sanctuary" />
              <Action to="/mesh" icon={Radio} label="Mesh" />
              <Action to="/audit" icon={AlertTriangle} label="Report" />
            </div>
          </div>
        )}
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

function LegendRow({ color, icon: Icon, label }: { color: string; icon: React.ElementType; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={cn('w-5 h-5 rounded grid place-items-center text-white', color)}>
        <Icon size={11} />
      </span>
      {label}
    </li>
  )
}
