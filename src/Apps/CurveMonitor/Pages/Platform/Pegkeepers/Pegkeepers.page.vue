<script setup lang="ts">
import { ChartKeeperPrices } from "./Charts";
import { TablePegkeepers } from "./Tables";
</script>

<template>
  <div class="dashboard">
    <TablePegkeepers style="grid-area: table" />
    <ChartKeeperPrices style="grid-area: chart" />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    "table"
    "chart";
}
</style>
