<template>
  <div class="curve-monitor">
    <Header
      class="header"
      :pool-service="poolService"
    ></Header>

    <div
      v-if="hasPool"
      class="data"
    >
      <Controls class="controls"></Controls>
      <Prices class="prices"></Prices>
      <Transactions class="transactions"></Transactions>
      <Balances class="balances"></Balances>
      <TVL class="tvl"></TVL>
      <Bonding class="bonding"></Bonding>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pool } from "@CM/Models";
import { PoolService, createSocketRoot } from "@CM/Services/MonitorLegacy";
import { useMonitorStore } from "@CM/Pages/Platform/MonitorLegacy/Store";
import Header from "@CM/Pages/Platform/Monitor/Components/Header.vue";
import Controls from "@CM/Pages/Platform/Monitor/Components/Controls.vue";
import Transactions from "@CM/Pages/Platform/Monitor/Components/Transactions.vue";
import TVL from "@CM/Pages/Platform/Monitor/Components/TVL.vue";
import Bonding from "@CM/Pages/Platform/Monitor/Components/Bonding.vue";
import Balances from "@CM/Pages/Platform/Monitor/Components/Balances.vue";
import Prices from "@CM/Pages/Platform/Monitor/Components/Prices.vue";
import { loadPool } from "@CM/Pages/Platform/MonitorLegacy/DataLoaders";

const host = "https://ws.llama.airforce:2053";
const socket = createSocketRoot(host);

const poolService = new PoolService(socket);

// Refs.
const router = useRouter();
const store = useMonitorStore();
store.socket = socket;

const pool = useRouteParams<string>("pool");

const hasPool = computed((): boolean => store.pool !== null);

let poolConnected = "";

// Hooks
onMounted(async () => {
  // Navigate to pool from URL address if set.
  await onNewPoolRoute(pool.value);

  socket.connect();
});

// Methods
const onNewPool = async (poolNew: Pool, updateUrl: boolean): Promise<void> => {
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
whenever(
  () => store.pool,
  async (pool) => {
    await onNewPool(pool, true);
  }
);

watch(pool, async (pool) => {
  await onNewPoolRoute(pool);
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("curve-monitor");

.curve-monitor {
  max-width: calc(1920px - 18.125rem);
  gap: 0;
}

.data {
  @include dashboard-grid;

  grid-template-rows: auto 350px 350px auto;
  grid-template-columns: repeat(6, 1fr);

  @media only screen and (max-width: 1280px) {
    padding-top: 0;
  }

  .controls {
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
</style>
