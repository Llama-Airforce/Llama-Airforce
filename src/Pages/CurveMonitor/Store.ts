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
} from "@/Pages/CurveMonitor/Models";

type State = {
  pools: Pool[];
  poolsLoadingError: boolean;
  prices: Price[];
  balances: Balances[];
  volumes: Volume[];
  transactions: Transaction[];
  tvl: Tvl[];
  bonding: Bonding;
  coins: Coin[];
};

export const useCurveMonitorStore = defineStore({
  id: "curveMonitorStore",
  state: (): State => ({
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
  }),
});
