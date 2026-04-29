import { Popup } from 'react-map-gl/maplibre'
import {
  X, Coffee, Cross, Beer, Store, Lightbulb, Construction, Eye, AlertCircle,
  AlertTriangle, Home as HomeIcon, Flag, ArrowUpRight,
} from 'lucide-react'
import type { Sanctuary } from '@/data/sanctuaries'
import type { Hazard } from '@/data/hazards'
import { ORIGIN, DESTINATION } from '@/data/routes'

/* ─────────────────────────────────────────────────────────────────────────
   The popup is the screenshot moment for this app. We hide every default
   MapLibre styling (see index.css) and render a card that matches the rest
   of the floating chrome. One component renders all four kinds.
   ───────────────────────────────────────────────────────────────────────── */

export type PopupSelection =
  | { kind: 'origin' }
  | { kind: 'destination' }
  | { kind: 'sanctuary'; data: Sanctuary }
  | { kind: 'hazard'; data: Hazard }

export function MapPopup({
  selection,
  onClose,
}: {
  selection: PopupSelection
  onClose: () => void
}) {
  const v = renderable(selection)
  if (!v) return null

  return (
    <Popup
      longitude={v.lng}
      latitude={v.lat}
      // 'auto' lets MapLibre flip the popup to the side with the most space —
      // critical on small viewports where a 'bottom' anchor would clip into
      // the search bar above.
      anchor={undefined}
      offset={v.offset}
      closeButton={false}
      closeOnClick={false}
      onClose={onClose}
      maxWidth="320px"
    >
      <article
        className="popup-card relative w-[280px] md:w-[320px] rounded-2xl bg-surface border border-black/5 overflow-hidden"
        // Strong drop shadow with a brand-purple cast — ties to the rest of
        // the floating chrome.
        style={{ boxShadow: 'var(--shadow-float)' }}
      >
        {/* Header row: marker chip + title + close. The chip uses the same
            visual language as the markers on the map itself, so users feel
            the popup "comes from" the marker they tapped. */}
        <header className="flex items-start gap-3 px-4 pt-4">
          <span
            className={
              'shrink-0 w-10 h-10 rounded-xl grid place-items-center text-white shadow-sm ' +
              v.chipBg
            }
            aria-hidden="true"
          >
            <v.icon size={18} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-display text-[17px] leading-tight font-medium text-[#14101c] truncate">
              {v.title}
            </p>
            {v.eyebrow && (
              <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500 mt-1">
                {v.eyebrow}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 -mr-1 -mt-1 w-7 h-7 rounded-full grid place-items-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
          >
            <X size={14} />
          </button>
        </header>

        {/* Status pill (own row so it can never clip the title) */}
        {v.tag && (
          <div className="px-4 pt-2">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${v.tagClass}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
              {v.tag}
            </span>
          </div>
        )}

        {/* Body: address + description */}
        <div className="px-4 py-3 space-y-2">
          {v.address && (
            <p className="text-[13px] text-neutral-600 leading-snug">
              {v.address}
            </p>
          )}
          {v.body && (
            <p className="text-[13px] text-neutral-700 leading-relaxed line-clamp-3">
              {v.body}
            </p>
          )}
        </div>

        {/* CTA — only when it's a real action (sanctuary / destination) */}
        {v.cta && (
          <footer className="px-4 pb-4">
            <button
              type="button"
              onClick={v.cta.onClick}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white text-[13px] font-medium py-2.5 transition shadow-sm"
            >
              {v.cta.label}
              <ArrowUpRight size={14} />
            </button>
          </footer>
        )}

        {/* Decorative bottom accent — single hairline tied to the marker color.
            Subtle, but it's the kind of detail that separates this from a generic card. */}
        <span
          className="absolute left-0 right-0 bottom-0 h-[2px]"
          style={{ background: v.accent, opacity: 0.85 }}
          aria-hidden="true"
        />
      </article>
    </Popup>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Resolve a Selection to a flat view-model. Keeps the JSX above clean and
   makes adding new kinds (e.g. user location, transit stop) a one-case add.
   ───────────────────────────────────────────────────────────────────────── */

type View = {
  lng: number; lat: number;
  offset: number;
  icon: React.ElementType;
  chipBg: string;        // tailwind classes for the icon chip background
  accent: string;        // hex for the bottom hairline
  title: string;
  eyebrow?: string;
  tag?: string;
  tagClass?: string;     // tailwind classes for the status pill
  address?: string;
  body?: string;
  cta?: { label: string; onClick: () => void };
}

function renderable(sel: PopupSelection): View | null {
  if (sel.kind === 'origin') {
    return {
      lng: ORIGIN.lng, lat: ORIGIN.lat, offset: 30,
      icon: HomeIcon,
      chipBg: 'bg-gradient-to-br from-brand-500 to-brand-700',
      accent: '#7c3aed',
      title: 'Home',
      eyebrow: 'Starting point',
      address: ORIGIN.label.replace(/^Home — /, ''),
    }
  }
  if (sel.kind === 'destination') {
    return {
      lng: DESTINATION.lng, lat: DESTINATION.lat, offset: 30,
      icon: Flag,
      chipBg: 'bg-gradient-to-br from-rose-500 to-red-600',
      accent: '#ef4444',
      title: 'Destination',
      eyebrow: 'Where you’re going',
      address: DESTINATION.label,
    }
  }
  if (sel.kind === 'sanctuary') {
    const s = sel.data
    if (s.lat == null || s.lng == null) return null
    const Icon =
      s.kind === 'cafe' ? Coffee
      : s.kind === 'pharmacy' ? Cross
      : s.kind === 'bar' ? Beer
      : Store
    const label = labelForSanctuaryKind(s.kind)
    return {
      lng: s.lng, lat: s.lat, offset: 22,
      icon: Icon,
      chipBg: 'bg-gradient-to-br from-brand-500 to-brand-700',
      accent: '#7c3aed',
      title: s.name ?? 'Sanctuary',
      eyebrow: label,
      tag: s.is_open_now ? 'Open now' : 'Closed',
      tagClass: s.is_open_now
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-neutral-100 text-neutral-500',
      address: s.address ?? undefined,
      body: s.description ?? undefined,
      cta: {
        label: 'Get directions',
        onClick: () => {
          // Hand off to the underlying device map for now; routing UI can
          // intercept this later (recipes/wire-real-routing.md).
          if (s.lat != null && s.lng != null) {
            window.open(
              `https://www.openstreetmap.org/directions?from=&to=${s.lat},${s.lng}`,
              '_blank',
              'noopener',
            )
          }
        },
      },
    }
  }
  // hazard
  const h = sel.data
  if (h.lat == null || h.lng == null) return null
  const Icon =
    h.kind === 'broken_light' ? Lightbulb
    : h.kind === 'blocked_walkway' ? Construction
    : h.kind === 'poor_visibility' ? Eye
    : h.kind === 'unsafe_crossing' ? AlertCircle
    : AlertTriangle
  const tagClass =
    h.status === 'resolved' ? 'bg-emerald-50 text-emerald-700'
    : h.status === 'verified' ? 'bg-amber-50 text-amber-700'
    : 'bg-amber-50 text-amber-700'
  return {
    lng: h.lng, lat: h.lat, offset: 18,
    icon: Icon,
    chipBg: 'bg-gradient-to-br from-amber-400 to-amber-600',
    accent: '#f59e0b',
    title: h.title ?? 'Hazard',
    eyebrow: 'Hazard report',
    tag: h.status ? capitalize(h.status) : undefined,
    tagClass,
    body: h.description ?? undefined,
  }
}

function labelForSanctuaryKind(k: Sanctuary['kind']): string {
  if (k === 'cafe') return 'Café · Sanctuary'
  if (k === 'pharmacy') return 'Pharmacy · Sanctuary'
  if (k === 'bar') return 'Bar · Sanctuary'
  if (k === 'store') return 'Store · Sanctuary'
  return 'Sanctuary'
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
