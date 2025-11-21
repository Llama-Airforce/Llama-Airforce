import { keepPreviousData } from "@tanstack/vue-query";
import * as Api from "../services/savings";
import { getTimeRange } from "@/Utils/timestamp";
import { paginate } from "@/Utils/Pagination";

export function useStats(params: MaybeRefOrGetter<{ chain: string }>) {
  return useQuery({ queryKey: ["savings-stats", params] as const, queryFn: () => Api.getStats(toValue(params)) });
}

export function useAprHistory(params: MaybeRefOrGetter<{ chain: string }>) {
  const { start, end } = getTimeRange({ daysRange: 90 });
  return useQuery({
    queryKey: ["savings-apr-history", params, start, end] as const,
    queryFn: () => {
      const fs = (page: number, per_page: number) => Api.getAprHistory({ ...toValue(params), start, end, page, per_page }).then((x) => x.data);
      return paginate(fs, 1, 100);
    },
  });
}

export function useTvlHistory(params: MaybeRefOrGetter<{ chain: string }>) {
  const { start, end } = getTimeRange({ daysRange: 90 });
  return useQuery({
    queryKey: ["savings-tvl-history", params, start, end] as const,
    queryFn: () => {
      const fs = (page: number, per_page: number) => Api.getTvlHistory({ ...toValue(params), start, end, page, per_page }).then((x) => x.data);
      return paginate(fs, 1, 100);
    },
  });
}

export function useVolumeHistory(params: MaybeRefOrGetter<{ chain: string }>) {
  const { start, end } = getTimeRange({ daysRange: 90 });
  return useQuery({
    queryKey: ["savings-volume-history", params, start, end] as const,
    queryFn: () => {
      const fs = (page: number, per_page: number) => Api.getVolumeHistory({ ...toValue(params), start, end, page, per_page }).then((x) => x.data);
      return paginate(fs, 1, 100);
    },
  });
}

export function useEvents(params: MaybeRefOrGetter<{ chain: string; page?: number; per_page?: number }>) {
  return useQuery({ queryKey: ["savings-events", params] as const, queryFn: () => Api.getEvents(toValue(params)), placeholderData: keepPreviousData });
}

export function useTopUsers(params: MaybeRefOrGetter<{ chain: string }>) {
  return useQuery({ queryKey: ["savings-top-users", params] as const, queryFn: () => Api.getTopUsers(toValue(params)) });
}
