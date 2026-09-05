import { Router, type IRouter, type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  lte,
  sql,
} from "drizzle-orm";
import { db } from "@workspace/db";
import {
  assets,
  auditLogs,
  claimEvents,
  claims,
  customers,
  documents,
  fraudAlerts,
  investigators,
  investigations,
  payments,
  policies,
  riskProfiles,
  users,
} from "@workspace/db";
import {
  CalculateClaimRiskParams,
  CreateAssetBody,
  CreateClaimBody,
  CreateCustomerBody,
  CreateInvestigationBody,
  CreatePolicyBody,
  GetClaimParams,
  GetCustomerParams,
  ListAssetsQueryParams,
  ListAuditLogsQueryParams,
  ListClaimsQueryParams,
  ListCustomersQueryParams,
  ListFraudAlertsQueryParams,
  ListInvestigationsQueryParams,
  ListPaymentsQueryParams,
  ListPoliciesQueryParams,
  LoginBody,
  SettleClaimBody,
  SettleClaimParams,
  UpdateClaimStatusBody,
  UpdateClaimStatusParams,
  UpdateCustomerBody,
  UpdateCustomerParams,
  UpdateFraudAlertBody,
  UpdateFraudAlertParams,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";
import {
  activeClaimTransitions,
  asNumber,
  assetSearch,
  auditSearch,
  buildWhere,
  claimSearch,
  customerSearch,
  fraudSearch,
  getPageOptions,
  investigationSearch,
  jsonArray,
  jsonObject,
  offsetFor,
  paymentSearch,
  policySearch,
  riskLevelFor,
} from "../lib/domain";

const router: IRouter = Router();
const sessionSecret = process.env.SESSION_SECRET ?? "insurex-development-session-secret";
type AuthenticatedRequest = Request & { user: typeof users.$inferSelect };

async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  try {
    const payload = jwt.verify(token, sessionSecret) as { sub?: string };
    if (!payload.sub) {
      res.status(401).json({ error: "Invalid authentication token" });
      return;
    }
    const [user] = await db.select().from(users).where(and(eq(users.id, payload.sub), eq(users.active, true))).limit(1);
    if (!user) {
      res.status(401).json({ error: "User account is inactive or missing" });
      return;
    }
    (req as AuthenticatedRequest).user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired authentication token" });
  }
}

function requireRoles(...roles: Array<typeof users.$inferSelect["role"]>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ error: "You do not have permission for this operation" });
      return;
    }
    next();
  };
}

const userView = (user: typeof users.$inferSelect) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  initials: user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
});

const claimView = (row: {
  claim: typeof claims.$inferSelect;
  customer: typeof customers.$inferSelect;
  policy: typeof policies.$inferSelect;
}) => ({
  id: row.claim.id,
  claimNumber: row.claim.claimNumber,
  customerId: row.claim.customerId,
  customerName: row.customer.name,
  policyId: row.claim.policyId,
  policyNumber: row.policy.policyNumber,
  policyType: row.policy.policyType,
  region: row.customer.region,
  claimType: row.claim.claimType,
  claimAmount: asNumber(row.claim.claimAmount),
  claimDate: row.claim.claimDate,
  status: row.claim.status,
  riskScore: row.claim.riskScore,
  riskLevel: row.claim.riskLevel,
  createdAt: row.claim.createdAt,
});

const eventView = (event: typeof claimEvents.$inferSelect) => ({
  id: event.id,
  claimId: event.claimId,
  eventType: event.eventType,
  description: event.description,
  actingUser: event.actingUser,
  timestamp: event.timestamp,
});

async function writeAudit(action: string, entityType: string, entityId: string, metadata: Record<string, unknown>) {
  await db.insert(auditLogs).values({
    action,
    entityType,
    entityId,
    actingUser: "Aarav Mehta",
    metadata: JSON.stringify(metadata),
  });
}

