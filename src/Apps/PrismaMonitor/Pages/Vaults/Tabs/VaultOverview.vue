<script setup lang="ts">
import { type TroveManagerDetails } from "@PM/Services";
import ChartLargePositionsSelector from "@PM/Pages/Vaults/Charts/ChartLargePositionsSelector.vue";
import ChartDistributionSelector from "@PM/Pages/Vaults/Charts/ChartDistributionSelector.vue";
import VaultKPIs from "@PM/Pages/Vaults/KPIs/VaultKPIs.vue";
import ChartSingleVaultCollateralRatio from "@PM/Pages/Vaults/Charts/ChartSingleVaultCollateralRatio.vue";
import ChartSingleVaultOpenTroves from "@PM/Pages/Vaults/Charts/ChartSingleVaultOpenTroves.vue";

// Props
interface Props {
  vault: TroveManagerDetails | null;
}

const { vault } = defineProps<Props>();
</script>

<template>
  <div class="vault-overview">
    <VaultKPIs
      style="grid-column: 1 / -1"
      :vault="vault"
    ></VaultKPIs>
    <ChartDistributionSelector :vault="vault"></ChartDistributionSelector>
    <ChartLargePositionsSelector :vault="vault"></ChartLargePositionsSelector>
    <ChartSingleVaultCollateralRatio
      :vault="vault"
    ></ChartSingleVaultCollateralRatio>
    <ChartSingleVaultOpenTroves :vault="vault"></ChartSingleVaultOpenTroves>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.vault-overview {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 450px 450px;
}
</style>
