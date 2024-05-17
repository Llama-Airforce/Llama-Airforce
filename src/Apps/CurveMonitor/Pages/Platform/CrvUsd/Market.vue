<template>
  <div class="market-overview">
    <Spinner
      class="spinner"
      :class="{ loading }"
    ></Spinner>

    <TabView
      v-if="!loading && market"
      :active="tabActive"
      @tab="tabActive = $event.index"
    >
      <TabItem header="Overview">
        <KeepAlive>
          <MarketOverview
            v-if="tabActive === 0"
            :market="market"
          ></MarketOverview>
        </KeepAlive>
      </TabItem>

      <TabItem header="Liquidations">
        <KeepAlive>
          <Liquidations
            v-if="tabActive === 1 && market"
            :market="market"
          ></Liquidations>
        </KeepAlive>
      </TabItem>

      <TabItem header="Llamma">
        <KeepAlive>
          <Llamma
            v-if="tabActive === 2 && market"
            :market="market"
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

// Refs
const router = useRouter();

type Tabs = "overview" | "liquidations" | "llamma";
const tab = useRouteParams<Tabs>("tab", "overview");
const tabActive = ref(0);

const marketAddr = useRouteParams<string>("marketAddr");

const storeBreadcrumb = useBreadcrumbStore();
const storeCrvUsd = useCrvUsdStore();

// Market
const { isFetching: loading, data: markets } = useQueryMarkets();
const market = computed(() =>
  markets.value.find((market) => market.address === marketAddr.value)
);
watch(
  market,
  (newMarket) => {
    if (newMarket) {
      storeCrvUsd.market = newMarket;
      storeBreadcrumb.crumbs = [
        {
          id: "crvusd",
          label: "crvUSD",
          pathName: "crvusd",
        },
        {
          id: "market",
          label: `Market: ${market.value?.name ?? "?"}`,
        },
      ];
    }
  },
  { immediate: true }
);

// Hooks
onMounted(() => {
  if (tab.value === "liquidations") {
    tabActive.value = 1;
  } else if (tab.value === "llamma") {
    tabActive.value = 2;
  }

  storeBreadcrumb.show = true;
});

// Watches
watch(tabActive, async (newTab) => {
  if (newTab === 0) {
    await router.push({
      name: "crvusdmarket",
      params: { tab: "", marketAddr: marketAddr.value },
    });
  } else if (newTab === 1) {
    await router.push({
      name: "crvusdmarket",
      params: { tab: "liquidations", marketAddr: marketAddr.value },
    });
  } else if (newTab === 2) {
    await router.push({
      name: "crvusdmarket",
      params: { tab: "llamma", marketAddr: marketAddr.value },
    });
  }
});
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
