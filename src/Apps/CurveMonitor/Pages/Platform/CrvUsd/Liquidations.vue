<template>
  <div class="liquidations">
    <CardLiquidationOverview :market="market"></CardLiquidationOverview>

    <ChartLiquidationSoftLiquidation
      :market="market"
    ></ChartLiquidationSoftLiquidation>

    <ChartLiquidationMedianLoss :market="market"></ChartLiquidationMedianLoss>

    <ChartLiquidationProportionLosers
      :market="market"
    ></ChartLiquidationProportionLosers>

    <ChartLiquidationAverageHealth
      :market="market"
    ></ChartLiquidationAverageHealth>

    <ChartLiquidationHealthDeciles
      :market="market"
    ></ChartLiquidationHealthDeciles>

    <ChartLiquidationCollateralRatio
      :market="market"
    ></ChartLiquidationCollateralRatio>

    <ChartLiquidationHistorical :market="market"></ChartLiquidationHistorical>
    <TableLiquidationLiquidators :market="market"></TableLiquidationLiquidators>

    <ChartLiquidationLiquidatorRevenue
      :market="market"
    ></ChartLiquidationLiquidatorRevenue>
  </div>
</template>

<script setup lang="ts">
import type { Market } from "@CM/Services/CrvUsd";
import CardLiquidationOverview from "@CM/Pages/Platform/CrvUsd/Cards/CardLiquidationOverview.vue";
import ChartLiquidationSoftLiquidation from "@CM/Pages/Platform/CrvUsd/Charts/ChartLiquidationSoftLiquidation.vue";
import ChartLiquidationMedianLoss from "@CM/Pages/Platform/CrvUsd/Charts/ChartLiquidationMedianLoss.vue";
import ChartLiquidationAverageHealth from "@CM/Pages/Platform/CrvUsd/Charts/ChartLiquidationAverageHealth.vue";
import ChartLiquidationHealthDeciles from "@CM/Pages/Platform/CrvUsd/Charts/ChartLiquidationHealthDeciles.vue";
import ChartLiquidationProportionLosers from "@CM/Pages/Platform/CrvUsd/Charts/ChartLiquidationProportionLosers.vue";
import ChartLiquidationHistorical from "@CM/Pages/Platform/CrvUsd/Charts/ChartLiquidationHistorical.vue";
import TableLiquidationLiquidators from "@CM/Pages/Platform/CrvUsd/Tables/TableLiquidationLiquidators.vue";
import ChartLiquidationLiquidatorRevenue from "@CM/Pages/Platform/CrvUsd/Charts/ChartLiquidationLiquidatorRevenue.vue";
import ChartLiquidationCollateralRatio from "@CM/Pages/Platform/CrvUsd/Charts/ChartLiquidationCollateralRatio.vue";

// Props
interface Props {
  market: Market | null;
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
