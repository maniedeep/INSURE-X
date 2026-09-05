# INSURE-X data dictionary

| Entity | Purpose | Key relationships |
|---|---|---|
| users | Operator identity, password hash, role, active state | Authenticates API requests |
| customers | Policyholder profile and region | Has many policies and claims |
| policies | Coverage, premium, term, lifecycle status | Belongs to customer; has assets and claims |
| assets | Insured item with identifier and value | Belongs to policy; optionally linked to claims |
| claims | Loss record, amount, status, score, factors | Belongs to customer and policy |
| claim_events | Append-only operational timeline | Belongs to claim |
| documents | Claim evidence and verification state | Belongs to claim |
| risk_profiles | Stored score snapshot and explainable factors | Belongs to claim and customer |
| fraud_alerts | Review queue for elevated risk signals | Belongs to claim |
| investigators | Investigation operator directory | Has many investigations |
| investigations | Assignment, findings, recommendation, status | Belongs to claim and investigator |
| payments | Settlement disbursement and status | Belongs to claim |
| service_providers | External assessor/repair/service directory | Seeded for future claim/provider linkage |
| audit_logs | Attributable record of material mutations | References entity type and entity id |

Amounts use fixed-precision PostgreSQL numeric columns. Statuses and roles use PostgreSQL enums. Frequently filtered fields have indexes for customer, policy, claim, risk, event, payment, and audit access paths.