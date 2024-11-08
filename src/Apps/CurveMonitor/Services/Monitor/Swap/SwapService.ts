import type { Address } from "@/Types/Address";
import { createObservable } from "@/Services/Socket";
import type {
  SocketMonitorDefi,
  ServerToClientEvents,
} from "../SocketMonitorDefi";

type SocketObservable<T extends keyof ServerToClientEvents> = ReturnType<
  typeof createObservable<ServerToClientEvents, T>
>;

type Observables = {
  swaps$?: SocketObservable<"NewSwapDataForAddress">;
};

export default class SwapService {
  public readonly swaps$: SocketObservable<"NewSwapDataForAddress">;

  constructor(private socket: SocketMonitorDefi, observables?: Observables) {
    this.swaps$ =
      observables?.swaps$ ?? createObservable(socket, "NewSwapDataForAddress");
  }

  sub(swappers: Address | Address[]) {
    if (!Array.isArray(swappers)) {
      this.socket.emit("connectToGeneralErc20SwapLivestream", swappers);
    } else if (swappers.length > 0) {
      this.socket.emit("connectToGeneralErc20SwapArrayLivestream", swappers);
    }
  }

  unsub(swappers: Address | Address[]) {
    const swappersArray = Array.isArray(swappers) ? swappers : [swappers];

    for (const swapper of swappersArray) {
      this.socket.emit("disconnectFromGeneralErc20SwapLivestream", swapper);
    }
  }
}
