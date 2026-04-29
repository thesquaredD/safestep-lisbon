# Recipe: Add a new database table

## When the team asks
*"Add a table for user reviews of sanctuaries"* / *"Track which routes users walked"*

## What to do

### 1. Create a migration
```bash
pnpm supabase migration new <descriptive_name>
```
This creates an empty `supabase/migrations/<timestamp>_<name>.sql`. **Never edit existing migrations** — always create a new one.

### 2. Write the SQL
Copy the pattern from `supabase/migrations/20260429185211_init_schema.sql`. Each table needs:

```sql
create table my_table (
  id uuid primary key default gen_random_uuid(),
  -- columns
  created_at timestamptz not null default now()
);

alter table my_table enable row level security;
create policy "anyone can read my_table"
  on my_table for select to anon, authenticated using (true);
```

For geo data: `location geography(point, 4326) not null` and add a `gist` index. Always create a sibling `_geo` view that exposes `lat` / `lng` columns via `st_y / st_x` so the client can read coords without WKB parsing — see `sanctuary_spaces_geo` for the pattern.

### 3. Apply the migration
```bash
pnpm supabase db push
```
If you get a password prompt, the password is in `.env.supabase.local` (not committed, ask Diogo).

### 4. Regenerate types
```bash
pnpm db:types
```
This rewrites `src/lib/database.types.ts`. **Don't edit that file by hand.**

### 5. Add a fetch hook
Create `src/data/<thing>.ts` mirroring `sanctuaries.ts`:

```ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

export type MyThing = Database['public']['Tables']['my_table']['Row']

export function useMyThings() {
  const [data, setData] = useState<MyThing[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    supabase.from('my_table').select('*').then(({ data, error }) => {
      if (cancelled) return
      if (error) setError(error.message)
      else setData(data ?? [])
    })
    return () => { cancelled = true }
  }, [])
  return { data, error, loading: data === null && !error }
}
```

If the table has writes from the client (e.g., a "submit review" button), add an `insert` policy in the migration and a `submitMyThing(...)` async function in the hook file.

### 6. Verify
- `pnpm build` passes.
- Check Supabase dashboard → Table editor — the table is there with the right columns.
- Hook returns data when called from a page.

## Gotchas
- RLS is on by default in Supabase. Without policies, **all queries return empty** (no error, just no rows). Always add policies.
- `pnpm db:types` requires being logged into Supabase CLI. If it fails: `pnpm supabase login`.
- Don't add a service-role key to the client. The anon key + RLS is the right model.
