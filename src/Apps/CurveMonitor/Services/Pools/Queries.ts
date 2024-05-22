import { useQuery } from "@tanstack/vue-query";
import { keepPreviousData } from "@tanstack/vue-query";
import PoolsService from "@CM/Services/Pools";
import { type Chain } from "@CM/Models/Chain";

const service = new PoolsService(getHost());

export function useQueryPools(
  chain: Ref<Chain | undefined>,
  page: Ref<number>
) {
  return useQuery({
    queryKey: ["curve-pools", chain, page] as const,
    queryFn: async ({ queryKey: [, chain, page] }) =>
      service.getPools(chain!, page),
    placeholderData: keepPreviousData,
    enabled: computed(() => !!chain.value),
  });
}
