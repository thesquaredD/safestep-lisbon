import { Outlet, useLocation, useNavigate } from 'react-router'
import { useEffect } from 'react'
import { BottomNav } from './BottomNav'
import { Header } from './Header'

const ONBOARDING_KEY = 'safestep:onboarded'

export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY) && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true })
    }
  }, [location.pathname, navigate])

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
