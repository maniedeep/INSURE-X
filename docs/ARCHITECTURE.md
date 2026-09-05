# INSURE-X architecture

```text
React/Vite web artifact
        |
        | generated typed fetch hooks
        v
Express API (/api)
  auth middleware + validation
  claim lifecycle + risk rules
  settlement transaction
        |
        v
PostgreSQL + Drizzle
```

The OpenAPI file is the boundary contract. Orval generates the React Query client and Zod schemas. The API uses centralized helper functions for pagination, search predicates, JSON fields, risk levels, and claim transitions. The settlement path uses a single database transaction so a payment cannot be created without the corresponding settled claim and event.

## Request flow

1. The operator authenticates with email/password.
2. The server verifies the bcrypt hash and returns a short-lived JWT.
3. The web client stores the token in local storage and supplies it through the generated fetch layer.
4. Protected API routes verify the token and load the active user.
5. Mutations write business data plus events/audit records.

## Environment adaptation

The academic specification named MongoDB/Mongoose, but this Replit project has an existing provisioned PostgreSQL database and no MongoDB URI. The relational schema preserves the same domain model and is the currently runnable implementation. A Mongo adapter should be introduced only when a real MongoDB connection is supplied; it should not silently replace the working database.