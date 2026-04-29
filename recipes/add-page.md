# Recipe: Add a new page

## When the team asks
*"Add a Settings page"* / *"Add a Help page with FAQs"* / *"Add a History tab"*

## What to do

### 1. Create the page component
Create `src/pages/<Name>.tsx`. Mirror the structure of an existing page (e.g., `Profile.tsx` for a settings-style screen, `Sanctuary.tsx` for a list with header). Use the layout primitives:

```tsx
export function MyPage() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">Title</h1>
        <p className="text-sm text-neutral-500">Subtitle</p>
      </div>
      {/* content */}
    </div>
  )
}
```

### 2. Register the route
In `src/App.tsx`, add a `<Route>` inside the `<Layout>` block:

```tsx
<Route path="/my-page" element={<MyPage />} />
```

If the page should NOT show the header + bottom nav (e.g., a full-screen modal), put it OUTSIDE the `<Layout>` route, like `Onboarding`.

### 3. (Optional) Add to bottom nav
Edit `src/components/BottomNav.tsx` and add an entry to the `items` array. **Caveat:** the nav is `grid-cols-4`. If you add a 5th, change to `grid-cols-5` or replace one. Ask the user which to drop.

### 4. (Optional) Link from Map action chips
The Map page's action chips (Walk / Sanctuary / Mesh / Report) are in `src/pages/Map.tsx`. Replace one if the new page is more important.

### 5. Verify
- Run `pnpm build` — must pass with no errors.
- Click the route locally to confirm it renders.

## Gotchas
- Use the path alias `@/` for imports (e.g., `import { cn } from '@/lib/cn'`).
- React Router v7 — use `react-router` imports (no `react-router-dom`).
- If the page needs data, **always go through a hook** in `src/data/`, never call `supabase` directly from the page.
