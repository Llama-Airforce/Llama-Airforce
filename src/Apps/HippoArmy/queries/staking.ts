import { keepPreviousData } from "@tanstack/vue-query";
import type { pagination, timerange } from "../services/schema";
import * as Api from "../services/staking";

export function useEvents(
  params: MaybeRefOrGetter<Parameters<typeof Api.getEvents>[0]>
) {
  return useQuery({
    queryKey: ["staking-events", params] as const,
    queryFn: () => Api.getEvents(toValue(params)),
    placeholderData: keepPreviousData,
  });
}

export function useCooldownQueue(
  params: MaybeRefOrGetter<Parameters<typeof Api.getCooldownQueue>[0]>
) {
  return useQuery({
    queryKey: ["staking-cooldown-queue", params] as const,
    queryFn: () => Api.getCooldownQueue(toValue(params)),
  });
}

export function useAprHistory(
  params: MaybeRefOrGetter<
    Omit<
      Parameters<typeof Api.getAprHistory>[0],
      keyof typeof timerange | keyof typeof pagination
    >
  >
) {
  const { start, end } = getTimeRange({ daysRange: 90 });

  return useQuery({
    queryKey: ["staking-apr-history", params] as const,
    queryFn: () => {
      const fs = (page: number, per_page: number) =>
        Api.getAprHistory({
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

export function useTvlHistory(
  params: MaybeRefOrGetter<
    Omit<
      Parameters<typeof Api.getTvlHistory>[0],
      keyof typeof timerange | keyof typeof pagination
    >
  >
) {
  const { start, end } = getTimeRange({ daysRange: 90 });

  return useQuery({
    queryKey: ["staking-tvl-history", params] as const,
    queryFn: () => {
      const fs = (page: number, per_page: number) =>
        Api.getTvlHistory({
          ...toValue(params),
          page,
          per_page,
          start,
          end,
        }).then((x) => x.data);

      return paginate(fs, 1, 100);
    },
  });
}

export function useTopUsers(
  params: MaybeRefOrGetter<Parameters<typeof Api.getTopUsers>[0]>
) {
  return useQuery({
    queryKey: ["staking-top-users", params] as const,
    queryFn: () => Api.getTopUsers(toValue(params)),
  });
}

export function useQueryPositionHist(
  params: MaybeRefOrGetter<Parameters<typeof Api.getPositionHist>[0]>
) {
  return useQuery({
    queryKey: ["staking-position-hist", params] as const,
    queryFn: () => Api.getPositionHist(toValue(params)),
  });
}
