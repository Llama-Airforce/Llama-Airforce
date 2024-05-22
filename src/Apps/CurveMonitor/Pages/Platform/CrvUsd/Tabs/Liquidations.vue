<template>
  <div class="liquidations">
    <TableLiqOverview
      :market
      :chain
    ></TableLiqOverview>

    <ChartLiqSoftLiqRatio
      :market
      :chain
    ></ChartLiqSoftLiqRatio>

    <ChartLiqMedianLoss
      :market
      :chain
    ></ChartLiqMedianLoss>

    <ChartLiqLosersProportion
      :market
      :chain
    ></ChartLiqLosersProportion>

    <ChartLiquidationAverageHealth :market></ChartLiquidationAverageHealth>

    <ChartLiqHealthDeciles
      :market
      :chain
    ></ChartLiqHealthDeciles>

    <ChartLiquidationCollateralRatio :market></ChartLiquidationCollateralRatio>

    <ChartLiqs
      :market
      :chain
    ></ChartLiqs>

    <TableTopLiquidators
      :market
      :chain
    ></TableTopLiquidators>

    <ChartLiquidationLiquidatorRevenue
      :market
    ></ChartLiquidationLiquidatorRevenue>
  </div>
</template>

<script setup lang="ts">
import type { Chain } from "@CM/Models/Chain";
import type { Market } from "@CM/Services/CrvUsd";
import {
  ChartLiqSoftLiqRatio,
  ChartLiqMedianLoss,
  ChartLiquidationAverageHealth,
  ChartLiqHealthDeciles,
  ChartLiqLosersProportion,
  ChartLiqs,
  ChartLiquidationLiquidatorRevenue,
  ChartLiquidationCollateralRatio,
} from "@CM/Pages/Platform/CrvUsd/Charts";
import {
  TableTopLiquidators,
  TableLiqOverview,
} from "@CM/Pages/Platform/CrvUsd/Tables";

// Props
interface Props {
  market: Market | undefined;
  chain: Chain | undefined;
}

const { market } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.liquidations {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
}
</style>
