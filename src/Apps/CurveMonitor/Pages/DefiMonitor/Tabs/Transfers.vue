<script setup lang="ts">
import TableTransfers from "@CM/Pages/DefiMonitor/Tables/TableTransfers.vue";
</script>

<template>
  <div class="transfers">
    <TableTransfers style="grid-area: transfers"></TableTransfers>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.transfers {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;

  grid-template-rows: auto;
  grid-template-columns: 1fr;
  grid-template-areas: "transfers";
}
</style>
