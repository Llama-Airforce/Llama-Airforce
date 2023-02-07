import { defineStore } from "pinia";
import type {
  Pool,
  Balances,
  Volume,
  Price,
  Transaction,
  Tvl,
} from "@/Pages/CurveMonitor/Models";

type State = {
  pools: Pool[];
  poolsLoadingError: boolean;
  prices: Price[];
  balances: Balances[];
  volumes: Volume[];
  transactions: Transaction[];
  tvl: Tvl[];
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
  }),
  actions: {
    addTransaction(tx: Transaction) {
      if (this.transactions.length === 0) {
        this.transactions = [];
      }

      this.transactions.push(tx);
    },
    addPrice(price: Price) {
      if (this.prices.length === 0) {
        this.prices = [];
      }

      this.prices.push(price);
    },
    addBalances(balances: Balances) {
      if (this.balances.length === 0) {
        this.balances = [];
      }

      this.balances.push(balances);
    },
    addTvl(tvl: Tvl) {
      if (this.tvl.length === 0) {
        this.tvl = [];
      }

      this.tvl.push(tvl);
    },
  },
});
