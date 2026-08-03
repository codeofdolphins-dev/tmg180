# TMG180

pnpm monorepo. React + Vite web app, Express + Postgres API serving both web and
mobile clients, and shared packages consumed by all of them.

```
apps/
  web/          React 19 + Vite 8 + Tailwind v4 (the 69 screens)
  api/          Express 5 + Postgres, mounted at /api/v1
packages/
  shared/       Roles + evidence-chain rules that must hold on every client
  terminology/  Terminology registry client + banned-term guard
  api-client/   Bearer-token HTTP client — web today, React Native later
md/             Specification documents (start with md/INDEX.md)
```

## Requirements

- Node >= 22
- pnpm 11 (`corepack enable pnpm`)
- Postgres (for the API; the web app runs standalone on mock data)

## Getting started

```bash
pnpm install
cp apps/api/.env.example apps/api/.env   # then fill in the secrets
pnpm dev                                  # web on :5173, api on :4000
```

`pnpm dev` runs every app in parallel. To run one:

```bash
pnpm dev:web
pnpm dev:api
```

The web dev server proxies `/api` to `http://localhost:4000`, so the browser
sees one origin and needs no CORS preflight. Deployed builds set `VITE_API_URL`.

## Other commands

| Command | Effect |
| --- | --- |
| `pnpm build` | Builds every package that defines a build script |
| `pnpm lint` | oxlint across the whole workspace |
| `pnpm --filter @tmg180/web <script>` | Run a script in one workspace package |
| `pnpm --filter @tmg180/api add <pkg>` | Add a dependency to one package |

## Conventions

- **Plain JSX, no TypeScript** — matches the existing 69 screens. JSDoc where
  types genuinely help.
- **Workspace packages are unbuilt ESM.** They export `./src/index.js` directly,
  so there is no build step to sequence and no stale `dist` to debug.
- **Add dependencies to the package that uses them**, never to the root. pnpm's
  strict `node_modules` will fail the import otherwise — that is the point, and
  `shamefully-hoist` is not the fix.
- **API is versioned at `/api/v1`** and authenticates with bearer tokens rather
  than cookies, so the mobile client uses the identical path.
