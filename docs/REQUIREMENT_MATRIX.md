# INSURE-X requirement matrix

| Area | Required capability | Status | Evidence |
|---|---|---:|---|
| Authentication | JWT login, bcrypt password verification, active-user check | Complete | `POST /api/auth/login`, auth middleware |
| Authorization | Role claim carried by JWT and persisted user roles | Complete for core operations | Role gates protect customer/policy/asset/claim mutations, investigation/risk/fraud actions, and finance settlement |
| Customers | Search, pagination, create, detail, update | Complete | `/api/customers` |
| Policies | Search, pagination, create, lifecycle status | Complete | `/api/policies` |
| Assets | Search, pagination, create, policy linkage | Complete | `/api/assets` |
| Claims | Search, filters, pagination, create, detail | Complete | `/api/claims` |
| Claim lifecycle | Controlled transitions, claim events, audit entries | Complete | `/api/claims/:id/status` |
| Risk | Explainable rule-based score and factors | Complete | `/api/claims/:id/risk` |
| Fraud | Alert generation for elevated scores and status updates | Complete | `/api/fraud-alerts` |
| Investigations | Assignment, status and workload report | Complete | `/api/investigations` |
| Settlements | Atomic claim/payment/event/audit workflow | Complete | `/api/claims/:id/settle` |
| Payments | Search, pagination, payment status | Complete | `/api/payments` |
| Documents | Claim-linked schema and claim detail display | Partial | Upload/storage mutation is not yet exposed |
| Service providers | Seeded relational entity | Partial | CRUD/report UI is not yet exposed |
| Analytics | Dashboard and report endpoints use aggregate SQL | Complete | `/api/dashboard/summary`, `/api/reports/*` |
| Auditability | Timestamped audit log and claim timeline | Complete | `/api/audit-logs`, `/api/claim-events/:claimId` |
| UI | React dashboard, responsive shell, loading/error/empty states | Complete | `artifacts/insure-x` |
| Data store | MongoDB/Mongoose requested by original specification | Environment divergence | PostgreSQL/Drizzle is used because no MongoDB URI/integration is available |