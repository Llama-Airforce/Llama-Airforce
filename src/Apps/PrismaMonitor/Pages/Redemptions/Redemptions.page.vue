<script setup lang="ts">
import { getApiSocket, useSocketStore, useSettingsStore } from "@PM/Stores";
import { TroveOverviewService } from "@PM/Services";
import TableRedemptions from "@PM/Pages/Redemptions/Tables/TableRedemptions.vue";

// Refs
const storeSettings = useSettingsStore();
const socket = useSocketStore().getSocket(getApiSocket(storeSettings.flavor));
const prismaService = new TroveOverviewService(socket, "ethereum");
const vaults = useObservable(prismaService.overview$, []);
</script>

<template>
  <div class="dashboard">
    <TableRedemptions :vaults />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr;
  grid-template-rows: auto;
}
</style>
