<template>
  <apexchart
    class="chart"
    height="100%"
    :options="options"
    :series="series"
  ></apexchart>
</template>

<script setup lang="ts">
// Props
interface Props {
  options: unknown;
  series: unknown;
}

const { options, series } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart {
  &::v-deep(.apexcharts-tooltip) {
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

  .apexcharts-legend-marker {
    border-radius: var(--border-radius) !important;
  }
}
</style>
