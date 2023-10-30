<template>
  <div class="redemptions">
    <TableRedemptions :vaults="vaults"></TableRedemptions>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import TableRedemptions from "@PM/Pages/Redemptions/TableRedemptions.vue";
import {
  TroveOverviewService,
  type TroveManagerDetails,
} from "@PM/Services/Socket/TroveOverviewService";

const prismaService = new TroveOverviewService("ethereum");

// Refs
const vaults = ref<TroveManagerDetails[]>([]);

// Watches
watch(prismaService.currentData, (newData) => {
  vaults.value = newData;
});

// Hooks
onMounted(() => {
  vaults.value = prismaService.currentData.value;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("redemptions");

.mkusd {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr;
  grid-template-rows: auto;
}
</style>
