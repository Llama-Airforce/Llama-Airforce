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
    addCandle(candle: Candle) {
      if (this.candles.length === 0) {
        this.candles = [];
      }

      this.candles.push(candle);
    },
    addTransaction(tx: Transaction) {
      if (this.transactions.length === 0) {
        this.transactions = [];
      }

      this.transactions.push(tx);
    },
  },
});
