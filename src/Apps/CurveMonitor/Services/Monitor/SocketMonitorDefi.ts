import { type Socket } from "socket.io-client";
import { useSocketIO } from "@/Framework/Composables/UseSocketIO";
import type { GeneralErc20TokenSpecificBlockSummary } from "@CM/Services/Monitor/Transfer";
import type { GeneralSwapAddressSpecificBlockSummary } from "@CM/Services/Monitor/Swap";

export type ClientToServerEvents = {
  connectToGeneralErc20Livestream: (tokenAddress: string) => void;
  connectToGeneralErc20SwapLivestream: (observedAddress: string) => void;
};

export type ServerToClientEvents = {
  NewTransfersForToken: (
    blockSummary: GeneralErc20TokenSpecificBlockSummary
  ) => void;

  NewSwapDataForAddress: (
    generalSwapAddressSpecificBlockSummary: GeneralSwapAddressSpecificBlockSummary
  ) => void;
};

export type SocketMonitorDefi = Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;

let socket: ReturnType<typeof useSocketIO<SocketMonitorDefi>> | undefined;
export function useSocketMonitorDefi() {
  if (!socket) {
    socket = useSocketIO({ url: "wss://api.defimonitor.com/main" });
  }

  return socket;
}
