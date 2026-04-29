# SafeStep — Claude Code Context

> The same project context applies whether you're Claude Code or Gemini CLI. The full guide lives in [`GEMINI.md`](./GEMINI.md). **Read that first.** This file calls out anything Claude-specific.

## Hard rules

1. **Use the `context7` MCP plugin for library docs** (`mcp__plugin_context7_context7__resolve-library-id` then `mcp__plugin_context7_context7__query-docs`). Always — even for libraries you "know." Skip if and only if the answer is purely about JS/TS language semantics or business logic in our own code.
2. Everything else in [GEMINI.md → Hard rules](./GEMINI.md#hard-rules) applies identically.

## Claude-specific notes

- The team uses Gemini CLI as their daily driver. Claude Code is for the technical lead (Diogo) doing setup, architectural changes, or unblocking the team. If you're being invoked, you're probably handling a tougher task than the everyday flow.
- `bin/safe-step` is the team's wrapper. Don't recreate it — use it (`safe-step ship "<msg>"`) when finishing work for the team to inherit.
- Vercel and Supabase CLIs are authenticated under the `theSquaredD` / `diogo.seabra.diogo@gmail.com` accounts. Don't switch identities.
- Git remote uses the SSH host alias `github.com-personal` (configured per-repo via `core.sshCommand`). If a push fails with "permission denied," check `git config --get core.sshCommand`.

## Sub-agents you can use

- **Plan** for architectural decisions (e.g., adding auth, splitting into Capacitor mobile, swapping the routing engine).
- **Explore** for "where does X live in this codebase" questions — faster than scanning manually.
- **general-purpose** for multi-file refactors that span pages + data + types.

Avoid using sub-agents for one-line edits or trivial lookups; direct tools are faster.

## Don't

- Don't open PRs unless explicitly asked. Default is direct push to a feature branch.
- Don't run `vercel deploy --prod` from the CLI — pushes to `main` already deploy. Manual prod deploys bypass the team's review flow.
- Don't drop or rename tables without checking with Diogo first.
- Don't replace the demo routes with a paid routing service without confirming budget.
