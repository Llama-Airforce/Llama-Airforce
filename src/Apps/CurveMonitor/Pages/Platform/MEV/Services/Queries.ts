import { useSocketMEV } from "@CM/Services/Sockets";
import MEVService from "@CM/Pages/Platform/MEV/Services/MEVService";

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
