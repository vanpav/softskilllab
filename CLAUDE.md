# CLAUDE.md

## Project

Redesign of softskilllabs.com: a Russian-language landing page for mini-groups (up to 6 children, ages 6–16, Akko) that develop communication through science experiments. Product truth: `PRODUCT.md`.

## Stack

SvelteKit 3 on Vite 8, Svelte 5 runes, TypeScript, SSR on Cloudflare Workers through `adapter-cloudflare`. shadcn-svelte (`vega` preset) with Tailwind 4. Package manager: pnpm. Import project code through `#lib/...`, with `.js` for TS modules.

## Commands

| Command | Does |
|---|---|
| `pnpm dev` | dev server |
| `pnpm build` | production build into `build/` |
| `pnpm start` | run the production build locally in Wrangler (`pnpm build` first; `--port` sets the port) |
| `pnpm run deploy` | build and deploy by hand; normally a push to `main` deploys through Workers Builds |
| `pnpm check` | types and Svelte diagnostics |
| `pnpm test` | unit tests in `src/lib/*.test.ts` on Node's own runner, no framework |
| `pnpm exec shadcn-svelte add <name>` | add a UI component |
| `<impeccable plugin>/scripts/impeccable detect --json <file>` | design and contrast checks |

No linter exists. After changes run `pnpm check` and `pnpm test`, then check in a browser at 1440 and 390 wide. Modules under test must not import images (`posts.ts` takes doodle names from `doodles.ts`, not `content.ts`).

## Structure

- `src/routes/+page.svelte` — the landing page, with head and meta
- `src/routes/+page.server.ts` — per-request values: random hero photo, random doodle set on Аня's portrait (`?anya=N` in dev), current month, New Year season
- `src/lib/season.ts` — date rules in Akko time (`?date=2027-01-01T12:00:00Z` previews a day in `pnpm dev`; `localStorage.show_ny = true` shows the New Year season on any date)
- `src/lib/posts.ts` — a post's layout: stored blocks from the visual editor (`content`), or read from plain text by the rules in its header comment
- `src/lib/server/post-store.ts` — posts in the `POSTS` KV namespace, one key each with `{ seq, date }` metadata and no shared index (KV reads lag writes, so read-modify-write loses posts). `src/posts/*.md` show from the files until saved or deleted in /adm
- `src/routes/zhurnal/` — journal list and post pages; `src/routes/adm/` — Аня's visual editor (login limited to 5 tries a minute per address by the `LOGIN_LIMIT` rate-limit binding) (`src/lib/components/admin/VisualEditor.svelte`) behind `ADMIN_PASSWORD` (`src/lib/server/admin-auth.ts`); the post sheet's styles are shared in `src/lib/components/journal/post-sheet.css`
- Photos: `PHOTOS` R2 bucket, uploaded at `/adm/upload`, served at `/foto/<key>`; deleted with their post
- Bindings come from `cloudflare:workers` through `src/lib/server/bindings.ts`, not `event.platform`; locally the password is in gitignored `.dev.vars`; restart `pnpm dev` after changing `wrangler.jsonc`
- SEO: `Seo.svelte` writes title, description, canonical (always `SITE_URL`), Open Graph (default picture `static/og.jpg`, 1200×630) and JSON-LD from `src/lib/schema.ts`; `/sitemap.xml` is built from the post store; `static/robots.txt` closes `/adm`; `/legal` carries the previous site's legal texts plus the analytics wording
- Analytics: Google tag `GTM-NH8NB2TF` in `src/routes/+layout.svelte`, only on `SITE_URL` and outside `/adm`
- Line breaks: `src/lib/typography.ts` glues short Russian words, numbers and dashes with non-breaking spaces. It runs on static markup text at build time (preprocessor in `vite.config.ts`), on `content.ts` arrays via `nbspDeep`, and on journal posts in `parsePost`. Text in other JS strings needs `nbsp()` by hand
- `src/routes/+error.svelte` — 404 and server errors as a torn-out journal page, copy varies by path and status; `src/error.html` — self-contained fallback when the app itself fails
- `src/routes/layout.css` — journal tokens, shadcn role mapping, global rules
- `src/lib/content.ts` — page copy that repeats or lists (protocols, roster, photos, contacts)
- `src/lib/components/journal/` — page sections and their scoped CSS
- `src/lib/components/ui/` — shadcn-svelte components, ours to edit; Button holds `pen`, `stamp`, `pencil`
- `src/lib/assets/` — images; `*.webp.json` beside each records its origin
- `.impeccable/` — design tooling state; `surfaces/variants-b-notebook-html.md` holds the direction contract, `design.json` is generated
- `.impeccable/review/` — gitignored screenshots

## Conventions

- UI copy is Russian. Docs and CLAUDE.md are English.
- Commit messages are one short line: no body, no mention of Claude, no `Co-Authored-By`.
- `DESIGN.md` owns the visual system; follow its named rules. Refresh it and `.impeccable/design.json` together after visual changes.
- Keep shadcn components free of stock looks: new primitives take journal tokens, square corners and the global dashed focus outline.
- Experiment details, the start date, availability, and the photos are unconfirmed: see Open Decisions in `PRODUCT.md`. Don't present them as fact.
- The design variants were published as a public artifact (https://claude.ai/artifact/EXPLnk1vYKGTwGCfhH5Cgc). Their source was removed from the repo; it is in git history before this change. Ask before republishing.
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
