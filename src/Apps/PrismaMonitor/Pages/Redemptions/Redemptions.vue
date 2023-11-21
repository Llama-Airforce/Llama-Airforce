<template>
  <div class="redemptions">
    <TableRedemptions :vaults="vaults"></TableRedemptions>
  </div>
</template>

<script setup lang="ts">
import { useObservable } from "@/Framework";
import { useSocketStore } from "@PM/Stores";
import { TroveOverviewService } from "@PM/Services";
import TableRedemptions from "@PM/Pages/Redemptions/TableRedemptions.vue";

// Refs
const socket = useSocketStore().getSocket("api");
const prismaService = new TroveOverviewService(socket, "ethereum");
const vaults = useObservable(prismaService.overview$, []);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("redemptions");

.redemptions {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr;
  grid-template-rows: auto;
}
</style>
