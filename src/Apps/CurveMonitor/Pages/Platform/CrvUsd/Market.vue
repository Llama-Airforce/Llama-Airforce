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
          ></MarketOverview>
        </KeepAlive>
      </TabItem>

      <TabItem header="Liquidations">
        <KeepAlive>
          <Liquidations
            v-if="tabActive === 'liquidations' && market"
            :market
          ></Liquidations>
        </KeepAlive>
      </TabItem>

      <TabItem header="Llamma">
        <KeepAlive>
          <Llamma
            v-if="tabActive === 'llamma' && market"
            :market
          ></Llamma>
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import { useQueryMarkets } from "@CM/Services/CrvUsd/Queries";
import { useCrvUsdStore } from "@CM/Pages/Platform/CrvUsd/Store";
import MarketOverview from "@CM/Pages/Platform/CrvUsd/MarketOverview.vue";
import Liquidations from "@CM/Pages/Platform/CrvUsd/Liquidations.vue";
import Llamma from "@CM/Pages/Platform/CrvUsd/Llamma.vue";

const { show: showCrumbs, crumbs } = storeToRefs(useBreadcrumbStore());

// Market
const marketAddr = useRouteParams<string>("marketAddr");
const { market } = storeToRefs(useCrvUsdStore());
const { isFetching: loading, data: markets } = useQueryMarkets();

const marketFromRoute = computed(() =>
  markets.value.find((market) => market.address === marketAddr.value)
);

watch(
  marketFromRoute,
  (newMarket) => {
    market.value = newMarket;
    crumbs.value = [
      {
        id: "crvusd",
        label: "crvUSD",
        pathName: "crvusd",
      },
      {
        id: "market",
        label: `Market: ${newMarket?.name ?? "?"}`,
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
  ["overview", "liquidations", "llamma"],
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
