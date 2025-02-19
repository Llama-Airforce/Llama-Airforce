import type { Address } from "@/Types/Address";
import { useSocketMonitorDefi } from "../socketMonitorDefi";
import {
  type CleanedTransfer,
  type GeneralErc20TokenSpecificBlockSummary,
  TransferService,
} from "./";

export function useQueryTransfers(tokens: Ref<Address | Address[]>) {
  const tokensArray = computed(() =>
    Array.isArray(tokens.value) ? tokens.value : [tokens.value]
  );

  const { socket, isConnected, url } = useSocketMonitorDefi();
  const service = computed(() =>
    socket.value ? new TransferService(socket.value) : null
  );
  const queryKey = computed(
    () => ["defimonitor-transfers", url.value, ...tokensArray.value] as const
  );

  // Unsubscribe from tokens no longer watched.
  watchArray(
    tokensArray,
    (_newTokens, _oldTokens, _added, removed) => {
      service.value?.unsub(removed);
    },
    { deep: true }
  );

  const query = useQueryRx({
    queryKey,
    queryFn: () => service.value?.sub(tokens.value),
    enabled: isConnected,
    observable: computed(() => service.value?.transfers$),
    setQueryData: (
      oldData: CleanedTransfer[] | undefined,
      blockSummary: GeneralErc20TokenSpecificBlockSummary
    ) => [...(oldData ?? []), ...blockSummary.transfers.flat()].takeRight(200),
    keepData: false,
  });

  return query;
}
