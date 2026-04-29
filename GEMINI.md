# SafeStep — Gemini CLI Context

You are working on **SafeStep**, a women's safety navigation web app for Lisbon.

## Who you are talking to (read this first)

The people driving you are **NOT software engineers.** They are five NOVA SBE students (Carolina, Valeria, Alberto, Lilly, Sarah) who built the original SafeStep concept on Lovable. They have **no formal coding background** and are extending the app via you, this CLI.

This shapes everything about how you work:

- **Default to plain language.** Don't say *"I'll add a `useEffect` to debounce the input"* — say *"I'll make it wait until you stop typing before searching."* If you must use a technical term, briefly say what it does.
- **Explain *what changed*, not *how the code changed*.** After each edit, summarize in user-visible terms: *"Now the Open Now filter also hides places that close in less than 30 minutes"*, not *"Added an `expiresWithin` predicate to the filter array."*
- **Never ask them to make architectural decisions.** Don't ask *"should this be a hook or a context?"* — pick the right answer (a hook, almost always) and proceed. They'll trust you on shape; you should trust them on intent.
- **Default to safe choices.** When you have to pick between "easier and good enough" and "more correct but more code," pick easier. They want fast iteration, not engineering elegance.
- **Ask one question at a time, in plain English, only when you genuinely need them to choose.** Examples of *good* questions: *"Should the new Settings page replace the Mesh tab, or add a 5th tab?"* / *"Do you want this for everyone, or only logged-in users?"* (when auth exists). *Bad* question: *"What persistence strategy should we use?"*
- **Surface trade-offs only when there's real risk.** If you're about to do something irreversible (drop a table, change a published API) or expensive (add a paid service), pause and explain in 2–3 sentences. Otherwise just do it.
- **Tell them when their request reveals a deeper issue.** If they ask "make the slider work" and you discover the sliders are cosmetic and don't actually change routing — tell them. Don't fake it. *"The sliders right now don't do anything — they're decorative. To make them actually re-rank routes, I need to do X. Want me to?"*

The technical lead is **Diogo** (`diogo.seabra.diogo@gmail.com`). When something is genuinely beyond the daily flow — auth, paid services, big refactors — say *"this is bigger than the usual change; let me flag it for Diogo first"* and stop.

---

## Hard rules (never violate)

