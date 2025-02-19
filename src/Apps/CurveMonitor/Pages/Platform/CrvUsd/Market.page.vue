<script setup lang="ts">
import { useQueryMarkets } from "@CM/queries/crvusd";
import MarketOverview from "./Tabs/MarketOverview.vue";
import Liquidations from "./Tabs/Liquidations.vue";
import Trading from "./Tabs/Trading.vue";

// Market
const marketAddr = useRouteParams<string>("marketAddr");
const { isFetching: loading, data: markets } = useQueryMarkets();

const market = computed(() =>
  markets.value.find((market) => market.address === marketAddr.value)
);

const { crumbs } = storeToRefs(useBreadcrumbStore());
watch(
  market,
  (market) => {
    crumbs.value = [
      {
        id: "crvusd",
        label: "crvUSD",
        pathName: "crvusd",
      },
      {
        id: "market",
        label: `Market: ${market?.name ?? "?"}`,
      },
    ];
  },
  { immediate: true }
);

// Tabs
const { tabActive, tabActiveIndex } = useTabNavigation(
  ["overview", "trading", "liquidations"],
  "crvusdmarket",
  () => ({
    marketAddr: marketAddr.value,
  })
);
</script>

<template>
  <div class="dashboard">
    <Spinner :loading />

    <TabView
      v-if="!loading && market"
      :active="tabActiveIndex"
      @tab="tabActiveIndex = $event.index"
    >
      <TabItem header="Overview">
        <KeepAlive>
          <MarketOverview
            v-if="tabActive === 'overview'"
            chain="ethereum"
            :market
          />
        </KeepAlive>
      </TabItem>

      <TabItem header="Trading">
        <KeepAlive>
          <Trading
            v-if="tabActive === 'trading'"
            chain="ethereum"
            :market
          />
        </KeepAlive>
      </TabItem>

      <TabItem header="Liquidations">
        <KeepAlive>
          <Liquidations
            v-if="tabActive === 'liquidations'"
            chain="ethereum"
            :market
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
