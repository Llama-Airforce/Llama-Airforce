<script setup lang="ts">
import ChartPrice from "@PM/Pages/Wrappers/Charts/ChartPrice.vue";
import ChartTVL from "@PM/Pages/Wrappers/Charts/ChartTVL.vue";
import ChartFlow from "@PM/Pages/Wrappers/Charts/ChartFlow.vue";
import ChartAPR from "@PM/Pages/Wrappers/Charts/ChartAPR.vue";
import ChartDistribution from "@PM/Pages/Wrappers/Charts/ChartDistribution.vue";
</script>

<template>
  <div class="dashboard-grid">
    <ChartPrice contract="convex"></ChartPrice>
    <ChartTVL contract="convex"></ChartTVL>
    <ChartFlow contract="convex"></ChartFlow>
    <ChartAPR contract="convex"></ChartAPR>
    <ChartDistribution
      contract="convex"
      style="grid-column: 1 / -1"
    ></ChartDistribution>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto 400px;
}
</style>
