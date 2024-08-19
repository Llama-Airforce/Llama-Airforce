import { useSocketMonitorDefi } from "../SocketMonitorDefi";
import {
  type CleanedTransfer,
  TransfersService,
  type GeneralErc20TokenSpecificBlockSummary,
} from "./";

export function useQueryTransfers() {
  const { socket, isConnected, url } = useSocketMonitorDefi();
  const service = computed(() =>
    socket.value ? new TransfersService(socket.value) : null
  );
  const queryKey = computed(
    () => ["defimonitor-transfers", url.value] as const
  );

  return useQueryRx({
    queryKey,
    queryFn: () =>
      service.value?.subTransfers("0xdAC17F958D2ee523a2206206994597C13D831ec7"),
    enabled: isConnected,
    observable: computed(() => service.value?.transfers$),
    setQueryData: (
      oldData: CleanedTransfer[] | undefined,
      blockSummary: GeneralErc20TokenSpecificBlockSummary
    ) => [...(oldData ?? []), ...blockSummary.transfers.flat()],
    resetOnSubscribe: true,
  });
}
