import { type Address } from "viem";
import { useQuery } from "@tanstack/vue-query";
import PirexService from "@LAF/Pages/Pirex/Services";
import { API_URL } from "@LAF/Pages/Pirex/Services/PirexService";

const service = new PirexService(useHost(API_URL));

export function useQueryRewards(address: Ref<Address | undefined>) {
  return useQuery({
    queryKey: ["pirex-rewards", address] as const,
    queryFn: async ({ queryKey: [, address] }) => service.getRewards(address!),
    initialData: [],
    initialDataUpdatedAt: 0,
    enabled: computed(() => !!address.value),
  });
}
