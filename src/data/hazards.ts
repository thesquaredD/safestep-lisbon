import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

export type Hazard = Database['public']['Views']['hazard_reports_geo']['Row'] & { 
  is_local?: boolean 
}

const LOCAL_HAZARDS_KEY = 'safestep:local_hazards'

export function useHazards() {
  const [data, setData] = useState<Hazard[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => setRefreshKey(s => s + 1), [])

  useEffect(() => {
    let cancelled = false
    
    async function load() {
      const { data: dbData, error: dbError } = await supabase
        .from('hazard_reports_geo')
        .select('*')
        .order('created_at', { ascending: false })

      if (cancelled) return
      
      if (dbError) {
        setError(dbError.message)
        return
      }

      // Load local hazards
      const localRaw = localStorage.getItem(LOCAL_HAZARDS_KEY)
      const localHazards: Hazard[] = localRaw ? JSON.parse(localRaw) : []
      
      const combined = [
        ...localHazards.map(h => ({ ...h, is_local: true })),
        ...(dbData ?? [])
      ].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
        return dateB - dateA
      })

      setData(combined)
    }

    load()
    return () => { cancelled = true }
  }, [refreshKey])

  return { data, error, loading: data === null && !error, refresh }
}

export function saveLocalHazard(hazard: Omit<Hazard, 'id' | 'created_at' | 'status'>) {
  const localRaw = localStorage.getItem(LOCAL_HAZARDS_KEY)
  const localHazards: Hazard[] = localRaw ? JSON.parse(localRaw) : []
  
  const newHazard: Hazard = {
    ...hazard,
    id: `local-${Date.now()}`,
    created_at: new Date().toISOString(),
    status: 'new', // Shows as "Pending review" in UI
  }
  
  localStorage.setItem(LOCAL_HAZARDS_KEY, JSON.stringify([newHazard, ...localHazards]))
  return newHazard
}
