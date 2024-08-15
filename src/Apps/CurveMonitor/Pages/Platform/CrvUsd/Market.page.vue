<template>
  <div class="market-overview">
    <Spinner
      class="spinner"
      :class="{ loading }"
    ></Spinner>

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
            chain="ethereum"
          ></MarketOverview>
        </KeepAlive>
      </TabItem>

      <TabItem header="Trading">
        <KeepAlive>
          <Trading
            v-if="tabActive === 'trading'"
            :market
            chain="ethereum"
          ></Trading>
        </KeepAlive>
      </TabItem>

      <TabItem header="Liquidations">
        <KeepAlive>
          <Liquidations
            v-if="tabActive === 'liquidations'"
            :market
            chain="ethereum"
          ></Liquidations>
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import { useQueryMarkets } from "@CM/Services/CrvUsd/Queries";
import MarketOverview from "@CM/Pages/Platform/CrvUsd/Tabs/MarketOverview.vue";
import Liquidations from "@CM/Pages/Platform/CrvUsd/Tabs/Liquidations.vue";
import Trading from "@CM/Pages/Platform/CrvUsd/Tabs/Trading.vue";

const { show: showCrumbs, crumbs } = storeToRefs(useBreadcrumbStore());

// Market
const marketAddr = useRouteParams<string>("marketAddr");
const { isFetching: loading, data: markets } = useQueryMarkets();

const market = computed(() =>
  markets.value.find((market) => market.address === marketAddr.value)
);

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

// Hooks
onMounted(() => {
  showCrumbs.value = true;
});

// Tabs
const { tabActive, tabActiveIndex } = useTabNavigation(
  ["overview", "trading", "liquidations"],
  "crvusdmarket",
  () => ({
    marketAddr: marketAddr.value,
  })
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("market-overview");

.market-overview {
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
