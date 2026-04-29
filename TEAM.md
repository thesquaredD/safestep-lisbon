# SafeStep — Team Guide

> **For Carolina, Valeria, Alberto, Lilly, Sarah** — and anyone else who'll be extending SafeStep.

Talking to Gemini is the only thing you need to know how to do. Gemini reads the code, edits it, ships it, and previews it for you. You never type git, GitHub, Supabase, or any other technical command.

---

## One-time setup (5 min, by yourself)

1. **Install Node.js** from https://nodejs.org (pick the LTS version).
2. **Open Terminal** (Mac: ⌘+Space → "Terminal"). Paste these three commands one at a time, pressing Enter after each:
   ```
   npm install -g @google/gemini-cli
   git clone git@github.com:thesquaredD/safestep-lisbon.git
   cd safestep-lisbon
   ```
3. **Start Gemini:**
   ```
   gemini -y
   ```
   The `-y` lets Gemini run setup commands automatically — no clicking required.
4. **Type this to Gemini:**
   > Set up my environment, then explain how I make changes.

   Gemini will install the missing pieces, sign you into GitHub (a browser will open), and walk you through the loop. **Once it says you're ready, you're ready.**

That's it. From now on, every time you want to work on the app, open Terminal, type `cd safestep-lisbon`, then `gemini -y`.

---

## Making a change

Just talk to Gemini in plain English. Some examples:

> *"On the Sanctuary page, add a button to show only places open after 10pm."*
> *"Change the 'Continue' button on onboarding to say 'Next'."*
> *"Add a new sanctuary: Café Pessoa on Rua dos Sapateiros 12 in Baixa, open 24h."*
> *"Make the route options bigger on the map."*

Gemini will:
1. Edit the code
2. Tell you what it changed, in plain English
3. Save it and create a private preview URL
4. Show you the preview
5. Ask if you want to make it live

When you say yes, it goes live within ~30 seconds.

---

## What Gemini is good at

- Adding pages, buttons, sliders, filters
- Changing wording, colors, icons
- Filtering, sorting, grouping lists
- Adding new data fields to existing screens
- Visual tweaks (*"make this card smaller"*, *"add an icon"*, *"use rounded corners"*)
- Adding a new sanctuary or removing a hazard

## What Gemini will refuse (or ask you to confirm)

- **Deleting things from the database.** The database is shared with three teammates — your delete erases their stuff too. If you really need this, ask Diogo.
- **Real-world routing.** The 3 routes today follow streets but the safety scores are placeholders. Replacing them with real scoring is a bigger task — covered in `recipes/wire-real-routing.md`. Gemini can do it; just tell it.
- **Bluetooth, push notifications, mobile-only features.** These don't work on a web app.
- **User accounts / sign-in.** Possible but a multi-day task. Discuss with Diogo first.

---

## When something looks wrong

Tell Gemini what you see:

> *"The map is showing nothing."*
> *"The save button doesn't do anything."*
> *"My change isn't on the live site."*

Gemini will diagnose and either fix it, or tell you it's something it can't fix. **You won't break the live app** as long as you don't manually edit code in another editor.

If Gemini gives up and tells you to contact Diogo, that means it's something it can't safely fix on its own. Send Diogo a screenshot — but only when Gemini explicitly tells you to.

---

## A first task to practice

Open Gemini and say:

> *"Change the 'Continue' button on the first onboarding screen to say 'Next', show me the preview, then undo it."*

Gemini will run through the whole loop. If you watched the preview update, you've got it.

---

*Project structure, conventions, and recipes are in [`GEMINI.md`](./GEMINI.md) and [`recipes/`](./recipes/) — Gemini reads them automatically. You don't need to.*
