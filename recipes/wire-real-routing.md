# Recipe: Make the safety scoring real

> **Status:** geometry is now real (OSRM-routed polylines + Nominatim destination search). The numbers in the route options card (92 / 76 / 54) are *placeholders*. **This recipe is the team's first real Gemini exercise** — replacing those numbers with a formula that actually reflects safety.

## When the team asks
*"Make the Safest route actually be safer, not just longer"* / *"Use the safety sliders to re-rank"* / *"Why does the slider not change anything?"*

## Background — what's there now

`src/data/routes.ts` exports `useRoutes(from, to)` which calls OSRM and returns up to three alternatives sorted by duration:

- shortest = `fastest`
- longest  = `safest`
- middle   = `balanced` (when 3 alternatives exist)

Each route gets a hardcoded `score` (92 / 76 / 54). That's the placeholder. Real scoring should look at the *geometry of each route* against:

1. **Sanctuary coverage** — % of the route within ~80 m of any sanctuary
2. **Lighting density** — count of `highway=street_lamp` nodes near the route
3. **Time-of-day weighting** — a multiplier when it's dark
4. **User preferences** — Profile sliders (`Street Lighting`, `Foot Traffic`, `Open Stores`, `Walk Path`, `Visibility`, `Time of Day`)

## Steps

### 1. Add a sanctuary-coverage helper

Use PostGIS to compute, for a given route polyline, what fraction of it is within 80 m of any sanctuary. **Use context7** for current PostGIS / Supabase RPC syntax — don't guess. Sketch:

```sql
-- supabase/migrations/<timestamp>_route_safety.sql
create or replace function route_sanctuary_coverage(line_geojson jsonb, radius_m int default 80)
returns numeric language plpgsql as $$
declare
  line geography;
  total numeric;
  covered numeric;
begin
  line := st_geogfromgeojson(line_geojson);
  total := st_length(line);
  if total = 0 then return 0; end if;
  covered := (
    select coalesce(sum(st_length(st_intersection(line, st_buffer(s.location, radius_m)))), 0)
    from sanctuary_spaces s
  );
  return least(1, covered::numeric / total);
end $$;
```

Call from the client via `supabase.rpc('route_sanctuary_coverage', { line_geojson: r.geometry, radius_m: 80 })`.

### 2. Add a lighting-density helper

OSM has `highway=street_lamp` as point nodes. Two options:

- **One-time scrape:** download the lamp nodes via Overpass API (`https://overpass-api.de/api/interpreter`) once, store as a `street_lamps` table, then count nearby per route via PostGIS. Stable, fast, no rate limit.
- **Live query:** call Overpass at runtime for the route's bounding box. Easier to start, slower for the user.

Start with the one-time scrape. The data refresh cadence for streetlights is "almost never" — once is fine.

### 3. Compute a per-route safety score

In `src/data/routes.ts`, mutate `fetchOsrm` (or wrap it) so each `Route` carries:

```ts
type SafetyComponents = {
  sanctuaryCoverage: number  // 0..1
  lightingDensity:   number  // 0..1 (normalised lamps per 100m)
  duration:          number  // seconds
}
```

Then a `scoreFor(weights, components)` pure function combines them into 0..100:

```ts
function scoreFor(w: Weights, c: SafetyComponents) {
  const s =
      w.lighting * c.lightingDensity
    + w.openStores * c.sanctuaryCoverage  // sanctuaries are mostly stores/cafes
    + w.visibility * c.lightingDensity    // proxy for now
    + w.walkPath  * (1 - timePenalty(c.duration))
    + w.footTraffic * c.sanctuaryCoverage // proxy
    + w.timeOfDay * (isDark() ? 1 : 0.6)
  return Math.round(100 * s / totalWeight(w))
}
```

Then re-sort: highest score = `safest`, lowest = `fastest`, middle = `balanced`. The labels stay; the assignment becomes data-driven.

### 4. Read the sliders from Profile

Today the sliders are component state in `src/pages/Profile.tsx` and don't persist. Two options:

- **Quick:** save to `localStorage` in a `useEffect`; read from localStorage in `useRoutes`.
- **Right:** add a `user_prefs` row in Supabase tied to `auth.uid()`. Requires auth scope — flag for Diogo.

Start with localStorage. Move to Supabase when auth lands.

## Verify
- Slide a slider → routes re-rank → the polyline colors update on the map.
- Pick a destination far from any sanctuary → `Safest` and `Fastest` scores get closer (sanctuary signal vanishes).
- Pick a destination at night (toggle a debug flag or actual time) → time-of-day penalty kicks in.

## Gotchas
- OSRM's public demo only returns up to 3 alternatives and only foot-routing. Don't expect 5 alternatives.
- PostGIS `st_geogfromgeojson` expects valid GeoJSON — pass the route's `geometry` field directly.
- Don't overweight any single factor. The Profile sliders normalise to 0–100; treat them as proportions.
- Rendering 100 lamp markers will tank the map. Aggregate into a heat-map or count-only layer; don't draw individual lamps.
