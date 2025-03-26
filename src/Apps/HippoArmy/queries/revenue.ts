import { keepPreviousData } from "@tanstack/vue-query";
import * as Api from "../services/revenue";

export function useDistributions(
  params: MaybeRefOrGetter<Parameters<typeof Api.getDistributions>[0]>
) {
  return useQuery({
    queryKey: ["revenue-distributions", params] as const,
    queryFn: () => Api.getDistributions(toValue(params)),
    placeholderData: keepPreviousData,
  });
}
