# INSURE-X Insurance Intelligence

INSURE-X is an insurance operations command center for policy context, claims review, explainable risk signals, fraud alerts, investigations, and settlement auditability.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/insure-x run dev` — run the React web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (development only)
- Required env: `DATABASE_URL` and `SESSION_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM in this Replit environment
- Auth: JWT sessions with bcrypt password hashes and role claims
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source API contract
- `lib/db/src/schema/index.ts` — source relational schema and indexes
- `artifacts/api-server/src/routes/insurex.ts` — API handlers, auth, lifecycle rules, risk scoring, and settlement transaction
- `artifacts/api-server/src/lib/seed.ts` — repeatable demo dataset initialization
- `artifacts/insure-x/src/App.tsx` — responsive React command center
- `artifacts/insure-x/src/index.css` — INSURE-X visual system
- `docs/` — requirement matrix, data dictionary, architecture, ERD, test plan, and delivery audit

## Architecture decisions

- OpenAPI is the contract boundary; typed React hooks and Zod request schemas are generated from it.
- Claim status changes are allow-listed and every material action writes a claim event and/or audit log.
- Risk scoring is deliberately explainable and rule-based; each score stores its contributing factors.
- Settlement changes claim status, creates the payment, appends a claim event, and writes an audit row in one database transaction.
- The specification requested MongoDB/Mongoose, but this workspace has a provisioned PostgreSQL database and no MongoDB connection. The implemented adapter is documented in `docs/DELIVERY_AUDIT.md`.

## Product

The app includes operator login, command-center KPIs, customers, policies, assets, claims, claim detail timelines, risk recalculation, investigations, fraud alerts, payments, reports, audit logs, loading/error/empty states, responsive layouts, and mutation refresh behavior.

## User preferences

No project-specific preferences recorded.

## Gotchas

- The API is mounted below `/api`; the web artifact uses the same-origin proxy.
- The seeded demo operator is `admin@insurex.io` / `DemoPass123!`; do not use this credential in production.
- The API server seeds only when the users table is empty, so it is safe to restart but does not overwrite existing records.
- Run `pnpm run typecheck:libs` after schema or generated-library changes before typechecking the API server.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
