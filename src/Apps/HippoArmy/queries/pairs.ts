import { keepPreviousData } from "@tanstack/vue-query";
import * as Api from "../services/pairs";
import type { pagination, timerange } from "../services/schema";

export function useQuerySnapshots(
  params: MaybeRefOrGetter<
    Omit<
      Parameters<typeof Api.getSnapshots>[0],
      keyof typeof timerange | keyof typeof pagination
    >
  >
) {
  const { start, end } = getTimeRange({ daysRange: 90 });

  return useQuery({
    queryKey: ["pairs-snapshots", params] as const,
    queryFn: () => {
      const fs = (page: number, per_page: number) =>
        Api.getSnapshots({
          ...toValue(params),
          page,
          per_page,
          start,
          end,
        }).then((x) => x.snapshots);

      return paginate(fs, 1, 100);
    },
  });
}

export function useQueryCollateralEvents(
  params: MaybeRefOrGetter<Parameters<typeof Api.getCollateralEvents>[0]>
) {
  return useQuery({
    queryKey: ["pairs-collateral-events", params] as const,
    queryFn: () => Api.getCollateralEvents(toValue(params)),
    placeholderData: keepPreviousData,
  });
}

export function useQueryRedemption(
  params: MaybeRefOrGetter<Parameters<typeof Api.getRedemption>[0]>
) {
  return useQuery({
    queryKey: ["pairs-redemption", params] as const,
    queryFn: () => Api.getRedemption(toValue(params)),
    placeholderData: keepPreviousData,
  });
}

export function useQueryLiquidations(
  params: MaybeRefOrGetter<Parameters<typeof Api.getLiquidations>[0]>
) {
  return useQuery({
    queryKey: ["pairs-liquidations", params] as const,
    queryFn: () => Api.getLiquidations(toValue(params)),
    placeholderData: keepPreviousData,
  });
}
