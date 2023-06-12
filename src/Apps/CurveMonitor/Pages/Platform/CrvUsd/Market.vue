<template>
  <div class="market">
    <Breadcrumb
      :crumbs="crumbs"
      @crumb="onCrumb"
    ></Breadcrumb>

    <div class="row">
      <ChartMarketVolume :market="market"></ChartMarketVolume>
      <ChartMarketRates :market="market"></ChartMarketRates>
      <ChartMarketLoans :market="market"></ChartMarketLoans>
    </div>

    <ChartMarketDeciles :market="market"></ChartMarketDeciles>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Breadcrumb, type Crumb } from "@/Framework";
import ChartMarketVolume from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketVolume.vue";
import ChartMarketLoans from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketLoans.vue";
import ChartMarketRates from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketRates.vue";
import ChartMarketDeciles from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketDeciles.vue";

// Refs
const route = useRoute();
const router = useRouter();

const market = computed(() => route.params.marketAddr as string);

const crumbs = ref<Crumb[]>([
  {
    id: "crvusd",
    label: "crvUSD",
  },
  {
    id: "market",
    label: `Market: ${market?.value}`,
  },
]);

// Methods
const onCrumb = async (crumb: Crumb) => {
  if (crumb.id === "crvusd") {
    await router.push({ name: "crvusd" });
  }
};
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
