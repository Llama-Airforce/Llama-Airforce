<script setup lang="ts">
import ChartRevenue from "@PM/Pages/Revenue/Charts/ChartRevenue.vue";
import ChartBreakdown from "@PM/Pages/Revenue/Charts/ChartBreakdown.vue";
</script>

<template>
  <div class="dashboard">
    <ChartRevenue style="grid-column: 1" />
    <ChartBreakdown style="grid-column: 2" />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 2fr 1fr;
}
</style>
