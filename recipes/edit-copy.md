# Recipe: Edit copy / labels / wording

## When the team asks
*"Change 'Continue' to 'Next' in onboarding"* / *"Reword the privacy callout on Mesh"* / *"The Sanctuary description is too long"*

## What to do

1. **Find it.** Use grep / search to locate the text. Most copy lives in:
   - `src/pages/Onboarding.tsx` — onboarding step titles + bodies
   - `src/pages/Mesh.tsx` — mesh explainer + privacy callout
   - `src/pages/Profile.tsx` — section headings, "+ Add Contact" etc.
   - `src/pages/Sanctuary.tsx` — page title, filter chips, CTA button text
   - `src/pages/Audit.tsx` — Live Insights, status pills, body copy
   - `src/components/Header.tsx` — "AFESTEP" wordmark
2. **Edit the JSX text directly.** No i18n / locale system — text is inline.
3. **Verify** by clicking through locally.

## Gotchas
- Mock data (sanctuary names, contact phone numbers, "Sarah Johnson", hazard descriptions) lives in:
  - `supabase/migrations/20260429185225_seed_lisbon.sql` — sanctuaries + hazards in the live DB
  - `src/pages/Profile.tsx` — Sarah Johnson + Mom/Best Friend contacts (hardcoded for the demo)
  Editing the seed migration only affects future seeds. To change live data, edit via Supabase dashboard or write a one-off `update` SQL.
- "AFESTEP" with a stylized S logo is intentional in the original demo (the icon's "S" forms the route shape). If asked to "fix the typo," confirm with the user — it's a brand decision, not a typo.
