import { SocketMEV } from "@CM/Services/Sockets";
import {
  type SandwichDetail,
  type LabelRankingExtended,
  type LabelRankingShort,
  type SearchResult,
} from "@CM/Services/Sockets/SocketMEV";

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

  public getSandwiches(): Promise<SandwichDetail[]> {
    const promise = new Promise<SandwichDetail[]>((resolve) => {
      this.socket.once("fullSandwichTableContent", (sandwiches) => {
        resolve(sandwiches);
      });
    });

    this.socket.emit("getFullSandwichTableContent", "full");

    return promise;
  }
}
