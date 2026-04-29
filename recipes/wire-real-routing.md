# Recipe: Replace demo polylines with real routing

## When the team asks
*"Make the routes actually follow the streets"* / *"Use real Lisbon routing"* / *"Different start/end points should work"*

## Background

`src/data/routes.ts` currently exports three hardcoded GeoJSON LineStrings between fixed origin (Rua de São José) and destination (Praça do Comércio). For real routing, we need a routing engine that:

1. Takes origin + destination + a **preference** (safest / balanced / fastest)
2. Returns a polyline that follows actual streets

## Recommended path: OSRM public demo (free, no key)

OSRM exposes `/route/v1/foot/{lng1,lat1};{lng2,lat2}?alternatives=true&overview=full&geometries=geojson`. The public demo at `router.project-osrm.org` is fine for a class demo (no real users). For production, self-host OSRM or switch to OpenRouteService (2000 req/day free with API key signup).

## Steps

1. **Use context7** to fetch current OSRM API docs:
   - `context7.resolve-library-id` for "OSRM" or "OpenRouteService"
   - `context7.query-docs` with the right ID for "fetch routes with alternatives in GeoJSON"
2. **Replace `src/data/routes.ts`** with a fetch-based implementation. Sketch:

   ```ts
   export async function fetchRoutes(from: LngLat, to: LngLat) {
     const url = `https://router.project-osrm.org/route/v1/foot/${from.lng},${from.lat};${to.lng},${to.lat}?alternatives=true&overview=full&geometries=geojson`
     const res = await fetch(url)
     const json = await res.json()
     // json.routes is an array of up to 3 alternatives. Sort by duration:
     //   shortest = 'fastest', longest = 'safest', middle = 'balanced'.
     // Return them in our { id, label, score, minutes, km, geometry } shape.
   }
   ```

3. **Add a `useRoutes(from, to)` hook** in `src/data/routes.ts` so pages can do `const { data, loading } = useRoutes(...)`.
4. **Wire `MapView.tsx`** to receive routes as a prop instead of importing the static `allRoutesFeature()`.
5. **Score the routes.** OSRM gives you duration and distance, not safety. Compute a "safety score" by counting how many sanctuary spaces are within 50m of each polyline (cheap PostGIS query: `st_dwithin`). Highest sanctuary-coverage = safest. Use the user's slider weights from Profile to mix this with duration.

## Verify
- Try several origin/destination pairs.
- Confirm the 3 routes are genuinely different (they should be — `alternatives=true` returns up to 3).
- Confirm the map fits all 3 routes (use `fitBounds` after fetch).

## Gotchas
- OSRM's public demo is rate-limited and could go down. If the demo dies, swap to ORS with an API key (free signup).
- Route geometry is `[lng, lat]` (not `[lat, lng]`). Same convention as our hardcoded routes.
- If the user picks two points outside Lisbon, OSRM still routes — but our sanctuary scoring will return zero. That's fine, just don't crash.
