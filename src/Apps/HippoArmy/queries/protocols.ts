import * as Api from "../services/protocols";

export function useQueryOverview(
  params: MaybeRefOrGetter<Parameters<typeof Api.getOverview>[0]>
) {
  return useQuery({
    queryKey: ["protocols-overview", params] as const,
    queryFn: () => Api.getOverview(toValue(params)),
  });
}

export function useQueryPairs(
  params: MaybeRefOrGetter<Parameters<typeof Api.getPairs>[0]>
) {
  return useQuery({
    queryKey: ["protocols-pairs", params] as const,
    queryFn: () => Api.getPairs(toValue(params)),
  });
}
