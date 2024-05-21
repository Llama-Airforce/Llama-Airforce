<template>
  <div class="trading">
    <ChartOHLC
      style="grid-area: ohlc"
      endpoint="crvusd"
      :llamma
      :chain
    ></ChartOHLC>

    <TableTrades
      style="grid-area: trades"
      endpoint="crvusd"
      :llamma
      :chain
    ></TableTrades>

    <TableEvents
      style="grid-area: events"
      endpoint="crvusd"
      :llamma
      :chain
    ></TableEvents>
  </div>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Services/CrvUsd";
import { ChartOHLC, TableTrades, TableEvents } from "@CM/Components/Llamma";

// Props
interface Props {
  market: Market | undefined;
  chain: Chain | undefined;
}

const { market, chain } = defineProps<Props>();

const llamma = computed(() => market?.llamma);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.trading {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;

  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto;

  grid-template-areas:
    "ohlc ohlc"
    "trades events";
}
</style>

<i18n lang="yaml" locale="en">
oracle: Oracle price
amm: AMM price
</i18n>
