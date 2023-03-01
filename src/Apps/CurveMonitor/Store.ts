import { defineStore } from "pinia";
import type {
  Pool,
  Balances,
  Volume,
  Price,
  Transaction,
  Tvl,
  Bonding,
  Coin,
  Pair,
  TimeRange,
  Sandwich,
} from "@CM/Models";
import type { SocketPool, SocketRoot } from "@CM/Services/Sockets";

type State = {
  socket: SocketRoot | null;
  socketPool: SocketPool | null;

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
};

export const useCurveMonitorStore = defineStore({
  id: "curveMonitorStore",
  state: (): State => ({
    socket: null,
    socketPool: null,

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
  }),
});
