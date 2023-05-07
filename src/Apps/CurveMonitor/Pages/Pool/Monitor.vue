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
      <Sandwiches class="sandwiches"></Sandwiches>
      <Prices class="prices"></Prices>
      <Transactions class="transactions"></Transactions>
      <Balances class="balances"></Balances>
      <TVL class="tvl"></TVL>
      <Bonding class="bonding"></Bonding>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Pool } from "@CM/Models";
import { useCurveMonitorStore } from "@CM/Store";
import Header from "@CM/Pages/Pool/Components/Header.vue";
import Controls from "@CM/Pages/Pool/Components/Controls.vue";
import Sandwiches from "@CM/Pages/Pool/Components/Sandwiches.vue";
import Transactions from "@CM/Pages/Pool/Components/Transactions.vue";
import TVL from "@CM/Pages/Pool/Components/TVL.vue";
import Bonding from "@CM/Pages/Pool/Components/Bonding.vue";
import Balances from "@CM/Pages/Pool/Components/Balances.vue";
import Prices from "@CM/Pages/Pool/Components/Prices.vue";
import { PoolService } from "@CM/Services";
import { loadPool } from "@CM/DataLoaders";
import { createSocketRoot } from "@CM/Services/Sockets";

const host = "https://ws.llama.airforce:2053";
const socket = createSocketRoot(host);

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
  max-width: calc(1920px - 18.125rem);
  gap: 0;

  .header {
    margin-bottom: var(--dashboard-gap);
  }
}

.data {
  @include dashboard-grid;

  grid-template-rows: auto auto 350px 350px auto;
  grid-template-columns: repeat(6, 1fr);

  @media only screen and (max-width: 1280px) {
    padding-top: 0;
  }

  .controls {
    grid-row: 1;
    grid-column: 1 / -1;
  }

  .sandwiches {
    grid-row: 2;
    grid-column: 1 / -1;
  }

  .transactions {
    grid-row: 5;
    grid-column: 1 / -1;
  }

  .prices {
    grid-row: 3;
    grid-column: 1 / 4;
    min-height: 350px;
  }

  .bonding {
    grid-row: 3;
    grid-column: 4 / -1;
    min-height: 350px;
  }

  .balances {
    grid-row: 4;
    grid-column: 1 / 4;
    min-height: 350px;
  }

  .tvl {
    grid-row: 4;
    grid-column: 4 / -1;
    min-height: 350px;
  }
}
</style>
