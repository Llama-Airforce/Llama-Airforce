<template>
  <div class="liquidations">
    <CardLiquidationOverview :market></CardLiquidationOverview>
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
  market?: Market;
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
