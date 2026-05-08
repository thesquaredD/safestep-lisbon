import { Link } from 'react-router'
import { MessageSquareShare } from 'lucide-react'

export function Header() {
  return (
    <header className="flex items-center justify-between px-3 py-1.5 sm:px-4 sm:py-2 border-b border-neutral-100 bg-white/80 backdrop-blur-md sticky top-0 z-[100]">
      <Link to="/" className="flex items-center gap-2">
        <img src="/safestep-logo.png" alt="SafeStep" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
        <span className="font-bold text-brand-600 tracking-tight text-base sm:text-lg">SAFESTEP</span>
      </Link>
      
      <a 
        href="https://form.typeform.com/to/qFoI8tcr"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors shadow-md active:scale-95"
      >
        <MessageSquareShare size={14} className="sm:w-4 sm:h-4" />
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">Give feedback</span>
      </a>
    </header>
  )
}