const parseQuery = (schema: { safeParse: (value: unknown) => { success: boolean; data?: unknown } }, value: unknown): Record<string, unknown> => {
  const parsed = schema.safeParse(value);
  return parsed.success && parsed.data && typeof parsed.data === "object" ? parsed.data as Record<string, unknown> : {};
};

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [user] = await db.select().from(users).where(and(eq(users.email, parsed.data.email), eq(users.active, true))).limit(1);
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const token = jwt.sign({ sub: user.id, role: user.role }, sessionSecret, { expiresIn: "8h" });
  await writeAudit("LOGIN", "USER", user.id, { email: user.email });
  res.json({ token, user: userView(user) });
});

router.use(requireAuth);

router.get("/auth/profile", async (req, res): Promise<void> => {
  res.json(userView((req as AuthenticatedRequest).user));
});

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [activePolicies] = await db.select({ value: count() }).from(policies).where(eq(policies.status, "ACTIVE"));
  const [totalClaims] = await db.select({ value: count() }).from(claims);
  const [pendingClaims] = await db
    .select({ value: count() })
    .from(claims)
    .where(sql`${claims.status} in ('SUBMITTED', 'UNDER_REVIEW', 'INVESTIGATION')`);
  const [approvedClaims] = await db.select({ value: count() }).from(claims).where(eq(claims.status, "APPROVED"));
  const [rejectedClaims] = await db.select({ value: count() }).from(claims).where(eq(claims.status, "REJECTED"));
  const [highRiskClaims] = await db.select({ value: count() }).from(claims).where(sql`${claims.riskLevel} in ('HIGH', 'CRITICAL')`);
  const [openInvestigations] = await db.select({ value: count() }).from(investigations).where(sql`${investigations.status} in ('ASSIGNED', 'IN_PROGRESS')`);
  const [settlementTotal] = await db.select({ value: sql<string>`coalesce(sum(${payments.amount}), 0)` }).from(payments).where(eq(payments.status, "PAID"));
  const monthly = await db
    .select({
      label: sql<string>`to_char(date_trunc('month', ${claims.createdAt}), 'Mon')`,
      count: count(),
      amount: sql<string>`coalesce(sum(${claims.claimAmount}), 0)`,
    })
    .from(claims)
    .groupBy(sql`date_trunc('month', ${claims.createdAt})`)
    .orderBy(asc(sql`date_trunc('month', ${claims.createdAt})`));
  const riskDistribution = await db
    .select({ label: claims.riskLevel, value: count() })
    .from(claims)
    .groupBy(claims.riskLevel);
  const claimStatusDistribution = await db
    .select({ label: claims.status, value: count() })
    .from(claims)
    .groupBy(claims.status);
  const recent = await db.select().from(claimEvents).orderBy(desc(claimEvents.timestamp)).limit(6);
  res.json({
    kpis: {
      activePolicies: Number(activePolicies.value),
      totalClaims: Number(totalClaims.value),
      pendingClaims: Number(pendingClaims.value),
      approvedClaims: Number(approvedClaims.value),
      rejectedClaims: Number(rejectedClaims.value),
      highRiskClaims: Number(highRiskClaims.value),
      totalSettlements: asNumber(settlementTotal.value),
      openInvestigations: Number(openInvestigations.value),
    },
    claimsByMonth: monthly.map((item) => ({ label: item.label, count: Number(item.count), amount: asNumber(item.amount) })),
    riskDistribution: riskDistribution.map((item) => ({ label: item.label, value: Number(item.value) })),
    claimStatusDistribution: claimStatusDistribution.map((item) => ({ label: item.label, value: Number(item.value) })),
    recentActivity: recent.map(eventView),
  });
});

router.get("/customers", async (req, res): Promise<void> => {
  const query = parseQuery(ListCustomersQueryParams, req.query) ?? {};
  const options = getPageOptions(query);
  const where = customerSearch(options.search);
  const [{ value: total }] = await db.select({ value: count() }).from(customers).where(where);
  const rows = await db.select().from(customers).where(where).orderBy(desc(customers.createdAt)).limit(options.pageSize).offset(offsetFor(options));
  const items = await Promise.all(rows.map(async (customer) => {
    const [{ value: policyCount }] = await db.select({ value: count() }).from(policies).where(eq(policies.customerId, customer.id));
    const [{ value: claimCount }] = await db.select({ value: count() }).from(claims).where(eq(claims.customerId, customer.id));
    return { ...customer, policyCount: Number(policyCount), claimCount: Number(claimCount) };
  }));
  res.json({ items, page: options.page, pageSize: options.pageSize, total: Number(total) });
});

