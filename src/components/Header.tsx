import { Link } from 'react-router'
import { MessageSquareShare } from 'lucide-react'

export function Header() {
  return (
    <header className="flex items-center justify-between px-3 py-1.5 sm:px-4 sm:py-2 border-b border-neutral-100 bg-white/80 backdrop-blur-md sticky top-0 z-[100]">
      <Link to="/" className="flex items-center gap-1.5">
        <Logo />
        <span className="font-bold text-brand-600 tracking-tight text-base sm:text-lg">SAFESTEP</span>
      </Link>
      
      <a 
        href="https://form.typeform.com/to/qFoI8tcr"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-2.5 py-1.25 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors shadow-sm active:scale-95"
      >
        <MessageSquareShare size={14} className="sm:w-4 sm:h-4" />
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">Give feedback</span>
      </a>
    </header>
  )
}

function Logo() {
  return (
    <svg viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="currentColor" className="text-brand-500 sm:w-6 sm:h-6">
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" strokeWidth="2" />
      <path
        d="M22 9c-3.5 0-3.5 4-7 4s-3.5 4-7 4"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="22" cy="9" r="2" fill="currentColor" />
      <circle cx="8" cy="17" r="2" fill="currentColor" />
    </svg>
  )
}
