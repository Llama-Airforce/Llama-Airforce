<script setup lang="ts">
import { type TroveManagerDetails } from "@PM/Services";
import TableRedemptions from "@PM/Pages/Vaults/Tables/TableRedemptions.vue";

const { vault } = defineProps<{
  vault: TroveManagerDetails | null;
}>();
</script>

<template>
  <div class="dashboard-grid">
    <TableRedemptions :vault></TableRedemptions>
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;
}
</style>
