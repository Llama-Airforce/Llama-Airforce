<script setup lang="ts">
import { type TroveManagerDetails } from "@PM/Services";
import TableLiquidations from "@PM/Pages/Vaults/Tables/TableLiquidations.vue";

const { vault } = defineProps<{
  vault: TroveManagerDetails | null;
}>();
</script>

<template>
  <div class="dashboard-grid">
    <TableLiquidations :vault="vault"></TableLiquidations>
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;
}
</style>
