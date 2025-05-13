<script setup lang="ts">
import {
  useLeverageDistribution,
  useDebtDistribution,
  useLeverageStats,
  useCollateralRatioDistribution,
} from "@HA/queries/health";
import type { Pair } from "@HA/services/protocols/schema";
import ChartCollateralRatioDistribution from "../charts/ChartCollateralRatioDistribution.vue";
import ChartDebtDistribution from "../charts/ChartDebtDistribution.vue";
import ChartLeverageDistribution from "../charts/ChartLeverageDistribution.vue";
import CollateralRatioKPIs from "../components/CollateralRatioKPIs.vue";
import DebtKPIs from "../components/DebtKPIs.vue";
import LeverageKPIs from "../components/LeverageKPIs.vue";

const { pair } = defineProps<{
  pair: Pair;
}>();

const { isFetching: loadingLeverageDistribution, data: leverageDistribution } =
  useLeverageDistribution(
    toRef(() => ({
      pair_id: pair.pairId,
    }))
  );

const { isFetching: loadingDebtDistribution, data: debtDistribution } =
  useDebtDistribution(
    toRef(() => ({
      pair_id: pair.pairId,
    }))
  );

const { data: leverageStats } = useLeverageStats(
  toRef(() => ({
    pair_id: pair.pairId,
  }))
);

const {
  isFetching: loadingCollateralRatioDistribution,
  data: collaterRatioDistribution,
} = useCollateralRatioDistribution(
  toRef(() => ({
    pair_id: pair.pairId,
  }))
);
</script>

<template>
  <div class="dashboard-grid">
    <div
      style="grid-area: title-leverage-distribution"
      class="title"
    >
      Leverage Distribution
    </div>

    <LeverageKPIs
      style="grid-area: kpis-leverage"
      :leverage="leverageDistribution"
      :leverage-stats
    />

    <ChartLeverageDistribution
      style="grid-area: chart-leverage-distribution"
      :data="leverageDistribution"
      :loading="loadingLeverageDistribution"
    />

    <div
      style="grid-area: title-debt-distribution"
      class="title"
    >
      Debt Distribution
    </div>

    <DebtKPIs
      style="grid-area: kpis-debt"
      :debt="debtDistribution"
    />

    <ChartDebtDistribution
      style="grid-area: chart-debt-distribution"
      :data="debtDistribution"
      :loading="loadingDebtDistribution"
    />

    <div
      style="grid-area: title-collateral-ratio-distribution"
      class="title"
    >
      Collateral Ratio Distribution
    </div>

    <CollateralRatioKPIs
      style="grid-area: kpis-collateral-ratio"
      :collateral-ratio="collaterRatioDistribution"
    />

    <ChartCollateralRatioDistribution
      style="grid-area: chart-collateral-ratio-distribution"
      :data="collaterRatioDistribution"
      :loading="loadingCollateralRatioDistribution"
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: minmax(800px, 2fr) 1fr;
  grid-template-areas:
    "title-leverage-distribution title-leverage-distribution"
    "chart-leverage-distribution kpis-leverage"
    "title-debt-distribution title-debt-distribution"
    "chart-debt-distribution kpis-debt"
    "title-collateral-ratio-distribution title-collateral-ratio-distribution"
    "chart-collateral-ratio-distribution kpis-collateral-ratio";

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}

.kpis {
  @media only screen and (min-width: 1281px) {
    align-items: start;
    align-self: start;
  }
}

.title {
  font-size: 1.5rem;
  margin-bottom: -1rem;
  font-weight: 500;
}
</style>
