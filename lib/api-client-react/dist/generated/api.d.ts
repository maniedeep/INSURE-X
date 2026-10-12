import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Asset, AssetInput, AssetPage, AuditLogPage, AuthSession, Claim, ClaimDetail, ClaimEvent, ClaimInput, ClaimPage, ClaimStatusUpdate, Customer, CustomerInput, CustomerPage, CustomerUpdate, DashboardSummary, FraudAlert, FraudAlertPage, FraudAlertUpdate, GroupedMetric, HealthStatus, Investigation, InvestigationInput, InvestigationPage, ListAssetsParams, ListAuditLogsParams, ListClaimsParams, ListCustomersParams, ListFraudAlertsParams, ListInvestigationsParams, ListPaymentsParams, ListPoliciesParams, LoginInput, MonthlyMetric, PaymentPage, Policy, PolicyInput, PolicyPage, RiskProfile, SettlementInput, SettlementResult, User } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getLoginUrl: () => string;
/**
 * @summary Sign in an operations user
 */
export declare const login: (loginInput: LoginInput, options?: Parameters<typeof customFetch>[1]) => Promise<AuthSession>;
export declare const getLoginMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginInput>;
export type LoginMutationError = ErrorType<void>;
/**
* @summary Sign in an operations user
*/
export declare const useLogin: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
export declare const getGetProfileUrl: () => string;
/**
 * @summary Get the current operator profile
 */
export declare const getProfile: (options?: Parameters<typeof customFetch>[1]) => Promise<User>;
export declare const getGetProfileQueryKey: () => readonly ["/api/auth/profile"];
export declare const getGetProfileQueryOptions: <TData = Awaited<ReturnType<typeof getProfile>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProfileQueryResult = NonNullable<Awaited<ReturnType<typeof getProfile>>>;
export type GetProfileQueryError = ErrorType<unknown>;
/**
 * @summary Get the current operator profile
 */
export declare function useGetProfile<TData = Awaited<ReturnType<typeof getProfile>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetDashboardSummaryUrl: () => string;
/**
 * @summary Get live operations KPIs and chart series
 */
export declare const getDashboardSummary: (options?: Parameters<typeof customFetch>[1]) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/dashboard/summary"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get live operations KPIs and chart series
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListCustomersUrl: (params?: ListCustomersParams) => string;
/**
 * @summary Search and paginate customers
 */
