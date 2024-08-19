<script setup lang="ts">
import { type TroveManagerDetails } from "@PM/Services";
import TableRedemptions from "@PM/Pages/Vaults/Tables/TableRedemptions.vue";

// Props
interface Props {
  vault: TroveManagerDetails | null;
}

const { vault } = defineProps<Props>();
</script>

<template>
  <div class="redemptions">
    <TableRedemptions :vault="vault"></TableRedemptions>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.redemptions {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}
</style>
