<template>
  <div class="crvusd">
    <TableMarkets
      style="grid-column: 1 / -1"
      @selected="onMarketSelect"
    ></TableMarkets>

    <div class="col">
      <TablePegkeepers></TablePegkeepers>
      <ChartPoolPrices></ChartPoolPrices>
    </div>

    <div class="col">
      <ChartCrvUsdSupply></ChartCrvUsdSupply>
      <ChartCrvUsdPriceHistogram class="price"></ChartCrvUsdPriceHistogram>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useBreadcrumbStore } from "@CM/Stores/BreadcrumbStore";
import TableMarkets from "@CM/Pages/Platform/CrvUsd/Tables/TableMarkets.vue";
import TablePegkeepers from "@CM/Pages/Platform/CrvUsd/Tables/TablePegkeepers.vue";
import ChartPoolPrices from "@CM/Pages/Platform/CrvUsd/Charts/ChartPoolPrices.vue";
import ChartCrvUsdSupply from "@CM/Pages/Platform/CrvUsd/Charts/ChartCrvUsdSupply.vue";
import ChartCrvUsdPriceHistogram from "@CM/Pages/Platform/CrvUsd/Charts/ChartCrvUsdPriceHistogram.vue";
import type { Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

// Refs
const router = useRouter();

const storeBreadcrumb = useBreadcrumbStore();

// Hooks
onMounted(() => {
  storeBreadcrumb.show = true;
  storeBreadcrumb.crumbs = [
    {
      id: "crvusd",
      label: "crvUSD",
      pathName: "crvusd",
    },
  ];
});

// Events
const onMarketSelect = async (market: Market) => {
  await router.push({
    name: "crvusdmarket",
    params: {
      marketAddr: market.address,
    },
  });
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("crvusd");

.crvusd {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 5fr 4fr;

  > .col {
    display: flex;
    flex-direction: column;
    gap: var(--dashboard-gap);

    div {
      flex-grow: 0;
    }
  }

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
