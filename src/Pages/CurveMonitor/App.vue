<template>
  <div class="curve-monitor">
    <div class="dashboard">
      <SearchPool
        v-model="pool"
        class="search"
        :class="{ hasPool: !!poolSelected }"
        @select="onSelect"
      ></SearchPool>

      <div
        class="data"
        :class="{ loading: store.poolsLoading }"
      >
        <Transactions
          v-if="poolSelected"
          class="transactions"
        ></Transactions>

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

        <Bonding
          v-if="poolSelected"
          class="bonding"
        ></Bonding>

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
import Pool from "@/Pages/CurveMonitor/Models/Pool";
import { getHost } from "@/Services/Host";
import { useCurveStore } from "@/Pages/Curve/Store";
import SearchPool from "@/Pages/CurveMonitor/Components/SearchPool.vue";
import Transactions from "@/Pages/CurveMonitor/Components/Transactions.vue";
import Bonding from "@/Pages/CurveMonitor/Components/Bonding.vue";
import Balances from "@/Pages/CurveMonitor/Components/Balances.vue";
import Reserves from "@/Pages/CurveMonitor/Components/Reserves.vue";
import Candles from "@/Pages/CurveMonitor/Components/Candles.vue";
import Volume from "@/Pages/CurveMonitor/Components/Volume.vue";
import ReservesService from "@/Pages/CurveMonitor/Services/ReservesService";
import CandleService from "@/Pages/CurveMonitor/Services/CandleService";
import VolumeService from "@/Pages/CurveMonitor/Services/VolumeService";
import PoolService from "@/Pages/CurveMonitor/Services/PoolService";
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
const store = useCurveStore();

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

@include dashboard("curve-monitor");

.search {
  width: 30vw;
  margin-top: 30vh;
  justify-self: center;

  &.hasPool {
    margin-top: 0;
  }
}

.data {
  @include dashboard-grid;

  grid-template-rows: auto auto repeat(2, 300px);
  grid-template-columns: 1fr 1fr;

  .spinner {
    grid-row: 2;
    grid-column: 1 / -1;

    position: relative;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  .transactions {
    grid-row: 1;
    grid-column: 1 / -1;
  }

  .candles {
    grid-row: 2;
    grid-column: 1 / -1;
  }

  .reserves {
    grid-row: 3;
    grid-column: 1;
  }

  .volume {
    grid-row: 3;
    grid-column: 2;
  }

  .bonding {
    grid-row: 4;
    grid-column: 1;
  }

  .balances {
    grid-row: 4;
    grid-column: 2;
  }
}
</style>
