import { useSocketMonitorCurve } from "../SocketMonitorCurve";
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
