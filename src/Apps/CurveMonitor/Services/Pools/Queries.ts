import { useQuery } from "@tanstack/vue-query";
import { keepPreviousData } from "@tanstack/vue-query";
import PoolsService from "@CM/Services/Pools";
import { type Chain } from "@CM/Models/Chain";

const service = new PoolsService(getHost());

export function useQueryPools(chain: Ref<Chain | undefined>) {
  return useQuery({
    queryKey: ["curve-pools", chain] as const,
    queryFn: async ({ queryKey: [, chain] }) => service.getPools(chain!),
    placeholderData: keepPreviousData,
    enabled: computed(() => !!chain.value),
  });
}

export function useQueryPool(chain: Ref<Chain | undefined>, poolAddr: string) {
  return useQuery({
    queryKey: ["curve-pool", poolAddr] as const,
    queryFn: async ({ queryKey: [, poolAddr] }) =>
      service.getPool(chain.value!, poolAddr),
    enabled: computed(() => !!chain.value),
  });
}

export function useQueryPoolMultiple(
  chain: Ref<Chain | undefined>,
  poolAddrs: Ref<string[]>
) {
  const queries = computed(() =>
    poolAddrs.value.map((poolAddr) => ({
      queryKey: ["curve-pool", poolAddr],
      queryFn: () => service.getPool(chain.value!, poolAddr),
      enabled: computed(() => !!chain.value),
    }))
  );

  return useQueries({
    queries,
  });
}

export function useQueryVolume(
  chain: Ref<Chain | undefined>,
  poolAddr: Ref<string | undefined>
) {
  return useQuery({
    queryKey: ["curve-volume", poolAddr] as const,
    queryFn: async ({ queryKey: [, poolAddr] }) =>
      service.getVolume(chain.value!, poolAddr!),
    enabled: computed(() => !!chain.value && !!poolAddr.value),
    initialData: [],
    initialDataUpdatedAt: 0,
  });
}
