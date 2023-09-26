<template>
  <div class="vault-overview">
    <ChartDistributionSelector :vault="vault"></ChartDistributionSelector>
    <ChartLargePositionsSelector :vault="vault"></ChartLargePositionsSelector>
  </div>
</template>

<script setup lang="ts">
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";
import ChartLargePositionsSelector from "@PM/Pages/Vaults/Charts/ChartLargePositionsSelector.vue";
import ChartDistributionSelector from "@PM/Pages/Vaults/Charts/ChartDistributionSelector.vue";

// Props
interface Props {
  vault: TroveManagerDetails | null;
}

const { vault } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.vault-overview {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
