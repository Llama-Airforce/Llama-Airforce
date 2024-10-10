import DaoService from "./DaoService";

const service = new DaoService();

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryVotesOverview() {
  return useQuery({
    queryKey: ["dao-votes-overview"] as const,
    queryFn: () => service.getVotesOverview(),
  });
}

export function useQueryLocksDaily(days = 30) {
  return useQuery({
    queryKey: ["dao-locks-daily", days] as const,
    queryFn: () => service.getLocksDaily(days),
    ...initEmptyArray(),
  });
}

export function useQueryUserLocks(user: Ref<string | undefined>) {
  return useQuery({
    queryKey: ["dao-locks-user", computed(() => user.value)] as const,
    queryFn: ({ queryKey: [, user] }) => service.getUserLocks(user!),
    enabled: computed(() => !!user.value),
    ...initEmptyArray(),
  });
}

export function useQueryLockers(top = 20) {
  return useQuery({
    queryKey: ["dao-lockers", top] as const,
    queryFn: () => service.getLockers(top),
    ...initEmptyArray(),
  });
}

export function useQuerySupply(days: number | Ref<number> = 30) {
  const daysValue = computed(() => unref(days));

  return useQuery({
    queryKey: ["dao-supply", daysValue] as const,
    queryFn: () => service.getSupply(daysValue.value),
    ...initEmptyArray(),
  });
}
