import "@/Util/llamadash";
import { type Address } from "@/Framework/Address";
import { useSocketMonitorDefi } from "../SocketMonitorDefi";
import {
  type Swap,
  type GeneralSwapAddressSpecificBlockSummary,
  SwapService,
} from "./";

export function useQuerySwaps(observedAddress: Ref<Address>) {
  const { socket, isConnected, url } = useSocketMonitorDefi();
  const service = computed(() =>
    socket.value ? new SwapService(socket.value) : null
  );
  const queryKey = computed(
    () => ["defimonitor-swaps", url.value, observedAddress.value] as const
  );

  const query = useQueryRx({
    queryKey,
    queryFn: () => service.value?.subSwaps(observedAddress.value),
    enabled: isConnected,
    observable: computed(() => service.value?.swaps$),
    setQueryData: (
      oldData: Swap[] | undefined,
      blockSummary: GeneralSwapAddressSpecificBlockSummary
    ) => [...(oldData ?? []), ...blockSummary.swaps.flat()].takeRight(200),
    keepData: false,
  });

  return query;
}
