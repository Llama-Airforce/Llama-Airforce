import { keepPreviousData } from "@tanstack/vue-query";
import SavingsService from "./SavingsService";

const service = new SavingsService();

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryStatistics() {
  return useQuery({
    queryKey: ["scrvusd-stats"] as const,
    queryFn: () => service.getStatistics(),
  });
}

export function useQueryEvents(page: Ref<number>) {
  return useQuery({
    queryKey: ["scrvusd-events", page] as const,
    queryFn: ({ queryKey: [, page] }) => service.getEvents(page),
    placeholderData: keepPreviousData,
  });
}

export function useQueryYield() {
  return useQuery({
    queryKey: ["scrvusd-yield"] as const,
    queryFn: () => service.getYield(),
    ...initEmptyArray(),
  });
}

export function useQueryRevenue(page: Ref<number>) {
  return useQuery({
    queryKey: ["scrvusd-revenue", page] as const,
    queryFn: ({ queryKey: [, page] }) =>
      service.getRevenue(page).then((x) => x.history),
    placeholderData: keepPreviousData,
  });
}

export function useQueryRevenueTotalDistributed() {
  return useQuery({
    queryKey: ["scrvusd-revenue", 1] as const,
    queryFn: ({ queryKey: [, page] }) =>
      service.getRevenue(page).then((x) => x.totalDistributed),
  });
}
