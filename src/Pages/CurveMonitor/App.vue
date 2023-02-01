<template>
  <div class="curve-monitor">
    <div class="dashboard">
      <div
        class="top"
        :class="{ hasPool: !!poolSelected }"
      >
        <img
          class="logo"
          src="/headers/curve.png"
        />

        <SearchPool
          v-model="pool"
          class="search"
          @select="onSelect"
        ></SearchPool>
      </div>

      <div
        v-if="poolSelected"
        class="data"
        :class="{ loading: store.poolsLoading }"
      >
        <Transactions
          v-if="poolSelected"
          class="transactions"
          :pool-selected="poolSelected"
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
      </div>

      <Spinner
        v-if="store.poolsLoading"
        class="spinner"
      ></Spinner>
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
import Transactions from "@/Pages/CurveMonitor/Components/Transactions.vue";
import Bonding from "@/Pages/CurveMonitor/Components/Bonding.vue";
import Balances from "@/Pages/CurveMonitor/Components/Balances.vue";
import Reserves from "@/Pages/CurveMonitor/Components/Reserves.vue";
import Candles from "@/Pages/CurveMonitor/Components/Candles.vue";
import Volume from "@/Pages/CurveMonitor/Components/Volume.vue";
import {
  ReservesService,
  CandleService,
  VolumeService,
  PoolService,
  TransactionService,
} from "@/Pages/CurveMonitor/Services";
import {
  getCandles,
  getPools,
  getReserves,
  getTransactions,
  getVolumes,
} from "@/Pages/CurveMonitor/DataLoaders";

const poolService = new PoolService(getHost());
const reservesSerice = new ReservesService(getHost());
const candleService = new CandleService(getHost());
const volumeService = new VolumeService(getHost());
const transactionService = new TransactionService(
  "https://ws.llama.airforce:2053",
  "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD"
);

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
  void getTransactions(store, transactionService, poolNew);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("curve-monitor");

.curve-monitor {
  .dashboard {
    @media only screen and (max-width: 1280px) {
      gap: 0;
    }
  }
}

.top {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  justify-self: center;

  &:not(.hasPool) {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);

    .logo {
      display: flex;
    }
  }

  width: 600px;

  @media only screen and (max-width: 1280px) {
    width: calc(80% - 2rem);
    padding: 0 1rem;
  }

  .logo {
    display: none;
    width: 100%;
    height: 38px;
    object-fit: none;
  }

  .search {
    &.hasPool {
      margin-top: 0;
    }
  }
}

.data {
  @include dashboard-grid;

  grid-template-rows: auto auto repeat(2, 300px);
  grid-template-columns: 1fr 1fr;

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

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
}
</style>
