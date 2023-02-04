import { defineStore } from "pinia";
import type {
  Pool,
  Reserves,
  Volume,
  Price,
  Transaction,
} from "@/Pages/CurveMonitor/Models";

type State = {
  pools: Pool[];
  poolsLoadingError: boolean;
  prices: Price[];
  reserves: Reserves[];
  volumes: Volume[];
  transactions: Transaction[];
};

export const useCurveMonitorStore = defineStore({
  id: "curveMonitorStore",
  state: (): State => ({
    pools: [],
    poolsLoadingError: false,
    prices: [],
    reserves: [],
    volumes: [],
    transactions: [],
  }),
  actions: {
    addPrice(price: Price) {
      if (this.prices.length === 0) {
        this.prices = [];
      }

      this.prices.push(price);
    },
    addTransaction(tx: Transaction) {
      if (this.transactions.length === 0) {
        this.transactions = [];
      }

      this.transactions.push(tx);
    },
  },
});
