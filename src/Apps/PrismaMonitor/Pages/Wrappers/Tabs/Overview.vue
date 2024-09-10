<script setup lang="ts">
import ChartComparisonPrice from "@PM/Pages/Wrappers/Charts/ChartComparisonPrice.vue";
import ChartComparisonTVL from "@PM/Pages/Wrappers/Charts/ChartComparisonTVL.vue";
</script>

<template>
  <div class="dashboard-grid">
    <ChartComparisonPrice></ChartComparisonPrice>
    <ChartComparisonTVL></ChartComparisonTVL>
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto 400px;
}
</style>
