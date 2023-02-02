import { defineStore } from "pinia";
import type {
  Pool,
  Reserves,
  Volume,
  Candle,
  Transaction,
  PoolId,
} from "@/Pages/CurveMonitor/Models";

type State = {
  pools: Pool[];
  poolsLoadingError: boolean;
  candles: { [pool: PoolId]: Candle[] };
  reserves: { [pool: PoolId]: Reserves[] };
  volumes: { [pool: PoolId]: Volume[] };
  transactions: { [pool: PoolId]: Transaction[] };
};

export const useCurveMonitorStore = defineStore({
  id: "curveMonitorStore",
  state: (): State => ({
    pools: [],
    poolsLoadingError: false,
    candles: {},
    reserves: {},
    volumes: {},
    transactions: {},
  }),
  actions: {
    setCandles(pool: PoolId, candles: Candle[]) {
      this.candles[pool] = candles;
    },
    setReserves(pool: PoolId, reserves: Reserves[]) {
      this.reserves[pool] = reserves;
    },
    setVolumes(pool: PoolId, volumes: Volume[]) {
      this.volumes[pool] = volumes;
    },
    setTransactions(pool: PoolId, txs: Transaction[]) {
      this.transactions[pool] = txs;
    },
    addTransaction(pool: PoolId, tx: Transaction) {
      if (!this.transactions[pool] || this.transactions[pool].length === 0) {
        this.transactions[pool] = [];
      }

      this.transactions[pool].push(tx);
    },
  },
});
