<template>
  <Card
    class="card-graph"
    :title="title"
    :loading="loading"
  >
    <apexchart
      height="100%"
      :options="options"
      :series="series"
    ></apexchart>

    <slot></slot>
  </Card>
</template>

<script setup lang="ts">
import { Card } from "@/Framework";

// Props
interface Props {
  title?: string;
  loading?: boolean;
  options: unknown;
  series: unknown;
}

const { title = "", loading = false, options, series } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.card-graph {
  ::v-deep(.card-body) {
    display: block !important;
    margin-top: -1rem !important;
    overflow-x: clip;

    .apexcharts-tooltip {
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
}
</style>
