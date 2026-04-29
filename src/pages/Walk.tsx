import { Link } from 'react-router'
import { ChevronLeft, MapPinned, Lightbulb, Footprints, Store, CheckCircle2, RotateCcw } from 'lucide-react'
import { MapView } from '@/components/MapView'

export function WalkPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 bg-white">
        <Link to="/map" className="text-neutral-500"><ChevronLeft size={20} /></Link>
        <div className="flex-1">
          <p className="text-xs text-neutral-500">Walking to</p>
          <p className="font-semibold text-sm">Home — Rua de São José</p>
        </div>
        <span className="text-xs flex items-center gap-1 text-neutral-600">📋 Legend</span>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 border-b border-neutral-200 bg-white">
        <Stat icon={Lightbulb} label="Lighting" value="Good" tone="safe" />
        <Stat icon={Footprints} label="Traffic" value="Moderate" tone="warn" />
        <Stat icon={Store} label="Stores" value="2 open" tone="safe" />
      </div>

      <div className="flex-1 relative">
        <MapView selectedRoute="safest" />
      </div>

      <div className="grid grid-cols-2 gap-2 p-3 border-t border-neutral-200 bg-white">
        <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-50 text-brand-700 font-semibold">
          <CheckCircle2 size={16} /> Check-in
        </button>
        <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-500 text-white font-semibold">
          <RotateCcw size={16} /> Reroute
        </button>
      </div>

      <div className="absolute right-4 bottom-24 sm:bottom-28">
        {/* Floating SOS button — emergency hook for later */}
        <button aria-label="Emergency" className="w-12 h-12 rounded-full bg-risk text-white grid place-items-center shadow-lg">
          <MapPinned size={20} />
        </button>
      </div>
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
