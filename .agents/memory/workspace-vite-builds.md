---
name: Workspace Vite builds
description: Build portability rule for Vite artifacts in this workspace.
---

Vite artifact configs should accept the managed workflow environment variables but also provide safe defaults for standalone `pnpm run build` execution. Requiring `PORT` or `BASE_PATH` unconditionally makes the workspace build fail even when the workflow itself is healthy.

**Why:** The workspace-wide verification command is a useful release gate and must not depend on a running preview workflow.

**How to apply:** Keep workflow-provided values authoritative, but fall back to a valid development port and `/` base path when building outside the workflow.