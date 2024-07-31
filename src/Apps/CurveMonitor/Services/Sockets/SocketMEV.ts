import { type Socket } from "socket.io-client";
import { useSocketIO } from "@/Framework/Composables/UseSocketIO";
import type {
  LabelRankingShort,
  LabelRankingExtended,
  UserSearchResult,
  TransactionDetail,
} from "@CM/phil/src/utils/Interfaces";
import type { SandwichDetail } from "@CM/phil/src/utils/postgresTables/readFunctions/SandwichDetail";
import { TransactionType } from "@CM/phil/src/models/TransactionType";

export type {
  LabelRankingShort,
  LabelRankingExtended,
  TransactionDetail,
  SandwichDetail,
};

export { TransactionType };

const timeDurations = ["1 day", "1 week", "1 month", "full"] as const;
type TimeDuration = (typeof timeDurations)[number];

export type ClientToServerEvents = {
  ping: () => void;
  getSandwichLabelOccurrences: () => void;
  getAbsoluteLabelsRanking: () => void;
  getUserSearchResult: (input: string) => void;
  getFullSandwichTableContent: (
    timeDuration: TimeDuration,
    page: number
  ) => void;
};

export type ServerToClientEvents = {
  pong: () => void;
  userSearchResult: (searchResults: UserSearchResult[]) => void;
  sandwichLabelOccurrences: (labelsOccurrence: LabelRankingExtended[]) => void;
  absoluteLabelsRanking: (labelsRanking: LabelRankingShort[]) => void;
  fullSandwichTableContent: (resp: {
    data: SandwichDetail[];
    totalPages: number;
  }) => void;
};

export type SocketMEV = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: ReturnType<typeof useSocketIO<SocketMEV>> | undefined;
export function useSocketMEV() {
  if (!socket) {
    socket = useSocketIO({ url: "wss://api.curvemonitor.com" });
  }

  return socket;
}
