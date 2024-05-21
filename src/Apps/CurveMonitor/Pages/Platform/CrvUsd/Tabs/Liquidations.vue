<template>
  <div class="liquidations">
    <LiquidationOverview :market></LiquidationOverview>
    <ChartLiquidationSoftLiquidation :market></ChartLiquidationSoftLiquidation>
    <ChartLiquidationMedianLoss :market></ChartLiquidationMedianLoss>

    <ChartLiquidationProportionLosers
      :market
    ></ChartLiquidationProportionLosers>

    <ChartLiquidationAverageHealth :market></ChartLiquidationAverageHealth>
    <ChartLiquidationHealthDeciles :market></ChartLiquidationHealthDeciles>
    <ChartLiquidationCollateralRatio :market></ChartLiquidationCollateralRatio>

    <ChartLiquidationHistorical :market></ChartLiquidationHistorical>
    <TableLiquidationLiquidators :market></TableLiquidationLiquidators>

    <ChartLiquidationLiquidatorRevenue
      :market
    ></ChartLiquidationLiquidatorRevenue>
  </div>
</template>

<script setup lang="ts">
import type { Market } from "@CM/Services/CrvUsd";
import LiquidationOverview from "@CM/Pages/Platform/CrvUsd/Components/LiquidationOverview.vue";
import {
  ChartLiquidationSoftLiquidation,
  ChartLiquidationMedianLoss,
  ChartLiquidationAverageHealth,
  ChartLiquidationHealthDeciles,
  ChartLiquidationProportionLosers,
  ChartLiquidationHistorical,
  ChartLiquidationLiquidatorRevenue,
  ChartLiquidationCollateralRatio,
} from "@CM/Pages/Platform/CrvUsd/Charts";
import { TableLiquidationLiquidators } from "@CM/Pages/Platform/CrvUsd/Tables";

// Props
interface Props {
  market: Market | undefined;
}

const { market } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.liquidations {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
