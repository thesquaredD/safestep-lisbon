# SafeStep — Team Onboarding

> **For Carolina, Valeria, Alberto, Lilly, Sarah** — and anyone else who'll be extending SafeStep.

You don't need to know how programmers work. You just need to know **5 commands** and what they do.

---

## Setup (Diogo handles this with you, once)

The very first time you use SafeStep on your laptop, Diogo will sit with you for ~5 minutes:
- Install a few tools (Gemini, pnpm, GitHub CLI)
- Clone the project
- Make `safe-step` work from your terminal
- Drop in a small file called `.env.local` (the keys to talk to the database)

Diogo runs `bin/setup` on your laptop and answers any prompts that come up. After that, you never need to think about installation again.

If you're setting up later by yourself: clone the repo, then in the project folder run `bin/setup`. If anything breaks, take a screenshot and message Diogo.

---

## What you have

- **The live app:** https://safestep-lisbon-one.vercel.app/
- **A way to make changes safely:** every change you make gets its own private preview URL — like the live app, but only you can see it. Once you're happy, one command makes it live.
- **An AI assistant called Gemini** that edits code for you. You describe what you want; it writes the code. You never edit code by hand.

---

## The daily loop — 5 commands, ~5 minutes per change

```
safe-step new "filter sanctuaries by hours"   # 1. start a new private workspace
safe-step ai                                  # 2. ask Gemini for what you want
safe-step ship "filter for late-night cafés"  # 3. save it + create a preview
safe-step preview                             # 4. open the preview, check it on your phone
safe-step merge                               # 5. make it live
```

That's the whole thing. Steps 2 and 3 might repeat a few times if Gemini's first attempt isn't right.

### Step 1 — `safe-step new "<description>"`
Creates a private workspace for this one change. Pick a short description in quotes. *Examples: `"add hours filter"`, `"change Continue button to Next"`, `"new cafe in Bairro Alto"`.*

### Step 2 — `safe-step ai`
Opens a chat with Gemini. Tell it what you want, in plain English:

> *"On the Sanctuary page, add a button to show only places open after 10pm."*

Gemini will read the project, edit the code, and **explain what it changed in plain language**. Read the summary. If it did something weird, say so and ask it to fix.

When you're done with Gemini, type `/exit` (or close the window).

### Step 3 — `safe-step ship "<message>"`
Saves your change and makes a preview URL. **It checks the code first** — if there's a problem, it'll say *"the code has a problem"* and tell you to ask Gemini to fix. Once you do, run `ship` again.

### Step 4 — `safe-step preview`
Opens your private preview URL in the browser. Test on your phone too — the URL works anywhere. If you need more changes, go back to step 2.

### Step 5 — `safe-step merge`
Makes your change live on https://safestep-lisbon-one.vercel.app/. **No GitHub website needed** — this command does everything for you. Wait ~30 seconds and the change is on the live app.

---

## All commands

| Command | What it does | When to use |
|---|---|---|
| `safe-step new "<description>"` | Start a private workspace for a change | Beginning of every change |
| `safe-step ai` | Open Gemini to describe what you want | After `new`; whenever you want changes |
| `safe-step ship "<message>"` | Save your change + create a preview URL | When you've made some progress and want to see it |
| `safe-step preview` | Open your preview URL | After every `ship` |
| `safe-step merge` | Make your change live | When the preview looks good |
| `safe-step undo` | Take back the last change you shipped | If you shipped something you regret, and haven't merged yet |
| `safe-step prod` | Open the live app | Anytime |
| `safe-step status` | Show what workspace you're in and what changed | If you're confused |

That's all of them.

---

## What Gemini is good at

- Adding pages, buttons, sliders, filters
- Changing wording, colors, icons, fonts
- Filtering, sorting, grouping lists
- Showing or hiding things based on conditions
- Adding new fields to existing data
- Visual tweaks ("make this card smaller", "add an icon", "use rounded corners")

## What Gemini is NOT good at (yet)

- **Bluetooth, location permissions, push notifications.** These don't work on a website. The Guardian Mesh feature is a *concept demo* — you can edit the explainer text, but the actual Bluetooth doesn't work in a browser.
- **Real-world routing.** The 3 routes on the map are pre-drawn lines. Making them real routes through Lisbon's streets requires plugging in a routing service. Diogo can help.
- **Big architecture changes.** Things like *"make it a mobile app"* or *"add user accounts"* take days, not minutes. Tell Diogo first.
- **Deleting things from the database.** Don't ask Gemini to *"delete a column"* or *"remove all old hazards"*. The database is shared with three teammates — your delete erases their stuff too. Adding things is fine. Removing needs Diogo.

---

## When something feels wrong

The first thing to do is **stop**. The second thing to do is **screenshot** whatever's on your screen and **message Diogo**.

Specifically:

| You see this | What to do |
|---|---|
| *"Something unexpected happened. Take a screenshot and message Diogo."* | Do exactly that. The wrapper says this when it can't recover safely on its own. |
| *"the code has a problem"* | Run `safe-step ai` and tell Gemini *"the build is failing — what's wrong?"* — it can usually fix it. |
| *"a workspace called X already exists"* | Pick a different description. Or you started this earlier and forgot — `git checkout X` will pick it back up. |
| *"GitHub refused to merge"* | Conflict with a teammate. Screenshot, message Diogo. |
| The preview URL shows a blank page | Wait 60 seconds — Vercel might still be building. If still blank, screenshot, message Diogo. |
| You ran `merge` and the live app didn't update | Wait 60 seconds, then refresh. If still not, message Diogo. |
| Your change works on preview but not on the live app | Hard-refresh (Cmd+Shift+R). If still not, message Diogo. |

**You will never break the live app permanently** as long as you stop and ask before guessing.

---

## Don't do

- **Don't manually edit code in VS Code** unless Diogo specifically asks you to. Use Gemini — it's faster and won't break things.
- **Don't share your preview URL** with anyone outside the team if your preview is half-broken. Previews are not public-facing — they're for your team.
- **Don't `safe-step merge` without checking the preview first.** That's the whole point of the preview.
- **Don't ask Gemini to delete tables, columns, or "old data".** Read the *NOT good at* section above.

---

## A first task to practice

Try this once to get a feel for the loop. It should take about 3 minutes.

```
safe-step new "rename Continue to Next"
safe-step ai
# In Gemini, type: "Change the 'Continue' button on onboarding to say 'Next'."
# Wait for Gemini to finish and explain what it did.
# Type /exit (or close the window) to leave Gemini.
safe-step ship "continue → next"
safe-step preview
# The button should now say Next. If yes, you've got it.
safe-step undo
# It's back to Continue. (We're not actually shipping this — it was practice.)
```

That's the entire loop. From here, anything you can describe, Gemini can build.

---

*Project structure, conventions, and recipes are in [`GEMINI.md`](./GEMINI.md) and [`recipes/`](./recipes/) — Gemini reads them automatically. You don't need to.*
