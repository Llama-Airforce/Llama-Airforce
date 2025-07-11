<script setup lang="ts">
import { useQueryMarkets } from "@CM/queries/llamalend";
import type { Chain } from "@curvefi/prices-api";
import Liquidations from "./Tabs/Liquidations.vue";
import MarketOverview from "./Tabs/MarketOverview.vue";
import Trading from "./Tabs/Trading.vue";
import Users from "./Tabs/Users.vue";

// Markets
const chain = useRouteParams<Chain>("chain");
const marketAddr = useRouteParams<string>("marketAddr");
const { isFetching: loading, data: markets } = useQueryMarkets(chain);

const market = computed(() =>
  markets.value?.find((market) => market.controller === marketAddr.value)
);

const { crumbs } = storeToRefs(useBreadcrumbStore());
watch(
  market,
  (market) => {
    crumbs.value = [
      {
        id: "llamalend",
        label: "Llama Lend",
        pathName: "llamalend",
        params: () => ({
          chain: chain.value,
        }),
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
  ["overview", "trading", "liquidations", "users"],
  "llamalendmarket",
  () => ({
    chain: chain.value,
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
            :market
            :chain
          />
        </KeepAlive>
      </TabItem>

      <TabItem header="Trading">
        <KeepAlive>
          <Trading
            v-if="tabActive === 'trading'"
            :market
            :chain
          />
        </KeepAlive>
      </TabItem>

      <TabItem header="Liquidations">
        <KeepAlive>
          <Liquidations
            v-if="tabActive === 'liquidations'"
            :market
            :chain
          />
        </KeepAlive>
      </TabItem>

      <TabItem header="Users">
        <KeepAlive>
          <Users
            v-if="tabActive === 'users'"
            :market
            :chain
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
