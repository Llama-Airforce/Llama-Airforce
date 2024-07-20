import { type SocketMEV } from "@CM/Services/Sockets";
import {
  type SandwichDetail,
  type LabelRankingExtended,
  type LabelRankingShort,
  type SearchResult,
} from "@CM/Services/Sockets/SocketMEV";

type GetSandwichesResp = { sandwiches: SandwichDetail[]; totalPages: number };

export default class MEVService {
  private readonly socket: SocketMEV;

  constructor(socket: SocketMEV) {
    this.socket = socket;
  }

  public search(input: string) {
    const promise = new Promise<SearchResult[]>((resolve) => {
      this.socket.once("userSearchResult", (searchResults) => {
        resolve(searchResults);
      });
    });

    this.socket.emit("getUserSearchResult", input);

    return promise;
  }

  public getSandwichLabelOccurrences() {
    const promise = new Promise<LabelRankingExtended[]>((resolve) => {
      this.socket.once("sandwichLabelOccurrences", (labelsOccurrence) => {
        resolve(labelsOccurrence);
      });
    });

    this.socket.emit("getSandwichLabelOccurrences");

    return promise;
  }

  public getAbsoluteLabelsRanking() {
    const promise = new Promise<LabelRankingShort[]>((resolve) => {
      this.socket.once("absoluteLabelsRanking", (labelsRanking) => {
        resolve(labelsRanking);
      });
    });

    this.socket.emit("getAbsoluteLabelsRanking");

    return promise;
  }

  public getSandwiches(page = 1) {
    const promise = new Promise<GetSandwichesResp>((resolve) => {
      this.socket.once("fullSandwichTableContent", ({ data, totalPages }) => {
        resolve({ sandwiches: data, totalPages });
      });
    });

    this.socket.emit("getFullSandwichTableContent", "full", page);

    return promise;
  }
}
