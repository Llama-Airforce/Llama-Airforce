import { useSocketMEV } from "@CM/Services/Sockets";
import MEVService from "@CM/Pages/Platform/Monitor/Services/MEVService";

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
