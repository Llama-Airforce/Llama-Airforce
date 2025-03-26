import * as Api from "../services/health";

export function useLeverageStats(
  params: MaybeRefOrGetter<Parameters<typeof Api.getLeverageStats>[0]>
) {
  return useQuery({
    queryKey: ["health-leverage-stats", params] as const,
    queryFn: () => Api.getLeverageStats(toValue(params)),
  });
}

export function useLeverageDistribution(
  params: MaybeRefOrGetter<Parameters<typeof Api.getLeverageDistribution>[0]>
) {
  return useQuery({
    queryKey: ["health-leverage-distribution", params] as const,
    queryFn: () => Api.getLeverageDistribution(toValue(params)),
  });
}

export function useDebtDistribution(
  params: MaybeRefOrGetter<Parameters<typeof Api.getDebtDistribution>[0]>
) {
  return useQuery({
    queryKey: ["health-debt-distribution", params] as const,
    queryFn: () => Api.getDebtDistribution(toValue(params)),
  });
}

export function useCollateralRatioDistribution(
  params: MaybeRefOrGetter<
    Parameters<typeof Api.getCollateralRatioDistribution>[0]
  >
) {
  return useQuery({
    queryKey: ["health-collateral-ratio-distribution", params] as const,
    queryFn: () => Api.getCollateralRatioDistribution(toValue(params)),
  });
}
