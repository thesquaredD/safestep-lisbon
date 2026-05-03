import { Outlet, useLocation, useNavigate, Link } from 'react-router'
import { useEffect, useState } from 'react'
import { Siren, Phone, X, User as UserIcon, AlertTriangle } from 'lucide-react'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { DesktopShell } from './DesktopShell'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { cn } from '@/lib/cn'

const ONBOARDING_KEY = 'safestep:onboarded'
const CONTACT_KEY = 'safestep:emergency_contact'

/**
 * Branches between two shells based on viewport.
 * Mobile: phone-frame stack (header + Outlet + bottom nav) — unchanged.
 * Desktop: ink-purple sidebar + full-bleed main (DesktopShell renders its own Outlet).
 */
export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false)
  const [contact, setContact] = useState<{ name: string; phone: string } | null>(null)

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY) && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true })
    }
  }, [location.pathname, navigate])

  // Sync contact when emergency modal opens
  useEffect(() => {
    if (isEmergencyOpen) {
      const saved = localStorage.getItem(CONTACT_KEY)
      setContact(saved ? JSON.parse(saved) : null)
    }
  }, [isEmergencyOpen])

  if (isDesktop) return <DesktopShell />

  const isMapPage = location.pathname === '/map'
  const isWalkPage = location.pathname === '/walk'
  const showSOS = location.pathname !== '/onboarding'

  return (
    <div className="phone-frame flex flex-col h-svh bg-surface overflow-hidden relative">
      <Header />
      <main className="flex-1 overflow-y-auto relative">
        <Outlet />
        
        {/* Global SOS Button (Mobile) */}
        {showSOS && (
          <button
            onClick={() => setIsEmergencyOpen(true)}
            className={cn(
              "fixed left-4 z-40 w-14 h-14 rounded-full bg-risk text-white grid place-items-center shadow-lg shadow-red-500/40 active:scale-90 transition-transform",
              // Adjust position if we're on a page with a specific bottom drawer
              (isMapPage || isWalkPage) ? "bottom-24" : "bottom-20"
            )}
            aria-label="Emergency SOS"
          >
            <Siren size={28} className="animate-pulse" />
          </button>
        )}
      </main>
      <BottomNav />

      {/* Emergency Modal */}
      {isEmergencyOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-md p-4 sm:items-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 grid place-items-center">
                  <AlertTriangle size={24} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Emergency</h2>
              </div>
              <button 
                onClick={() => setIsEmergencyOpen(false)}
                className="w-10 h-10 rounded-full bg-neutral-100 grid place-items-center text-neutral-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <a 
                href="tel:112"
                className="flex items-center justify-between p-5 rounded-2xl bg-risk text-white shadow-lg shadow-red-500/20 active:scale-[0.98] transition"
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
                  className="flex items-center justify-between p-5 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/20 active:scale-[0.98] transition"
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