router.post("/customers", requireRoles("ADMIN", "AGENT"), async (req, res): Promise<void> => {
  const parsed = CreateCustomerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [customer] = await db.insert(customers).values(parsed.data).returning();
  await writeAudit("CREATE_CUSTOMER", "CUSTOMER", customer.id, { name: customer.name });
  res.status(201).json({ ...customer, policyCount: 0, claimCount: 0 });
});

router.get("/customers/:id", async (req, res): Promise<void> => {
  const params = GetCustomerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [customer] = await db.select().from(customers).where(eq(customers.id, params.data.id));
  if (!customer) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }
  const [{ value: policyCount }] = await db.select({ value: count() }).from(policies).where(eq(policies.customerId, customer.id));
  const [{ value: claimCount }] = await db.select({ value: count() }).from(claims).where(eq(claims.customerId, customer.id));
  res.json({ ...customer, policyCount: Number(policyCount), claimCount: Number(claimCount) });
});

router.patch("/customers/:id", requireRoles("ADMIN", "AGENT"), async (req, res): Promise<void> => {
  const params = UpdateCustomerParams.safeParse(req.params);
  const body = UpdateCustomerBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid customer update request" });
    return;
  }
  const [customer] = await db.update(customers).set(body.data).where(eq(customers.id, params.data.id)).returning();
  if (!customer) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }
  await writeAudit("UPDATE_CUSTOMER", "CUSTOMER", customer.id, body.data);
  res.json({ ...customer, policyCount: 0, claimCount: 0 });
});

router.get("/policies", async (req, res): Promise<void> => {
  const query = parseQuery(ListPoliciesQueryParams, req.query) ?? {};
  const options = getPageOptions(query);
  const policyStatus = typeof query.status === "string" ? query.status : undefined;
  const policyType = typeof query.policyType === "string" ? query.policyType : undefined;
  const where = buildWhere(policySearch(options.search), policyStatus ? eq(policies.status, policyStatus as never) : undefined, policyType ? ilike(policies.policyType, `%${policyType}%`) : undefined);
  const [{ value: total }] = await db.select({ value: count() }).from(policies).where(where);
  const rows = await db.select({ policy: policies, customer: customers }).from(policies).innerJoin(customers, eq(policies.customerId, customers.id)).where(where).orderBy(desc(policies.createdAt)).limit(options.pageSize).offset(offsetFor(options));
  res.json({
    items: rows.map(({ policy, customer }) => ({ ...policy, customerName: customer.name, premium: asNumber(policy.premium), coverageAmount: asNumber(policy.coverageAmount) })),
    page: options.page,
    pageSize: options.pageSize,
    total: Number(total),
  });
});

router.post("/policies", requireRoles("ADMIN", "AGENT"), async (req, res): Promise<void> => {
  const parsed = CreatePolicyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (parsed.data.endDate <= parsed.data.startDate) {
    res.status(400).json({ error: "End date must be after start date" });
    return;
  }
  const [policy] = await db.insert(policies).values({
    policyNumber: parsed.data.policyNumber,
    customerId: parsed.data.customerId,
    policyType: parsed.data.policyType,
    premium: String(parsed.data.premium),
    coverageAmount: String(parsed.data.coverageAmount),
    startDate: parsed.data.startDate.toISOString().slice(0, 10),
    endDate: parsed.data.endDate.toISOString().slice(0, 10),
  }).returning();
  const [customer] = await db.select().from(customers).where(eq(customers.id, policy.customerId));
  await writeAudit("CREATE_POLICY", "POLICY", policy.id, { policyNumber: policy.policyNumber });
  res.status(201).json({ ...policy, customerName: customer?.name ?? "Unknown", premium: asNumber(policy.premium), coverageAmount: asNumber(policy.coverageAmount) });
});

