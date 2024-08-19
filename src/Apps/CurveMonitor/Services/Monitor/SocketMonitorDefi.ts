import { type Socket } from "socket.io-client";
import { useSocketIO } from "@/Framework/Composables/UseSocketIO";
import type { GeneralErc20TokenSpecificBlockSummary } from "@CM/Services/Monitor/Transfers";

export type ClientToServerEvents = {
  connectToGeneralErc20Livestream: (tokenAddress: string) => void;
};

export type ServerToClientEvents = {
  NewTransfersForToken: (
    blockSummary: GeneralErc20TokenSpecificBlockSummary
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
