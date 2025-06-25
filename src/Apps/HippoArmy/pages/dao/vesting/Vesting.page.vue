<script setup lang="ts">
import ChartProjections from "./charts/ChartProjections.vue";
import ChartSupplyCirculating from "./charts/ChartSupplyCirculating.vue";
import ChartSupplyDistribution from "./charts/ChartSupplyDistribution.vue";
import KPIs from "./components/KPIs.vue";
import TableVesting from "./tables/TableVesting.vue";
</script>

<template>
  <div class="dashboard">
    <DashboardHeader
      style="grid-area: header"
      title="Vesting"
      description="Token vesting, distribution, and circulating supply metrics"
    />

    <KPIs style="grid-area: highlights" />

    <ChartSupplyDistribution style="grid-area: supply-distribution" />
    <ChartSupplyCirculating style="grid-area: supply-circulating" />

    <ChartProjections style="grid-area: projections" />

    <TableVesting style="grid-area: table" />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-areas:
    "header header"
    "highlights highlights"
    "supply-distribution supply-circulating"
    "projections projections"
    "table table";

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
