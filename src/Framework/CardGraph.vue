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
import { nextTick, onUpdated } from "vue";
import { Card } from "@/Framework";

// Props
interface Props {
  title?: string;
  loading?: boolean;
  options: unknown;
  series: unknown;
}

const { title = "", loading = false, options, series } = defineProps<Props>();

// Hooks
onUpdated(async (): Promise<void> => {
  await nextTick(() => {
    window.dispatchEvent(new Event("resize"));
  });
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.card-graph {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    overflow-x: clip;

    .apexcharts-legend-marker {
      border-radius: 0px !important;
    }
  }
}
</style>
