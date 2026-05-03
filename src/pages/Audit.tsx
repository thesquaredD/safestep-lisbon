import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { AlertTriangle, Clock, Lightbulb, Construction, Eye, AlertCircle, Plus, X, MapPin, Send, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useHazards, type Hazard } from '@/data/hazards'
import { useLocation } from '@/lib/useLocation'

const iconFor = (k: Hazard['kind']) =>
  k === 'broken_light' ? Lightbulb
  : k === 'blocked_walkway' ? Construction
  : k === 'poor_visibility' ? Eye
  : k === 'unsafe_crossing' ? AlertCircle
  : AlertTriangle

const kindLabels: Record<NonNullable<Hazard['kind']>, string> = {
  broken_light: 'Broken streetlight',
  poor_visibility: 'Poor visibility',
  blocked_walkway: 'Blocked walkway',
  unsafe_crossing: 'Unsafe crossing',
  other: 'Other'
}

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
  const [searchParams] = useSearchParams()
  const { coords } = useLocation()
  const lat = searchParams.get('lat') || coords?.lat
  const lng = searchParams.get('lng') || coords?.lng

  const { data, loading, error } = useHazards()
  const [isReporting, setIsReporting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Form State
  const [form, setForm] = useState({
    kind: 'broken_light' as NonNullable<Hazard['kind']>,
    locationMode: (lat && lng) ? 'current' : 'manual' as 'current' | 'manual',
    useCurrentLocation: !!(lat && lng),
    note: '',
    anonymous: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock submission
    setIsReporting(false)
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <div className="p-4 flex flex-col gap-4 relative min-h-full bg-white">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 tracking-tight">
            <AlertTriangle size={20} className="text-brand-600" />
            Structural Audit
          </h1>
          <p className="text-sm text-neutral-500">Report hazards, improve urban safety</p>
        </div>
        <button 
          onClick={() => setIsReporting(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition"
        >
          <Plus size={16} /> Report
        </button>
      </div>

      {isSubmitted && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
          <div>
            <p className="font-bold text-emerald-900 text-sm">Report submitted</p>
            <p className="text-emerald-700 text-xs">Status: Pending review.</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-brand-50 border border-brand-100 p-4 text-sm flex gap-3">
        <div className="w-8 h-8 rounded-full bg-white grid place-items-center shrink-0 shadow-sm">
          <Eye size={16} className="text-brand-600" />
        </div>
        <p className="text-brand-900 leading-relaxed italic">
          Reports are compiled for city councils for physical urban safety improvements. Your reports make a difference.
        </p>
      </div>

      <div>
        <h2 className="text-sm font-bold flex items-center gap-1.5 mb-3 text-neutral-900 uppercase tracking-widest">
          <Clock size={14} /> Live Insights
        </h2>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm p-3 mb-2">
            Couldn't load hazards: {error}
          </div>
        )}

        {loading && (
          <ul className="flex flex-col gap-3">
            {[0, 1, 2].map(i => <li key={i} className="h-20 rounded-2xl bg-neutral-100 animate-pulse" />)}
          </ul>
        )}

        <ul className="flex flex-col gap-3 pb-8">
          {data?.map((h) => {
            const Icon = iconFor(h.kind)
            return (
              <li key={h.id} className="flex gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
                <span className="w-12 h-12 rounded-xl bg-brand-50 grid place-items-center text-brand-600 shrink-0">
                  <Icon size={20} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-neutral-900 leading-tight">{h.title}</h3>
                    {h.status && (
                      <span className={cn('text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap', tone[h.status])}>
                        {h.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 leading-snug">{h.description}</p>
                  <p className="text-[10px] font-medium text-neutral-400 mt-2 uppercase tracking-wide">
                    {h.created_at ? timeAgo(h.created_at) : ''}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Report Form Modal */}
      {isReporting && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 sm:items-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight">Report local hazard</h2>
              <button 
                onClick={() => setIsReporting(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 grid place-items-center text-neutral-500 hover:bg-neutral-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-neutral-900 mb-2">Hazard Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(kindLabels) as Array<keyof typeof kindLabels>).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setForm(s => ({ ...s, kind: k }))}
                      className={cn(
                        "text-xs p-3 rounded-xl border text-left transition-all",
                        form.kind === k 
                          ? "bg-brand-50 border-brand-300 text-brand-700 font-bold" 
                          : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                      )}
                    >
                      {kindLabels[k]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-neutral-900 ml-1">Location</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (coords) setForm(s => ({ ...s, locationMode: 'current', useCurrentLocation: true }))
                      else alert("Please enable location services.")
                    }}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border text-left transition-all",
                      form.locationMode === 'current' ? "bg-brand-50 border-brand-300 ring-1 ring-brand-300" : "bg-white border-neutral-200"
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-lg grid place-items-center shadow-sm", form.locationMode === 'current' ? "bg-brand-500 text-white" : "bg-neutral-50 text-neutral-400")}>
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className={cn("text-sm font-bold leading-tight", form.locationMode === 'current' ? "text-brand-900" : "text-neutral-900")}>Use current location</p>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-tight">Best for live reports</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm(s => ({ ...s, locationMode: 'manual', useCurrentLocation: false }))}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border text-left transition-all",
                      form.locationMode === 'manual' ? "bg-brand-50 border-brand-300 ring-1 ring-brand-300" : "bg-white border-neutral-200"
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-lg grid place-items-center shadow-sm", form.locationMode === 'manual' ? "bg-brand-500 text-white" : "bg-neutral-50 text-neutral-400")}>
                      <Plus size={16} />
                    </div>
                    <div>
                      <p className={cn("text-sm font-bold leading-tight", form.locationMode === 'manual' ? "text-brand-900" : "text-neutral-900")}>Type location manually</p>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-tight">Specify address or landmark</p>
                    </div>
                  </button>
                </div>

                {form.locationMode === 'manual' && (
                  <input 
                    type="text"
                    placeholder="Enter location (e.g. Rua de São José)"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all mt-1 animate-in slide-in-from-top-2 duration-200"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-900 mb-2">Notes (Optional)</label>
                <textarea 
                  value={form.note}
                  onChange={(e) => setForm(s => ({ ...s, note: e.target.value }))}
                  placeholder="Tell us more about the hazard..."
                  className="w-full p-4 rounded-2xl border border-neutral-200 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all min-h-[100px]"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-bold text-neutral-900">Anonymous</p>
                  <p className="text-xs text-neutral-500">Don't show my name</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setForm(s => ({ ...s, anonymous: !s.anonymous }))}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors",
                    form.anonymous ? "bg-brand-600" : "bg-neutral-200"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                    form.anonymous ? "right-1" : "left-1"
                  )} />
                </button>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-600 text-white font-bold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition mt-2"
              >
                <Send size={18} /> Submit report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
