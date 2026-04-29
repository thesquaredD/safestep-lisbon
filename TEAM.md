# SafeStep — Team Onboarding

> **For Carolina, Valeria, Alberto, Lilly, Sarah** — and anyone else extending SafeStep.

This is your one-page guide. You don't need to know git, Vercel, or Supabase. You only need to know **5 commands**.

---

## What you have

- A live app: **https://safestep-lisbon-one.vercel.app/**
- A code repository (the "source") on GitHub: `theSquaredD/safestep-lisbon`
- An AI assistant called **Gemini** that edits the code for you. You describe what you want; it writes the code.
- Every change you make gets its own preview URL — like the live app, but private to you, so you can try things without breaking anything.

---

## The 5-step loop (~5 minutes per change)

You'll do this every time you want to change something.

### Step 1 — Start a new change
```
safe-step new "filter sanctuaries by hours"
```
That sets up an isolated workspace for this change. Pick a short description in quotes.

### Step 2 — Ask Gemini
```
safe-step ai
```
A chat opens. Tell it what you want, in plain English:

> *"On the Sanctuary page, add a button to show only places open after 10pm."*

Gemini will read the project, edit the code, and tell you what it changed. **Read its summary** before moving on — if it did something weird, say so and ask it to redo.

When you're done, type `/exit` (or close the window) to leave Gemini.

### Step 3 — Ship it
```
safe-step ship "filter for late-night sanctuaries"
```
This saves your change and pushes it to the cloud. **It also runs a check** — if the code has errors, it'll refuse to ship and tell you what's wrong. Go back to Gemini and ask it to fix the errors, then try again.

### Step 4 — See your preview
```
safe-step preview
```
Opens your private preview URL. Click around the app, test on your phone (the URL works anywhere). If it looks good, you're done. If it doesn't, ask Gemini to fix it, then `safe-step ship` again — the same preview URL gets updated.

### Step 5 — Make it live (or undo)

**Make it live:** Open the GitHub PR (linked in the GitHub UI) and click "Merge". The change goes to https://safestep-lisbon-one.vercel.app/ within a minute. Or ask Diogo (the technical one) to merge for you the first few times.

**Undo it instead:** if the change is bad, run `safe-step undo`. The preview URL goes back to before your change.

---

## All 7 commands

| Command | What it does |
|---|---|
| `safe-step new "<description>"` | Start a new isolated change |
| `safe-step ai` | Open Gemini to describe what you want |
| `safe-step ship "<message>"` | Save your change and create a preview |
| `safe-step preview` | Open your preview URL in the browser |
| `safe-step prod` | Open the live app |
| `safe-step undo` | Revert the last change you shipped |
| `safe-step status` | What did I change? What branch am I on? |

---

## Things to know

### What Gemini is good at
- Adding pages, buttons, sliders
- Changing wording, colors, icons
- Filtering or sorting lists
- Hooking up new data fields
- Visual tweaks ("make this card smaller", "add an icon")

### What Gemini is NOT good at (yet)
- **Anything involving Bluetooth, location permissions, push notifications.** These don't work on the web. The "Guardian Mesh" feature is a *concept demo* — you can edit the explainer text, but the actual peer-to-peer Bluetooth doesn't work in a browser.
- **Real-world routing.** The 3 routes on the map are pre-drawn lines. Gemini can swap them for real routes from a service called OSRM — that's covered in `recipes/wire-real-routing.md`. Ask Diogo before tackling it the first time.
- **Big architecture changes.** "Make it a mobile app" or "add user accounts" — these are real days of work. Talk to Diogo first.

### When something breaks
1. `safe-step undo` first — it will roll back the last change.
2. Then ask Gemini *what went wrong* by describing the symptom.
3. If you're really stuck, message Diogo with the preview URL and a screenshot.

### Don't do
- **Don't run `safe-step ship` while on `main`.** The wrapper will block you, but seriously — `main` is what's live, you don't want to push there directly.
- **Don't share the URL `https://safestep-lisbon-…vercel.app/` with anyone if your preview is half-broken.** Previews are private but the URL is shareable.
- **Don't edit the file `src/lib/database.types.ts`** by hand. It's auto-generated. If Gemini suggests editing it manually, tell it to run `pnpm db:types` instead.

---

## A first task to practice

Try this to get a feel for the loop:

```bash
safe-step new "change continue button to next"
safe-step ai
# In Gemini: "Change the 'Continue' button on onboarding to say 'Next'."
# Wait for Gemini to finish.
# Type /exit (or close the window).
safe-step ship "continue → next"
safe-step preview
# Click through onboarding. The button should say Next.
safe-step undo
# It's back to Continue.
```

That's the whole loop. From here, anything you can describe, you can build.

---

*Project structure, conventions, and recipes live in [`GEMINI.md`](./GEMINI.md) and [`recipes/`](./recipes/) — Gemini reads those automatically. You don't need to.*
