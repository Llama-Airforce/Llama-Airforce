<template>
  <div class="curve-monitor">
    <div class="dashboard">
      <Controls
        :status-service="statusService"
        :pool-service="poolService"
        @select="onSelect"
      ></Controls>

      <div
        v-if="poolSelected"
        class="data"
      >
        <Sandwiches class="sandwiches"></Sandwiches>
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
import type { Pool } from "@/Pages/CurveMonitor/Models";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import Controls from "@/Pages/CurveMonitor/Components/Controls.vue";
import Sandwiches from "@/Pages/CurveMonitor/Components/Sandwiches.vue";
import Transactions from "@/Pages/CurveMonitor/Components/Transactions.vue";
import TVL from "@/Pages/CurveMonitor/Components/TVL.vue";
import Bonding from "@/Pages/CurveMonitor/Components/Bonding.vue";
import Balances from "@/Pages/CurveMonitor/Components/Balances.vue";
import Prices from "@/Pages/CurveMonitor/Components/Prices.vue";
import { PoolService, StatusService } from "@/Pages/CurveMonitor/Services";
import { loadPool } from "@/Pages/CurveMonitor/DataLoaders";
import { createSocketRoot } from "@/Pages/CurveMonitor/Services/Sockets";

const host = "https://ws.llama.airforce:2053";
const socket = createSocketRoot(host);

const statusService = new StatusService(socket);
const poolService = new PoolService(socket);

// Refs.
const store = useCurveMonitorStore();
store.socket = socket;

let poolSelected: Pool | null = $ref(null);

// Events
const onSelect = (option: unknown): void => {
  const poolNew = option as Pool;

  poolSelected = poolNew;

  store.socketPool?.close();
  store.socketPool = loadPool(
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

.curve-monitor {
  .dashboard {
    gap: 0;
    padding-top: 0;
  }
}

.data {
  @include dashboard-grid;

  grid-template-rows: 350px auto 350px auto auto;
  grid-template-columns: repeat(6, 1fr);

  @media only screen and (max-width: 1280px) {
    padding-top: 0;
  }

  .sandwiches {
    grid-row: 4;
    grid-column: 1 / -1;
  }

  .transactions {
    grid-row: 5;
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
