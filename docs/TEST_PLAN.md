# INSURE-X verification plan

## Automated checks completed

- API TypeScript check: `pnpm --filter @workspace/api-server run typecheck`
- Web TypeScript check: `pnpm --filter @workspace/insure-x run typecheck`
- Web production bundle: `pnpm --filter @workspace/insure-x run build`
- Shared generated-library check: `pnpm run typecheck:libs`

## Runtime checks completed

- API health endpoint responds successfully.
- Seeded dashboard aggregate returns live counts, risk distribution, settlement total, and recent events.
- Claim list returns joined customer/policy context and server-side pagination shape.
- Login returns a JWT for the seeded operator.
- Risk recalculation returns score, level, factors, and timestamp.
- Investigation list returns joined investigator and claim context.
- Mobile claims view renders without horizontal page overflow.

## Required follow-up tests

- Add an integration test that intentionally fails inside the settlement transaction and verifies no claim status, payment, event, or audit row is committed.
- Add transition-matrix tests for every allowed and denied claim status change.
- Add authorization tests for each role once route-level role policy is finalized.
- Add SQL explain-plan captures for claim search, risk filters, and audit pagination.