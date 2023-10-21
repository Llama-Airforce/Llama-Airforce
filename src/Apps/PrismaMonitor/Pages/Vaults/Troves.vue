<template>
  <div class="troves">
    <TableTroves :vault="vault"></TableTroves>
  </div>
</template>

<script setup lang="ts">
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";
import TableTroves from "@PM/Pages/Vaults/Tables/TableTroves.vue";

// Props
interface Props {
  vault: TroveManagerDetails | null;
}

const { vault } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.troves {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}
</style>
