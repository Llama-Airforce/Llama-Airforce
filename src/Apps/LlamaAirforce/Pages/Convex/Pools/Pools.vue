<template>
  <div class="pools">
    <div class="dashboard">
      <TablePools
        class="datatable-pools"
        :expanded="expanded"
        @selected="onSelected"
      ></TablePools>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useExpansion } from "@/Framework";
import { shorten, longen, minDelay } from "@/Util";
import { getHost } from "@/Services/Host";
import TablePools from "@LAF/Pages/Convex/Pools/Components/TablePools.vue";
import { type Pool } from "@LAF/Pages/Convex/Pools/Models/Pool";
import PoolService from "@LAF/Pages/Convex/Pools/Services/PoolService";
import PoolSnapshotsService from "@LAF/Pages/Convex/Pools/Services/PoolSnapshotsService";
import { useConvexStore } from "@LAF/Pages/Convex/Store";

let isMounted = false;

const poolService = new PoolService(getHost());
const poolSnapshotsService = new PoolSnapshotsService(getHost());

// Refs
const store = useConvexStore();
const route = useRoute();
const router = useRouter();
const { expanded, toggleExpansion } = useExpansion<Pool>();

// Hooks
onMounted(async (): Promise<void> => {
  isMounted = true;
  const resp = await minDelay(poolService.get());

  if (resp) {
    const pools = resp.pools;

    // Order descending by TVL.
    pools.sort((x: Pool, y: Pool) => y.tvl - x.tvl);
    store.pools = pools.filter((pool) => pool.tvl > 1000);

    /*
     * Select first pool by default if none given by the URL.
     * It's possible the component has unmounted before we arrive here.
     */
    if (!isMounted) {
      return;
    }

    const poolParam = route.params.pool;
    if (poolParam && typeof poolParam === "string") {
      routeExpandPool(poolParam);
    }
  }
});

onBeforeUnmount((): void => {
  isMounted = false;
});

// Events
const getSnapshots = async (pool?: Pool): Promise<void> => {
  if (!pool) {
    return;
  }

  // Don't request new snapshots if there's already cached.
  if (store.snapshots[pool.name]) {
    return;
  }

  // Introduce delay so the animation doesn't lag immediately.
  const resp = await minDelay(poolSnapshotsService.get(pool), 500);

  if (resp) {
    const snapshots = resp.data.snapshots;
    store.setSnapshots(pool, snapshots);
  }
};

const routeExpandPool = (poolRoute: string): void => {
  const poolName = longen(poolRoute);
  const poolFound = store.pools.find((pool) => pool.name === poolName);
  if (poolFound) {
    const expanded = toggleExpansion(poolFound);
    if (expanded) {
      void getSnapshots(poolFound);
    }
  }
};

// Events
const onSelected = async (pool: Pool): Promise<void> => {
  const expanded = toggleExpansion(pool);

  if (expanded) {
    void getSnapshots(pool);
    await router.push({
      name: "convexpools",
      params: { pool: shorten(pool.name) },
    });
  }
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("pools");

.pools {
  .dashboard {
    .datatable-pools {
      grid-column: 1;
      grid-row: 1;
    }
  }
}
</style>
