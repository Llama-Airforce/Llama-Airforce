<template>
  <div class="liquidations">
    <TableLiquidations :vaults="vaults"></TableLiquidations>
  </div>
</template>

<script setup lang="ts">
import { useObservable } from "@/Framework";
import { useSocketStore } from "@PM/Stores";
import TableLiquidations from "@PM/Pages/Liquidations/TableLiquidations.vue";
import { TroveOverviewService } from "@PM/Services";

// Refs
const socket = useSocketStore().getSocket("api");
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
