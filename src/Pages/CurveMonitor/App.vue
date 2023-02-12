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

        <Status :status-service="statusService"></Status>
      </div>

      <div
        v-if="poolSelected"
        class="data"
      >
        <Prices class="prices"></Prices>
        <Transactions class="transactions"></Transactions>
        <Balances class="balances"></Balances>
        <TVL class="tvl"></TVL>
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
import TVL from "@/Pages/CurveMonitor/Components/TVL.vue";
import Bonding from "@/Pages/CurveMonitor/Components/Bonding.vue";
import Balances from "@/Pages/CurveMonitor/Components/Balances.vue";
import Prices from "@/Pages/CurveMonitor/Components/Prices.vue";
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
    gap: 0;
    padding-top: 0;
  }
}

.top {
  &:not(.hasPool) {
    display: flex;
    flex-direction: column;
    justify-self: center;
    gap: 8rem;
    width: 600px;

    position: absolute;
    top: 22%;
    left: 50%;

    @media only screen and (max-width: 1280px) {
      width: calc(80% - 2rem);
      padding: 0 1rem;
      gap: 10rem;
      align-self: center;
    }

    .logo,
    .search {
      transform: translateY(-50%) translateX(-50%);
    }

    .logo {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      align-self: auto;

      img {
        height: 128px;
        object-fit: contain;
        justify-self: end;
        margin-right: 3rem;
      }

      span {
        font-size: 3rem;
      }
    }

    .status {
      position: fixed;
      top: 0.5rem;
      right: 1rem;

      @media only screen and (max-width: 1280px) {
        position: absolute;
        right: 50%;
      }
    }
  }

  background: $background-color;
  position: sticky;
  top: 0;
  padding: 1.5rem 0;
  z-index: 1;

  display: grid;
  grid-template-columns: 1fr 600px 1fr;

  @media only screen and (max-width: 1280px) {
    padding: 1.5rem 1rem;
  }

  .logo {
    grid-column: 1;

    display: flex;
    align-items: center;
    align-self: center;
    gap: 1rem;
    height: 30px;

    img {
      height: 30px;
      object-fit: contain;

      transform: scale(1);
      animation: pulse 2s infinite;
    }

    span {
      display: flex;
      align-items: center;
    }
  }

  .search {
    grid-column: 2;

    &.hasPool {
      margin-top: 0;
    }
  }

  .status {
    grid-column: 3;

    display: flex;
    align-items: center;
    justify-self: end;
  }
}

.data {
  @include dashboard-grid;

  grid-template-rows: 350px auto 350px auto;
  grid-template-columns: repeat(6, 1fr);

  @media only screen and (max-width: 1280px) {
    padding-top: 0;
  }

  .transactions {
    grid-row: 4;
    grid-column: 1 / -1;
  }

  .prices {
    grid-row: 1;
    grid-column: 1 / -1;
  }

  .bonding {
    grid-row: 3;
    grid-column: 4 / -1;
  }

  .balances {
    grid-row: 2;
    grid-column: 1 / -1;
  }

  .tvl {
    grid-row: 3;
    grid-column: 1 / 4;
  }
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
}
</style>