router.get("/assets", async (req, res): Promise<void> => {
  const query = parseQuery(ListAssetsQueryParams, req.query) ?? {};
  const options = getPageOptions(query);
  const type = typeof query.assetType === "string" ? query.assetType : undefined;
  const where = buildWhere(assetSearch(options.search), type ? ilike(assets.assetType, `%${type}%`) : undefined);
  const [{ value: total }] = await db.select({ value: count() }).from(assets).where(where);
  const rows = await db.select({ asset: assets, policy: policies, customer: customers }).from(assets).innerJoin(policies, eq(assets.policyId, policies.id)).innerJoin(customers, eq(policies.customerId, customers.id)).where(where).orderBy(desc(assets.createdAt)).limit(options.pageSize).offset(offsetFor(options));
  res.json({ items: rows.map(({ asset, customer }) => ({ ...asset, customerName: customer.name, value: asNumber(asset.value) })), page: options.page, pageSize: options.pageSize, total: Number(total) });
});

router.post("/assets", requireRoles("ADMIN", "AGENT"), async (req, res): Promise<void> => {
  const parsed = CreateAssetBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [asset] = await db.insert(assets).values({ ...parsed.data, value: String(parsed.data.value) }).returning();
  const [{ customerName }] = await db.select({ customerName: customers.name }).from(policies).innerJoin(customers, eq(policies.customerId, customers.id)).where(eq(policies.id, asset.policyId));
  res.status(201).json({ ...asset, customerName, value: asNumber(asset.value) });
});

router.get("/claims", async (req, res): Promise<void> => {
  const query = parseQuery(ListClaimsQueryParams, req.query) ?? {};
  const options = getPageOptions(query);
  const where = buildWhere(
    claimSearch(options.search),
    typeof query.status === "string" ? eq(claims.status, query.status as never) : undefined,
    typeof query.riskLevel === "string" ? eq(claims.riskLevel, query.riskLevel as never) : undefined,
    typeof query.region === "string" ? ilike(customers.region, `%${query.region}%`) : undefined,
    typeof query.policyType === "string" ? ilike(policies.policyType, `%${query.policyType}%`) : undefined,
  );
  const [{ value: total }] = await db.select({ value: count() }).from(claims).innerJoin(customers, eq(claims.customerId, customers.id)).innerJoin(policies, eq(claims.policyId, policies.id)).where(where);
  const rows = await db.select({ claim: claims, customer: customers, policy: policies }).from(claims).innerJoin(customers, eq(claims.customerId, customers.id)).innerJoin(policies, eq(claims.policyId, policies.id)).where(where).orderBy(desc(claims.createdAt)).limit(options.pageSize).offset(offsetFor(options));
  res.json({ items: rows.map(claimView), page: options.page, pageSize: options.pageSize, total: Number(total) });
});

router.post("/claims", requireRoles("ADMIN", "AGENT"), async (req, res): Promise<void> => {
  const parsed = CreateClaimBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [policy] = await db.select().from(policies).where(eq(policies.id, parsed.data.policyId));
  const [customer] = await db.select().from(customers).where(eq(customers.id, parsed.data.customerId));
  if (!policy || !customer) {
    res.status(400).json({ error: "Customer or policy reference is invalid" });
    return;
  }
  const [claim] = await db.insert(claims).values({
    claimNumber: parsed.data.claimNumber,
    customerId: parsed.data.customerId,
    policyId: parsed.data.policyId,
    assetId: parsed.data.assetId,
    claimType: parsed.data.claimType,
    claimDate: parsed.data.claimDate.toISOString().slice(0, 10),
    description: parsed.data.description,
    claimAmount: String(parsed.data.claimAmount),
    status: "SUBMITTED",
  }).returning();
  await db.insert(claimEvents).values({ claimId: claim.id, eventType: "CLAIM_SUBMITTED", description: "Claim submitted through the operations queue.", actingUser: "Aarav Mehta" });
  await writeAudit("SUBMIT_CLAIM", "CLAIM", claim.id, { claimNumber: claim.claimNumber });
  res.status(201).json(claimView({ claim, customer, policy }));
});

