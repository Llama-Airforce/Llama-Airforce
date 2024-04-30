<template>
  <div class="llamma">
    <ChartLlammaCandles :market="market"></ChartLlammaCandles>
  </div>
</template>

<script setup lang="ts">
import { type Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import ChartLlammaCandles from "@CM/Pages/Platform/CrvUsd/Charts/ChartLlammaCandles.vue";

// Props
interface Props {
  market: Market | null;
}

const { market } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.llamma {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
