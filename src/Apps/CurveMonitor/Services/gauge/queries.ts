import GaugeService from "./service";

const service = new GaugeService();

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryGauges() {
  return useQuery({
    queryKey: ["gauge-overview"] as const,
    queryFn: () => service.getGauges(),
    ...initEmptyArray(),
  });
}

export function useQueryGauge(gaugeAddress: Ref<string | undefined>) {
  return useQuery({
    queryKey: ["gauge-metadata", computed(() => gaugeAddress.value)] as const,
    queryFn: ({ queryKey: [, gauge] }) => service.getGauge(gauge!),
    enabled: computed(() => !!gaugeAddress.value),
  });
}

export function useQueryVotes(gaugeAddress: Ref<string | undefined>) {
  return useQuery({
    queryKey: ["gauge-votes", computed(() => gaugeAddress.value)] as const,
    queryFn: ({ queryKey: [, gauge] }) => service.getVotes(gauge!),
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
    queryFn: ({ queryKey: [, gauge] }) => service.getWeightHistory(gauge!),
    enabled: computed(() => !!gaugeAddress.value),
    ...initEmptyArray(),
  });
}

export function useQueryDeployment(gaugeAddress: Ref<string | undefined>) {
  return useQuery({
    queryKey: ["gauge-deployment", computed(() => gaugeAddress.value)] as const,
    queryFn: ({ queryKey: [, gauge] }) => service.getDeployment(gauge!),
    enabled: computed(() => !!gaugeAddress.value),
  });
}

export function useQueryUserGaugeVotes(user: Ref<string | undefined>) {
  return useQuery({
    queryKey: ["gauge-user-votes", computed(() => user.value)] as const,
    queryFn: ({ queryKey: [, user] }) => service.getUserGaugeVotes(user!),
    enabled: computed(() => !!user.value),
    ...initEmptyArray(),
  });
}
