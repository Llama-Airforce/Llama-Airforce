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
import { onMounted } from "vue";
import { $ref } from "vue/macros";
import { Spinner } from "@/Framework";
import { shorten } from "@/Util";
import type { Pool } from "@/Pages/CurveMonitor/Models";
import { getHost } from "@/Services/Host";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import SearchPool from "@/Pages/CurveMonitor/Components/SearchPool.vue";
import Balances from "@/Pages/CurveMonitor/Components/Balances.vue";
import Reserves from "@/Pages/CurveMonitor/Components/Reserves.vue";
import Candles from "@/Pages/CurveMonitor/Components/Candles.vue";
import Volume from "@/Pages/CurveMonitor/Components/Volume.vue";
import {
  ReservesService,
  CandleService,
  VolumeService,
  PoolService,
} from "@/Pages/CurveMonitor/Services";
import {
  getCandles,
  getPools,
  getReserves,
  getVolumes,
} from "@/Pages/CurveMonitor/DataLoaders";

const poolService = new PoolService(getHost());
const reservesSerice = new ReservesService(getHost());
const candleService = new CandleService(getHost());
const volumeService = new VolumeService(getHost());

// Refs.
const store = useCurveMonitorStore();

let pool = $ref("");
let poolSelected: Pool | null = $ref(null);

// Hooks
onMounted(async (): Promise<void> => {
  await getPools(store, poolService);
});

// Events
const onSelect = (option: unknown): void => {
  const poolNew = option as Pool;

  pool = shorten(poolNew.name);
  poolSelected = poolNew;

  void getCandles(store, candleService, poolNew);
  void getReserves(store, reservesSerice, poolNew);
  void getVolumes(store, volumeService, poolNew);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("pools");

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
