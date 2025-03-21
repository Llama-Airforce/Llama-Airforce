import type { Socket } from "socket.io-client";
import { TransactionType } from "@CM/phil/src/models/TransactionType";
import type {
  LabelRankingShort,
  LabelRankingExtended,
  TransactionDetail,
  DurationType,
  DurationInput,
  IntervalInput,
} from "@CM/phil/src/utils/Interfaces";
import type { SandwichDetail } from "@CM/phil/src/utils/postgresTables/readFunctions/SandwichDetail";

interface AggregatedVolumeData {
  interval_start: Date;
  interval_start_unixtime: number;
  full_volume: number;
  atomicArbVolume: number;
  cexDexArbVolume: number;
  sandwichVolume_LossWithin: number;
  sandwichVolume_LossOutside: number;
}

export type {
  LabelRankingShort,
  LabelRankingExtended,
  TransactionDetail,
  SandwichDetail,
  AggregatedVolumeData,
  DurationType,
  DurationInput,
  IntervalInput,
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
  getPoolSpecificAggregatedMevVolume: (
    poolAddress: string,
    timeDuration: DurationInput,
    timeInterval: IntervalInput
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
  poolSpecificAggregatedMevVolume: (aggregatedMevVolumeForPool: {
    data: AggregatedVolumeData[];
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
