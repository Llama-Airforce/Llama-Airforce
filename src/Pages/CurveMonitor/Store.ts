import { defineStore } from "pinia";
import type {
  Pool,
  Reserves,
  Volume,
  Candle,
  Transaction,
} from "@/Pages/CurveMonitor/Models";

type State = {
  pools: Pool[];
  poolsLoadingError: boolean;
  candles: Candle[];
  reserves: Reserves[];
  volumes: Volume[];
  transactions: Transaction[];
};

export const useCurveMonitorStore = defineStore({
  id: "curveMonitorStore",
  state: (): State => ({
    pools: [],
    poolsLoadingError: false,
    candles: [],
    reserves: [],
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
  },
});
