<template>
  <div class="collateral">
    <ChartCollateralPrices :vault="vault"></ChartCollateralPrices>
    <ChartCollateralPriceImpact :vault="vault"></ChartCollateralPriceImpact>
  </div>
</template>

<script setup lang="ts">
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";
import ChartCollateralPrices from "@PM/Pages/Vaults/Charts/ChartCollateralPrices.vue";
import ChartCollateralPriceImpact from "@PM/Pages/Vaults/Charts/ChartCollateralPriceImpact.vue";

// Props
interface Props {
  vault: TroveManagerDetails | null;
}

const { vault } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.collateral {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
