import { defineStore } from "pinia";
import type { Pool, Coin, Pair, TimeRange } from "@CM/Models";
import type {
  Balances,
  Volume,
  Price,
  Transaction,
  Tvl,
  Bonding,
  Sandwich,
} from "@CM/Pages/Pool/Models";
import type { SocketPool, SocketRoot, SocketMEV } from "@CM/Services/Sockets";
import {
  type SandwichDetail,
  type LabelRankingExtended,
  type LabelRankingShort,
} from "@CM/Services/Sockets/SocketMEV";

type State = {
  socket: SocketRoot | null;
  socketPool: SocketPool | null;
  socketMEV: SocketMEV | null;

  pool: Pool | null;
  pools: Pool[];
  poolsLoadingError: boolean;
  prices: Price[];
  balances: Balances[];
  volumes: Volume[];
  transactions: Transaction[];
  tvl: Tvl[];
  bonding: Bonding;
  coins: Coin[];
  pair: Pair | null;
  timeRange: TimeRange;
  sandwiches: Sandwich[];

  mev: {
    labelRankingShort: LabelRankingShort[];
    labelRankingExtended: LabelRankingExtended[];
    sandwiches: SandwichDetail[];
  };
};

export const useMonitorStore = defineStore({
  id: "monitorStore",
  state: (): State => ({
    socket: null,
    socketPool: null,
    socketMEV: null,

    pool: null,
    pools: [],
    poolsLoadingError: false,
    prices: [],
    balances: [],
    volumes: [],
    transactions: [],
    tvl: [],
    bonding: {
      curve: [],
      balanceCoin0: 0,
      balanceCoin1: 0,
    },
    coins: [],
    pair: null,
    timeRange: "month",
    sandwiches: [],
    mev: {
      labelRankingShort: [],
      labelRankingExtended: [],
      sandwiches: [],
    },
  }),
});
