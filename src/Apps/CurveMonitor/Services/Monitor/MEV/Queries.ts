import type { Address } from "@/Types/Address";
import {
  type DurationInput,
  type IntervalInput,
  useSocketMonitorCurve,
} from "../SocketMonitorCurve";
import { MEVService } from "./";

export function useQueryLabels() {
  const { socket, isConnected, url } = useSocketMonitorCurve();
  const service = computed(() =>
    socket.value ? new MEVService(socket.value) : null
  );
  const queryKey = computed(() => ["mev-labels", url.value] as const);

  return useQuery({
    queryKey,
    queryFn: () => service.value?.getLabels(),
    enabled: isConnected,
  });
}

export function useQuerySandwiches() {
  const { socket, isConnected, url } = useSocketMonitorCurve();
  const service = computed(() =>
    socket.value ? new MEVService(socket.value) : null
  );
  const queryKey = computed(() => ["mev-sandwiches-tx", url.value] as const);

  return useQuery({
    queryKey,
    queryFn: () => service.value?.getSandwiches(),
    enabled: isConnected,
  });
}

export function useQueryPoolVolume(
  poolAddress: Ref<Address>,
  timeDuration: Ref<DurationInput>,
  timeInterval: Ref<IntervalInput>
) {
  const { socket, isConnected, url } = useSocketMonitorCurve();
  const service = computed(() =>
    socket.value ? new MEVService(socket.value) : null
  );
  const queryKey = computed(
    () =>
      [
        "mev-pool-volume",
        url.value,
        poolAddress,
        timeDuration,
        timeInterval,
      ] as const
  );

  return useQuery({
    queryKey,
    queryFn: ({ queryKey: [, , poolAddress, timeDuration, timeInterval] }) =>
      service.value
        ?.getPoolSpecificAggregatedMevVolume(
          poolAddress,
          timeDuration,
          timeInterval
        )
        .then((x) => x.data) ?? [],
    enabled: isConnected,
    initialData: [],
    initialDataUpdatedAt: 0,
  });
}
