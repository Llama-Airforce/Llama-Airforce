import { io, type Socket } from "socket.io-client";

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
  userSearchResult: (searchResults: SearchResult[]) => void;
  sandwichLabelOccurrences: (labelsOccurrence: LabelRankingExtended[]) => void;
  absoluteLabelsRanking: (labelsRanking: LabelRankingShort[]) => void;
  fullSandwichTableContent: (resp: {
    data: SandwichDetail[];
    totalPages: number;
  }) => void;
};

export type LabelRankingExtended = {
  address: string;
  label: string;
  occurrences: number;
  numOfAllTx: number;
};

export type LabelRankingShort = {
  address: string;
  label: string;
  occurrences: number;
};

export type SearchResult = {
  address: string;
  name: string | null;
};

export type TransactionType = "swap" | "deposit" | "remove";

type CoinDetail = {
  coin_id: number;
  amount: string;
  name: string;
  address: string;
};

export type TransactionDetail = {
  tx_id: number;
  pool_id: number;
  event_id?: number;
  tx_hash: string;
  block_number: number;
  block_unixtime: number;
  transaction_type: TransactionType;
  called_contract_by_user: string;
  trader: string;
  tx_position: number;
  coins_leaving_wallet: CoinDetail[];
  coins_entering_wallet: CoinDetail[];
};

type UserLossDetail = {
  unit: string;
  unitAddress: string;
  amount: number;
  lossInPercentage: number;
};

export type SandwichDetail = {
  frontrun: TransactionDetail;
  center: TransactionDetail[];
  backrun: TransactionDetail;
  user_losses_details: UserLossDetail[];
  label: string;
  poolAddress: string;
  poolName: string;
  lossInUsd: number;
};

export type SocketMEV = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createSocketMEV(url: string): SocketMEV {
  const socket = io(`${url}/main`, {
    autoConnect: false,
    secure: true,
  });

  socket.on("error", (error: Error) => {
    console.error("Socket.IO error:", error);
  });

  return socket;
}
