# INSURE-X ERD source

```mermaid
erDiagram
  USERS ||--o{ AUDIT_LOGS : creates
  CUSTOMERS ||--o{ POLICIES : owns
  CUSTOMERS ||--o{ CLAIMS : files
  POLICIES ||--o{ ASSETS : covers
  POLICIES ||--o{ CLAIMS : receives
  ASSETS ||--o{ CLAIMS : supports
  CLAIMS ||--o{ CLAIM_EVENTS : records
  CLAIMS ||--o{ DOCUMENTS : contains
  CLAIMS ||--o{ RISK_PROFILES : scores
  CUSTOMERS ||--o{ RISK_PROFILES : assessed
  CLAIMS ||--o{ FRAUD_ALERTS : triggers
  CLAIMS ||--o{ INVESTIGATIONS : examines
  INVESTIGATORS ||--o{ INVESTIGATIONS : assigned
  CLAIMS ||--o{ PAYMENTS : settles

  USERS { uuid id PK; string email; enum role; boolean active }
  CUSTOMERS { uuid id PK; string name; string email; enum status }
  POLICIES { uuid id PK; string policy_number; uuid customer_id FK; numeric coverage_amount }
  ASSETS { uuid id PK; uuid policy_id FK; string identifier; numeric value }
  CLAIMS { uuid id PK; string claim_number; uuid customer_id FK; uuid policy_id FK; enum status; integer risk_score }
  CLAIM_EVENTS { uuid id PK; uuid claim_id FK; string event_type; timestamp timestamp }
  DOCUMENTS { uuid id PK; uuid claim_id FK; enum verification_status }
  RISK_PROFILES { uuid id PK; uuid claim_id FK; integer score; enum level }
  FRAUD_ALERTS { uuid id PK; uuid claim_id FK; integer risk_score; enum status }
  INVESTIGATORS { uuid id PK; string name; string region }
  INVESTIGATIONS { uuid id PK; uuid claim_id FK; uuid investigator_id FK; enum status }
  PAYMENTS { uuid id PK; uuid claim_id FK; numeric amount; enum status }
  AUDIT_LOGS { uuid id PK; string action; string entity_type; string entity_id }
```

The executable schema source is `lib/db/src/schema/index.ts`.