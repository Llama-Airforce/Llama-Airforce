<script setup lang="ts">
import { type TroveManagerDetails } from "@PM/Services";
import ChartCollateralPrices from "@PM/Pages/Vaults/Charts/ChartCollateralPrices.vue";
import ChartCollateralPriceImpact from "@PM/Pages/Vaults/Charts/ChartCollateralPriceImpact.vue";
import CollateralKPIs from "@PM/Pages/Vaults/KPIs/CollateralKPIs.vue";

const { vault } = defineProps<{
  vault: TroveManagerDetails | null;
}>();
</script>

<template>
  <div class="dashboard-grid">
    <CollateralKPIs
      style="grid-column: 1 / -1"
      :vault="vault"
    ></CollateralKPIs>
    <ChartCollateralPrices :vault="vault"></ChartCollateralPrices>
    <ChartCollateralPriceImpact :vault="vault"></ChartCollateralPriceImpact>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
}
</style>
