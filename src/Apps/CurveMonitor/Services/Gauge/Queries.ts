import GaugeService from "./GaugeService";

const service = new GaugeService();

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryUserGaugeVotes(user: Ref<string | undefined>) {
  return useQuery({
    queryKey: ["gauge-user-votes", computed(() => user.value)] as const,
    queryFn: ({ queryKey: [, user] }) => service.getUserGaugeVotes(user!),
    enabled: computed(() => !!user.value),
    ...initEmptyArray(),
  });
}
