import { NavLink } from 'react-router'
import { Map, Shield, Radio, User } from 'lucide-react'
import { cn } from '@/lib/cn'

const items = [
  { to: '/map', label: 'Map', icon: Map },
  { to: '/sanctuary', label: 'Sanctuary', icon: Shield },
  { to: '/mesh', label: 'Mesh', icon: Radio },
  { to: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  return (
    <nav className="grid grid-cols-4 border-t border-neutral-200 bg-white" aria-label="Primary">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 py-2.5 text-xs',
              isActive ? 'text-brand-600' : 'text-neutral-500',
            )
          }
        >
          <Icon size={20} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
