import { Observable, share } from "rxjs";
import type {
  SocketMonitorCurve,
  ServerToClientEvents,
} from "../SocketMonitorCurve";

type ResponseType<T extends keyof ServerToClientEvents> = Parameters<
  ServerToClientEvents[T]
>[0];

type SandwichData = ResponseType<"fullSandwichTableContent">;
type LabelsData = ResponseType<"sandwichLabelOccurrences">;
type LabelsRankingData = ResponseType<"absoluteLabelsRanking">;

export default class MEVService {
  public readonly sandwiches$: Observable<SandwichData>;
  public readonly labels$: Observable<LabelsData>;
  public readonly labelsRanking$: Observable<LabelsRankingData>;

  constructor(private socket: SocketMonitorCurve) {
    this.sandwiches$ = new Observable<SandwichData>((subscriber) => {
      const onData = (data: SandwichData) => {
        subscriber.next(data);
      };

      socket.on("fullSandwichTableContent", onData);

      return () => {
        socket.off("fullSandwichTableContent", onData);
      };
    }).pipe(share());

    this.labels$ = new Observable<LabelsData>((subscriber) => {
      const onData = (data: LabelsData) => {
        subscriber.next(data);
      };

      socket.on("sandwichLabelOccurrences", onData);

      return () => {
        socket.off("sandwichLabelOccurrences", onData);
      };
    }).pipe(share());

    this.labelsRanking$ = new Observable<LabelsRankingData>((subscriber) => {
      const onData = (data: LabelsRankingData) => {
        subscriber.next(data);
      };

      socket.on("absoluteLabelsRanking", onData);

      return () => {
        socket.off("absoluteLabelsRanking", onData);
      };
    }).pipe(share());
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
