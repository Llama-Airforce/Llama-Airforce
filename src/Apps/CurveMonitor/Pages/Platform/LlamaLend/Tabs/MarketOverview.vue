<script setup lang="ts">
import { type Chain } from "@CM/Models";
import { type Market, tvl } from "@CM/Services/LlamaLend";
import { useQuerySnapshots } from "@CM/Services/LlamaLend/Queries";
import {
  ChartMarketSupply,
  ChartMarketCollateral,
  ChartMarketLoans,
  ChartMarketRates,
} from "@CM/Pages/Platform/LlamaLend/Charts";
import {
  KPIUsage,
  Addresses,
  Properties,
} from "@CM/Pages/Platform/LlamaLend/Components";
import { ChartCollateralRatio, ChartEquity } from "@CM/Components/Lending";

const { market, chain } = defineProps<{
  market: Market | undefined;
  chain: Chain | undefined;
}>();

// Data
const { isFetching: loadingSnapshots, data: snapshots } = useQuerySnapshots(
  toRef(() => market),
  toRef(() => chain)
);

const collateralRatios = computed(() =>
  snapshots.value.map(
    ({
      timestamp,
      collateralBalanceUsd,
      borrowedBalanceUsd,
      totalDebtUsd,
    }) => ({
      timestamp,
      ratio:
        totalDebtUsd > 0
          ? (collateralBalanceUsd + borrowedBalanceUsd) / totalDebtUsd
          : 0,
    })
  )
);

const equity = computed(() =>
  snapshots.value.map(
    ({
      timestamp,
      collateralBalanceUsd,
      borrowedBalanceUsd,
      totalDebtUsd,
    }) => ({
      timestamp,
      equity: collateralBalanceUsd + borrowedBalanceUsd - totalDebtUsd,
    })
  )
);
</script>

<template>
  <div class="dashboard-grid">
    <KPI
      style="grid-area: kpi1"
      label="Borrow APY"
      :has-value="!!market"
    >
      <AsyncValue
        :value="market?.borrow_apy"
        type="percentage"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi2"
      label="Lend APY"
      :has-value="!!market"
    >
      <AsyncValue
        :value="market?.lend_apy"
        type="percentage"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi3"
      label="Loans"
      :has-value="!!market"
    >
      {{ market?.n_loans ?? 0 }}
    </KPI>

    <KPI
      style="grid-area: kpi4"
      label="TVL"
      :has-value="!!market"
    >
      <AsyncValue
        :value="tvl(market)"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <ChartMarketSupply
      style="grid-area: supply"
      :market
      :chain
    ></ChartMarketSupply>

    <ChartMarketCollateral
      style="grid-area: collateral"
      :market
      :chain
    ></ChartMarketCollateral>

    <ChartCollateralRatio
      style="grid-area: colratio"
      :ratios="collateralRatios"
      :loading="loadingSnapshots"
    ></ChartCollateralRatio>

    <ChartEquity
      style="grid-area: equity"
      :equity
      :loading="loadingSnapshots"
    ></ChartEquity>

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

    <Properties
      style="grid-area: properties"
      :market
      :chain
    ></Properties>

    <KPIUsage
      style="grid-area: usage"
      :market
    ></KPIUsage>
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    "usage usage usage usage"
    "kpi1 kpi2 kpi3 kpi4"
    "supply supply collateral collateral"
    "colratio colratio equity equity"
    "rates rates loans loans"
    "properties properties addresses addresses";

  @media only screen and (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "usage usage"
      "kpi1 kpi2"
      "kpi3 kpi4"
      "supply supply"
      "collateral collateral"
      "colratio colratio"
      "equity equity"
      "rates rates"
      "loans loans"
      "properties properties"
      "addresses addresses";
  }
}
</style>
