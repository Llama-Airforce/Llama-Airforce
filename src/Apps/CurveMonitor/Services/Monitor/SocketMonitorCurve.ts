import type { Socket } from "socket.io-client";
import type {
  LabelRankingShort,
  LabelRankingExtended,
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const timeDurations = ["1 day", "1 week", "1 month", "full"] as const;
type TimeDuration = (typeof timeDurations)[number];

export type ClientToServerEvents = {
  ping: () => void;
  getSandwichLabelOccurrences: () => void;
  getAbsoluteLabelsRanking: () => void;
  getFullSandwichTableContent: (
    timeDuration: TimeDuration,
    page: number
  ) => void;
};

export type ServerToClientEvents = {
  pong: () => void;
  sandwichLabelOccurrences: (labelsOccurrence: LabelRankingExtended[]) => void;
  absoluteLabelsRanking: (labelsRanking: LabelRankingShort[]) => void;
  fullSandwichTableContent: (resp: {
    data: SandwichDetail[];
    totalPages: number;
  }) => void;
};

export type SocketMonitorCurve = Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;

let socket: ReturnType<typeof useSocketIO<SocketMonitorCurve>> | undefined;
export function useSocketMonitorCurve() {
  if (!socket) {
    socket = useSocketIO({ url: "wss://api.curvemonitor.com/main" });
  }

  return socket;
}
