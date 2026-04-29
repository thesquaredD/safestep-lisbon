import { AlertTriangle, Clock, Lightbulb, Construction, Eye, AlertCircle, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useHazards, type Hazard } from '@/data/hazards'

const iconFor = (k: Hazard['kind']) =>
  k === 'broken_light' ? Lightbulb
  : k === 'blocked_walkway' ? Construction
  : k === 'poor_visibility' ? Eye
  : k === 'unsafe_crossing' ? AlertCircle
  : AlertTriangle

const tone: Record<NonNullable<Hazard['status']>, string> = {
  verified: 'bg-emerald-50 text-emerald-700',
  new: 'bg-amber-50 text-amber-700',
  resolved: 'bg-emerald-50 text-emerald-700',
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const m = Math.round(ms / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}

export function AuditPage() {
  const { data, loading, error } = useHazards()

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

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm p-3 mb-2">
            Couldn't load hazards: {error}
          </div>
        )}

        {loading && (
          <ul className="flex flex-col gap-2">
            {[0, 1, 2].map(i => <li key={i} className="h-20 rounded-2xl bg-neutral-100 animate-pulse" />)}
          </ul>
        )}

        <ul className="flex flex-col gap-2">
          {data?.map((h) => {
            const Icon = iconFor(h.kind)
            return (
              <li key={h.id} className="flex gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
                <span className="w-10 h-10 rounded-lg bg-brand-50 grid place-items-center text-brand-600 shrink-0">
                  <Icon size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{h.title}</h3>
                    {h.status && (
                      <span className={cn('text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full', tone[h.status])}>
                        {h.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">{h.description}</p>
                  <p className="text-xs text-neutral-400 mt-1">{h.created_at ? timeAgo(h.created_at) : ''}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
