import { useQuery, keepPreviousData } from "@tanstack/vue-query";
import type { Chain } from "@CM/Services";
import * as Api from "@CM/Services/pools";

export function useQueryPools(chain: Ref<Chain | undefined>) {
  return useQuery({
    queryKey: ["curve-pools", chain] as const,
    queryFn: async ({ queryKey: [, chain] }) =>
      Api.getPools(chain!, 1, 9999, {
        host: useHost(),
      }),
    placeholderData: keepPreviousData,
    enabled: computed(() => !!chain.value),
  });
}

export function useQueryPool(chain: Ref<Chain | undefined>, poolAddr: string) {
  return useQuery({
    queryKey: ["curve-pool", poolAddr] as const,
    queryFn: async ({ queryKey: [, poolAddr] }) =>
      Api.getPool(chain.value!, poolAddr),
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
      queryFn: () => Api.getPool(chain.value!, poolAddr),
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
    queryKey: ["curve-pool-volume", poolAddr] as const,
    queryFn: async ({ queryKey: [, poolAddr] }) =>
      Api.getVolume(chain.value!, poolAddr!),
    enabled: computed(() => !!chain.value && !!poolAddr.value),
    initialData: [],
    initialDataUpdatedAt: 0,
  });
}

export function useQueryTvl(
  chain: Ref<Chain | undefined>,
  poolAddr: Ref<string | undefined>
) {
  return useQuery({
    queryKey: ["curve-pool-tvl", poolAddr] as const,
    queryFn: async ({ queryKey: [, poolAddr] }) =>
      Api.getTvl(chain.value!, poolAddr!),
    enabled: computed(() => !!chain.value && !!poolAddr.value),
    initialData: [],
    initialDataUpdatedAt: 0,
  });
}
