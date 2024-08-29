import { merge } from "rxjs";
import { createObservable } from "@/Services/Socket";
import type {
  SocketMonitorDefi,
  ServerToClientEvents,
} from "../SocketMonitorDefi";
import type { Address } from "@/Framework/Address";

type SocketObservable<T extends keyof ServerToClientEvents> = ReturnType<
  typeof createObservable<ServerToClientEvents, T>
>;

type Observables = {
  transfers$?: SocketObservable<
    "NewTransfersForToken" | "NewTransfersForTokenArray"
  >;
};

export default class TransferService {
  public readonly transfers$: SocketObservable<
    "NewTransfersForToken" | "NewTransfersForTokenArray"
  >;

  constructor(private socket: SocketMonitorDefi, observables?: Observables) {
    if (observables?.transfers$) {
      this.transfers$ = observables.transfers$;
    } else {
      const transfersForToken = createObservable(
        socket,
        "NewTransfersForToken"
      );
      const transfersForTokenArray = createObservable(
        socket,
        "NewTransfersForTokenArray"
      );

      this.transfers$ = merge(transfersForToken, transfersForTokenArray);
    }
  }

  subTransfers(tokens: Address | Address[]) {
    if (!Array.isArray(tokens)) {
      this.socket.emit("connectToGeneralErc20Livestream", tokens);
    } else if (tokens.length > 0) {
      this.socket.emit("connectToGeneralErc20ArrayLivestream", tokens);
    }
  }
}
