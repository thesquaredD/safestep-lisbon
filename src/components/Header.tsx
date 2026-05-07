import { Link } from 'react-router'
import { MessageSquareShare } from 'lucide-react'

export function Header({ onFeedback }: { onFeedback: () => void }) {
  return (
    <header className="flex items-center justify-between px-3 py-1.5 sm:px-4 sm:py-3 border-b border-neutral-200 bg-white">
      <div className="w-8 md:hidden" /> {/* Spacer for centering logo on mobile */}
      <Link to="/" className="flex items-center gap-1.5">
        <Logo />
        <span className="font-bold text-brand-600 tracking-tight text-base sm:text-lg">AFESTEP</span>
      </Link>
      <button 
        onClick={onFeedback}
        className="flex items-center gap-1.5 text-neutral-400 hover:text-brand-600 transition"
        title="Give feedback"
      >
        <MessageSquareShare size={18} />
        <span className="text-[10px] font-bold uppercase tracking-tight hidden sm:inline">Feedback</span>
      </button>
    </header>
  )
}

function Logo() {
  // Stylized "S" path matching the demo's purple route-shaped mark.
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="currentColor" className="text-brand-500 sm:w-7 sm:h-7">
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
