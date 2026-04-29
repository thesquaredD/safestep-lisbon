import { useEffect, useState } from 'react'

/**
 * Reactively reads a CSS media query. Used to swap mobile / desktop shells.
 * SSR-safe via the lazy initialiser; we have no SSR today, but this keeps
 * the hook portable.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mql.matches)  // resync after mount
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}
