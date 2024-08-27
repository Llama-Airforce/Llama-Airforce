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

  subSwaps(observedAddress: string) {
    this.socket.emit("connectToGeneralErc20SwapLivestream", observedAddress);
  }
}
