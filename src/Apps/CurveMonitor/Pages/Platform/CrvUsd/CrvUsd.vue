<template>
  <div class="crvusd">
    <div class="col">
      <TableMarkets @selected="onMarketSelect"></TableMarkets>
      <ChartCrvUsdPriceHistogram class="price"></ChartCrvUsdPriceHistogram>
    </div>

    <div class="col">
      <TablePoolStats></TablePoolStats>
      <ChartPoolPrices></ChartPoolPrices>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import TableMarkets from "@CM/Pages/Platform/CrvUsd/Tables/TableMarkets.vue";
import TablePoolStats from "@CM/Pages/Platform/CrvUsd/Tables/TablePoolStats.vue";
import ChartPoolPrices from "@CM/Pages/Platform/CrvUsd/Charts/ChartPoolPrices.vue";
import ChartCrvUsdPriceHistogram from "@CM/Pages/Platform/CrvUsd/Charts/ChartCrvUsdPriceHistogram.vue";
import type { Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

// Refs
const router = useRouter();

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

  grid-template-columns: 1fr 1fr;

  > .col {
    display: flex;
    flex-direction: column;
    gap: var(--dashboard-gap);

    div {
      flex-grow: 0;
    }
  }
}
</style>
