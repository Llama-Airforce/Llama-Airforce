<template>
  <div class="curve-monitor">
    <div class="dashboard">
      <div
        class="top"
        :class="{ hasPool: !!poolSelected }"
      >
        <div class="logo">
          <img src="@/Assets/crv.png" />
          <span>Curve</span>
        </div>

        <SearchPool
          v-model="pool"
          class="search"
          :pool-service="poolService"
          @select="onSelect"
        ></SearchPool>
      </div>

      <div
        v-if="poolSelected"
        class="data"
      >
        <Transactions class="transactions"></Transactions>
        <Candles class="candles"></Candles>
        <Reserves class="reserves"></Reserves>
        <Volume class="volumes"></Volume>
        <Balances class="balances"></Balances>
        <Bonding class="bonding"></Bonding>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { $ref } from "vue/macros";
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
  getReserves,
  getTransactions,
  getVolumes,
} from "@/Pages/CurveMonitor/DataLoaders";

const host = "https://ws.llama.airforce:2053";
const poolService = new PoolService(host);
const reservesSerice = new ReservesService(getHost());
const volumeService = new VolumeService(getHost());
let candleService = new CandleService(host, "0x0");
let transactionService = new TransactionService(host, "0x0");

// Refs.
const store = useCurveMonitorStore();

let pool = $ref("");
let poolSelected: Pool | null = $ref(null);

// Events
const onSelect = (option: unknown): void => {
  const poolNew = option as Pool;

  pool = shorten(poolNew.name);
  poolSelected = poolNew;

  void getReserves(store, reservesSerice, poolNew);
  void getVolumes(store, volumeService, poolNew);

  // TODO: reuse same socket, connect and close that, not the service.

  // New pool, new transaction service.
  transactionService.close();
  transactionService = new TransactionService(
    host,
    "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD"
  );
  void getTransactions(store, transactionService);
  transactionService.connect();

  // New pool, new candle service.
  candleService.close();
  candleService = new CandleService(
    host,
    "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD"
  );
  void getCandles(store, candleService);
  candleService.connect();
};

// Hooks
onMounted(() => {
  poolService.connect();
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("curve-monitor");

@keyframes pulse {
  0% {
    transform: scale(0.94);
  }

  70% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.94);
  }
}

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
  gap: 8rem;
  justify-self: center;

  &:not(.hasPool) {
    .logo {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;

      img {
        height: 128px;
        object-fit: contain;
        justify-self: end;
        margin-right: 3rem;

        transform: scale(1);
        animation: pulse 2s infinite;
      }

      span {
        font-size: 3rem;
      }
    }

    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  width: 600px;

  @media only screen and (max-width: 1280px) {
    width: calc(80% - 2rem);
    padding: 0 1rem;
    gap: 10rem;
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
