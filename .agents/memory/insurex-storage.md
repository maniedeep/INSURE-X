---
name: INSURE-X storage adapter
description: Why the current insurance intelligence implementation uses PostgreSQL instead of the originally requested MongoDB.
---

The original product specification names MongoDB/Mongoose, but this workspace has a provisioned PostgreSQL database and no available MongoDB integration or connection string. The current implementation uses PostgreSQL/Drizzle to keep the app runnable and preserve relational integrity for claims, events, payments, and audit records.

**Why:** The settlement workflow and existing workspace database are operationally verifiable here; inventing a Mongo connection would make the app non-runnable.

**How to apply:** If a real MongoDB URI becomes available, add a deliberate adapter/migration plan and update the delivery audit rather than silently swapping storage.