router.get("/claims/:id", async (req, res): Promise<void> => {
  const params = GetClaimParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db.select({ claim: claims, customer: customers, policy: policies }).from(claims).innerJoin(customers, eq(claims.customerId, customers.id)).innerJoin(policies, eq(claims.policyId, policies.id)).where(eq(claims.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Claim not found" });
    return;
  }
  const [asset] = row.claim.assetId ? await db.select().from(assets).where(eq(assets.id, row.claim.assetId)) : [];
  const claimAlerts = await db.select().from(fraudAlerts).where(eq(fraudAlerts.claimId, row.claim.id));
  const claimDocuments = await db.select().from(documents).where(eq(documents.claimId, row.claim.id));
  const [investigation] = await db.select({ investigation: investigations, investigator: investigators }).from(investigations).innerJoin(investigators, eq(investigations.investigatorId, investigators.id)).where(eq(investigations.claimId, row.claim.id)).limit(1);
  const [payment] = await db.select().from(payments).where(eq(payments.claimId, row.claim.id)).limit(1);
  const events = await db.select().from(claimEvents).where(eq(claimEvents.claimId, row.claim.id)).orderBy(asc(claimEvents.timestamp));
  res.json({
    ...claimView(row),
    description: row.claim.description,
    assetDescription: asset?.description ?? "No asset linked",
    riskFactors: jsonArray(row.claim.riskFactors),
    fraudAlerts: claimAlerts.map((alert) => ({ ...alert, claimNumber: row.claim.claimNumber, factors: jsonArray(alert.factors) })),
    documents: claimDocuments,
    investigation: investigation ? { ...investigation.investigation, claimNumber: row.claim.claimNumber, investigatorName: investigation.investigator.name } : null,
    events: events.map(eventView),
    payment: payment ? { ...payment, claimNumber: row.claim.claimNumber, amount: asNumber(payment.amount) } : null,
  });
});

router.patch("/claims/:id/status", requireRoles("ADMIN", "AGENT", "INVESTIGATOR"), async (req, res): Promise<void> => {
  const params = UpdateClaimStatusParams.safeParse(req.params);
  const body = UpdateClaimStatusBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid claim status request" });
    return;
  }
  const [current] = await db.select().from(claims).where(eq(claims.id, params.data.id));
  if (!current) {
    res.status(404).json({ error: "Claim not found" });
    return;
  }
  if (!activeClaimTransitions[current.status]?.includes(body.data.status)) {
    res.status(400).json({ error: `Invalid transition from ${current.status} to ${body.data.status}` });
    return;
  }
  const [claim] = await db.update(claims).set({ status: body.data.status, updatedAt: new Date() }).where(eq(claims.id, current.id)).returning();
  await db.insert(claimEvents).values({ claimId: claim.id, eventType: body.data.status === "APPROVED" ? "CLAIM_APPROVED" : body.data.status === "REJECTED" ? "CLAIM_REJECTED" : "STATUS_UPDATED", description: body.data.note ?? `Claim moved to ${body.data.status}.`, actingUser: "Aarav Mehta" });
  await writeAudit(`${body.data.status === "APPROVED" ? "APPROVE" : body.data.status === "REJECTED" ? "REJECT" : "UPDATE"}_CLAIM`, "CLAIM", claim.id, { status: body.data.status });
  const [row] = await db.select({ claim: claims, customer: customers, policy: policies }).from(claims).innerJoin(customers, eq(claims.customerId, customers.id)).innerJoin(policies, eq(claims.policyId, policies.id)).where(eq(claims.id, claim.id));
  res.json(claimView(row));
});

