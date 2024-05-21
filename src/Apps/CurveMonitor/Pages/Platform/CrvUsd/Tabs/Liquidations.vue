<template>
  <div class="liquidations">
    <LiquidationOverview :market></LiquidationOverview>

    <ChartLiqSoftLiqRatio
      :market
      :chain
    ></ChartLiqSoftLiqRatio>

    <ChartLiquidationMedianLoss :market></ChartLiquidationMedianLoss>

    <ChartLiquidationProportionLosers
      :market
    ></ChartLiquidationProportionLosers>

    <ChartLiquidationAverageHealth :market></ChartLiquidationAverageHealth>
    <ChartLiquidationHealthDeciles :market></ChartLiquidationHealthDeciles>
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
import LiquidationOverview from "@CM/Pages/Platform/CrvUsd/Components/LiquidationOverview.vue";
import {
  ChartLiqSoftLiqRatio,
  ChartLiquidationMedianLoss,
  ChartLiquidationAverageHealth,
  ChartLiquidationHealthDeciles,
  ChartLiquidationProportionLosers,
  ChartLiqs,
  ChartLiquidationLiquidatorRevenue,
  ChartLiquidationCollateralRatio,
} from "@CM/Pages/Platform/CrvUsd/Charts";
import { TableTopLiquidators } from "@CM/Pages/Platform/CrvUsd/Tables";

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
  grid-template-rows: 1fr 1fr;
}
</style>