1. **Use the `context7` MCP server for library/framework docs.** Whenever you touch code that uses React, Vite, Tailwind, MapLibre, react-map-gl, Supabase, react-router, lucide-react, or any other library — call `context7.resolve-library-id` then `context7.query-docs` first. Your training data may be out of date; context7 returns current docs. **Do not skip this even for "obvious" library APIs.** It's already configured in `.gemini/settings.json` — no setup needed.
2. **Never edit `src/lib/database.types.ts` by hand.** It's regenerated from the live Supabase schema. After any DB change, run `pnpm db:types`.
3. **Never commit secrets.** `.env*` files are gitignored. The Supabase anon key in `.env.local` is fine to expose (it's public by design with RLS), but DB passwords, service role keys, and anything in `.env.supabase.local` must stay local.
4. **Never `git push --force` to `main`.** Always work on a feature branch.
5. **Run `pnpm build` before claiming a feature is done.** It type-checks the whole project. If it errors, the deploy will fail. The team's `safe-step ship` wrapper does this automatically — but if you're testing manually, run it.
6. **Confirm with the user before destructive Supabase changes** (dropping tables, deleting columns, removing RLS policies). Migrations that *add* are fine to run unattended.
7. **Never tell them to "run a migration" or "regenerate types" without doing it yourself first.** If you change the schema, you also run `pnpm supabase db push` and `pnpm db:types`. They should never have to type those commands.

---

## Project at a glance

| What | Where |
|---|---|
| Frontend | Vite + React 19 + TypeScript + Tailwind v4 |
| Routing | `react-router` v7 |
| Backend | Supabase (Postgres + PostGIS, RLS) |
| Map | MapLibre GL via `react-map-gl/maplibre`, OpenFreeMap tiles (free, no API key) |
| Hosting | Vercel — `main` → prod, every other branch → preview URL |
| Repo | `theSquaredD/safestep-lisbon` on GitHub |

---

## File structure

```
src/
├── App.tsx                 ← route table
├── main.tsx                ← bootstraps React + BrowserRouter
├── index.css               ← Tailwind theme tokens (brand colors, surface)
├── components/
│   ├── Layout.tsx          ← phone-frame, header, bottom nav, onboarding gate
│   ├── Header.tsx
│   ├── BottomNav.tsx
│   └── MapView.tsx         ← MapLibre + sanctuary markers + route polylines
├── pages/
│   ├── Onboarding.tsx      ← 4-step intro (gated by localStorage flag)
│   ├── Map.tsx             ← home: search, map, route options
│   ├── Walk.tsx            ← active walking view
│   ├── Sanctuary.tsx       ← list of vetted safe spaces (Supabase)
│   ├── Mesh.tsx            ← Guardian Mesh BLE explainer (UI only — BLE is web-impossible)
│   ├── Profile.tsx         ← Sarah Johnson + safety factor sliders + contacts
│   └── Audit.tsx           ← hazard reports / Live Insights (Supabase)
├── data/
│   ├── sanctuaries.ts      ← useSanctuaries() hook
│   ├── hazards.ts          ← useHazards() hook
│   └── routes.ts           ← demo route polylines (REPLACE with real routing later)
└── lib/
    ├── supabase.ts         ← typed Supabase client
    ├── database.types.ts   ← AUTO-GENERATED — do not edit
    └── cn.ts               ← Tailwind class merger

supabase/
├── config.toml
└── migrations/             ← timestamped SQL files (one per change)

recipes/                    ← copy-paste examples for common changes
```

---

## How to make changes (recipes)

The `recipes/` folder has example prompts for common tasks. **Read the relevant recipe before starting.** Each one shows the exact files to touch and the right approach. If the team asks for something not covered, look at the closest recipe for guidance and ask context7 for any library-specific bits.

| Want to… | Read recipe |
|---|---|
| Add a new screen / page | `recipes/add-page.md` |
| Add or change a database table | `recipes/add-table.md` |
| Change the safety scoring weights | `recipes/change-route-weights.md` |
| Add or remove a sanctuary | `recipes/add-sanctuary.md` |
| Change wording / labels | `recipes/edit-copy.md` |
| Replace demo routes with real routing | `recipes/wire-real-routing.md` |

---

## Conventions

- **Tailwind v4 only.** Brand tokens are in `src/index.css` under `@theme`. Use `bg-brand-500`, `text-brand-600`, `bg-safe`, `bg-warn`, `bg-risk`. Do NOT introduce a `tailwind.config.js` — v4 uses CSS for config.
- **No shadcn yet.** Components are handcrafted. If you need a complex primitive (Slider, Dialog, Drawer), check context7 for shadcn-cli setup first; don't reinvent.
- **Path alias `@/`** points to `src/`. Use it (`@/lib/cn`, `@/data/sanctuaries`).
- **Mobile-first.** Phone is the design target. Layouts use `phone-frame` class which centers a 420px column on desktop.
- **Icons** come from `lucide-react`. Pick semantically — `Shield` for safety, `Coffee/Cross/Beer/Store` for sanctuary kinds, `AlertTriangle` for hazards.
- **Data fetches** go through hooks in `src/data/`. Pages should not import `supabase` directly — they import a `useFoo()` hook with `{ data, error, loading }`.

---

## Running the app

```bash
pnpm dev                 # http://127.0.0.1:5173
pnpm build               # type-check + production build (RUN BEFORE PUSHING)
pnpm db:types            # regenerate src/lib/database.types.ts from live schema
```

If `pnpm` is missing: `npm install -g pnpm`.

---

## Git workflow

The team uses a simple `safe-step` wrapper (see `bin/safe-step`):

```bash
safe-step new <feature-name>     # create branch from main
# ... ask Gemini to implement ...
safe-step ship "<short message>" # add + commit + push (triggers preview deploy)
safe-step preview                # print preview URL
safe-step undo                   # revert the last pushed commit
```

You should call `pnpm build` before `safe-step ship` to catch type errors. If the build fails, fix the errors before shipping.

When opening PRs: keep the title short, describe the user-visible change, and don't mention Gemini in the title (commit footer is fine).

---

## Brand & design

- **Primary purple:** `#7c3aed` (Tailwind: `brand-500`)
- **Safety palette:** safe `#22c55e` / warn `#f59e0b` / risk `#ef4444`
- **Logotype:** stylized "S"-shaped route mark + "SAFESTEP" wordmark. See `src/components/Header.tsx` for the inline SVG.
- **Tone:** calm, trustworthy, empowering. Never alarming or fearmongering. The manifesto is *"design is never neutral — every product either includes or excludes, and we choose to include."*

---

## Known sharp edges

- **Guardian Mesh** (BLE peer-to-peer) cannot work on the web. The `Mesh` page is UI-only — it's a demo of the *concept*. If the team wants real BLE later, the next move is wrapping the SPA with **Capacitor** to ship as iOS/Android. Do NOT try to implement this in the web build.
- **Routes are hardcoded** in `src/data/routes.ts`. They look real but are static polylines. Wiring real routing is `recipes/wire-real-routing.md`.
- **No auth yet.** Profile sliders and emergency contacts live in component state / localStorage, not Supabase. If the team wants accounts, that's a meaty feature — flag the scope before starting.
- **Map zoom on the small Map page** is tuned to roughly fit the route. If the team adds longer routes, expect they'll want a `fitBounds` call.

---

## When in doubt

1. Check `recipes/` first.
2. Use `context7` for any library API question. Always.
3. If it touches the database, run a migration (`pnpm supabase migration new <name>`), edit the SQL, run `pnpm supabase db push`, then `pnpm db:types`.
4. If you're unsure about scope, ask the user before writing code.
