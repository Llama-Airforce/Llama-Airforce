<template>
  <div class="market-overview">
    <TabView
      :active="tabActive"
      @tab="tabActive = $event.index"
    >
      <TabItem header="Overview">
        <KeepAlive>
          <MarketOverview v-if="tabActive === 0" :market="market"></MarketOverview>
        </KeepAlive>
      </TabItem>

      <TabItem header="Liquidations">
        <KeepAlive>
          <Liquidations v-if="tabActive === 1 && market" :market="market"></Liquidations>
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import { getHost } from "@/Services/Host";
import { TabView, TabItem } from "@/Framework";
import { useBreadcrumbStore } from "@CM/Stores/BreadcrumbStore";
import { useCrvUsdStore } from "@CM/Pages/Platform/CrvUsd/Store";
import CurveService from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import MarketOverview from "@CM/Pages/Platform/CrvUsd/MarketOverview.vue";
import Liquidations from "@CM/Pages/Platform/CrvUsd/Liquidations.vue";
const curveService = new CurveService(getHost());

// Refs
const route = useRoute();
const router = useRouter();

const storeBreadcrumb = useBreadcrumbStore();
const storeCrvUsd = useCrvUsdStore();
const tabActive = ref(0);

const marketAddr = computed(() => route.params.marketAddr as string);
const market = computed(() => storeCrvUsd.market);

// Hooks
onMounted(async () => {

  const tabParam = route.params.tab;
  if (tabParam && typeof tabParam === "string") {
    if (tabParam === "liquidations") {
      tabActive.value = 1;
    }
  }

  if (storeCrvUsd.market?.address !== marketAddr.value) {
    const { markets } = await curveService.getMarkets();
    const market = markets.find(
      (market) => market.address === marketAddr.value
    );

    if (market) {
      storeCrvUsd.market = market;
    }
  }

  storeBreadcrumb.show = true;
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

});

// Watches
watch(tabActive, async (newTab) => {
  if (newTab === 0) {
    await router.push({ name: "crvusdmarket", params: { tab: "", marketAddr: marketAddr.value } });
  } else if (newTab === 1) {
    await router.push({ name: "crvusdmarket", params: { tab: "liquidations", marketAddr: marketAddr.value } });
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.market-overview {
  padding-top: 2rem;
  position: relative;
  display: grid;
}
</style>
