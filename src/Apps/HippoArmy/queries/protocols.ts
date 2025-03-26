import { queryOptions } from "@tanstack/vue-query";
import * as Api from "../services/protocols";
import type { pagination } from "../services/schema";

export function useOverview(
  params: MaybeRefOrGetter<Parameters<typeof Api.getOverview>[0]>
) {
  return useQuery({
    queryKey: ["protocols-overview", params] as const,
    queryFn: () => Api.getOverview(toValue(params)),
  });
}

/** Gets all pairs using pagination */
function pairsQueryOptions(
  params: MaybeRefOrGetter<
    Omit<Parameters<typeof Api.getPairs>[0], keyof typeof pagination>
  >
) {
  return queryOptions({
    queryKey: ["protocols-pairs", params] as const,
    queryFn: () => {
      const fs = (page: number, per_page: number) =>
        Api.getPairs({ ...toValue(params), page, per_page }).then(
          (x) => x.pairs
        );

      return paginate(fs, 1, 100);
    },
  });
}

export function usePairs(
  params: Parameters<typeof pairsQueryOptions>[0],
  enabled: MaybeRefOrGetter<boolean>
) {
  return useQuery({
    ...pairsQueryOptions(params),
    enabled,
  });
}

export function usePairsEthereum() {
  const { data: protocols } = useOverview({ chain: "ethereum" });

  const protocolNames = computed(() =>
    (protocols.value?.protocols ?? []).map((x) => x.name)
  );

  const enabled = computed(() => (protocols.value?.count ?? 0) > 0);

  const queries = computed(() =>
    protocolNames.value.map((protocol_name) => ({
      ...pairsQueryOptions({ chain: "ethereum", protocol_name }),
      enabled,
    }))
  );

  const result = useQueries({
    queries,
    combine: (results) => ({
      data: results
        .map((result) => result.data)
        .filter((result) => result !== undefined)
        .flat(),
      pending: results.some((result) => result.isPending),
    }),
  });

  return {
    data: computed(() => result.value.data),
    pending: computed(() => result.value.pending),
  };
}
