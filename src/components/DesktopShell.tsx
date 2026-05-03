import { Outlet, NavLink, Link } from 'react-router'
import { Map as MapIcon, Shield, Radio, AlertTriangle, User, Sparkles, Siren, X, Phone, User as UserIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/cn'

const CONTACT_KEY = 'safestep:emergency_contact'

/**
 * Desktop shell: ink-purple sidebar (88px) on the left, full-bleed main on the right.
 * The main area has NO max-width on Map, so the map can go corner-to-corner. Other
 * pages may opt-in to a centered container themselves.
 */
export function DesktopShell() {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false)
  const [contact, setContact] = useState<{ name: string; phone: string } | null>(null)

  // Sync contact when emergency modal opens
  useEffect(() => {
    if (isEmergencyOpen) {
      const saved = localStorage.getItem(CONTACT_KEY)
      setContact(saved ? JSON.parse(saved) : null)
    }
  }, [isEmergencyOpen])

  return (
    <div className="h-svh flex bg-surface-2 text-[15px]">
      <Sidebar onSOS={() => setIsEmergencyOpen(true)} />
      <main className="flex-1 relative overflow-y-auto">
        <Outlet />
      </main>

      {/* Emergency Modal (Shared logic with mobile) */}
      {isEmergencyOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 grid place-items-center">
                  <AlertTriangle size={24} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Emergency</h2>
              </div>
              <button 
                onClick={() => setIsEmergencyOpen(false)}
                className="w-10 h-10 rounded-full bg-neutral-100 grid place-items-center text-neutral-500 hover:bg-neutral-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <a 
                href="tel:112"
                className="flex items-center justify-between p-5 rounded-2xl bg-risk text-white shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 grid place-items-center">
                    <Phone size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xl leading-none">Call 112</p>
                    <p className="text-red-100 text-sm mt-1">Police & Emergency</p>
                  </div>
                </div>
              </a>

              {contact ? (
                <a 
                  href={`tel:${contact.phone}`}
                  className="flex items-center justify-between p-5 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 grid place-items-center">
                      <UserIcon size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-xl leading-none">Call {contact.name}</p>
                      <p className="text-brand-100 text-sm mt-1">Emergency Contact</p>
                    </div>
                  </div>
                </a>
              ) : (
                <Link 
                  to="/profile" 
                  onClick={() => setIsEmergencyOpen(false)}
                  className="flex items-center justify-between p-5 rounded-2xl border-2 border-dashed border-neutral-200 text-neutral-500 hover:border-brand-200 hover:text-brand-600 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-50 grid place-items-center">
                      <UserIcon size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg leading-none">Add Emergency Contact</p>
                      <p className="text-xs mt-1 text-neutral-400">Set this up in your Profile</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            <p className="text-center text-xs text-neutral-400 mt-8 leading-relaxed">
              SafeStep is a prototype. In a real emergency, always call local authorities immediately.
            </p>
          </div>
        </div>
      )}
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

function Sidebar({ onSOS }: { onSOS: () => void }) {
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
          
          {/* Global SOS Button in Desktop Sidebar */}
          <li className="mt-4 px-2">
            <button
              onClick={onSOS}
              className="w-10 h-10 mx-auto rounded-xl bg-risk text-white grid place-items-center shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95 transition-all"
              title="Emergency SOS"
            >
              <Siren size={18} className="animate-pulse" />
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer — minimal. The dark rail itself carries the manifesto tone;
          a verbose card would only look squeezed in the 88px width. */}
      <div className="pt-4 pb-2 px-3 flex flex-col items-center gap-1.5">
        <Sparkles size={12} className="text-brand-300/80" />
        <p
          className="font-display text-[10px] tracking-[0.22em] uppercase text-white/40 text-center leading-[1.4]"
          style={{ fontVariationSettings: '"opsz" 36' }}
        >
          Lisboa
          <br />
          v0.1
        </p>
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
