<script setup lang="ts">
import TableOracles from "./Tables/TableOracles.vue";
</script>

<template>
  <div class="dashboard">
    <TableOracles style="grid-area: oracles" />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-areas:
    "oracles oracles";
}
</style>