router.post("/claims/:id/risk", requireRoles("ADMIN", "AGENT", "INVESTIGATOR"), async (req, res): Promise<void> => {
  const params = CalculateClaimRiskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [claim] = await db.select().from(claims).where(eq(claims.id, params.data.id));
  if (!claim) {
    res.status(404).json({ error: "Claim not found" });
    return;
  }
  const [{ value: history }] = await db.select({ value: count() }).from(claims).where(and(eq(claims.customerId, claim.customerId), sql`${claims.id} <> ${claim.id}`));
  const [{ value: recentClaims }] = await db.select({ value: count() }).from(claims).where(and(eq(claims.customerId, claim.customerId), gte(claims.createdAt, new Date(Date.now() - 90 * 86400000))));
  const [policy] = await db.select().from(policies).where(eq(policies.id, claim.policyId));
  const factors: string[] = [];
  let score = 0;
  if (Number(history) > 0) {
    score += 15;
    factors.push("Previous claims");
  }
  if (policy && Math.abs(new Date(claim.claimDate).getTime() - new Date(policy.startDate).getTime()) < 45 * 86400000) {
    score += 25;
    factors.push("Claim filed soon after policy start");
  }
  if (policy && asNumber(claim.claimAmount) > asNumber(policy.coverageAmount) * 0.5) {
    score += 20;
    factors.push("High claim amount relative to coverage");
  }
  if (Number(recentClaims) > 1) {
    score += 15;
    factors.push("Multiple recent claims");
  }
  const [pendingDocuments] = await db.select({ value: count() }).from(documents).where(and(eq(documents.claimId, claim.id), eq(documents.verificationStatus, "PENDING")));
  if (Number(pendingDocuments.value) > 0) {
    score += 10;
    factors.push("Missing or unverified required documents");
  }
  score = Math.min(100, score);
  const level = riskLevelFor(score);
  const [risk] = await db.insert(riskProfiles).values({ claimId: claim.id, customerId: claim.customerId, score, level, factors: JSON.stringify(factors) }).returning();
  await db.update(claims).set({ riskScore: score, riskLevel: level, riskFactors: JSON.stringify(factors), updatedAt: new Date() }).where(eq(claims.id, claim.id));
  if (score >= 60) {
    const [existing] = await db.select().from(fraudAlerts).where(and(eq(fraudAlerts.claimId, claim.id), sql`${fraudAlerts.status} in ('OPEN', 'UNDER_REVIEW')`)).limit(1);
    if (!existing) {
      await db.insert(fraudAlerts).values({ claimId: claim.id, riskScore: score, severity: level, factors: JSON.stringify(factors) });
      await db.insert(claimEvents).values({ claimId: claim.id, eventType: "FRAUD_ALERT_CREATED", description: "A fraud alert was created from prototype risk indicators.", actingUser: "Aarav Mehta" });
    }
  }
  await db.insert(claimEvents).values({ claimId: claim.id, eventType: "RISK_CALCULATED", description: `Prototype risk score calculated at ${score}/100 (${level}).`, actingUser: "Aarav Mehta" });
  await writeAudit("UPDATE_RISK", "CLAIM", claim.id, { score, level, factors });
  res.json({ claimId: claim.id, score: risk.score, level: risk.level, factors, calculatedAt: risk.calculatedAt });
});

router.post("/claims/:id/settle", requireRoles("ADMIN", "FINANCE"), async (req, res): Promise<void> => {
  const params = SettleClaimParams.safeParse(req.params);
  const body = SettleClaimBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid settlement request" });
    return;
  }
  const [current] = await db.select().from(claims).where(eq(claims.id, params.data.id));
  if (!current) {
    res.status(404).json({ error: "Claim not found" });
    return;
  }
  if (current.status !== "APPROVED") {
    res.status(400).json({ error: "Only approved claims can be settled" });
    return;
  }
  const result = await db.transaction(async (tx) => {
    const [claim] = await tx.update(claims).set({ status: "SETTLED", updatedAt: new Date() }).where(eq(claims.id, current.id)).returning();
    const [payment] = await tx.insert(payments).values({ claimId: current.id, amount: String(body.data.amount), method: body.data.method, status: "PAID" }).returning();
    const [event] = await tx.insert(claimEvents).values({ claimId: current.id, eventType: "PAYMENT_CREATED", description: `Settlement payment of ${body.data.amount} created via ${body.data.method}.`, actingUser: "Aarav Mehta" }).returning();
    await tx.insert(auditLogs).values({ action: "CREATE_PAYMENT", entityType: "PAYMENT", entityId: payment.id, actingUser: "Aarav Mehta", metadata: JSON.stringify({ claimId: current.id, amount: body.data.amount }) });
    return { claim, payment, event };
  });
  const [row] = await db.select({ claim: claims, customer: customers, policy: policies }).from(claims).innerJoin(customers, eq(claims.customerId, customers.id)).innerJoin(policies, eq(claims.policyId, policies.id)).where(eq(claims.id, current.id));
  res.json({ claim: claimView(row), payment: { ...result.payment, claimNumber: current.claimNumber, amount: asNumber(result.payment.amount) }, event: eventView(result.event) });
});

