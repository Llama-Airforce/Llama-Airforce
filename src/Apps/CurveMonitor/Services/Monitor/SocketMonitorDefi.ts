import { type Socket } from "socket.io-client";
import { useSocketIO } from "@/Framework/Composables/UseSocketIO";
import type { USDCBlockSummary } from "@CM/Services/Monitor/Transfers";

export type ClientToServerEvents = {
  connectToUSDCLivestream: () => void;
};

export type ServerToClientEvents = {
  NewTransfersUSDC: (blockSummary: USDCBlockSummary) => void;
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
