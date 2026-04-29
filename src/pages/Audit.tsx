import { AlertTriangle, Clock, Lightbulb, Construction, Eye, AlertCircle, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'

type Hazard = {
  id: string; title: string; status: 'verified' | 'new' | 'resolved'
  description: string; ago: string; icon: React.ElementType
}
const HAZARDS: Hazard[] = [
  { id: '1', title: 'Broken Streetlight', status: 'verified', icon: Lightbulb,
    description: 'Street light out near Rua dos Fanqueiros intersection', ago: '2h ago' },
  { id: '2', title: 'Blocked Walkway', status: 'new', icon: Construction,
    description: 'Construction debris blocking Calçada do Carmo sidewalk', ago: '45m ago' },
  { id: '3', title: 'Poor Visibility', status: 'new', icon: Eye,
    description: 'Overgrown trees blocking streetlight on Rua da Madalena', ago: '1h ago' },
  { id: '4', title: 'Unsafe Crossing', status: 'resolved', icon: AlertCircle,
    description: 'Missing crosswalk markings on Avenida da Liberdade', ago: '3d ago' },
]

const tone = {
  verified: 'bg-emerald-50 text-emerald-700',
  new: 'bg-amber-50 text-amber-700',
  resolved: 'bg-emerald-50 text-emerald-700',
}

export function AuditPage() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2"><AlertTriangle size={20} />Structural Audit</h1>
          <p className="text-sm text-neutral-500">Report hazards, improve urban safety</p>
        </div>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-500 text-white text-sm">
          <Plus size={14} /> Report
        </button>
      </div>

      <div className="rounded-2xl bg-brand-50 border border-brand-100 p-3 text-sm flex gap-2">
        <Eye size={16} className="text-brand-600 shrink-0 mt-0.5" />
        <p className="text-neutral-700">
          Reports can be compiled for city councils for physical urban safety improvements. Your reports make a difference.
        </p>
      </div>

      <div>
        <h2 className="text-sm font-semibold flex items-center gap-1.5 mb-2"><Clock size={14} />Live Insights</h2>
        <ul className="flex flex-col gap-2">
          {HAZARDS.map((h) => {
            const Icon = h.icon
            return (
              <li key={h.id} className="flex gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
                <span className="w-10 h-10 rounded-lg bg-brand-50 grid place-items-center text-brand-600 shrink-0">
                  <Icon size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{h.title}</h3>
                    <span className={cn('text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full', tone[h.status])}>
                      {h.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">{h.description}</p>
                  <p className="text-xs text-neutral-400 mt-1">{h.ago}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
