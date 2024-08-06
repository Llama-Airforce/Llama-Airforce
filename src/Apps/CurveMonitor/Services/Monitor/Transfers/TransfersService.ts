import { createObservable } from "@/Services/Socket";
import type {
  SocketMonitorDefi,
  ServerToClientEvents,
} from "../SocketMonitorDefi";

type SocketObservable<T extends keyof ServerToClientEvents> = ReturnType<
  typeof createObservable<ServerToClientEvents, T>
>;

export default class TransfersService {
  public readonly transfers$: SocketObservable<"NewTransfersUSDC">;

  constructor(private socket: SocketMonitorDefi) {
    this.transfers$ = createObservable(socket, "NewTransfersUSDC");
  }

  subTransfers() {
    this.socket.emit("connectToUSDCLivestream");
  }
}
