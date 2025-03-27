import * as Api from "../services/pairs";

export function useQuerySnapshots(
  params: MaybeRefOrGetter<Parameters<typeof Api.getSnapshots>[0]>
) {
  return useQuery({
    queryKey: ["pairs-snapshots", params] as const,
    queryFn: () => Api.getSnapshots(toValue(params)),
  });
}

export function useQueryCollateralEvents(
  params: MaybeRefOrGetter<Parameters<typeof Api.getCollateralEvents>[0]>
) {
  return useQuery({
    queryKey: ["pairs-collateral-events", params] as const,
    queryFn: () => Api.getCollateralEvents(toValue(params)),
  });
}

export function useQueryRedemption(
  params: MaybeRefOrGetter<Parameters<typeof Api.getRedemption>[0]>
) {
  return useQuery({
    queryKey: ["pairs-redemption", params] as const,
    queryFn: () => Api.getRedemption(toValue(params)),
  });
}

export function useQueryLiquidations(
  params: MaybeRefOrGetter<Parameters<typeof Api.getLiquidations>[0]>
) {
  return useQuery({
    queryKey: ["pairs-liquidations", params] as const,
    queryFn: () => Api.getLiquidations(toValue(params)),
  });
}
