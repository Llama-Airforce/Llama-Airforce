import SocketIOService, {
  type SocketObservableT,
} from "@/Services/Socket/SocketIOService";
import type {
  SocketMonitorDefi,
  ServerToClientEvents,
} from "../SocketMonitorDefi";

type SocketObservable<T extends keyof ServerToClientEvents> = SocketObservableT<
  ServerToClientEvents,
  T
>;

export default class TransfersService extends SocketIOService<SocketMonitorDefi> {
  public readonly transfers$: SocketObservable<"NewTransfersUSDC">;

  constructor(socket: SocketMonitorDefi) {
    super(socket);

    this.transfers$ = this.createObservable("NewTransfersUSDC");
  }

  subTransfers() {
    this.socket.emit("connectToUSDCLivestream");
  }
}
