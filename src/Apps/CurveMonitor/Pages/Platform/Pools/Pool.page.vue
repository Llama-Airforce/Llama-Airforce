<script setup lang="ts">
import { type Chain } from "@CM/Models";
import { useQueryPool } from "@CM/Services/Pools/Queries";
import PoolOverview from "@CM/Pages/Platform/Pools/Tabs/PoolOverview.vue";
import MEV from "@CM/Pages/Platform/Pools/Tabs/MEV.vue";

const { show: showCrumbs, crumbs } = storeToRefs(useBreadcrumbStore());

// Markets
const chain = useRouteParams<Chain>("chain");
const poolAddr = useRouteParams<string>("poolAddr");
const { isFetching: loading, data: pool } = useQueryPool(chain, poolAddr.value);

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

// Hooks
onMounted(() => {
  showCrumbs.value = true;
});

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
  <div class="pool">
    <Spinner
      class="spinner"
      :class="{ loading }"
    ></Spinner>

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
          ></PoolOverview>
        </KeepAlive>
      </TabItem>

      <TabItem header="MEV">
        <KeepAlive>
          <MEV
            v-if="tabActive === 'mev'"
            :pool
            :chain
          ></MEV>
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("pool");

.pool {
  position: relative;
  max-width: calc(1920px - 18.125rem);

  .spinner {
    position: absolute;
    top: 50vh;
    top: 50dvh;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);

    @include loading-spinner();
  }
}
</style>
