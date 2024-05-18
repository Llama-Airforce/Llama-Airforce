<template>
  <div class="market">
    <KPI
      style="grid-area: kpi1"
      :label="t('borrow-apy')"
      :has-value="!!market"
    >
      <AsyncValue
        :value="market?.borrow_apy"
        type="percentage"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi2"
      :label="t('lend-apy')"
      :has-value="!!market"
    >
      <AsyncValue
        :value="market?.lend_apy"
        type="percentage"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi3"
      :label="t('loans')"
      :has-value="!!market"
    >
      {{ market?.n_loans ?? 0 }}
    </KPI>

    <KPI
      style="grid-area: kpi4"
      :label="t('tvl')"
      :has-value="!!market"
    >
      <AsyncValue
        :value="tvl(market)"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <ChartMarketRates
      style="grid-area: rates"
      :market
      :chain
    ></ChartMarketRates>

    <ChartMarketLoans
      style="grid-area: loans"
      :market
      :chain
    ></ChartMarketLoans>

    <Addresses
      style="grid-area: addresses"
      :market
    ></Addresses>
  </div>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import { type Market, tvl } from "@CM/Services/LlamaLend";

import ChartMarketLoans from "@CM/Pages/Platform/LlamaLend/Charts/ChartMarketLoans.vue";
import ChartMarketRates from "@CM/Pages/Platform/LlamaLend/Charts/ChartMarketRates.vue";
import Addresses from "@CM/Pages/Platform/LlamaLend/Addresses.vue";

const { t } = useI18n();

// Props
interface Props {
  market?: Market;
  chain?: Chain;
}

const { market, chain } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.market {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;

  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto 1fr 1fr;

  grid-template-areas:
    "kpi1 kpi2 kpi3 kpi4"
    "rates rates loans loans"
    "addresses addresses . .";
}
</style>

<i18n lang="yaml" locale="en">
borrow-apy: Borrow APY
lend-apy: Lend APY
loans: Loans
tvl: TVL
</i18n>
