<script setup lang="ts">
import type { Pool } from "@curvefi/prices-api/pools";
import ChartMEV from "../Charts/ChartMEV.vue";

const { pool } = defineProps<{
  pool: Pool;
}>();

const poolAddr = computed(() => pool.address);
</script>

<template>
  <div class="dashboard-grid">
    <ChartMEV
      style="grid-area: chart"
      :pool="poolAddr"
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-rows: 600px;
  grid-template-columns: 1fr;
  grid-template-areas: "chart";
}
</style>
