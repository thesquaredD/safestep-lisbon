import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

export type Hazard = Database['public']['Views']['hazard_reports_geo']['Row']

export function useHazards() {
  const [data, setData] = useState<Hazard[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('hazard_reports_geo')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) setError(error.message)
        else setData(data ?? [])
      })
    return () => { cancelled = true }
  }, [])

  return { data, error, loading: data === null && !error }
}
