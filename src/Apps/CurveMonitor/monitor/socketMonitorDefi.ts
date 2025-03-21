import type { Socket } from "socket.io-client";
import type { GeneralSwapAddressSpecificBlockSummary } from "./swap";
import type { GeneralErc20TokenSpecificBlockSummary } from "./transfer";

export type ClientToServerEvents = {
  disconnectFromGeneralErc20Livestream: (tokenAddress: string) => void;
  connectToGeneralErc20Livestream: (tokenAddress: string) => void;
  connectToGeneralErc20ArrayLivestream: (tokenAddresses: string[]) => void;

  disconnectFromGeneralErc20SwapLivestream: (swapperAddress: string) => void;
  connectToGeneralErc20SwapLivestream: (swapperAddress: string) => void;
  connectToGeneralErc20SwapArrayLivestream: (swapperAddress: string[]) => void;
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
