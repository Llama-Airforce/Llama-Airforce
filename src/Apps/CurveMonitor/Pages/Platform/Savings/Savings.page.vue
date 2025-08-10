<script setup lang="ts">
import { useQueryStatistics } from "@CM/queries/savings";
import ChartTVL from "./Charts/ChartTVL.vue";
import ChartYield from "./Charts/ChartYield.vue";
import TableEvents from "./Tables/TableEvents.vue";

const { data: stats } = useQueryStatistics();
</script>

<template>
  <div class="dashboard">
    <KPI
      style="grid-area: kpi1"
      label="APY (Projected)"
      :has-value="!!stats"
    >
      <AsyncValue
        type="percentage"
        :value="stats?.apyProjected"
      />
    </KPI>

    <KPI
      style="grid-area: kpi2"
      label="Shares"
      :has-value="!!stats"
    >
      <AsyncValue :value="stats?.supply" />
    </KPI>

    <TableEvents style="grid-area: events" />
    <ChartYield style="grid-area: yield" />
    <ChartTVL style="grid-area: tvl" />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  /* Can't be just 1fr for some reason, charts won't shrink otherwise */
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-areas:
    "kpi1 kpi2"
    "yield tvl"
    "events events";
}
</style>
