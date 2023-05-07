<template>
  <div class="pools">
    <div class="dashboard">
      <SearchPool
        v-model="pool"
        @select="onSelect"
      ></SearchPool>

      <div
        class="data"
        :class="{ loading: store.poolsLoading }"
      >
        <Candles
          v-if="poolSelected"
          class="candles"
          :pool-selected="poolSelected"
        ></Candles>

        <Reserves
          v-if="poolSelected"
          class="reserves"
          :pool-selected="poolSelected"
        ></Reserves>

        <Volume
          v-if="poolSelected"
          class="volumes"
          :pool-selected="poolSelected"
        ></Volume>

        <Balances
          v-if="poolSelected"
          class="balances"
          :pool-selected="poolSelected"
        ></Balances>

        <Spinner
          v-if="store.poolsLoading"
          class="spinner"
        ></Spinner>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Spinner } from "@/Framework";
import { shorten } from "@/Util";
import type { Pool } from "@LAF/Pages/Curve/Pools/Models";
import { getHost } from "@/Services/Host";
import { useCurvePoolsStore } from "@LAF/Pages/Curve/Pools/Store";
import SearchPool from "@LAF/Pages/Curve/Pools/Components/SearchPool.vue";
import Balances from "@LAF/Pages/Curve/Pools/Components/Balances.vue";
import Reserves from "@LAF/Pages/Curve/Pools/Components/Reserves.vue";
import Candles from "@LAF/Pages/Curve/Pools/Components/Candles.vue";
import Volume from "@LAF/Pages/Curve/Pools/Components/Volume.vue";
import {
  ReservesService,
  CandleService,
  VolumeService,
  PoolService,
} from "@LAF/Pages/Curve/Pools/Services";
import {
  getCandles,
  getPools,
  getReserves,
  getVolumes,
} from "@LAF/Pages/Curve/Pools/DataLoaders";

const poolService = new PoolService(getHost());
const reservesSerice = new ReservesService(getHost());
const candleService = new CandleService(getHost());
const volumeService = new VolumeService(getHost());

// Refs.
const store = useCurvePoolsStore();

const pool = ref("");
const poolSelected = ref<Pool | null>(null);

// Hooks
onMounted(async (): Promise<void> => {
  await getPools(store, poolService);
});

// Events
const onSelect = (option: unknown): void => {
  const poolNew = option as Pool;

  pool.value = shorten(poolNew.name);
  poolSelected.value = poolNew;

  void getCandles(store, candleService, poolNew);
  void getReserves(store, reservesSerice, poolNew);
  void getVolumes(store, volumeService, poolNew);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("pools");

.data {
  @include dashboard-grid;

  grid-template-rows: auto repeat(2, 300px);
  grid-template-columns: 1fr 1fr;

  .spinner {
    grid-row: 1;
    grid-column: 1 / -1;

    position: relative;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  .candles {
    grid-row: 1;
    grid-column: 1 / -1;
  }

  .reserves {
    grid-row: 2;
    grid-column: 1;
  }

  .volume {
    grid-row: 2;
    grid-column: 2;
  }

  .balances {
    grid-row: 3;
    grid-column: 1 / -1;
  }
}
</style>
