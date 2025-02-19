<script setup lang="ts">
import TableOracles from "../Tables/TableOracles.vue";
</script>

<template>
  <div class="dashboard-grid">
    <TableOracles style="grid-area: oracles" />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-areas: "oracles oracles";
}
</style>
