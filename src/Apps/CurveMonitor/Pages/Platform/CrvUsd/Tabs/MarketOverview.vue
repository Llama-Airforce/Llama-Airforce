<template>
  <div class="market">
    <ChartMarketRates :market></ChartMarketRates>
    <ChartMarketAvailableCap :market></ChartMarketAvailableCap>
    <ChartMarketLoans :market></ChartMarketLoans>
    <ChartMarketVolume :market></ChartMarketVolume>
  </div>
</template>

<script setup lang="ts">
import type { Market } from "@CM/Services/CrvUsd";
import {
  ChartMarketVolume,
  ChartMarketLoans,
  ChartMarketRates,
  ChartMarketAvailableCap,
} from "@CM/Pages/Platform/CrvUsd/Charts";

// Props
interface Props {
  market: Market | undefined;
}

const { market } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.market {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
