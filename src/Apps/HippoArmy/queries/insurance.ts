import * as Api from "../services/insurance";

export function useQueryEvents(
  params: MaybeRefOrGetter<Parameters<typeof Api.getEvents>[0]>
) {
  return useQuery({
    queryKey: ["insurance-events", params] as const,
    queryFn: () => Api.getEvents(toValue(params)),
  });
}

export function useQueryCooldownQueue(
  params: MaybeRefOrGetter<Parameters<typeof Api.getCooldownQueue>[0]>
) {
  return useQuery({
    queryKey: ["insurance-cooldown-queue", params] as const,
    queryFn: () => Api.getCooldownQueue(toValue(params)),
  });
}
