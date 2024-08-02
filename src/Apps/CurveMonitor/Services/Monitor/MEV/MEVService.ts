import { Observable, share } from "rxjs";
import SocketIOService from "@/Services/Socket/SocketIOService";
import type {
  SocketMEV,
  ServerToClientEvents,
  ClientToServerEvents,
} from "./SocketMEV";

type ResponseType<T extends keyof ServerToClientEvents> = Parameters<
  ServerToClientEvents[T]
>[0];

export default class MEVService extends SocketIOService<
  ServerToClientEvents,
  ClientToServerEvents,
  SocketMEV
> {
  getSandwichLabelOccurrences() {
    return this.emitAndListen(
      "getSandwichLabelOccurrences",
      "sandwichLabelOccurrences"
    );
  }

  getAbsoluteLabelsRanking() {
    return this.emitAndListen(
      "getAbsoluteLabelsRanking",
      "absoluteLabelsRanking"
    );
  }

  getSandwiches(page = 1) {
    return this.emitAndListen(
      "getFullSandwichTableContent",
      "fullSandwichTableContent",
      "full",
      page
    ).then(({ data, totalPages }) => ({ sandwiches: data, totalPages }));
  }
}

export class MEVServiceRx {
  public readonly sandwiches$: Observable<
    ResponseType<"fullSandwichTableContent">
  >;

  constructor(private socket: SocketMEV) {
    type SandwichData = ResponseType<"fullSandwichTableContent">;
    this.sandwiches$ = new Observable<SandwichData>((subscriber) => {
      const onData = (data: SandwichData) => {
        subscriber.next(data);
      };

      socket.on("fullSandwichTableContent", onData);

      return () => {
        socket.off("fullSandwichTableContent", onData);
      };
    }).pipe(share());
  }

  getSandwiches() {
    this.socket.emit("getFullSandwichTableContent", "full", 1);
  }
}
