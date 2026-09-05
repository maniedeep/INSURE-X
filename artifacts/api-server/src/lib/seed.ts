import bcrypt from "bcryptjs";
import { and, count, eq } from "drizzle-orm";
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
  serviceProviders,
  users,
} from "@workspace/db";
import { logger } from "./logger";

const asDate = (daysAgo: number) => {
  const value = new Date();
  value.setDate(value.getDate() - daysAgo);
  return value;
};

export async function ensureSeedData(): Promise<void> {
  const [{ value: userCount }] = await db.select({ value: count() }).from(users);
  if (Number(userCount) > 0) return;

  const [admin] = await db
    .insert(users)
    .values({
      name: "Aarav Mehta",
      email: "admin@insurex.io",
      passwordHash: await bcrypt.hash("DemoPass123!", 10),
      role: "ADMIN",
    })
    .returning();

  const [investigatorOne, investigatorTwo] = await db
    .insert(investigators)
    .values([
      { name: "Maya Shah", email: "maya@insurex.io", region: "West" },
      { name: "Rohan Iyer", email: "rohan@insurex.io", region: "South" },
    ])
    .returning();

  const [provider] = await db
    .insert(serviceProviders)
    .values({ name: "Northstar Assessors", category: "Vehicle inspection", region: "West" })
    .returning();

  const seededCustomers = await db
    .insert(customers)
    .values([
      { name: "Neha Kapoor", email: "neha.kapoor@example.com", phone: "+91 98765 12001", region: "West" },
      { name: "Kabir Rao", email: "kabir.rao@example.com", phone: "+91 98765 12002", region: "South" },
      { name: "Ishita Sen", email: "ishita.sen@example.com", phone: "+91 98765 12003", region: "East" },
      { name: "Vikram Nair", email: "vikram.nair@example.com", phone: "+91 98765 12004", region: "North" },
      { name: "Ananya Bose", email: "ananya.bose@example.com", phone: "+91 98765 12005", region: "East" },
    ])
    .returning();

  const seededPolicies = await db
    .insert(policies)
    .values([
      {
        policyNumber: "POL-24-10482",
        customerId: seededCustomers[0].id,
        policyType: "Motor",
        premium: "48600",
        coverageAmount: "1250000",
        startDate: "2024-01-12",
        endDate: "2025-01-11",
        status: "ACTIVE",
      },
      {
        policyNumber: "POL-24-10483",
        customerId: seededCustomers[1].id,
        policyType: "Property",
        premium: "72800",
        coverageAmount: "2800000",
        startDate: "2024-02-04",
        endDate: "2025-02-03",
        status: "ACTIVE",
      },
      {
        policyNumber: "POL-24-10484",
        customerId: seededCustomers[2].id,
        policyType: "Health",
        premium: "35400",
        coverageAmount: "900000",
        startDate: "2024-03-20",
        endDate: "2025-03-19",
        status: "ACTIVE",
      },
      {
        policyNumber: "POL-24-10485",
        customerId: seededCustomers[3].id,
        policyType: "Travel",
        premium: "9800",
        coverageAmount: "450000",
        startDate: "2024-05-08",
        endDate: "2024-11-07",
        status: "EXPIRED",
      },
    ])
    .returning();

  const seededAssets = await db
    .insert(assets)
    .values([
      {
        policyId: seededPolicies[0].id,
        assetType: "Vehicle",
        description: "2022 Toyota Camry, graphite",
        identifier: "MH-04-KR-4821",
        value: "1120000",
      },
      {
        policyId: seededPolicies[1].id,
        assetType: "Property",
        description: "Two-bedroom apartment, Andheri East",
        identifier: "PROP-MH-1884",
        value: "6200000",
      },
      {
        policyId: seededPolicies[2].id,
        assetType: "Person",
        description: "Individual health cover",
        identifier: "HEALTH-IS-003",
        value: "900000",
      },
    ])
    .returning();

  const seededClaims = await db
    .insert(claims)
    .values([
      {
        claimNumber: "CLM-24-77841",
        customerId: seededCustomers[0].id,
        policyId: seededPolicies[0].id,
        assetId: seededAssets[0].id,
        claimType: "Collision",
        claimAmount: "845000",
        claimDate: "2024-06-18",
        description: "Rear impact collision on the Western Express Highway.",
        status: "INVESTIGATION",
        riskScore: 72,
        riskLevel: "HIGH",
        riskFactors: JSON.stringify(["Claim filed soon after policy start", "High claim amount", "Missing repair estimate"]),
        createdAt: asDate(23),
      },
      {
        claimNumber: "CLM-24-77842",
        customerId: seededCustomers[1].id,
        policyId: seededPolicies[1].id,
        assetId: seededAssets[1].id,
        claimType: "Water damage",
        claimAmount: "312000",
        claimDate: "2024-07-02",
        description: "Water damage reported after a monsoon-related ceiling leak.",
        status: "UNDER_REVIEW",
        riskScore: 38,
        riskLevel: "MEDIUM",
        riskFactors: JSON.stringify(["Multiple recent claims"]),
        createdAt: asDate(11),
      },
      {
        claimNumber: "CLM-24-77843",
        customerId: seededCustomers[2].id,
        policyId: seededPolicies[2].id,
        assetId: seededAssets[2].id,
        claimType: "Hospitalisation",
        claimAmount: "186000",
        claimDate: "2024-07-10",
        description: "Hospitalisation claim with complete discharge documentation.",
        status: "APPROVED",
        riskScore: 21,
        riskLevel: "LOW",
        riskFactors: JSON.stringify([]),
        createdAt: asDate(5),
      },
      {
        claimNumber: "CLM-24-77844",
        customerId: seededCustomers[3].id,
        policyId: seededPolicies[3].id,
        claimType: "Trip cancellation",
        claimAmount: "72000",
        claimDate: "2024-06-28",
        description: "Trip cancellation due to a documented medical emergency.",
        status: "SETTLED",
        riskScore: 12,
        riskLevel: "LOW",
        riskFactors: JSON.stringify([]),
        createdAt: asDate(29),
      },
      {
        claimNumber: "CLM-24-77845",
        customerId: seededCustomers[4].id,
        policyId: seededPolicies[2].id,
        assetId: seededAssets[2].id,
        claimType: "Outpatient",
        claimAmount: "44000",
        claimDate: "2024-07-14",
        description: "Outpatient procedure with provider invoice attached.",
        status: "REJECTED",
        riskScore: 64,
        riskLevel: "HIGH",
        riskFactors: JSON.stringify(["Repeated service provider association"]),
        createdAt: asDate(2),
      },
    ])
    .returning();

  await db.insert(claimEvents).values(
    seededClaims.flatMap((claim, index) => [
      {
        claimId: claim.id,
        eventType: "CLAIM_SUBMITTED",
        description: "Claim submitted through the operations queue.",
        actingUser: admin.id,
        timestamp: new Date(Date.now() - (index + 2) * 86400000),
      },
      {
        claimId: claim.id,
        eventType: index === 0 ? "INVESTIGATOR_ASSIGNED" : "RISK_CALCULATED",
        description: index === 0 ? "Assigned to Maya Shah for focused review." : "Prototype rule-based fraud-risk indicators evaluated.",
        actingUser: index === 0 ? investigatorOne.id : admin.id,
        timestamp: asDate(index + 1),
      },
    ]),
  );

  await db.insert(documents).values([
    {
      claimId: seededClaims[0].id,
      documentType: "Repair estimate",
      fileName: "repair-estimate-77841.pdf",
      verificationStatus: "PENDING",
    },
    {
      claimId: seededClaims[0].id,
      documentType: "Police report",
      fileName: "police-report-77841.pdf",
      verificationStatus: "VERIFIED",
      verifiedBy: "Aarav Mehta",
    },
    {
      claimId: seededClaims[1].id,
      documentType: "Property photographs",
      fileName: "property-photos-77842.zip",
      verificationStatus: "PENDING",
    },
  ]);

  await db.insert(investigations).values({
    claimId: seededClaims[0].id,
    investigatorId: investigatorOne.id,
    status: "IN_PROGRESS",
    notes: "Awaiting assessor report and second service-provider estimate.",
    findings: "Initial evidence suggests a valid collision; amount variance remains to be confirmed.",
    recommendation: "Continue investigation",
  });

  await db.insert(fraudAlerts).values([
    {
      claimId: seededClaims[0].id,
      riskScore: 72,
      severity: "HIGH",
      factors: JSON.stringify(["Claim filed soon after policy start", "High claim amount", "Missing repair estimate"]),
      status: "UNDER_REVIEW",
      assignedInvestigator: "Maya Shah",
    },
    {
      claimId: seededClaims[4].id,
      riskScore: 64,
      severity: "HIGH",
      factors: JSON.stringify(["Repeated service provider association"]),
      status: "OPEN",
    },
  ]);

  await db.insert(riskProfiles).values(
    seededClaims.map((claim) => ({
      claimId: claim.id,
      customerId: claim.customerId,
      score: claim.riskScore,
      level: claim.riskLevel,
      factors: claim.riskFactors,
    })),
  );

  await db.insert(payments).values({
    claimId: seededClaims[3].id,
    amount: "72000",
    method: "Bank transfer",
    status: "PAID",
    paymentDate: asDate(9),
  });

  await db.insert(auditLogs).values(
    seededClaims.map((claim) => ({
      action: "SUBMIT_CLAIM",
      entityType: "CLAIM",
      entityId: claim.id,
      actingUser: admin.id,
      metadata: JSON.stringify({ claimNumber: claim.claimNumber, source: "seed" }),
      timestamp: claim.createdAt,
    })),
  );

  logger.info(
    {
      customers: seededCustomers.length,
      policies: seededPolicies.length,
      claims: seededClaims.length,
      provider: provider.id,
      investigators: [investigatorOne.id, investigatorTwo.id],
    },
    "INSURE-X demo data seeded",
  );
}