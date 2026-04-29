# Recipe: Change the safety scoring weights

## When the team asks
*"Make the Safest route default to higher weight on lighting"* / *"Add a new factor for 'Police presence'"* / *"Show a different score for night-time"*

## What to do

The Profile page has 6 sliders (Street Lighting, Foot Traffic, Open Stores, Walk Path, Visibility, Time of Day). They're in `src/pages/Profile.tsx`, defined in the `FACTORS` const.

### Add a factor
1. Add a new entry to the `FACTORS` array in `Profile.tsx`. Each entry has `key`, `emoji`, `label`, `initial` (0–100).
2. If the factor needs to influence routing, plumb the value into `src/data/routes.ts`. **Today, routes are hardcoded polylines** — the sliders don't actually change anything. Wiring them to real scoring requires either:
   - Real routing (see `wire-real-routing.md`), where you'd send weights to OSRM/ORS as profile preferences, or
   - A client-side scoring formula that re-orders the 3 alternatives based on factor weights.

### Change a default
Edit the `initial` field on the factor entry.

### Persist user adjustments
Currently the sliders live in component state — they reset on reload. To persist:
- **Quick:** save to `localStorage` in a `useEffect`.
- **Right:** add a `user_prefs` table in Supabase (see `add-table.md`) and require auth. Confirm scope with the user before going down this path.

## Gotchas
- The sliders right now are cosmetic. If a user expects them to affect the route order, they will be disappointed. When the team asks for "more weight on lighting" and the sliders don't actually do anything yet, **flag this to them** — they may not realize the demo limitation.
- The score numbers on Map (92 / 76 / 54) are in `src/pages/Map.tsx` `routes` array — also hardcoded for the demo.
