<script setup lang="ts">
import ChartPrice from "@PM/Pages/Wrappers/Charts/ChartPrice.vue";
import ChartTVL from "@PM/Pages/Wrappers/Charts/ChartTVL.vue";
import ChartFlow from "@PM/Pages/Wrappers/Charts/ChartFlow.vue";
import ChartAPR from "@PM/Pages/Wrappers/Charts/ChartAPR.vue";
import ChartDistribution from "@PM/Pages/Wrappers/Charts/ChartDistribution.vue";
</script>

<template>
  <div class="dashboard-grid">
    <ChartPrice contract="yearn" />
    <ChartTVL contract="yearn" />
    <ChartFlow contract="yearn" />
    <ChartAPR contract="yearn" />
    <ChartDistribution
      contract="yearn"
      style="grid-column: 1 / -1"
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto 400px;
}
</style>
