---
name: INSURE-X contract workflow
description: API contract and generated client convention for the insurance intelligence app.
---

The INSURE-X API contract lives in OpenAPI and drives generated React Query hooks and Zod request schemas. Contract changes must be followed by library generation and a shared-library typecheck before the API or web package is checked.

**Why:** The frontend and backend stay aligned only when the generated types are refreshed together; stale workspace declarations previously hid the new schema from the API compiler.

**How to apply:** Change the OpenAPI contract first, regenerate the clients, run the shared library build, then typecheck the API and web artifacts.