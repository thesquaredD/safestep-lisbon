# Recipes

Each file in this folder is a **template for a common change** to SafeStep. They're written for Gemini CLI to read — the team types something like *"add a hazard severity rating"* and Gemini consults the right recipe.

Recipes describe **what files to touch**, **the order of operations**, and **the gotchas**. They are not strict procedures — Gemini should adapt them to the specific request.

| Recipe | What it covers |
|---|---|
| [add-page.md](./add-page.md) | New screen with a route + bottom-nav entry |
| [add-table.md](./add-table.md) | New Supabase table with migration, RLS, types, hook |
| [add-sanctuary.md](./add-sanctuary.md) | Add a single sanctuary entry without a migration |
| [edit-copy.md](./edit-copy.md) | Change wording, labels, error messages |
| [change-route-weights.md](./change-route-weights.md) | Tune the safety scoring sliders' defaults / behavior |
| [wire-real-routing.md](./wire-real-routing.md) | Replace the demo polylines with real OSRM/ORS routing |
