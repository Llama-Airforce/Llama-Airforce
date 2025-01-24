<script setup lang="ts">
import TableSettlements from "@CM/Pages/Platform/Revenue/Tables/TableSettlements.vue";
import { useQueryCowSwapSettlements } from "@CM/queries/revenue";

const { isFetching: loading, data: settlements } = useQueryCowSwapSettlements();
</script>

<template>
  <div class="dashboard-grid">
    <TableSettlements
      style="grid-area: table"
      :settlements
      :loading
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-areas: "table";
}
</style>
