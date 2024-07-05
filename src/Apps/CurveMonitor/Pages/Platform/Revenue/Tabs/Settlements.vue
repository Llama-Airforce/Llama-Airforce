<template>
  <div class="settlements">
    <TableSettlements
      style="grid-area: table"
      :settlements
      :loading
    ></TableSettlements>
  </div>
</template>

<script setup lang="ts">
import TableSettlements from "@CM/Pages/Platform/Revenue/Tables/TableSettlements.vue";
import { useQueryCowSwapSettlements } from "@CM/Services/Revenue/Queries";

const { isFetching: loading, data: settlements } = useQueryCowSwapSettlements();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.settlements {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;

  grid-template-areas: "table";
}
</style>
