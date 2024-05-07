import { ref } from "vue";
import { defineStore } from "pinia";
import type {
  Pool,
  Reserves,
  Volume,
  Candle,
  PoolId,
} from "@CM/Pages/Platform/Pools/Models";

export const useCurvePoolsStore = defineStore("curvePoolsStore", () => {
  const pools = ref<Pool[]>([]);
  const poolsLoading = ref<boolean>(false);
  const poolsLoadingError = ref<boolean>(false);
  const candles = ref<{ [pool: PoolId]: Candle[] }>({});
  const reserves = ref<{ [pool: PoolId]: Reserves[] }>({});
  const volumes = ref<{ [pool: PoolId]: Volume[] }>({});

  function setCandles(pool: PoolId, newCandles: Candle[]) {
    candles.value[pool] = newCandles;
  }

  function setReserves(pool: PoolId, newReserves: Reserves[]) {
    reserves.value[pool] = newReserves;
  }

  function setVolumes(pool: PoolId, newVolumes: Volume[]) {
    volumes.value[pool] = newVolumes;
  }

  return {
    pools,
    poolsLoading,
    poolsLoadingError,
    candles,
    reserves,
    volumes,

    setCandles,
    setReserves,
    setVolumes,
  };
});
