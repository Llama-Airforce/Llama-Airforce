<template>
  <div class="market">
    <div class="row">
      <ChartMarketVolume :market="market"></ChartMarketVolume>
      <ChartMarketRates :market="market"></ChartMarketRates>
      <ChartMarketLoans :market="market"></ChartMarketLoans>
    </div>

    <ChartMarketDeciles :market="market"></ChartMarketDeciles>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useBreadcrumbStore } from "@CM/Stores/BreadcrumbStore";
import ChartMarketVolume from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketVolume.vue";
import ChartMarketLoans from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketLoans.vue";
import ChartMarketRates from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketRates.vue";
import ChartMarketDeciles from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketDeciles.vue";

// Refs
const route = useRoute();

const storeBreadcrumb = useBreadcrumbStore();

const market = computed(() => route.params.marketAddr as string);

// Hooks
onMounted(() => {
  storeBreadcrumb.show = true;
  storeBreadcrumb.crumbs = [
    {
      id: "crvusd",
      label: "crvUSD",
      pathName: "crvusd",
    },
    {
      id: "market",
      label: `Market: ${market?.value}`,
    },
  ];
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("market");

.market {
  max-width: calc(1920px - 18.125rem);

  .row {
    display: flex;
    gap: var(--dashboard-gap);

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
    }

    div {
      flex-grow: 1;
    }
  }
}
</style>
