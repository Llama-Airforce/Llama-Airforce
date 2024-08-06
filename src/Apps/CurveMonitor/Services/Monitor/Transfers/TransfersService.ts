import { createObservable } from "@/Services/Socket";
import type {
  SocketMonitorDefi,
  ServerToClientEvents,
} from "../SocketMonitorDefi";

type SocketObservable<T extends keyof ServerToClientEvents> = ReturnType<
  typeof createObservable<ServerToClientEvents, T>
>;

type Observables = {
  transers$?: SocketObservable<"NewTransfersUSDC">;
};

export default class TransfersService {
  public readonly transfers$: SocketObservable<"NewTransfersUSDC">;

  constructor(private socket: SocketMonitorDefi, observables?: Observables) {
    this.transfers$ =
      observables?.transers$ ?? createObservable(socket, "NewTransfersUSDC");
  }

  subTransfers() {
    this.socket.emit("connectToUSDCLivestream");
  }
}
