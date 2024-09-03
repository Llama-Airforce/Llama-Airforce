<script setup lang="ts">
import { type TroveManagerDetails } from "@PM/Services";
import TableLiquidations from "@PM/Pages/Vaults/Tables/TableLiquidations.vue";

const { vault } = defineProps<{
  vault: TroveManagerDetails | null;
}>();
</script>

<template>
  <div class="liquidations">
    <TableLiquidations :vault="vault"></TableLiquidations>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.liquidations {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}
</style>
