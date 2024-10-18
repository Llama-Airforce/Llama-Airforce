<script setup lang="ts">
import { type TroveManagerDetails } from "@PM/Services";
import ChartLargePositionsSelector from "@PM/Pages/Vaults/Charts/ChartLargePositionsSelector.vue";
import ChartDistributionSelector from "@PM/Pages/Vaults/Charts/ChartDistributionSelector.vue";
import VaultKPIs from "@PM/Pages/Vaults/KPIs/VaultKPIs.vue";
import ChartSingleVaultCollateralRatio from "@PM/Pages/Vaults/Charts/ChartSingleVaultCollateralRatio.vue";
import ChartSingleVaultOpenTroves from "@PM/Pages/Vaults/Charts/ChartSingleVaultOpenTroves.vue";

const { vault } = defineProps<{
  vault: TroveManagerDetails | null;
}>();
</script>

<template>
  <div class="dashboard-grid">
    <VaultKPIs
      style="grid-column: 1 / -1"
      :vault
    ></VaultKPIs>
    <ChartDistributionSelector :vault></ChartDistributionSelector>
    <ChartLargePositionsSelector :vault></ChartLargePositionsSelector>
    <ChartSingleVaultCollateralRatio :vault></ChartSingleVaultCollateralRatio>
    <ChartSingleVaultOpenTroves :vault></ChartSingleVaultOpenTroves>
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: 1fr 1fr;
}
</style>
