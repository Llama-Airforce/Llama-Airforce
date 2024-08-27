<script setup lang="ts">
import TableSwaps from "@CM/Pages/DefiMonitor/Tables/TableSwaps.vue";
</script>

<template>
  <div class="swaps">
    <TableSwaps style="grid-area: swaps"></TableSwaps>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.swaps {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;

  grid-template-rows: auto;
  grid-template-columns: 1fr;
  grid-template-areas: "swaps";
}
</style>
