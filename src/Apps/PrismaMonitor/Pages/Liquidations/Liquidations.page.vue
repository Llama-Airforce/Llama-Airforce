<script setup lang="ts">
import { getApiSocket, useSocketStore } from "@PM/Stores";
import TableLiquidations from "@PM/Pages/Liquidations/Tables/TableLiquidations.vue";
import { TroveOverviewService } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";

// Refs
const storeSettings = useSettingsStore();
const socket = useSocketStore().getSocket(getApiSocket(storeSettings.flavor));
const prismaService = new TroveOverviewService(socket, "ethereum");
const vaults = useObservable(prismaService.overview$, []);
</script>

<template>
  <div class="dashboard">
    <TableLiquidations :vaults></TableLiquidations>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr;
  grid-template-rows: auto;
}
</style>