export declare const listCustomers: (params?: ListCustomersParams, options?: Parameters<typeof customFetch>[1]) => Promise<CustomerPage>;
export declare const getListCustomersQueryKey: (params?: ListCustomersParams) => readonly ["/api/customers", ...ListCustomersParams[]];
export declare const getListCustomersQueryOptions: <TData = Awaited<ReturnType<typeof listCustomers>>, TError = ErrorType<unknown>>(params?: ListCustomersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCustomers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCustomers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCustomersQueryResult = NonNullable<Awaited<ReturnType<typeof listCustomers>>>;
export type ListCustomersQueryError = ErrorType<unknown>;
/**
 * @summary Search and paginate customers
 */
export declare function useListCustomers<TData = Awaited<ReturnType<typeof listCustomers>>, TError = ErrorType<unknown>>(params?: ListCustomersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCustomers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateCustomerUrl: () => string;
/**
 * @summary Create a customer
 */
export declare const createCustomer: (customerInput: CustomerInput, options?: Parameters<typeof customFetch>[1]) => Promise<Customer>;
export declare const getCreateCustomerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCustomer>>, TError, {
        data: BodyType<CustomerInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCustomer>>, TError, {
    data: BodyType<CustomerInput>;
}, TContext>;
export type CreateCustomerMutationResult = NonNullable<Awaited<ReturnType<typeof createCustomer>>>;
export type CreateCustomerMutationBody = BodyType<CustomerInput>;
export type CreateCustomerMutationError = ErrorType<unknown>;
/**
* @summary Create a customer
*/
export declare const useCreateCustomer: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCustomer>>, TError, {
        data: BodyType<CustomerInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCustomer>>, TError, {
    data: BodyType<CustomerInput>;
}, TContext>;
export declare const getGetCustomerUrl: (id: string) => string;
/**
 * @summary Get a customer
 */
export declare const getCustomer: (id: string, options?: Parameters<typeof customFetch>[1]) => Promise<Customer>;
export declare const getGetCustomerQueryKey: (id: string) => readonly [`/api/customers/${string}`];
export declare const getGetCustomerQueryOptions: <TData = Awaited<ReturnType<typeof getCustomer>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCustomer>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCustomer>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCustomerQueryResult = NonNullable<Awaited<ReturnType<typeof getCustomer>>>;
export type GetCustomerQueryError = ErrorType<unknown>;
/**
 * @summary Get a customer
 */
export declare function useGetCustomer<TData = Awaited<ReturnType<typeof getCustomer>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCustomer>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateCustomerUrl: (id: string) => string;
/**
 * @summary Update a customer
 */
export declare const updateCustomer: (id: string, customerUpdate: CustomerUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<Customer>;
export declare const getUpdateCustomerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCustomer>>, TError, {
        id: string;
        data: BodyType<CustomerUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCustomer>>, TError, {
    id: string;
    data: BodyType<CustomerUpdate>;
}, TContext>;
export type UpdateCustomerMutationResult = NonNullable<Awaited<ReturnType<typeof updateCustomer>>>;
export type UpdateCustomerMutationBody = BodyType<CustomerUpdate>;
export type UpdateCustomerMutationError = ErrorType<unknown>;
/**
* @summary Update a customer
*/
export declare const useUpdateCustomer: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCustomer>>, TError, {
        id: string;
        data: BodyType<CustomerUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCustomer>>, TError, {
    id: string;
    data: BodyType<CustomerUpdate>;
}, TContext>;
export declare const getListPoliciesUrl: (params?: ListPoliciesParams) => string;
/**
 * @summary Search and paginate policies
 */
export declare const listPolicies: (params?: ListPoliciesParams, options?: Parameters<typeof customFetch>[1]) => Promise<PolicyPage>;
export declare const getListPoliciesQueryKey: (params?: ListPoliciesParams) => readonly ["/api/policies", ...ListPoliciesParams[]];
export declare const getListPoliciesQueryOptions: <TData = Awaited<ReturnType<typeof listPolicies>>, TError = ErrorType<unknown>>(params?: ListPoliciesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPolicies>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPolicies>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPoliciesQueryResult = NonNullable<Awaited<ReturnType<typeof listPolicies>>>;
export type ListPoliciesQueryError = ErrorType<unknown>;
/**
 * @summary Search and paginate policies
 */
export declare function useListPolicies<TData = Awaited<ReturnType<typeof listPolicies>>, TError = ErrorType<unknown>>(params?: ListPoliciesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPolicies>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreatePolicyUrl: () => string;
/**
 * @summary Create a policy
 */
export declare const createPolicy: (policyInput: PolicyInput, options?: Parameters<typeof customFetch>[1]) => Promise<Policy>;
export declare const getCreatePolicyMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPolicy>>, TError, {
        data: BodyType<PolicyInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPolicy>>, TError, {
    data: BodyType<PolicyInput>;
}, TContext>;
export type CreatePolicyMutationResult = NonNullable<Awaited<ReturnType<typeof createPolicy>>>;
export type CreatePolicyMutationBody = BodyType<PolicyInput>;
export type CreatePolicyMutationError = ErrorType<unknown>;
/**
* @summary Create a policy
*/
export declare const useCreatePolicy: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPolicy>>, TError, {
        data: BodyType<PolicyInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPolicy>>, TError, {
    data: BodyType<PolicyInput>;
}, TContext>;
export declare const getListAssetsUrl: (params?: ListAssetsParams) => string;
/**
 * @summary Search and paginate insured assets
 */
export declare const listAssets: (params?: ListAssetsParams, options?: Parameters<typeof customFetch>[1]) => Promise<AssetPage>;
export declare const getListAssetsQueryKey: (params?: ListAssetsParams) => readonly ["/api/assets", ...ListAssetsParams[]];
export declare const getListAssetsQueryOptions: <TData = Awaited<ReturnType<typeof listAssets>>, TError = ErrorType<unknown>>(params?: ListAssetsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAssets>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAssets>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAssetsQueryResult = NonNullable<Awaited<ReturnType<typeof listAssets>>>;
export type ListAssetsQueryError = ErrorType<unknown>;
/**
 * @summary Search and paginate insured assets
 */
export declare function useListAssets<TData = Awaited<ReturnType<typeof listAssets>>, TError = ErrorType<unknown>>(params?: ListAssetsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAssets>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateAssetUrl: () => string;
/**
 * @summary Register an insured asset
 */
export declare const createAsset: (assetInput: AssetInput, options?: Parameters<typeof customFetch>[1]) => Promise<Asset>;
export declare const getCreateAssetMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAsset>>, TError, {
        data: BodyType<AssetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAsset>>, TError, {
    data: BodyType<AssetInput>;
}, TContext>;
export type CreateAssetMutationResult = NonNullable<Awaited<ReturnType<typeof createAsset>>>;
export type CreateAssetMutationBody = BodyType<AssetInput>;
export type CreateAssetMutationError = ErrorType<unknown>;
/**
* @summary Register an insured asset
*/
export declare const useCreateAsset: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAsset>>, TError, {
        data: BodyType<AssetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAsset>>, TError, {
    data: BodyType<AssetInput>;
}, TContext>;
export declare const getListClaimsUrl: (params?: ListClaimsParams) => string;
/**
 * @summary Search and paginate claims
 */
export declare const listClaims: (params?: ListClaimsParams, options?: Parameters<typeof customFetch>[1]) => Promise<ClaimPage>;
export declare const getListClaimsQueryKey: (params?: ListClaimsParams) => readonly ["/api/claims", ...ListClaimsParams[]];
export declare const getListClaimsQueryOptions: <TData = Awaited<ReturnType<typeof listClaims>>, TError = ErrorType<unknown>>(params?: ListClaimsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listClaims>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listClaims>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListClaimsQueryResult = NonNullable<Awaited<ReturnType<typeof listClaims>>>;
export type ListClaimsQueryError = ErrorType<unknown>;
/**
 * @summary Search and paginate claims
 */
export declare function useListClaims<TData = Awaited<ReturnType<typeof listClaims>>, TError = ErrorType<unknown>>(params?: ListClaimsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listClaims>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateClaimUrl: () => string;
/**
 * @summary Submit a claim
 */
export declare const createClaim: (claimInput: ClaimInput, options?: Parameters<typeof customFetch>[1]) => Promise<Claim>;
export declare const getCreateClaimMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createClaim>>, TError, {
        data: BodyType<ClaimInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createClaim>>, TError, {
    data: BodyType<ClaimInput>;
}, TContext>;
export type CreateClaimMutationResult = NonNullable<Awaited<ReturnType<typeof createClaim>>>;
export type CreateClaimMutationBody = BodyType<ClaimInput>;
export type CreateClaimMutationError = ErrorType<unknown>;
/**
* @summary Submit a claim
*/
export declare const useCreateClaim: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createClaim>>, TError, {
        data: BodyType<ClaimInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createClaim>>, TError, {
    data: BodyType<ClaimInput>;
}, TContext>;
export declare const getGetClaimUrl: (id: string) => string;
/**
 * @summary Get a claim with its related workflow data
 */
export declare const getClaim: (id: string, options?: Parameters<typeof customFetch>[1]) => Promise<ClaimDetail>;
export declare const getGetClaimQueryKey: (id: string) => readonly [`/api/claims/${string}`];
export declare const getGetClaimQueryOptions: <TData = Awaited<ReturnType<typeof getClaim>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getClaim>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getClaim>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetClaimQueryResult = NonNullable<Awaited<ReturnType<typeof getClaim>>>;
export type GetClaimQueryError = ErrorType<unknown>;
/**
 * @summary Get a claim with its related workflow data
 */
export declare function useGetClaim<TData = Awaited<ReturnType<typeof getClaim>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getClaim>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateClaimStatusUrl: (id: string) => string;
/**
 * @summary Move a claim through a controlled lifecycle transition
 */
export declare const updateClaimStatus: (id: string, claimStatusUpdate: ClaimStatusUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<Claim>;
export declare const getUpdateClaimStatusMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateClaimStatus>>, TError, {
        id: string;
        data: BodyType<ClaimStatusUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateClaimStatus>>, TError, {
    id: string;
    data: BodyType<ClaimStatusUpdate>;
}, TContext>;
export type UpdateClaimStatusMutationResult = NonNullable<Awaited<ReturnType<typeof updateClaimStatus>>>;
export type UpdateClaimStatusMutationBody = BodyType<ClaimStatusUpdate>;
export type UpdateClaimStatusMutationError = ErrorType<unknown>;
/**
* @summary Move a claim through a controlled lifecycle transition
*/
export declare const useUpdateClaimStatus: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateClaimStatus>>, TError, {
        id: string;
        data: BodyType<ClaimStatusUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateClaimStatus>>, TError, {
    id: string;
    data: BodyType<ClaimStatusUpdate>;
}, TContext>;
export declare const getCalculateClaimRiskUrl: (id: string) => string;
/**
 * @summary Calculate explainable rule-based risk indicators
 */
export declare const calculateClaimRisk: (id: string, options?: Parameters<typeof customFetch>[1]) => Promise<RiskProfile>;
export declare const getCalculateClaimRiskMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof calculateClaimRisk>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof calculateClaimRisk>>, TError, {
    id: string;
}, TContext>;
export type CalculateClaimRiskMutationResult = NonNullable<Awaited<ReturnType<typeof calculateClaimRisk>>>;
export type CalculateClaimRiskMutationError = ErrorType<unknown>;
/**
* @summary Calculate explainable rule-based risk indicators
*/
export declare const useCalculateClaimRisk: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof calculateClaimRisk>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof calculateClaimRisk>>, TError, {
    id: string;
}, TContext>;
export declare const getSettleClaimUrl: (id: string) => string;
/**
 * @summary Atomically settle a claim and create payment evidence
 */
export declare const settleClaim: (id: string, settlementInput: SettlementInput, options?: Parameters<typeof customFetch>[1]) => Promise<SettlementResult>;
export declare const getSettleClaimMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof settleClaim>>, TError, {
        id: string;
        data: BodyType<SettlementInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof settleClaim>>, TError, {
    id: string;
    data: BodyType<SettlementInput>;
}, TContext>;
export type SettleClaimMutationResult = NonNullable<Awaited<ReturnType<typeof settleClaim>>>;
export type SettleClaimMutationBody = BodyType<SettlementInput>;
export type SettleClaimMutationError = ErrorType<unknown>;
/**
* @summary Atomically settle a claim and create payment evidence
*/
export declare const useSettleClaim: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof settleClaim>>, TError, {
        id: string;
        data: BodyType<SettlementInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof settleClaim>>, TError, {
    id: string;
    data: BodyType<SettlementInput>;
}, TContext>;
export declare const getListClaimEventsUrl: (claimId: string) => string;
/**
 * @summary Get a claim timeline
 */
export declare const listClaimEvents: (claimId: string, options?: Parameters<typeof customFetch>[1]) => Promise<ClaimEvent[]>;
export declare const getListClaimEventsQueryKey: (claimId: string) => readonly [`/api/claim-events/${string}`];
export declare const getListClaimEventsQueryOptions: <TData = Awaited<ReturnType<typeof listClaimEvents>>, TError = ErrorType<unknown>>(claimId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listClaimEvents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listClaimEvents>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListClaimEventsQueryResult = NonNullable<Awaited<ReturnType<typeof listClaimEvents>>>;
export type ListClaimEventsQueryError = ErrorType<unknown>;
/**
 * @summary Get a claim timeline
 */
export declare function useListClaimEvents<TData = Awaited<ReturnType<typeof listClaimEvents>>, TError = ErrorType<unknown>>(claimId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listClaimEvents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListInvestigationsUrl: (params?: ListInvestigationsParams) => string;
/**
 * @summary Search investigations
 */
export declare const listInvestigations: (params?: ListInvestigationsParams, options?: Parameters<typeof customFetch>[1]) => Promise<InvestigationPage>;
export declare const getListInvestigationsQueryKey: (params?: ListInvestigationsParams) => readonly ["/api/investigations", ...ListInvestigationsParams[]];
export declare const getListInvestigationsQueryOptions: <TData = Awaited<ReturnType<typeof listInvestigations>>, TError = ErrorType<unknown>>(params?: ListInvestigationsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listInvestigations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listInvestigations>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListInvestigationsQueryResult = NonNullable<Awaited<ReturnType<typeof listInvestigations>>>;
export type ListInvestigationsQueryError = ErrorType<unknown>;
/**
 * @summary Search investigations
 */
export declare function useListInvestigations<TData = Awaited<ReturnType<typeof listInvestigations>>, TError = ErrorType<unknown>>(params?: ListInvestigationsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listInvestigations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateInvestigationUrl: () => string;
/**
 * @summary Assign an investigator
 */
export declare const createInvestigation: (investigationInput: InvestigationInput, options?: Parameters<typeof customFetch>[1]) => Promise<Investigation>;
export declare const getCreateInvestigationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createInvestigation>>, TError, {
        data: BodyType<InvestigationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createInvestigation>>, TError, {
    data: BodyType<InvestigationInput>;
}, TContext>;
export type CreateInvestigationMutationResult = NonNullable<Awaited<ReturnType<typeof createInvestigation>>>;
export type CreateInvestigationMutationBody = BodyType<InvestigationInput>;
export type CreateInvestigationMutationError = ErrorType<unknown>;
/**
* @summary Assign an investigator
*/
export declare const useCreateInvestigation: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createInvestigation>>, TError, {
        data: BodyType<InvestigationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createInvestigation>>, TError, {
    data: BodyType<InvestigationInput>;
}, TContext>;
export declare const getListFraudAlertsUrl: (params?: ListFraudAlertsParams) => string;
/**
 * @summary Search fraud alerts
 */
export declare const listFraudAlerts: (params?: ListFraudAlertsParams, options?: Parameters<typeof customFetch>[1]) => Promise<FraudAlertPage>;
export declare const getListFraudAlertsQueryKey: (params?: ListFraudAlertsParams) => readonly ["/api/fraud-alerts", ...ListFraudAlertsParams[]];
export declare const getListFraudAlertsQueryOptions: <TData = Awaited<ReturnType<typeof listFraudAlerts>>, TError = ErrorType<unknown>>(params?: ListFraudAlertsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFraudAlerts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listFraudAlerts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListFraudAlertsQueryResult = NonNullable<Awaited<ReturnType<typeof listFraudAlerts>>>;
export type ListFraudAlertsQueryError = ErrorType<unknown>;
/**
 * @summary Search fraud alerts
 */
export declare function useListFraudAlerts<TData = Awaited<ReturnType<typeof listFraudAlerts>>, TError = ErrorType<unknown>>(params?: ListFraudAlertsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFraudAlerts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateFraudAlertUrl: (id: string) => string;
/**
 * @summary Resolve or dismiss a fraud alert
 */
export declare const updateFraudAlert: (id: string, fraudAlertUpdate: FraudAlertUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<FraudAlert>;
export declare const getUpdateFraudAlertMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFraudAlert>>, TError, {
        id: string;
        data: BodyType<FraudAlertUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateFraudAlert>>, TError, {
    id: string;
    data: BodyType<FraudAlertUpdate>;
}, TContext>;
export type UpdateFraudAlertMutationResult = NonNullable<Awaited<ReturnType<typeof updateFraudAlert>>>;
export type UpdateFraudAlertMutationBody = BodyType<FraudAlertUpdate>;
export type UpdateFraudAlertMutationError = ErrorType<unknown>;
/**
* @summary Resolve or dismiss a fraud alert
*/
export declare const useUpdateFraudAlert: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFraudAlert>>, TError, {
        id: string;
        data: BodyType<FraudAlertUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateFraudAlert>>, TError, {
    id: string;
    data: BodyType<FraudAlertUpdate>;
}, TContext>;
export declare const getListPaymentsUrl: (params?: ListPaymentsParams) => string;
/**
 * @summary Search payments
 */
export declare const listPayments: (params?: ListPaymentsParams, options?: Parameters<typeof customFetch>[1]) => Promise<PaymentPage>;
export declare const getListPaymentsQueryKey: (params?: ListPaymentsParams) => readonly ["/api/payments", ...ListPaymentsParams[]];
export declare const getListPaymentsQueryOptions: <TData = Awaited<ReturnType<typeof listPayments>>, TError = ErrorType<unknown>>(params?: ListPaymentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPayments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPayments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPaymentsQueryResult = NonNullable<Awaited<ReturnType<typeof listPayments>>>;
export type ListPaymentsQueryError = ErrorType<unknown>;
/**
 * @summary Search payments
 */
export declare function useListPayments<TData = Awaited<ReturnType<typeof listPayments>>, TError = ErrorType<unknown>>(params?: ListPaymentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPayments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetClaimsByMonthUrl: () => string;
/**
 * @summary Monthly claim volume and value
 */
export declare const getClaimsByMonth: (options?: Parameters<typeof customFetch>[1]) => Promise<MonthlyMetric[]>;
export declare const getGetClaimsByMonthQueryKey: () => readonly ["/api/reports/claims-by-month"];
export declare const getGetClaimsByMonthQueryOptions: <TData = Awaited<ReturnType<typeof getClaimsByMonth>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getClaimsByMonth>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getClaimsByMonth>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetClaimsByMonthQueryResult = NonNullable<Awaited<ReturnType<typeof getClaimsByMonth>>>;
export type GetClaimsByMonthQueryError = ErrorType<unknown>;
/**
 * @summary Monthly claim volume and value
 */
export declare function useGetClaimsByMonth<TData = Awaited<ReturnType<typeof getClaimsByMonth>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getClaimsByMonth>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetRiskDistributionUrl: () => string;
/**
 * @summary Risk level distribution
 */
export declare const getRiskDistribution: (options?: Parameters<typeof customFetch>[1]) => Promise<GroupedMetric[]>;
export declare const getGetRiskDistributionQueryKey: () => readonly ["/api/reports/risk-distribution"];
export declare const getGetRiskDistributionQueryOptions: <TData = Awaited<ReturnType<typeof getRiskDistribution>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRiskDistribution>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRiskDistribution>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRiskDistributionQueryResult = NonNullable<Awaited<ReturnType<typeof getRiskDistribution>>>;
export type GetRiskDistributionQueryError = ErrorType<unknown>;
/**
 * @summary Risk level distribution
 */
export declare function useGetRiskDistribution<TData = Awaited<ReturnType<typeof getRiskDistribution>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRiskDistribution>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetSettlementReportUrl: () => string;
/**
 * @summary Monthly settlement totals
 */
export declare const getSettlementReport: (options?: Parameters<typeof customFetch>[1]) => Promise<MonthlyMetric[]>;
export declare const getGetSettlementReportQueryKey: () => readonly ["/api/reports/settlements"];
export declare const getGetSettlementReportQueryOptions: <TData = Awaited<ReturnType<typeof getSettlementReport>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSettlementReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSettlementReport>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSettlementReportQueryResult = NonNullable<Awaited<ReturnType<typeof getSettlementReport>>>;
export type GetSettlementReportQueryError = ErrorType<unknown>;
/**
 * @summary Monthly settlement totals
 */
export declare function useGetSettlementReport<TData = Awaited<ReturnType<typeof getSettlementReport>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSettlementReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetInvestigatorWorkloadUrl: () => string;
/**
 * @summary Workload by investigator
 */
export declare const getInvestigatorWorkload: (options?: Parameters<typeof customFetch>[1]) => Promise<GroupedMetric[]>;
export declare const getGetInvestigatorWorkloadQueryKey: () => readonly ["/api/reports/investigator-workload"];
export declare const getGetInvestigatorWorkloadQueryOptions: <TData = Awaited<ReturnType<typeof getInvestigatorWorkload>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInvestigatorWorkload>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getInvestigatorWorkload>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetInvestigatorWorkloadQueryResult = NonNullable<Awaited<ReturnType<typeof getInvestigatorWorkload>>>;
export type GetInvestigatorWorkloadQueryError = ErrorType<unknown>;
/**
 * @summary Workload by investigator
 */
export declare function useGetInvestigatorWorkload<TData = Awaited<ReturnType<typeof getInvestigatorWorkload>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInvestigatorWorkload>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListAuditLogsUrl: (params?: ListAuditLogsParams) => string;
/**
 * @summary Search the audit trail
 */
export declare const listAuditLogs: (params?: ListAuditLogsParams, options?: Parameters<typeof customFetch>[1]) => Promise<AuditLogPage>;
export declare const getListAuditLogsQueryKey: (params?: ListAuditLogsParams) => readonly ["/api/audit-logs", ...ListAuditLogsParams[]];
export declare const getListAuditLogsQueryOptions: <TData = Awaited<ReturnType<typeof listAuditLogs>>, TError = ErrorType<unknown>>(params?: ListAuditLogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAuditLogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAuditLogs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAuditLogsQueryResult = NonNullable<Awaited<ReturnType<typeof listAuditLogs>>>;
export type ListAuditLogsQueryError = ErrorType<unknown>;
/**
 * @summary Search the audit trail
 */
export declare function useListAuditLogs<TData = Awaited<ReturnType<typeof listAuditLogs>>, TError = ErrorType<unknown>>(params?: ListAuditLogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAuditLogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map