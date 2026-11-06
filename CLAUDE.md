# CLAUDE.md

## Project

Redesign of softskilllabs.com: a Russian-language landing page for mini-groups (up to 6 children, ages 6–16, Akko) that develop communication through science experiments. Product truth: `PRODUCT.md`.

## Stack

SvelteKit 3 on Vite 8, Svelte 5 runes, TypeScript, SSR through `adapter-node`. shadcn-svelte (`vega` preset) with Tailwind 4. Package manager: pnpm. Import project code through `#lib/...`, with `.js` for TS modules.

## Commands

| Command | Does |
|---|---|
| `pnpm dev` | dev server |
| `pnpm build` | production build into `build/` |
| `pnpm start` | run the SSR server (`PORT` sets the port; default 3000) |
| `pnpm check` | types and Svelte diagnostics |
| `pnpm exec shadcn-svelte add <name>` | add a UI component |
| `<impeccable plugin>/scripts/impeccable detect --json <file>` | design and contrast checks |

No test suite or linter exists. After changes run `pnpm check`, then check in a browser at 1440 and 390 wide.

## Structure

- `src/routes/+page.svelte` — the landing page, with head and meta
- `src/routes/+page.server.ts` — picks the random hero photo per request
- `src/routes/layout.css` — journal tokens, shadcn role mapping, global rules
- `src/lib/content.ts` — page copy that repeats or lists (protocols, roster, photos, contacts)
- `src/lib/components/journal/` — page sections and their scoped CSS
- `src/lib/components/ui/` — shadcn-svelte components, ours to edit; Button holds `pen`, `stamp`, `pencil`
- `src/lib/assets/` — images; `*.webp.json` beside each records its origin
- `variants/` — static design references, the source of the public artifact; `b-notebook.html` is the chosen design, the others are rejected
- `.impeccable/` — design tooling state; `surfaces/variants-b-notebook-html.md` holds the direction contract, `design.json` is generated
- `.impeccable/review/` — gitignored screenshots

## Conventions

- UI copy is Russian. Docs and CLAUDE.md are English.
- Commit messages are one short line: no body, no mention of Claude, no `Co-Authored-By`.
- `DESIGN.md` owns the visual system; follow its named rules. Refresh it and `.impeccable/design.json` together after visual changes.
- Rejected variants use other fonts, so design-system font findings on them are expected.
- Keep shadcn components free of stock looks: new primitives take journal tokens, square corners and the global dashed focus outline.
- Experiment details, the start date, availability, the photos and the portrait slot are unconfirmed: see Open Decisions in `PRODUCT.md`. Don't present them as fact.
- The variants are published as a public artifact (https://claude.ai/artifact/EXPLnk1vYKGTwGCfhH5Cgc). Ask before republishing.
- The logo presentation `variants/logo-final.html` is a second public artifact (https://claude.ai/artifact/KZA25A4XkMoxByDykdeVUP). Ask before republishing; its photos sit in `variants/img/` and are published with it.
- Logo files live in `src/lib/assets/logo/`; follow the lockup rules in `BRAND.md`.

## Where to look

- `PRODUCT.md` — audience, facts, open decisions
- `DESIGN.md` — tokens, components, rules
- `BRAND.md` — chosen logo, wordmark, lockup rules, logo files
- `.impeccable/surfaces/variants-b-notebook-html.md` — direction contract

## Work rules

- Answer briefly: no retelling of code, no closing summaries.
- If a task is unclear, ask one question instead of exploring the project.
- For orientation, use "Structure" and "Where to look" above before grepping code.
- Don't paste large outputs or whole files into answers; cite `file:line`.
- Write code comments only when they prevent mistakes (non-obvious constraints, gotchas, why-not-X). Never comment what the code does.
- Test/build/lint output is auto-filtered to errors (<=100 lines). Append `# full-output` or set `CLAUDE_FULL_OUTPUT=1` for full output.

## Task routing

Subagents start cold and re-read context, so delegate only when it pays off.
1. **Do it in the main session:** questions, docs, config, and small code changes (about 1-3 files, clear cause). Check with a narrow test run.
2. **Delegate to a `general-purpose` worker** with a self-contained brief (goal, files, done criteria) when the task is large, needs much reading, or several independent tasks can run in parallel. Model:
   - **haiku** - mechanical: bulk renames, formatting, moving code, generated docs.
   - **sonnet** - typical features, bug fixes with clear cause, refactors within a module.
   - **opus** - architecture, cross-module changes, unclear bugs, security, concurrency, data migrations.

## Compact instructions

When compacting, keep: files changed (paths + what changed), decisions made and why, current errors/failing tests, open TODOs, the task plan and its status, next steps.
Drop: command output, logs, file contents already applied, search results, exploration dead ends, results already captured in docs.
