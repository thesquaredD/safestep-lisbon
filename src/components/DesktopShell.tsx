import { Outlet, NavLink } from 'react-router'
import { Map as MapIcon, Shield, Radio, AlertTriangle, User, Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * Desktop shell: ink-purple sidebar (88px) on the left, full-bleed main on the right.
 * The main area has NO max-width on Map, so the map can go corner-to-corner. Other
 * pages may opt-in to a centered container themselves.
 */
export function DesktopShell() {
  return (
    <div className="h-svh flex bg-surface-2 text-[15px]">
      <Sidebar />
      <main className="flex-1 relative overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

const navItems = [
  { to: '/map',       label: 'Map',       icon: MapIcon },
  { to: '/sanctuary', label: 'Sanctuary', icon: Shield },
  { to: '/mesh',      label: 'Mesh',      icon: Radio },
  { to: '/audit',     label: 'Audit',     icon: AlertTriangle },
  { to: '/profile',   label: 'Profile',   icon: User },
]

function Sidebar() {
  return (
    // The grain texture pseudo-element + a soft radial gradient give the dark rail
    // depth without using an image asset.
    <aside
      className={cn(
        'relative w-[88px] shrink-0 flex flex-col items-stretch py-5',
        'bg-ink-900 text-white grain',
      )}
      style={{
        backgroundImage:
          'radial-gradient(120% 60% at 0% 0%, rgba(124,58,237,0.28), transparent 60%), radial-gradient(80% 50% at 100% 100%, rgba(124,58,237,0.12), transparent 60%)',
      }}
    >
      {/* Wordmark — Fraunces is the editorial accent that signals craft. */}
      <div className="px-3 pb-6">
        <Wordmark />
      </div>

      {/* Vertical nav */}
      <nav aria-label="Primary" className="flex-1 nav-stagger">
        <ul className="flex flex-col gap-1 px-2">
          {navItems.map((item, i) => (
            <li key={item.to} style={{ ['--i' as string]: i }}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'group relative flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition',
                    'text-[10px] tracking-wide uppercase',
                    isActive
                      ? 'text-white'
                      : 'text-white/55 hover:text-white hover:bg-white/[0.04]',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active pill — left rail accent. Subtle, not a slab. */}
                    <span
                      className={cn(
                        'absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all',
                        isActive ? 'h-7 bg-brand-400' : 'h-0 bg-transparent',
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        'w-10 h-10 grid place-items-center rounded-xl transition',
                        isActive
                          ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[0_8px_18px_-6px_rgba(124,58,237,0.55)]'
                          : 'bg-white/[0.04] group-hover:bg-white/[0.08]',
                      )}
                    >
                      <item.icon size={18} aria-hidden="true" />
                    </span>
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer card — gentle copy, ties the manifesto into the chrome */}
      <div className="px-3 pt-4">
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 py-3 backdrop-blur-sm">
          <Sparkles size={14} className="text-brand-300 mb-1.5" />
          <p className="font-display text-[13px] leading-tight text-white/95">
            Walk like
            <br />
            you belong.
          </p>
          <p className="text-[10px] text-white/45 mt-1.5 leading-snug">
            Share your route with a trusted contact before walking.
          </p>
        </div>
      </div>
    </aside>
  )
}

function Wordmark() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg viewBox="0 0 32 32" width="30" height="30" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="29" height="29" rx="8" stroke="#b893ff" strokeWidth="1.5" />
        <path
          d="M22 9c-3.5 0-3.5 4-7 4s-3.5 4-7 4"
          stroke="#d6c0ff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="22" cy="9" r="1.5" fill="#d6c0ff" />
        <circle cx="8"  cy="17" r="1.5" fill="#d6c0ff" />
      </svg>
      <span
        className="font-display tracking-[0.18em] text-[10px] text-white/70"
        style={{ fontVariationSettings: '"opsz" 144' }}
      >
        SAFESTEP
      </span>
    </div>
  )
}
