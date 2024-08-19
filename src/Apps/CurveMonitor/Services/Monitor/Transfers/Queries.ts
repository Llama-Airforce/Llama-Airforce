import "@/Util/llamadash";
import { type Address } from "@/Framework/Address";
import { useSocketMonitorDefi } from "../SocketMonitorDefi";
import {
  type CleanedTransfer,
  TransfersService,
  type GeneralErc20TokenSpecificBlockSummary,
} from "./";

export function useQueryTransfers(tokenAddress: Ref<Address>) {
  const { socket, isConnected, url } = useSocketMonitorDefi();
  const service = computed(() =>
    socket.value ? new TransfersService(socket.value) : null
  );
  const queryKey = computed(
    () => ["defimonitor-transfers", url.value, tokenAddress.value] as const
  );

  const query = useQueryRx({
    queryKey,
    queryFn: () => service.value?.subTransfers(tokenAddress.value),
    enabled: isConnected,
    observable: computed(() => service.value?.transfers$),
    setQueryData: (
      oldData: CleanedTransfer[] | undefined,
      blockSummary: GeneralErc20TokenSpecificBlockSummary
    ) =>
      [
        ...(oldData ?? []),
        ...blockSummary.transfers
          .flat()
          // Only needed because it's not possible yet to unsubscribe from streams.
          .filter(
            (x) =>
              x.coinAddress.toLocaleLowerCase() ===
              tokenAddress.value.toLocaleLowerCase()
          ),
      ].takeRight(200),
    resetOnSubscribe: true,
  });

  return query;
}
