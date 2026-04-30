import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'
import { FALLBACK_SANCTUARIES } from './fallback_sanctuaries'

export type Sanctuary = Database['public']['Views']['sanctuary_spaces_geo']['Row']

export function useSanctuaries() {
  const [data, setData] = useState<Sanctuary[] | null>(null)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('sanctuary_spaces_geo')
      .select('*')
      .order('name')
      .then(({ data: dbData, error }) => {
        if (cancelled) return
        
        // Merge DB data with Fallback data
        // We deduplicate by name to avoid showing the same place twice if it was pushed to DB
        const existingNames = new Set((dbData ?? []).map(s => s.name?.toLowerCase()))
        const combined = [
          ...(dbData ?? []),
          ...FALLBACK_SANCTUARIES.filter(f => !existingNames.has(f.name?.toLowerCase()))
        ]

        if (error) {
          console.warn('Supabase fetch failed, using fallback data only:', error.message)
          setData(FALLBACK_SANCTUARIES)
        } else {
          setData(combined)
        }
      })
    return () => { cancelled = true }
  }, [])

  return { data, error: null, loading: data === null }
}
