import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "ADMIN",
  "AGENT",
  "CUSTOMER",
  "INVESTIGATOR",
  "FINANCE",
]);
export const customerStatusEnum = pgEnum("customer_status", ["ACTIVE", "INACTIVE"]);
export const policyStatusEnum = pgEnum("policy_status", ["ACTIVE", "EXPIRED", "CANCELLED", "PENDING"]);
export const claimStatusEnum = pgEnum("claim_status", [
  "SUBMITTED",
  "UNDER_REVIEW",
  "INVESTIGATION",
  "APPROVED",
  "REJECTED",
  "SETTLED",
]);
export const riskLevelEnum = pgEnum("risk_level", ["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export const fraudAlertStatusEnum = pgEnum("fraud_alert_status", ["OPEN", "UNDER_REVIEW", "RESOLVED", "DISMISSED"]);
export const investigationStatusEnum = pgEnum("investigation_status", ["ASSIGNED", "IN_PROGRESS", "COMPLETED"]);
export const paymentStatusEnum = pgEnum("payment_status", ["PENDING", "PROCESSING", "PAID", "FAILED"]);
export const documentVerificationEnum = pgEnum("document_verification", ["PENDING", "VERIFIED", "REJECTED"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("AGENT"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone").notNull(),
    region: text("region").notNull(),
    status: customerStatusEnum("status").notNull().default("ACTIVE"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("customers_region_idx").on(table.region), index("customers_created_at_idx").on(table.createdAt)],
);

export const policies = pgTable(
  "policies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    policyNumber: text("policy_number").notNull().unique(),
    customerId: uuid("customer_id").notNull().references(() => customers.id),
    policyType: text("policy_type").notNull(),
    premium: numeric("premium", { precision: 14, scale: 2 }).notNull(),
    coverageAmount: numeric("coverage_amount", { precision: 14, scale: 2 }).notNull(),
    startDate: date("start_date", { mode: "string" }).notNull(),
    endDate: date("end_date", { mode: "string" }).notNull(),
    status: policyStatusEnum("status").notNull().default("ACTIVE"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("policies_customer_idx").on(table.customerId), index("policies_status_idx").on(table.status)],
);

export const assets = pgTable(
  "assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    policyId: uuid("policy_id").notNull().references(() => policies.id),
    assetType: text("asset_type").notNull(),
    description: text("description").notNull(),
    identifier: text("identifier").notNull().unique(),
    value: numeric("value", { precision: 14, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("assets_policy_idx").on(table.policyId), index("assets_type_idx").on(table.assetType)],
);

export const claims = pgTable(
  "claims",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    claimNumber: text("claim_number").notNull().unique(),
    customerId: uuid("customer_id").notNull().references(() => customers.id),
    policyId: uuid("policy_id").notNull().references(() => policies.id),
    assetId: uuid("asset_id").references(() => assets.id),
    claimType: text("claim_type").notNull(),
    claimAmount: numeric("claim_amount", { precision: 14, scale: 2 }).notNull(),
    claimDate: date("claim_date", { mode: "string" }).notNull(),
    description: text("description").notNull(),
    status: claimStatusEnum("status").notNull().default("SUBMITTED"),
    riskScore: integer("risk_score").notNull().default(0),
    riskLevel: riskLevelEnum("risk_level").notNull().default("LOW"),
    riskFactors: text("risk_factors").notNull().default("[]"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("claims_customer_idx").on(table.customerId),
    index("claims_policy_idx").on(table.policyId),
    index("claims_status_idx").on(table.status),
    index("claims_created_at_idx").on(table.createdAt),
    index("claims_risk_score_idx").on(table.riskScore),
  ],
);

export const claimEvents = pgTable(
  "claim_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    claimId: uuid("claim_id").notNull().references(() => claims.id),
    eventType: text("event_type").notNull(),
    description: text("description").notNull(),
    actingUser: text("acting_user").notNull(),
    timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("claim_events_claim_idx").on(table.claimId), index("claim_events_timestamp_idx").on(table.timestamp)],
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    claimId: uuid("claim_id").notNull().references(() => claims.id),
    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
    method: text("method").notNull(),
    status: paymentStatusEnum("status").notNull().default("PAID"),
    paymentDate: timestamp("payment_date", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("payments_claim_idx").on(table.claimId), index("payments_date_idx").on(table.paymentDate)],
);

export const serviceProviders = pgTable("service_providers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  region: text("region").notNull(),
  active: boolean("active").notNull().default(true),
});

export const investigators = pgTable("investigators", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  region: text("region").notNull(),
  active: boolean("active").notNull().default(true),
});

export const investigations = pgTable(
  "investigations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    claimId: uuid("claim_id").notNull().references(() => claims.id),
    investigatorId: uuid("investigator_id").notNull().references(() => investigators.id),
    status: investigationStatusEnum("status").notNull().default("ASSIGNED"),
    notes: text("notes").notNull().default(""),
    findings: text("findings").notNull().default(""),
    recommendation: text("recommendation").notNull().default(""),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("investigations_claim_idx").on(table.claimId), index("investigations_investigator_idx").on(table.investigatorId)],
);

export const riskProfiles = pgTable(
  "risk_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    claimId: uuid("claim_id").notNull().references(() => claims.id),
    customerId: uuid("customer_id").notNull().references(() => customers.id),
    score: integer("score").notNull().default(0),
    level: riskLevelEnum("level").notNull().default("LOW"),
    factors: text("factors").notNull().default("[]"),
    calculatedAt: timestamp("calculated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("risk_profiles_score_idx").on(table.score), index("risk_profiles_claim_idx").on(table.claimId)],
);

export const fraudAlerts = pgTable(
  "fraud_alerts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    claimId: uuid("claim_id").notNull().references(() => claims.id),
    riskScore: integer("risk_score").notNull(),
    severity: riskLevelEnum("severity").notNull(),
    factors: text("factors").notNull().default("[]"),
    status: fraudAlertStatusEnum("status").notNull().default("OPEN"),
    assignedInvestigator: text("assigned_investigator").notNull().default("Unassigned"),
    resolution: text("resolution").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("fraud_alerts_risk_score_idx").on(table.riskScore), index("fraud_alerts_status_idx").on(table.status)],
);

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    claimId: uuid("claim_id").notNull().references(() => claims.id),
    documentType: text("document_type").notNull(),
    fileName: text("file_name").notNull(),
    verificationStatus: documentVerificationEnum("verification_status").notNull().default("PENDING"),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
    verifiedBy: text("verified_by").notNull().default("Pending review"),
  },
  (table) => [index("documents_claim_idx").on(table.claimId), index("documents_status_idx").on(table.verificationStatus)],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    actingUser: text("acting_user").notNull(),
    timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
    metadata: text("metadata").notNull().default("{}"),
  },
  (table) => [index("audit_logs_action_idx").on(table.action), index("audit_logs_timestamp_idx").on(table.timestamp)],
);

export {
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";