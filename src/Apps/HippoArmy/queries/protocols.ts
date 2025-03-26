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
export function usePairs(
  params: MaybeRefOrGetter<
    Omit<Parameters<typeof Api.getPairs>[0], keyof typeof pagination>
  >,
  enabled: MaybeRefOrGetter<boolean>
) {
  return useQuery({
    queryKey: ["protocols-pairs", params] as const,
    queryFn: () => {
      const fs = (page: number, per_page: number) =>
        Api.getPairs({ ...toValue(params), page, per_page }).then(
          (x) => x.pairs
        );

      return paginate(fs, 1, 100);
    },
    enabled,
  });
}
