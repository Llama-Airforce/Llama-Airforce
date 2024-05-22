<template>
  <div class="market">
    <ChartMarketRates
      style="grid-area: rates"
      :market
    ></ChartMarketRates>

    <ChartMarketAvailableCap
      style="grid-area: cap"
      :market
    ></ChartMarketAvailableCap>

    <ChartMarketLoans
      style="grid-area: loans"
      :market
    ></ChartMarketLoans>

    <ChartMarketVolume
      style="grid-area: volume"
      :market
      :chain
    ></ChartMarketVolume>

    <Properties
      style="grid-area: properties"
      :market
      :chain
    ></Properties>

    <Addresses
      style="grid-area: addresses"
      :market
      :chain
    ></Addresses>
  </div>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import type { Market } from "@CM/Services/CrvUsd";
import {
  ChartMarketVolume,
  ChartMarketLoans,
  ChartMarketRates,
  ChartMarketAvailableCap,
} from "@CM/Pages/Platform/CrvUsd/Charts";
import { Properties, Addresses } from "@CM/Pages/Platform/CrvUsd/Components";

// Props
interface Props {
  market: Market | undefined;
  chain: Chain | undefined;
}

const { market, chain } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.market {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: repeat(4, 1fr);

  grid-template-areas:
    "rates rates cap cap"
    "loans loans volume volume"
    "properties properties addresses addresses";
}
</style>
