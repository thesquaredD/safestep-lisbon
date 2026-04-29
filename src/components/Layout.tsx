import { Outlet, useLocation, useNavigate } from 'react-router'
import { useEffect } from 'react'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { DesktopShell } from './DesktopShell'
import { useMediaQuery } from '@/lib/useMediaQuery'

const ONBOARDING_KEY = 'safestep:onboarded'

/**
 * Branches between two shells based on viewport.
 * Mobile: phone-frame stack (header + Outlet + bottom nav) — unchanged.
 * Desktop: ink-purple sidebar + full-bleed main (DesktopShell renders its own Outlet).
 *
 * Resizing across the breakpoint will re-mount page state. Acceptable trade-off
 * for the simplicity of swapping the entire layout.
 */
export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY) && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true })
    }
  }, [location.pathname, navigate])

  if (isDesktop) return <DesktopShell />

  return (
    <div className="phone-frame flex flex-col h-svh bg-surface">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
