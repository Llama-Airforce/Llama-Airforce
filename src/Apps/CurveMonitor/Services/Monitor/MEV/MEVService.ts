import SocketIOService, {
  type SocketObservableT,
} from "@/Services/Socket/SocketIOService";
import type {
  SocketMonitorCurve,
  ServerToClientEvents,
} from "../SocketMonitorCurve";

type SocketObservable<T extends keyof ServerToClientEvents> = SocketObservableT<
  ServerToClientEvents,
  T
>;

export default class MEVService extends SocketIOService<SocketMonitorCurve> {
  public readonly sandwiches$: SocketObservable<"fullSandwichTableContent">;
  public readonly labels$: SocketObservable<"sandwichLabelOccurrences">;
  public readonly labelsRanking$: SocketObservable<"absoluteLabelsRanking">;

  constructor(socket: SocketMonitorCurve) {
    super(socket);

    this.sandwiches$ = this.createObservable("fullSandwichTableContent");
    this.labels$ = this.createObservable("sandwichLabelOccurrences");
    this.labelsRanking$ = this.createObservable("absoluteLabelsRanking");
  }

  getSandwiches() {
    this.socket.emit("getFullSandwichTableContent", "full", 1);
  }

  getLabels() {
    this.socket.emit("getSandwichLabelOccurrences");
  }

  getLabelsRanking() {
    this.socket.emit("getAbsoluteLabelsRanking");
  }
}
