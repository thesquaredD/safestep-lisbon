# Recipe: Add or remove a sanctuary

## When the team asks
*"Add Café X to the sanctuary list"* / *"Remove the closed Loja da Atalaia"*

## What to do

This is a **data change**, not a code change — there's no migration or code deploy involved.

### Add

1. Open Supabase dashboard → Table Editor → `sanctuary_spaces`.
2. Click "Insert row" and fill in:
   - `name` (e.g., "Café Pessoa")
   - `kind` (`cafe` / `pharmacy` / `bar` / `store`)
   - `address` (street + neighborhood)
   - `description` (one-line, what makes it a sanctuary)
   - `location` — click the geography editor and pick the location on the map. Or use SQL: `st_setsrid(st_makepoint(<lng>, <lat>), 4326)::geography`
   - `is_open_now` (boolean)
   - `hours_text` (e.g., "Open 24h")
   - `verified` (true if the team has confirmed it)
3. Save. The app picks it up on next page load.

### Remove

Same UI, click the row → delete. Or `delete from sanctuary_spaces where name = 'X';` in SQL editor.

### Bulk add (5+ entries)

Use the SQL editor with an `insert into ... values (...)` block. Copy the format from `supabase/migrations/20260429185225_seed_lisbon.sql`.

## When NOT to use this recipe

If the change is "add a new *type* of sanctuary" (not a new entry, but a new category like `nightclub`), that's a schema change — see `add-table.md` (specifically, alter the `sanctuary_kind` enum).

## Gotchas
- Coordinates are `[longitude, latitude]` for `st_makepoint`, not `[lat, lng]`. Easy to swap.
- Lisbon's longitudes are negative (`-9.13...`), latitudes are positive (`38.71...`). If your dot lands in Africa, you flipped them.
