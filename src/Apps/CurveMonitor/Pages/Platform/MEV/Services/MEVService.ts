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

  public search(input: string): Promise<SearchResult[]> {
    const promise = new Promise<SearchResult[]>((resolve) => {
      this.socket.once("userSearchResult", (searchResults) => {
        resolve(searchResults);
      });
    });

    this.socket.emit("getUserSearchResult", input);

    return promise;
  }

  public getSandwichLabelOccurrences(): Promise<LabelRankingExtended[]> {
    const promise = new Promise<LabelRankingExtended[]>((resolve) => {
      this.socket.once("sandwichLabelOccurrences", (labelsOccurrence) => {
        resolve(labelsOccurrence);
      });
    });

    this.socket.emit("getSandwichLabelOccurrences");

    return promise;
  }

  public getAbsoluteLabelsRanking(): Promise<LabelRankingShort[]> {
    const promise = new Promise<LabelRankingShort[]>((resolve) => {
      this.socket.once("absoluteLabelsRanking", (labelsRanking) => {
        resolve(labelsRanking);
      });
    });

    this.socket.emit("getAbsoluteLabelsRanking");

    return promise;
  }

  public getSandwiches(page = 1): Promise<GetSandwichesResp> {
    const promise = new Promise<GetSandwichesResp>((resolve) => {
      this.socket.once("fullSandwichTableContent", ({ data, totalPages }) => {
        resolve({ sandwiches: data, totalPages });
      });
    });

    this.socket.emit("getFullSandwichTableContent", "full", page);

    return promise;
  }
}
