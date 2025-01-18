<script setup lang="ts">
import type { Chain } from "@/Types/Chain";
import { useQueryPool } from "@CM/Services/pools/queries";
import PoolOverview from "./Tabs/PoolOverview.vue";
import MEV from "./Tabs/MEV.vue";

// Markets
const chain = useRouteParams<Chain>("chain");
const poolAddr = useRouteParams<string>("poolAddr");
const { isFetching: loading, data: pool } = useQueryPool(chain, poolAddr.value);

const { crumbs } = storeToRefs(useBreadcrumbStore());
watch(
  pool,
  (pool) => {
    crumbs.value = [
      {
        id: "pools",
        label: "Pools",
        pathName: "pools",
        params: () => ({
          chain: chain.value,
        }),
      },
      {
        id: "pool",
        label: `Pool: ${pool?.name ?? "?"}`,
      },
    ];
  },
  { immediate: true }
);

// Tabs
const { tabActive, tabActiveIndex } = useTabNavigation(
  ["overview", "mev"],
  "poolspool",
  () => ({
    chain: chain.value,
    poolAddr: poolAddr.value,
  })
);
</script>

<template>
  <div class="dashboard">
    <Spinner :loading />

    <TabView
      v-if="!loading && pool"
      :active="tabActiveIndex"
      @tab="tabActiveIndex = $event.index"
    >
      <TabItem header="Overview">
        <KeepAlive>
          <PoolOverview
            v-if="tabActive === 'overview'"
            :pool
            :chain
          />
        </KeepAlive>
      </TabItem>

      <TabItem
        v-if="chain === 'ethereum' && !!pool"
        header="MEV"
      >
        <KeepAlive>
          <MEV
            v-if="tabActive === 'mev'"
            :pool
          />
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<style scoped>
.dashboard {
  position: relative;
  max-width: calc(1920px - 18.125rem);

  .spinner {
    position: absolute;
    top: 50vh;
    top: 50dvh;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
}
</style>
