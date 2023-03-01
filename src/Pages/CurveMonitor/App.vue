<template>
  <div class="curve-monitor">
    <div class="dashboard">
      <Controls
        :status-service="statusService"
        :pool-service="poolService"
      ></Controls>

      <div
        v-if="hasPool"
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
import { onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
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
const route = useRoute();
const router = useRouter();
const store = useCurveMonitorStore();
store.socket = socket;

const hasPool = computed((): boolean => store.pool !== null);

let poolConnected = "";

// Hooks
onMounted(async () => {
  // Navigate to pool from URL address if set.
  const routePool = route.params.pool;
  await onNewPoolRoute(routePool);

  socket.connect();
});

// Methods
const onNewPool = async (
  option: unknown,
  updateUrl: boolean
): Promise<void> => {
  const poolNew = option as Pool;

  // Don't do anything if 'new' pool is already loaded.
  if (poolConnected === poolNew.id) {
    return;
  }

  store.pool = {
    id: "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD",
    name: "susd",
  };

  store.socketPool?.close();
  store.socketPool = loadPool(store, host, store.pool.id);
  poolConnected = store.pool.id;

  if (updateUrl) {
    await router.push({
      name: "curvemonitor",
      params: { pool: store.pool.id },
    });
  }
};

const onNewPoolRoute = async (routePool: string | string[]) => {
  if (routePool && typeof routePool === "string") {
    const option: Pool = {
      id: routePool,
      name: "???",
    };
    await onNewPool(option, false);
  }
};

// Watches
watch(
  () => store.pool,
  async (newPool) => {
    await onNewPool(newPool, true);
  }
);

watch(
  () => route.params,
  async (newPool) => {
    const routePool = newPool.pool;
    await onNewPoolRoute(routePool);
  }
);
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

  grid-template-rows: auto 350px 350px auto;
  grid-template-columns: repeat(6, 1fr);

  @media only screen and (max-width: 1280px) {
    padding-top: 0;
  }

  .sandwiches {
    grid-row: 1;
    grid-column: 1 / -1;
  }

  .transactions {
    grid-row: 4;
    grid-column: 1 / -1;
  }

  .prices {
    grid-row: 2;
    grid-column: 1 / 4;
    min-height: 350px;
  }

  .bonding {
    grid-row: 2;
    grid-column: 4 / -1;
    min-height: 350px;
  }

  .balances {
    grid-row: 3;
    grid-column: 1 / 4;
    min-height: 350px;
  }

  .tvl {
    grid-row: 3;
    grid-column: 4 / -1;
    min-height: 350px;
  }
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
}
</style>
