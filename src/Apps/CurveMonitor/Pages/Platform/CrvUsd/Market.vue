<template>
  <div class="market">
    <ChartMarketVolume :market="market"></ChartMarketVolume>
    <ChartMarketRates :market="market"></ChartMarketRates>
    <ChartMarketLoans :market="market"></ChartMarketLoans>
    <ChartMarketDeciles :market="market"></ChartMarketDeciles>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getHost } from "@/Services/Host";
import { useBreadcrumbStore } from "@CM/Stores/BreadcrumbStore";
import { useCrvUsdStore } from "@CM/Pages/Platform/CrvUsd/Store";
import ChartMarketVolume from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketVolume.vue";
import ChartMarketLoans from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketLoans.vue";
import ChartMarketRates from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketRates.vue";
import ChartMarketDeciles from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketDeciles.vue";
import CurveService from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const curveService = new CurveService(getHost());

// Refs
const route = useRoute();

const storeBreadcrumb = useBreadcrumbStore();
const storeCrvUsd = useCrvUsdStore();

const marketAddr = computed(() => route.params.marketAddr as string);
const market = computed(() => storeCrvUsd.market);

// Hooks
onMounted(async () => {
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
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("market");

.market {
  max-width: calc(1920px - 18.125rem);

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
