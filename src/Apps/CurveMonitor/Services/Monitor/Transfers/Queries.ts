import { useSocketMonitorDefi } from "../SocketMonitorDefi";
import {
  type CleanedTransfer,
  TransfersService,
  type USDCBlockSummary,
} from "./";

export function useQueryTransfers() {
  const { socket, isConnected, url } = useSocketMonitorDefi();
  const service = computed(() =>
    socket.value ? new TransfersService(socket.value) : null
  );
  const queryKey = computed(
    () => ["defimonitor-transfers", url.value] as const
  );

  // Always purge old data when using this query.
  const queryClient = useQueryClient();
  queryClient.setQueryData(queryKey.value, null);
  void queryClient.invalidateQueries({ queryKey });

  return useQueryRx({
    queryKey,
    queryFn: () => service.value?.subTransfers(),
    enabled: isConnected,
    observable: computed(() => service.value?.transfers$),
    setQueryData: (
      oldData: CleanedTransfer[] | undefined,
      blockSummary: USDCBlockSummary
    ) => [...(oldData ?? []), ...blockSummary.transfers.flat()],
    staleTime: Infinity,
  });
}
