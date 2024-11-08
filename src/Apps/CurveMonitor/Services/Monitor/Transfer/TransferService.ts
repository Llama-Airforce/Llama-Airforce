import type { Address } from "@/Framework/Types/Address";
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

export default class TransferService {
  public readonly transfers$: SocketObservable<"NewTransfersForToken">;

  constructor(private socket: SocketMonitorDefi, observables?: Observables) {
    if (observables?.transfers$) {
      this.transfers$ = observables.transfers$;
    } else {
      this.transfers$ = createObservable(socket, "NewTransfersForToken");
    }
  }

  sub(tokens: Address | Address[]) {
    if (!Array.isArray(tokens)) {
      this.socket.emit("connectToGeneralErc20Livestream", tokens);
    } else if (tokens.length > 0) {
      this.socket.emit("connectToGeneralErc20ArrayLivestream", tokens);
    }
  }

  unsub(tokens: Address | Address[]) {
    const tokensArray = Array.isArray(tokens) ? tokens : [tokens];

    for (const token of tokensArray) {
      this.socket.emit("disconnectFromGeneralErc20Livestream", token);
    }
  }
}
