<script setup lang="ts">
import type { Chain } from "@/Framework/Types/Chain";
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
        type="percentage"
        :value="100 * (market?.rate ?? 0)"
      />
    </KPI>

    <KPI
      style="grid-area: kpi2"
      label="Borrowed"
      :has-value="!!market"
    >
      <AsyncValue
        type="dollar"
        :value="market?.borrowed"
      />
    </KPI>

    <KPI
      style="grid-area: kpi3"
      label="Borrowable"
      :has-value="!!market"
    >
      <AsyncValue
        type="dollar"
        :value="market?.borrowable"
      />
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
    />

    <ChartMarketAvailableCap
      style="grid-area: cap"
      :market
    />

    <ChartMarketLoans
      style="grid-area: loans"
      :market
    />

    <ChartMarketVolume
      style="grid-area: volume"
      :market
      :chain
    />

    <Properties
      style="grid-area: properties"
      :market
      :chain
    />

    <Addresses
      style="grid-area: addresses"
      :market
      :chain
    />
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
