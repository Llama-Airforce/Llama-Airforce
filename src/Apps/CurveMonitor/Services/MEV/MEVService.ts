import SocketIOService from "@/Services/Socket/SocketIOService";
import type {
  SocketMEV,
  ServerToClientEvents,
  ClientToServerEvents,
} from "@CM/Services/MEV/SocketMEV";

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

  public getSandwiches(page = 1) {
    return this.emitAndListen(
      "getFullSandwichTableContent",
      "fullSandwichTableContent",
      "full",
      page
    ).then(({ data, totalPages }) => ({ sandwiches: data, totalPages }));
  }
}
