<template>
  <div class="liquidations">
    <TableLiquidations :vault="vault"></TableLiquidations>
  </div>
</template>

<script setup lang="ts">
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";
import TableLiquidations from "@PM/Pages/Vaults/Tables/TableLiquidations.vue";

// Props
interface Props {
  vault: TroveManagerDetails | null;
}

const { vault } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.liquidations {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}
</style>
