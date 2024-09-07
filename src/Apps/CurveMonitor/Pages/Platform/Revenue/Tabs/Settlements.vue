<script setup lang="ts">
import TableSettlements from "@CM/Pages/Platform/Revenue/Tables/TableSettlements.vue";
import { useQueryCowSwapSettlements } from "@CM/Services/Revenue/Queries";

const { isFetching: loading, data: settlements } = useQueryCowSwapSettlements();
</script>

<template>
  <div class="dashboard-grid">
    <TableSettlements
      style="grid-area: table"
      :settlements
      :loading
    ></TableSettlements>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-areas: "table";
}
</style>
