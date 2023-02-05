import { defineStore } from "pinia";
import type {
  Pool,
  Balances,
  Volume,
  Price,
  Transaction,
} from "@/Pages/CurveMonitor/Models";

type State = {
  pools: Pool[];
  poolsLoadingError: boolean;
  prices: Price[];
  balances: Balances[];
  volumes: Volume[];
  transactions: Transaction[];
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
  },
});
