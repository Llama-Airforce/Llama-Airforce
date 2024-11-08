import { useQuery } from "@tanstack/vue-query";
import type { Address } from "@/Types/Address";
import PirexService from "@LAF/Pages/Pirex/Services";

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
