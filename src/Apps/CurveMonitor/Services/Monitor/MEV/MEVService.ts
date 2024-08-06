import { createObservable } from "@/Services/Socket";
import type {
  SocketMonitorCurve,
  ServerToClientEvents,
} from "../SocketMonitorCurve";

type SocketObservable<T extends keyof ServerToClientEvents> = ReturnType<
  typeof createObservable<ServerToClientEvents, T>
>;

export default class MEVService {
  public readonly sandwiches$: SocketObservable<"fullSandwichTableContent">;
  public readonly labels$: SocketObservable<"sandwichLabelOccurrences">;
  public readonly labelsRanking$: SocketObservable<"absoluteLabelsRanking">;

  constructor(private socket: SocketMonitorCurve) {
    this.sandwiches$ = createObservable(socket, "fullSandwichTableContent");
    this.labels$ = createObservable(socket, "sandwichLabelOccurrences");
    this.labelsRanking$ = createObservable(socket, "absoluteLabelsRanking");
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
