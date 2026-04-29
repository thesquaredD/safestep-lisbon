import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

export type Sanctuary = Database['public']['Views']['sanctuary_spaces_geo']['Row']

export function useSanctuaries() {
  const [data, setData] = useState<Sanctuary[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('sanctuary_spaces_geo')
      .select('*')
      .order('name')
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) setError(error.message)
        else setData(data ?? [])
      })
    return () => { cancelled = true }
  }, [])

  return { data, error, loading: data === null && !error }
}
