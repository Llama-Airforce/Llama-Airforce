<template>
  <Card
    class="cart-chart"
    :title="title"
    :loading="loading"
  >
    <ChartApex
      height="100%"
      :options="options"
      :series="series"
    ></ChartApex>

    <template #actions>
      <slot name="actions"></slot>
    </template>

    <slot></slot>
  </Card>
</template>

<script setup lang="ts">
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

.cart-chart {
  ::v-deep(.card-body) {
    display: block !important;
    margin-top: -1rem !important;
    overflow-x: clip;
  }
}
</style>
