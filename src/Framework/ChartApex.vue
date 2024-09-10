<script setup lang="ts">
const VueApexCharts = defineAsyncComponent(() => import("vue3-apexcharts"));

const { options, series } = defineProps<{
  options: unknown;
  series: unknown;
}>();
</script>

<template>
  <VueApexCharts
    class="chart"
    height="100%"
    :options="options"
    :series="series"
  ></VueApexCharts>
</template>

<style scoped>
.chart {
  &:deep(.apexcharts-tooltip) {
    background-color: var(--c-lvl1);
    border: solid var(--border-thickness) var(--c-lvl4);
    border-radius: var(--border-radius);
    box-shadow: var(--tooltip-box-shadow);
    color: var(--c-text);

    padding: 1rem;
    line-height: 0.75rem;

    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  &:deep(.apexcharts-legend-marker) {
    border-radius: var(--border-radius) !important;
  }
}
</style>
