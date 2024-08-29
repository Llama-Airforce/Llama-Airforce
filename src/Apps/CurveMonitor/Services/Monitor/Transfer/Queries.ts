import "@/Util/llamadash";
import { type Address } from "@/Framework/Address";
import { useSocketMonitorDefi } from "../SocketMonitorDefi";
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

  const query = useQueryRx({
    queryKey,
    queryFn: () => service.value?.subTransfers(tokens.value),
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
          .filter((x) =>
            tokensArray.value
              .map((y) => y.toLocaleLowerCase())
              .includes(x.coinAddress.toLocaleLowerCase())
          ),
      ].takeRight(200),
    keepData: false,
  });

  return query;
}
