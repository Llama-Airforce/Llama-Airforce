<template>
  <div class="liquidations">
    <TableLiquidations :vaults="vaults"></TableLiquidations>
  </div>
</template>

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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("liquidations");

.liquidations {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr;
  grid-template-rows: auto;
}
</style>
