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
  poolsLoading: boolean;
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
    poolsLoading: false,
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
  },
});