router.get("/claim-events/:claimId", async (req, res): Promise<void> => {
  const events = await db.select().from(claimEvents).where(eq(claimEvents.claimId, String(req.params.claimId))).orderBy(asc(claimEvents.timestamp));
  res.json(events.map(eventView));
});

router.get("/investigations", async (req, res): Promise<void> => {
  const query = parseQuery(ListInvestigationsQueryParams, req.query) ?? {};
  const options = getPageOptions(query);
  const where = buildWhere(investigationSearch(options.search), typeof query.status === "string" ? eq(investigations.status, query.status as never) : undefined);
  const [{ value: total }] = await db.select({ value: count() }).from(investigations).innerJoin(claims, eq(investigations.claimId, claims.id)).innerJoin(investigators, eq(investigations.investigatorId, investigators.id)).where(where);
  const rows = await db.select({ investigation: investigations, claim: claims, investigator: investigators }).from(investigations).innerJoin(claims, eq(investigations.claimId, claims.id)).innerJoin(investigators, eq(investigations.investigatorId, investigators.id)).where(where).orderBy(desc(investigations.updatedAt)).limit(options.pageSize).offset(offsetFor(options));
  res.json({ items: rows.map(({ investigation, claim, investigator }) => ({ ...investigation, claimNumber: claim.claimNumber, investigatorName: investigator.name })), page: options.page, pageSize: options.pageSize, total: Number(total) });
});

router.post("/investigations", requireRoles("ADMIN", "AGENT", "INVESTIGATOR"), async (req, res): Promise<void> => {
  const parsed = CreateInvestigationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [investigation] = await db.insert(investigations).values(parsed.data).returning();
  const [claim] = await db.select().from(claims).where(eq(claims.id, investigation.claimId));
  const [investigator] = await db.select().from(investigators).where(eq(investigators.id, investigation.investigatorId));
  await db.update(claims).set({ status: "INVESTIGATION", updatedAt: new Date() }).where(eq(claims.id, investigation.claimId));
  await db.insert(claimEvents).values({ claimId: investigation.claimId, eventType: "INVESTIGATOR_ASSIGNED", description: `Assigned to ${investigator?.name ?? "investigator"}.`, actingUser: "Aarav Mehta" });
  res.status(201).json({ ...investigation, claimNumber: claim?.claimNumber ?? "Unknown", investigatorName: investigator?.name ?? "Unknown" });
});

router.get("/fraud-alerts", async (req, res): Promise<void> => {
  const query = parseQuery(ListFraudAlertsQueryParams, req.query) ?? {};
  const options = getPageOptions(query);
  const where = buildWhere(fraudSearch(options.search), typeof query.severity === "string" ? eq(fraudAlerts.severity, query.severity as never) : undefined, typeof query.status === "string" ? eq(fraudAlerts.status, query.status as never) : undefined);
  const [{ value: total }] = await db.select({ value: count() }).from(fraudAlerts).innerJoin(claims, eq(fraudAlerts.claimId, claims.id)).where(where);
  const rows = await db.select({ alert: fraudAlerts, claim: claims }).from(fraudAlerts).innerJoin(claims, eq(fraudAlerts.claimId, claims.id)).where(where).orderBy(desc(fraudAlerts.createdAt)).limit(options.pageSize).offset(offsetFor(options));
  res.json({ items: rows.map(({ alert, claim }) => ({ ...alert, claimNumber: claim.claimNumber, factors: jsonArray(alert.factors) })), page: options.page, pageSize: options.pageSize, total: Number(total) });
});

router.patch("/fraud-alerts/:id", requireRoles("ADMIN", "AGENT", "INVESTIGATOR"), async (req, res): Promise<void> => {
  const params = UpdateFraudAlertParams.safeParse(req.params);
  const body = UpdateFraudAlertBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid fraud alert update request" });
    return;
  }
  const [alert] = await db.update(fraudAlerts).set(body.data).where(eq(fraudAlerts.id, params.data.id)).returning();
  if (!alert) {
    res.status(404).json({ error: "Fraud alert not found" });
    return;
  }
  const [claim] = await db.select().from(claims).where(eq(claims.id, alert.claimId));
  res.json({ ...alert, claimNumber: claim?.claimNumber ?? "Unknown", factors: jsonArray(alert.factors) });
});

