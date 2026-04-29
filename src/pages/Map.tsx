import { useState } from 'react'
import { Link } from 'react-router'
import {
  Search, Footprints, Shield, Radio, AlertTriangle,
  ChevronDown, ChevronUp, Map as MapIcon, Coffee, Cross, Beer, Store, Lightbulb,
  Compass,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { MapView } from '@/components/MapView'
import { useMediaQuery } from '@/lib/useMediaQuery'

type RouteOption = { id: 'safest' | 'balanced' | 'fastest'; label: string; score: number; minutes: number; km: number; tone: 'safe' | 'warn' | 'risk' }
const routes: RouteOption[] = [
  { id: 'safest',   label: 'Safest',   score: 92, minutes: 18, km: 1.4, tone: 'safe' },
  { id: 'balanced', label: 'Balanced', score: 76, minutes: 14, km: 1.1, tone: 'warn' },
  { id: 'fastest',  label: 'Fastest',  score: 54, minutes: 10, km: 0.8, tone: 'risk' },
]

export function MapPage() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [open, setOpen] = useState<RouteOption['id']>('safest')
  const [showLegend, setShowLegend] = useState(false)
  const [drawerExpanded, setDrawerExpanded] = useState(true)

  // ──────────────────────────────────────────────────────────────────────
  // DESKTOP: full-bleed map with three floating panels.
  // ──────────────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="relative h-full">
        <MapView selectedRoute={open} />

        {/* Search bar — top-center floating pill */}
        <div className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-[520px] z-20">
          <div className="flex items-center gap-3 bg-surface/95 backdrop-blur-md rounded-full border border-black/5 px-5 py-3 shadow-[var(--shadow-float)]">
            <Search size={16} className="text-neutral-500 shrink-0" />
            <span className="text-[14px] flex-1 truncate text-[#14101c]">Home — Rua de São José, Lisboa</span>
            <button
              onClick={() => setShowLegend(v => !v)}
              className="text-xs flex items-center gap-1.5 text-neutral-600 shrink-0 px-2.5 py-1 rounded-full hover:bg-black/5 transition"
              aria-label="Toggle legend"
            >
              <MapIcon size={13} /> Legend
            </button>
          </div>
        </div>

        {/* Action menu — top-left floating panel */}
        <ActionMenu />

        {/* Route Options — bottom-right floating card */}
        <RouteOptionsCard open={open} onSelect={setOpen} />

        {/* Legend popover */}
        {showLegend && <LegendCard onClose={() => setShowLegend(false)} />}
      </div>
    )
  }

  // ──────────────────────────────────────────────────────────────────────
  // MOBILE: untouched two-pane layout (kept exactly as it was working).
  // ──────────────────────────────────────────────────────────────────────
  return (
    <div className={cn(
      'grid h-full transition-[grid-template-rows] duration-200',
      drawerExpanded ? 'grid-rows-[2fr_3fr]' : 'grid-rows-[5fr_auto]',
    )}>
      <div className="relative">
        <MapView
          selectedRoute={open}
          onSelectionChange={(has) => { if (has) setDrawerExpanded(false) }}
        />
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
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Route Options</h2>
              <span className="text-xs text-neutral-500">Lisboa</span>
            </div>
            <div className="flex flex-col gap-2">
              {routes.map((r) => (
                <RouteRow key={r.id} r={r} active={open === r.id} onClick={() => setOpen(r.id)} />
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              <ActionChip to="/walk"     icon={Footprints}     label="Walk" />
              <ActionChip to="/sanctuary" icon={Shield}         label="Sanctuary" />
              <ActionChip to="/mesh"      icon={Radio}          label="Mesh" />
              <ActionChip to="/audit"     icon={AlertTriangle}  label="Report" />
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
    <span className={cn('w-10 h-10 grid place-items-center rounded-lg text-white font-bold text-sm tabular-nums', bg)}>
      {score}
    </span>
  )
}

function RouteRow({ r, active, onClick }: { r: RouteOption; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-xl border p-3 text-left transition',
        active ? 'bg-brand-50 border-brand-300 shadow-sm' : 'border-neutral-200 hover:bg-neutral-50',
      )}
    >
      <ScoreBadge score={r.score} tone={r.tone} />
      <div className="flex-1">
        <div className="font-semibold text-[14px]">{r.label}</div>
        <div className="text-xs text-neutral-500">{r.minutes} min · {r.km} km</div>
      </div>
      <ChevronDown size={18} className={cn('text-neutral-400 transition', active && 'rotate-180 text-brand-500')} />
    </button>
  )
}

function ActionChip({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1 rounded-xl bg-brand-50 py-2.5 text-xs text-brand-700 hover:bg-brand-100 transition">
      <Icon size={18} />
      {label}
    </Link>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Desktop-only — Action menu (top-left floating)
   The four big actions a user is most likely to take from the Map page.
   Each is a Link to the relevant page — keeps the routing flow clean.
   ───────────────────────────────────────────────────────────────────────── */

function ActionMenu() {
  const items: { to: string; icon: React.ElementType; label: string; sub: string }[] = [
    { to: '/walk',      icon: Footprints,     label: 'Start Walk',       sub: 'Begin guided navigation' },
    { to: '/sanctuary', icon: Shield,         label: 'Nearest Sanctuary', sub: 'Vetted safe places nearby' },
    { to: '/mesh',      icon: Radio,          label: 'Guardian Mesh',     sub: 'Anonymous BLE network' },
    { to: '/audit',     icon: AlertTriangle,  label: 'Report Hazard',     sub: 'Streetlight, blocked path…' },
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
              <Link
                to={it.to}
                className="group flex items-center gap-3 px-4 py-3 hover:bg-brand-50/60 transition"
              >
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

function RouteOptionsCard({ open, onSelect }: { open: RouteOption['id']; onSelect: (id: RouteOption['id']) => void }) {
  return (
    <div className="absolute bottom-6 right-6 z-10 w-[340px]">
      <div className="rounded-2xl bg-surface/96 backdrop-blur-md border border-black/5 p-4 shadow-[var(--shadow-float)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <h2 className="font-display text-[15px] font-medium text-[#14101c]">Route Options</h2>
            <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">Lisboa</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {routes.map(r => (
            <RouteRow key={r.id} r={r} active={open === r.id} onClick={() => onSelect(r.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Legend card — shared between mobile & desktop (positioning differs)
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
