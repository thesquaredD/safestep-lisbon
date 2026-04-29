import { Link } from 'react-router'

export function Header() {
  return (
    <header className="flex items-center justify-center gap-2 py-3 border-b border-neutral-200 bg-white">
      <Link to="/map" className="flex items-center gap-1.5">
        <Logo />
        <span className="font-bold text-brand-600 tracking-tight text-lg">AFESTEP</span>
      </Link>
    </header>
  )
}

function Logo() {
  // Stylized "S" path matching the demo's purple route-shaped mark.
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" className="text-brand-500">
      <rect x="1.5" y="1.5" width="29" height="29" rx="7" strokeWidth="1.5" />
      <path
        d="M22 9c-3.5 0-3.5 4-7 4s-3.5 4-7 4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="22" cy="9" r="1.5" fill="currentColor" />
      <circle cx="8" cy="17" r="1.5" fill="currentColor" />
    </svg>
  )
}
