<template>
  <div class="curve-monitor">
    <div class="dashboard">
      <Status :status-service="statusService"></Status>

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
        <Charts class="charts"></Charts>
        <Transactions class="transactions"></Transactions>
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
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import Status from "@/Pages/CurveMonitor/Components/Status.vue";
import SearchPool from "@/Pages/CurveMonitor/Components/SearchPool.vue";
import Transactions from "@/Pages/CurveMonitor/Components/Transactions.vue";
import Bonding from "@/Pages/CurveMonitor/Components/Bonding.vue";
import Balances from "@/Pages/CurveMonitor/Components/Balances.vue";
import Charts from "@/Pages/CurveMonitor/Components/Charts.vue";
import { PoolService, StatusService } from "@/Pages/CurveMonitor/Services";
import { loadPool } from "@/Pages/CurveMonitor/DataLoaders";
import {
  createSocketPool,
  createSocketRoot,
} from "@/Pages/CurveMonitor/Services/Sockets";

const host = "https://ws.llama.airforce:2053";
const socket = createSocketRoot(host);
let socketPool = createSocketPool(host, "0x0");

const statusService = new StatusService(socket);
const poolService = new PoolService(socket);

// Refs.
const store = useCurveMonitorStore();

let pool = $ref("");
let poolSelected: Pool | null = $ref(null);

// Events
const onSelect = (option: unknown): void => {
  const poolNew = option as Pool;

  pool = shorten(poolNew.name);
  poolSelected = poolNew;

  socketPool.close();
  socketPool = loadPool(
    store,
    host,
    "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD"
  );
};

// Hooks
onMounted(() => {
  socket.connect();
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

.status {
  position: fixed;
  top: 0.5rem;
  right: 1rem;

  @media only screen and (max-width: 1280px) {
    position: absolute;
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
    align-self: center;
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

  grid-template-rows: 450px 400px auto;
  grid-template-columns: repeat(6, 1fr);

  .transactions {
    grid-row: 3;
    grid-column: 1 / -1;
  }

  .charts {
    grid-row: 1;
    grid-column: 1 / -1;
  }

  .bonding {
    grid-row: 2;
    grid-column: 5 / -1;
  }

  .balances {
    grid-row: 2;
    grid-column: 1 / 5;
  }
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
}
</style>
