import { useEffect, useRef, useState } from 'react'
import { Search, X, Loader2, MapPin, BookOpen } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useGeocode } from '@/data/geocoder'
import type { LngLat } from '@/data/routes'

/**
 * Two-state search bar:
 *   - resting: a pill that shows the current destination's label + a Legend button
 *   - active:  an input with autocomplete dropdown
 *
 * We use a single component for both desktop and mobile; the parent positions it.
 */
export function SearchBar({
  destination,
  onDestinationChange,
  onLegendClick,
  legendActive = false,
  className,
  isMinimal = false,
  placeholder = "Where to in Lisbon?",
}: {
  destination: LngLat
  onDestinationChange: (dest: LngLat) => void
  onLegendClick?: () => void
  legendActive?: boolean
  className?: string
  isMinimal?: boolean
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const { data: hits, loading } = useGeocode(query)

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
    if (open) requestAnimationFrame(() => inputRef.current?.focus())
  }, [open])

  function pick(hit: { lng: number; lat: number; label: string; context: string }) {
    onDestinationChange({
      lng: hit.lng, lat: hit.lat,
      label: hit.context ? `${hit.label}, ${hit.context.split(', ')[0]}` : hit.label,
    })
    setQuery('')
    setOpen(false)
  }

  if (isMinimal) {
    return (
      <div ref={wrapRef} className={cn('relative w-full', className)}>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full text-left text-[13px] text-[#14101c] font-medium truncate py-0.5"
          >
            {destination?.label ?? placeholder}
          </button>
        )}
        {open && (
          <div className="fixed inset-x-3 top-3 z-[60] bg-surface rounded-2xl border border-black/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 px-5 py-4">
              <Search size={16} className="text-brand-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent outline-none text-[15px] font-medium placeholder:text-neutral-400 text-[#14101c]"
              />
              {loading && <Loader2 size={14} className="text-neutral-400 animate-spin shrink-0" />}
              <button
                type="button"
                onClick={() => { setOpen(false); setQuery('') }}
                className="text-neutral-400 hover:text-neutral-700 -mr-1 w-8 h-8 rounded-full grid place-items-center hover:bg-neutral-100 transition shrink-0"
              >
                <X size={18} />
              </button>
            </div>
            
            {hits && hits.length > 0 && (
              <ul className="border-t border-black/5 max-h-[60vh] overflow-y-auto py-1 bg-white">
                {hits.map(h => (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => pick(h)}
                      className="w-full flex items-start gap-4 px-5 py-3 hover:bg-brand-50/60 text-left transition border-b border-neutral-50 last:border-0"
                    >
                      <span className="w-8 h-8 rounded-lg bg-brand-50 grid place-items-center text-brand-600 shrink-0 mt-0.5">
                        <MapPin size={15} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[14px] font-semibold text-[#14101c] truncate">{h.label}</span>
                        {h.context && <span className="block text-[12px] text-neutral-500 truncate">{h.context}</span>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            
            {(!hits || hits.length === 0) && (
              <div className="p-5 text-center text-neutral-500 text-sm bg-white border-t border-neutral-50">
                {query.length < 2 ? "Type to search..." : "No places found."}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      {/* Resting state */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 bg-surface/95 backdrop-blur-md rounded-full border border-black/5 px-5 py-3 shadow-[var(--shadow-float)] hover:bg-surface transition text-left"
          aria-label="Edit destination"
        >
          <Search size={16} className="text-neutral-500 shrink-0" />
          <span className="text-[14px] flex-1 truncate text-[#14101c]">
            {destination.label ?? `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}`}
          </span>
          {onLegendClick && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); onLegendClick() }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onLegendClick() } }}
              className={cn(
                'text-xs flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full transition cursor-pointer',
                legendActive ? 'bg-brand-100 text-brand-700' : 'text-neutral-600 hover:bg-black/5',
              )}
            >
              <BookOpen size={13} /> Legend
            </span>
          )}
        </button>
      )}

      {/* Active state */}
      {open && (
        <div className="bg-surface/98 backdrop-blur-md rounded-2xl border border-black/5 shadow-[var(--shadow-float)] overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3">
            <Search size={16} className="text-brand-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-neutral-400 text-[#14101c]"
            />
            {loading && <Loader2 size={14} className="text-neutral-400 animate-spin shrink-0" />}
            <button
              type="button"
              onClick={() => { setOpen(false); setQuery('') }}
              className="text-neutral-400 hover:text-neutral-700 -mr-1 w-7 h-7 rounded-full grid place-items-center hover:bg-neutral-100 transition shrink-0"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>

          {/* Results */}
          {hits && hits.length > 0 && (
            <ul className="border-t border-black/5 max-h-[320px] overflow-y-auto py-1">
              {hits.map(h => (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => pick(h)}
                    className="w-full flex items-start gap-3 px-5 py-2.5 hover:bg-brand-50/60 text-left transition"
                  >
                    <span className="w-7 h-7 rounded-lg bg-brand-50 grid place-items-center text-brand-600 shrink-0 mt-0.5">
                      <MapPin size={13} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[13px] font-medium text-[#14101c] truncate">{h.label}</span>
                      {h.context && <span className="block text-[11px] text-neutral-500 truncate">{h.context}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {hits && hits.length === 0 && query.trim().length >= 2 && !loading && (
            <p className="border-t border-black/5 px-5 py-3 text-[12px] text-neutral-500">
              No matches in Lisbon for “{query}”.
            </p>
          )}

          {(!query || query.trim().length < 2) && (
            <p className="border-t border-black/5 px-5 py-3 text-[12px] text-neutral-500">
              Type at least 2 characters to search Lisbon.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
