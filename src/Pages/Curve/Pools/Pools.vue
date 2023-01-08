<template>
  <div class="mev">
    <div class="dashboard">
      <SearchPool
        v-model="pool"
        @select="onSelect"
      ></SearchPool>

      <div
        class="data"
        :class="{ loading: store.poolsLoading }"
      >
        <Trades
          v-if="poolSelected"
          class="trades"
        ></Trades>

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
import Pool from "@/Pages/Curve/Models/Pool";
import { getHost } from "@/Services/Host";
import { useCurveStore } from "@/Pages/Curve/Store";
import SearchPool from "@/Pages/Curve/Components/SearchPool.vue";
import Trades from "@/Pages/Curve/Pools/Components/Trades.vue";
import Bonding from "@/Pages/Curve/Pools/Components/Bonding.vue";
import Balances from "@/Pages/Curve/Pools/Components/Balances.vue";
import Reserves from "@/Pages/Curve/Pools/Components/Reserves.vue";
import Candles from "@/Pages/Curve/Pools/Components/Candles.vue";
import Volume from "@/Pages/Curve/Pools/Components/Volume.vue";
import ReservesService from "@/Pages/Curve/Pools/Services/ReservesService";
import CandleService from "@/Pages/Curve/Pools/Services/CandleService";
import VolumeService from "@/Pages/Curve/Pools/Services/VolumeService";
import PoolService from "@/Pages/Curve/Services/PoolService";
import {
  getCandles,
  getPools,
  getReserves,
  getVolumes,
} from "@/Pages/Curve/Pools/DataLoaders";

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

@include dashboard("mev");

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

  .trades {
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
