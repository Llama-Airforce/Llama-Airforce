import { createObservable } from "@/Services/Socket";
import type {
  SocketMonitorDefi,
  ServerToClientEvents,
} from "../SocketMonitorDefi";

type SocketObservable<T extends keyof ServerToClientEvents> = ReturnType<
  typeof createObservable<ServerToClientEvents, T>
>;

type Observables = {
  transfers$?: SocketObservable<"NewTransfersForToken">;
};

export default class TransfersService {
  public readonly transfers$: SocketObservable<"NewTransfersForToken">;

  constructor(private socket: SocketMonitorDefi, observables?: Observables) {
    this.transfers$ =
      observables?.transfers$ ??
      createObservable(socket, "NewTransfersForToken");
  }

  subTransfers(tokenAddress: string) {
    this.socket.emit("connectToGeneralErc20Livestream", tokenAddress);
  }
}
