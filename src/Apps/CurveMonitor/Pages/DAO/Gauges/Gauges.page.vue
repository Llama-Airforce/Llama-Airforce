<script setup lang="ts">
import TableGauges from "./Tables/TableGauges.vue";

// Crumbs
const { crumbs } = storeToRefs(useBreadcrumbStore());
crumbs.value = [
  {
    id: "gauges",
    label: "Gauges",
    pathName: "gauges",
  },
  {
    id: "pool",
    label: "Select gauge for details",
    hint: true,
  },
];
</script>

<template>
  <div class="dashboard">
    <TableGauges style="grid-area: gauges" />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-areas: "gauges";
}
</style>