router.get("/payments", async (req, res): Promise<void> => {
  const query = parseQuery(ListPaymentsQueryParams, req.query) ?? {};
  const options = getPageOptions(query);
  const where = buildWhere(paymentSearch(options.search), typeof query.status === "string" ? eq(payments.status, query.status as never) : undefined);
  const [{ value: total }] = await db.select({ value: count() }).from(payments).innerJoin(claims, eq(payments.claimId, claims.id)).where(where);
  const rows = await db.select({ payment: payments, claim: claims }).from(payments).innerJoin(claims, eq(payments.claimId, claims.id)).where(where).orderBy(desc(payments.paymentDate)).limit(options.pageSize).offset(offsetFor(options));
  res.json({ items: rows.map(({ payment, claim }) => ({ ...payment, claimNumber: claim.claimNumber, amount: asNumber(payment.amount) })), page: options.page, pageSize: options.pageSize, total: Number(total) });
});

router.get("/reports/claims-by-month", async (_req, res): Promise<void> => {
  const rows = await db.select({ label: sql<string>`to_char(date_trunc('month', ${claims.createdAt}), 'Mon YYYY')`, count: count(), amount: sql<string>`coalesce(sum(${claims.claimAmount}), 0)` }).from(claims).groupBy(sql`date_trunc('month', ${claims.createdAt})`).orderBy(asc(sql`date_trunc('month', ${claims.createdAt})`));
  res.json(rows.map((row) => ({ label: row.label, count: Number(row.count), amount: asNumber(row.amount) })));
});

router.get("/reports/risk-distribution", async (_req, res): Promise<void> => {
  const rows = await db.select({ label: claims.riskLevel, value: count() }).from(claims).groupBy(claims.riskLevel);
  res.json(rows.map((row) => ({ label: row.label, value: Number(row.value) })));
});

router.get("/reports/settlements", async (_req, res): Promise<void> => {
  const rows = await db.select({ label: sql<string>`to_char(date_trunc('month', ${payments.paymentDate}), 'Mon YYYY')`, count: count(), amount: sql<string>`coalesce(sum(${payments.amount}), 0)` }).from(payments).where(eq(payments.status, "PAID")).groupBy(sql`date_trunc('month', ${payments.paymentDate})`).orderBy(asc(sql`date_trunc('month', ${payments.paymentDate})`));
  res.json(rows.map((row) => ({ label: row.label, count: Number(row.count), amount: asNumber(row.amount) })));
});

router.get("/reports/investigator-workload", async (_req, res): Promise<void> => {
  const rows = await db.select({ label: investigators.name, value: count() }).from(investigations).innerJoin(investigators, eq(investigations.investigatorId, investigators.id)).groupBy(investigators.name).orderBy(desc(count()));
  res.json(rows.map((row) => ({ label: row.label, value: Number(row.value) })));
});

router.get("/audit-logs", async (req, res): Promise<void> => {
  const query = parseQuery(ListAuditLogsQueryParams, req.query) ?? {};
  const options = getPageOptions(query);
  const where = buildWhere(auditSearch(options.search), typeof query.action === "string" ? ilike(auditLogs.action, `%${query.action}%`) : undefined);
  const [{ value: total }] = await db.select({ value: count() }).from(auditLogs).where(where);
  const rows = await db.select().from(auditLogs).where(where).orderBy(desc(auditLogs.timestamp)).limit(options.pageSize).offset(offsetFor(options));
  res.json({ items: rows.map((row) => ({ ...row, metadata: JSON.stringify(jsonObject(row.metadata)) })), page: options.page, pageSize: options.pageSize, total: Number(total) });
});

router.use((error: unknown, req: { log?: typeof logger }, res: { status: (code: number) => { json: (body: unknown) => void } }, _next: unknown) => {
  req.log?.error({ error }, "INSURE-X route error");
  res.status(500).json({ error: "Something went wrong while processing the request." });
});

export default router;