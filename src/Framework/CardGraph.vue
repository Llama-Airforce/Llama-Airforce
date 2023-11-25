<template>
  <Card
    class="card-graph"
    :title="title"
    :loading="loading"
  >
    <GraphApex
      height="100%"
      :options="options"
      :series="series"
    ></GraphApex>

    <template #actions>
      <slot name="actions"></slot>
    </template>

    <slot></slot>
  </Card>
</template>

<script setup lang="ts">
import { Card, GraphApex } from "@/Framework";

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
  }
}
</style>
