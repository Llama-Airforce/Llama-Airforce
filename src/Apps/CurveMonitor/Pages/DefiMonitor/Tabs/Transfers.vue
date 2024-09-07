<script setup lang="ts">
import TableTransfers from "@CM/Pages/DefiMonitor/Tables/TableTransfers.vue";
</script>

<template>
  <div class="dashboard-grid">
    <TableTransfers style="grid-area: transfers"></TableTransfers>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-rows: auto;
  grid-template-areas: "transfers";
}
</style>
