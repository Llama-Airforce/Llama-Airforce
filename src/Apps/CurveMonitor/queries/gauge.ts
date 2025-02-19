import * as Api from "@curvefi/prices-api/gauge";

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryGauges() {
  return useQuery({
    queryKey: ["gauge-overview"] as const,
    queryFn: () => Api.getGauges(),
    ...initEmptyArray(),
  });
}

export function useQueryGauge(gaugeAddress: Ref<string | undefined>) {
  return useQuery({
    queryKey: ["gauge-metadata", computed(() => gaugeAddress.value)] as const,
    queryFn: ({ queryKey: [, gauge] }) => Api.getGauge(gauge!),
    enabled: computed(() => !!gaugeAddress.value),
  });
}

export function useQueryVotes(gaugeAddress: Ref<string | undefined>) {
  return useQuery({
    queryKey: ["gauge-votes", computed(() => gaugeAddress.value)] as const,
    queryFn: ({ queryKey: [, gauge] }) => Api.getVotes(gauge!),
    enabled: computed(() => !!gaugeAddress.value),
    ...initEmptyArray(),
  });
}

export function useQueryWeightHistory(gaugeAddress: Ref<string | undefined>) {
  return useQuery({
    queryKey: [
      "gauge-weight-history",
      computed(() => gaugeAddress.value),
    ] as const,
    queryFn: ({ queryKey: [, gauge] }) => Api.getWeightHistory(gauge!),
    enabled: computed(() => !!gaugeAddress.value),
    ...initEmptyArray(),
  });
}

export function useQueryDeployment(gaugeAddress: Ref<string | undefined>) {
  return useQuery({
    queryKey: ["gauge-deployment", computed(() => gaugeAddress.value)] as const,
    queryFn: ({ queryKey: [, gauge] }) => Api.getDeployment(gauge!),
    enabled: computed(() => !!gaugeAddress.value),
  });
}

export function useQueryUserGaugeVotes(user: Ref<string | undefined>) {
  return useQuery({
    queryKey: ["gauge-user-votes", computed(() => user.value)] as const,
    queryFn: ({ queryKey: [, user] }) => Api.getUserGaugeVotes(user!),
    enabled: computed(() => !!user.value),
    ...initEmptyArray(),
  });
}
