# Recipe: Survive conflicts when the team is working in parallel

## When the team asks
*"It says my push was rejected"* / *"There's a merge conflict"* / *"My data disappeared"* / *"Why does the app crash on my preview but not Carolina's?"*

## Background

Four teammates share **one repo and one database**. Most of the time that's fine. Occasionally two people change the same file or the same table at the same time, and you need to untangle it. This recipe covers the four common scenarios in plain language.

---

## Scenario 1: "push rejected — fetch first"

The user runs `safe-step ship` and sees:
```
✖ push rejected. Usually this means main has moved since you started.
```

**What happened:** someone else merged a PR to main while this branch was being worked on. Their changes are now on the live `main`, but this branch was built on an older `main`.

**What to do:**
1. Run `safe-step sync`.
2. If it succeeds: re-run `safe-step ship`. Done.
3. If it surfaces a merge conflict: jump to Scenario 2.

---

## Scenario 2: Merge conflict in code files

`safe-step sync` reports something like:
```
CONFLICT (content): Merge conflict in src/pages/Map.tsx
```

**What happened:** the user's branch and `main` both edited the same lines of the same file. Git can't pick a winner.

**What you (Gemini) do:**
1. Read each conflicted file. Conflict markers look like:
   ```
   <<<<<<< HEAD
   <user's change>
   =======
   <main's change>
   >>>>>>> origin/main
   ```
2. **Decide carefully.** Read the full file context. Often the right answer is *both* changes combined, not one or the other.
3. If the conflict is purely visual (CSS, copy, layout), you can usually merge both intents — pick the union.
4. If the conflict is logical (different functions doing similar things, different data shapes, different state machines), **stop and ask the user** in plain language: *"You changed the route options to use minutes; Carolina changed them to use km. Should it be both, just yours, or just hers?"*
5. After resolving, run `pnpm build` to confirm the merged code compiles.
6. `git add <files>` then `git commit` with a message like `"merge main into <branch>"`.
7. `safe-step ship` will succeed now.

**Never just pick a side blindly.** Pick wrong and you've quietly deleted a teammate's work.

---

## Scenario 3: Migration ordering conflict

The user runs `pnpm supabase db push` and sees:
```
ERROR: relation "X" already exists
```
or
```
ERROR: column "Y" of relation "Z" does not exist
```

**What happened:** another teammate's migration ran first against the shared DB. The current branch's migration assumes the previous schema state.

**What you (Gemini) do:**
1. Run `git fetch origin` then `ls supabase/migrations/` and compare to `git ls-tree origin/main supabase/migrations/`. Identify which migrations are on main but not in this branch.
2. **Pull main into the branch:** `safe-step sync`. This brings in the missing migrations as files.
3. Inspect the user's own migration. Is it now redundant (someone added the same column already)? Is it conflicting (someone added a column with the same name but a different type)? Is it dependent (the user's migration references a table the other migration created — this is fine, just re-push)?
4. If redundant: delete the migration file. Re-run `pnpm db:types`. Done.
5. If conflicting: stop. This is a coordination problem — get Diogo involved. Don't try to "merge" SQL migrations automatically.
6. If dependent: re-run `pnpm supabase db push`. It should now apply just the new migration.

**Reminder:** the team's rule is *append-only migrations*. If the conflict is two `drop` or `alter ... drop` migrations, the rule was violated — flag it.

---

## Scenario 4: "My data disappeared"

The user reports a sanctuary they added is gone, or a hazard they reported isn't there anymore.

**What happened (most likely):** another teammate's branch ran a migration that re-seeded or truncated the table. Or someone manually deleted a row in the Supabase dashboard.

**What you (Gemini) do:**
1. **Don't try to recreate the data from memory.** It will be wrong.
2. Tell the user: *"I think someone re-seeded the table. Can you check with Diogo if there's a backup, or with the team to see who recently touched it?"*
3. If it was their own row and they remember the details, offer to re-add it via `recipes/add-sanctuary.md`.

---

## Prevention checklist

When **you** (Gemini) are about to make any of these moves, pause and double-check:

- **Adding a migration:** does this table/column already exist on `main` or in another branch? `git fetch && git log origin/main..HEAD -- supabase/migrations/`
- **Editing a busy file** (Map.tsx, Sanctuary.tsx, Layout.tsx): is anyone else's branch touching the same area? `git log origin/main..HEAD -- <file>` shows what's on main not in your branch — if it's recent, sync first.
- **Deleting anything in the database:** STOP. Append-only rule. Tell the user this needs Diogo.
- **Renaming a file or component:** sync with main first; if anyone else is mid-flight on the same file, coordinate.

---

## When all else fails

Tell the user:

> *"I'm not confident I can resolve this without losing someone's work. Send the output of `git status` and `git log --oneline -10` to Diogo on Slack and pause until he replies."*

Then **stop**. Don't keep editing.
