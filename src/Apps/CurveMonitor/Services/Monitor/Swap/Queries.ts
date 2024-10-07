import { type Address } from "@/Framework/Address";
import { useSocketMonitorDefi } from "../SocketMonitorDefi";
import {
  type Swap,
  type GeneralSwapAddressSpecificBlockSummary,
  SwapService,
} from "./";

export function useQuerySwaps(swappers: Ref<Address | Address[]>) {
  const swappersArray = computed(() =>
    Array.isArray(swappers.value) ? swappers.value : [swappers.value]
  );

  const { socket, isConnected, url } = useSocketMonitorDefi();
  const service = computed(() =>
    socket.value ? new SwapService(socket.value) : null
  );
  const queryKey = computed(
    () => ["defimonitor-swaps", url.value, swappersArray.value] as const
  );

  // Unsubscribe from tokens no longer watched.
  watchArray(
    swappersArray,
    (_newSwappers, _oldSwappers, _added, removed) => {
      service.value?.unsub(removed);
    },
    { deep: true }
  );

  const query = useQueryRx({
    queryKey,
    queryFn: () => service.value?.sub(swappers.value),
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
