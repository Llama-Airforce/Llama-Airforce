<script setup lang="ts">
import TableSwaps from "../Tables/TableSwaps.vue";
</script>

<template>
  <div class="dashboard-grid">
    <TableSwaps style="grid-area: swaps" />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-rows: auto;
  grid-template-areas: "swaps";
}
</style>
