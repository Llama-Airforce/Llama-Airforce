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
            :chain
          ></MarketOverview>
        </KeepAlive>
      </TabItem>

      <TabItem header="Liquidations">
        <KeepAlive>
          <Liquidations
            v-if="tabActive === 'liquidations'"
            :market
            :chain
          ></Liquidations>
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import { useQueryMarkets } from "@CM/Services/LlamaLend/Queries";
import MarketOverview from "@CM/Pages/Platform/LlamaLend/MarketOverview.vue";
import Liquidations from "@CM/Pages/Platform/LlamaLend/Liquidations.vue";

const { show: showCrumbs, crumbs } = storeToRefs(useBreadcrumbStore());

// Markets
const chain = useRouteParams<Chain>("chain");
const marketAddr = useRouteParams<string>("marketAddr");
const { isFetching: loading, data: markets } = useQueryMarkets(chain);

const market = computed(() =>
  markets.value?.find((market) => market.controller === marketAddr.value)
);

watch(
  market,
  (newMarket) => {
    crumbs.value = [
      {
        id: "llamalend",
        label: "Llama Lend",
        pathName: "llamalend",
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
  ["overview", "liquidations"],
  "llamalendmarket",
  () => ({
    chain: chain.value,
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
