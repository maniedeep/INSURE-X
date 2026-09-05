import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
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
} from "@workspace/db";

export type PageOptions = {
  page: number;
  pageSize: number;
  search?: string;
  sort?: string;
};

export const getPageOptions = (query: Record<string, unknown>): PageOptions => ({
  page: Math.max(1, Number(query.page) || 1),
  pageSize: Math.min(100, Math.max(1, Number(query.pageSize) || 20)),
  search: typeof query.search === "string" ? query.search : undefined,
  sort: typeof query.sort === "string" ? query.sort : "-createdAt",
});

export const offsetFor = ({ page, pageSize }: PageOptions) => (page - 1) * pageSize;

export const directionFor = (sort: string | undefined) => (sort?.startsWith("-") ? desc : asc);

export const asNumber = (value: string | number | null | undefined) => Number(value ?? 0);

export const jsonArray = (value: string | null | undefined): string[] => {
  try {
    const parsed: unknown = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

export const jsonObject = (value: string | null | undefined): Record<string, unknown> => {
  try {
    const parsed: unknown = JSON.parse(value ?? "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
};

export const customerSearch = (search?: string) =>
  search
    ? or(
        ilike(customers.name, `%${search}%`),
        ilike(customers.email, `%${search}%`),
        ilike(customers.region, `%${search}%`),
      )
    : undefined;

export const policySearch = (search?: string) =>
  search
    ? or(
        ilike(policies.policyNumber, `%${search}%`),
        ilike(policies.policyType, `%${search}%`),
      )
    : undefined;

export const claimSearch = (search?: string) =>
  search
    ? or(
        ilike(claims.claimNumber, `%${search}%`),
        ilike(customers.name, `%${search}%`),
        ilike(policies.policyNumber, `%${search}%`),
        ilike(claims.claimType, `%${search}%`),
      )
    : undefined;

export const assetSearch = (search?: string) =>
  search
    ? or(
        ilike(assets.identifier, `%${search}%`),
        ilike(assets.description, `%${search}%`),
        ilike(assets.assetType, `%${search}%`),
      )
    : undefined;

export const investigationSearch = (search?: string) =>
  search
    ? or(
        ilike(claims.claimNumber, `%${search}%`),
        ilike(investigators.name, `%${search}%`),
      )
    : undefined;

export const fraudSearch = (search?: string) =>
  search
    ? or(
        ilike(claims.claimNumber, `%${search}%`),
        ilike(fraudAlerts.assignedInvestigator, `%${search}%`),
      )
    : undefined;

export const paymentSearch = (search?: string) =>
  search
    ? or(ilike(claims.claimNumber, `%${search}%`), ilike(payments.method, `%${search}%`))
    : undefined;

export const auditSearch = (search?: string) =>
  search
    ? or(
        ilike(auditLogs.action, `%${search}%`),
        ilike(auditLogs.entityType, `%${search}%`),
        ilike(auditLogs.actingUser, `%${search}%`),
      )
    : undefined;

export const activeClaimTransitions: Record<string, string[]> = {
  SUBMITTED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["INVESTIGATION", "APPROVED", "REJECTED"],
  INVESTIGATION: ["APPROVED", "REJECTED"],
  APPROVED: ["SETTLED"],
  REJECTED: [],
  SETTLED: [],
};

export const riskLevelFor = (score: number): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" => {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
};

export const buildWhere = (...conditions: Array<SQL | undefined>) => {
  const present = conditions.filter((condition): condition is SQL => Boolean(condition));
  return present.length ? and(...present) : undefined;
};

export const tables = {
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
};