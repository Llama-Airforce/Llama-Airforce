<script setup lang="ts">
import { type Chain } from "@CM/Models";
import type { Market } from "@CM/Services/CrvUsd";
import {
  ChartMarketVolume,
  ChartMarketLoans,
  ChartMarketRates,
  ChartMarketAvailableCap,
} from "@CM/Pages/Platform/CrvUsd/Charts";
import { Properties, Addresses } from "@CM/Pages/Platform/CrvUsd/Components";

const { market, chain } = defineProps<{
  market: Market | undefined;
  chain: Chain | undefined;
}>();
</script>

<template>
  <div class="dashboard-grid">
    <KPI
      style="grid-area: kpi1"
      label="Borrow Rate"
      :has-value="!!market"
    >
      <AsyncValue
        :value="100 * (market?.rate ?? 0)"
        type="percentage"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi2"
      label="Borrowed"
      :has-value="!!market"
    >
      <AsyncValue
        :value="market?.borrowed"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi3"
      label="Borrowable"
      :has-value="!!market"
    >
      <AsyncValue
        :value="market?.borrowable"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi4"
      label="Loans"
      :has-value="!!market"
    >
      {{ market?.loans ?? 0 }}
    </KPI>

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

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    "kpi1 kpi2 kpi3 kpi4"
    "rates rates cap cap"
    "loans loans volume volume"
    "properties properties addresses addresses";

  @media only screen and (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "kpi1 kpi2"
      "kpi3 kpi4"
      "rates rates"
      "cap cap"
      "loans loans"
      "volume volume"
      "properties properties"
      "addresses addresses";
  }
}
</style>
