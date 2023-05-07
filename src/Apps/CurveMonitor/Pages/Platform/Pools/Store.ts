import { defineStore } from "pinia";
import type {
  Pool,
  Reserves,
  Volume,
  Candle,
  PoolId,
} from "@CM/Pages/Platform/Pools/Models";

type State = {
  pools: Pool[];
  poolsLoading: boolean;
  poolsLoadingError: boolean;
  candles: { [pool: PoolId]: Candle[] };
  reserves: { [pool: PoolId]: Reserves[] };
  volumes: { [pool: PoolId]: Volume[] };
};

export const useCurvePoolsStore = defineStore({
  id: "curvePoolsStore",
  state: (): State => ({
    pools: [],
    poolsLoading: false,
    poolsLoadingError: false,
    candles: {},
    reserves: {},
    volumes: {},
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
  },
});
