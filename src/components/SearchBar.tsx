import { useEffect, useRef, useState } from 'react'
import { Search, X, Loader2, MapPin, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useGeocode } from '@/data/geocoder'
import type { LngLat } from '@/data/routes'

export function SearchBar({
  destination,
  onDestinationChange,
  onLegendClick,
  className,
  isMinimal = false,
  placeholder = "Where to in Lisbon?",
  triggerOpen = 0,
}: {
  destination: LngLat
  onDestinationChange: (dest: LngLat) => void
  onLegendClick?: () => void
  className?: string
  isMinimal?: boolean
  placeholder?: string
  triggerOpen?: number
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const { data: hits, loading, error } = useGeocode(query)

  // DEBUG LOGS
  useEffect(() => {
    if (query.length >= 2) {
      console.log(`[SearchBar] Query: "${query}", Loading: ${loading}, Hits: ${hits?.length ?? 0}, Error: ${error}`)
    }
  }, [query, loading, hits, error])

  // External trigger to open
  useEffect(() => {
    if (triggerOpen > 0) setOpen(true)
  }, [triggerOpen])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // When opening, focus the input
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  function pick(hit: { lng: number; lat: number; label: string; context: string }) {
    console.log('[SearchBar] Tapped result:', hit.label)
    onDestinationChange({
      lng: hit.lng, lat: hit.lat,
      label: hit.label,
    })
    setQuery('')
    setOpen(false)
  }

  // Common inner content to ensure consistency between fixed/absolute modes
  const renderDropdownContent = () => (
    <div className="flex-1 overflow-y-auto bg-white border-t border-black/5 min-h-[100px]">
      {/* VISIBLE DEBUG OVERLAY (Temporary) */}
      <div className="bg-brand-50/50 px-5 py-2 text-[10px] font-mono text-brand-600 border-b border-brand-100 flex justify-between items-center">
        <span>DEBUG: {loading ? 'SEARCHING...' : error ? 'ERROR' : `${hits?.length ?? 0} HITS`}</span>
        {query.length > 0 && <span className="opacity-50">"{query}"</span>}
      </div>

      {loading && (
        <div className="p-8 flex flex-col items-center justify-center gap-3 text-neutral-400">
           <Loader2 size={24} className="animate-spin text-brand-500" />
           <p className="text-sm font-medium animate-pulse">Searching Lisbon...</p>
        </div>
      )}

      {error && (
        <div className="p-8 text-center space-y-3">
           <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full grid place-items-center mx-auto">
             <AlertCircle size={24} />
           </div>
           <div>
             <p className="text-sm font-bold text-neutral-800">Search service unavailable</p>
             <p className="text-xs text-neutral-500 mt-1">{error}</p>
           </div>
           <button onClick={() => setQuery(q => q + ' ')} className="px-4 py-2 bg-neutral-100 rounded-lg text-xs font-bold">Retry</button>
        </div>
      )}

      {!loading && !error && hits && hits.length > 0 && (
        <ul className="divide-y divide-neutral-50">
          {hits.map(h => (
            <li key={h.id}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); pick(h) }} // onMouseDown triggers before onBlur
                className="w-full flex items-start gap-4 px-5 py-4 hover:bg-brand-50/60 text-left transition active:bg-brand-100"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0 mt-0.5 shadow-sm">
                  <MapPin size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[15px] text-[#14101c] truncate leading-tight">{h.label}</p>
                  <p className="text-[12px] text-neutral-500 truncate mt-0.5">{h.context}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && query.length >= 2 && (!hits || hits.length === 0) && (
        <div className="p-10 text-center space-y-2">
           <p className="text-sm font-bold text-neutral-800">No matches found</p>
           <p className="text-xs text-neutral-500 leading-relaxed">
             We couldn't find "{query}" in the Lisbon area. Try a more specific street name.
           </p>
        </div>
      )}

      {query.length < 2 && !loading && (
        <div className="p-10 text-center opacity-40">
           <Search size={32} className="mx-auto mb-3 text-neutral-300" />
           <p className="text-xs font-medium uppercase tracking-widest">Type to search streets & places</p>
        </div>
      )}
    </div>
  )

  const renderInputArea = () => (
    <div className="flex items-center gap-3 px-5 py-4 shrink-0">
      <Search size={20} className="text-brand-500 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-[16px] font-medium placeholder:text-neutral-300 text-[#14101c]"
      />
      {(loading) && <Loader2 size={18} className="text-brand-400 animate-spin shrink-0" />}
      <button
        type="button"
        onClick={() => { setOpen(false); setQuery('') }}
        className="text-neutral-400 hover:text-neutral-700 -mr-1 w-9 h-9 rounded-full grid place-items-center hover:bg-neutral-100 transition shrink-0"
      >
        <X size={20} />
      </button>
    </div>
  )

  if (isMinimal) {
    return (
      <div ref={wrapRef} className={cn('relative w-full', className)}>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full text-left text-[14px] text-[#14101c] font-medium truncate py-1"
          >
            {destination?.label ?? placeholder}
          </button>
        )}
        {open && (
          <div className="fixed inset-0 z-[9999] bg-white flex flex-col animate-in fade-in duration-200">
            <div className="safe-area-top bg-white" />
            {renderInputArea()}
            {renderDropdownContent()}
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 bg-white rounded-xl border border-neutral-200 px-4 py-3 shadow-sm hover:border-brand-300 transition text-left"
        >
          <Search size={18} className="text-neutral-400 shrink-0" />
          <span className="text-[14px] flex-1 truncate text-[#14101c]">
            {destination?.label ?? placeholder}
          </span>
          {onLegendClick && (
            <span onClick={(e) => { e.stopPropagation(); onLegendClick() }} className="text-xs text-brand-600 font-bold px-2 py-1 rounded-lg bg-brand-50 hover:bg-brand-100">Legend</span>
          )}
        </button>
      )}

      {open && (
        <div className="absolute top-0 left-0 right-0 bg-white rounded-2xl border border-black/10 shadow-2xl overflow-hidden flex flex-col z-[9999] animate-in zoom-in-95 duration-200 min-w-[320px]">
          {renderInputArea()}
          {renderDropdownContent()}
        </div>
      )}
    </div>
  )
}
