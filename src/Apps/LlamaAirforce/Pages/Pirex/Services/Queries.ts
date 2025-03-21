import type { Address } from "@/types/address";
import PirexService from "@LAF/Pages/Pirex/Services";
import { useQuery } from "@tanstack/vue-query";

const service = new PirexService(useHost());

export function useQueryRewards(address: Ref<Address | undefined>) {
  return useQuery({
    queryKey: ["pirex-rewards", address] as const,
    queryFn: async ({ queryKey: [, address] }) => service.getRewards(address!),
    initialData: {
      snapshotRewards: [],
      futuresRewards: [],
    },
    initialDataUpdatedAt: 0,
    enabled: computed(() => !!address.value),
  });
}

export function useQueryRedemptions(address: Ref<Address | undefined>) {
  return useQuery({
    queryKey: ["pirex-redemptions", address] as const,
    queryFn: async ({ queryKey: [, address] }) =>
      service.getRedemptions(address!),
    initialData: [],
    initialDataUpdatedAt: 0,
    enabled: computed(() => !!address.value),
  });
}

export function useQueryFutures(address: Ref<Address | undefined>) {
  return useQuery({
    queryKey: ["pirex-futures", address] as const,
    queryFn: async ({ queryKey: [, address] }) => service.getFutures(address!),
    initialData: [],
    initialDataUpdatedAt: 0,
    enabled: computed(() => !!address.value),
  });
}
