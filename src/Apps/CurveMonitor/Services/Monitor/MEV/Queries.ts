import { useSocketMEV, MEVService, MEVServiceRx } from "./";

function initEmptyArray() {
  return {
    initialData: [],
    initialDataUpdatedAt: 0,
  };
}

export function useQueryGetSandwichLabelOccurrences() {
  const { socket, isConnected } = useSocketMEV();
  const service = new MEVService(socket);

  return useQuery({
    queryKey: ["mev-sandwich-label-occurrences"] as const,
    queryFn: () => service.getSandwichLabelOccurrences(),
    ...initEmptyArray(),
    enabled: isConnected,
  });
}

export function useQuerySandwiches(page: Ref<number>) {
  const { socket, isConnected } = useSocketMEV();
  const service = new MEVService(socket);

  return useQuery({
    queryKey: ["mev-sandwiches", page] as const,
    queryFn: ({ queryKey: [, page] }) => service.getSandwiches(page),
    initialData: { sandwiches: [], totalPages: 0 },
    initialDataUpdatedAt: 0,
    enabled: isConnected,
  });
}

export function useQuerySandwichesRx() {
  const { socket, isConnected, url } = useSocketMEV();
  const service = computed(() =>
    socket.value ? new MEVServiceRx(socket.value) : null
  );
  const queryKey = computed(() => ["mev-sandwiches-tx", url.value] as const);

  return useQueryRx({
    queryKey,
    queryFn: () => service.value?.getSandwiches(),
    enabled: isConnected,
    observable: computed(() => service.value?.sandwiches$),
    setQueryData: (_, x) => x,
  });
}
