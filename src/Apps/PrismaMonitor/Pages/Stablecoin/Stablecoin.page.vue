<template>
  <div class="stable">
    <KPIs style="grid-column: 1 / -1"></KPIs>
    <ChartPrice></ChartPrice>
    <ChartPriceDistribution></ChartPriceDistribution>
    <ChartSupply></ChartSupply>
    <ChartHolders></ChartHolders>
    <ChartDepthContainer></ChartDepthContainer>
  </div>
</template>

<script setup lang="ts">
import KPIs from "@PM/Pages/Stablecoin/Components/KPIs.vue";
import ChartPrice from "@PM/Pages/Stablecoin/Charts/ChartPrice.vue";
import ChartPriceDistribution from "@PM/Pages/Stablecoin/Charts/ChartPriceDistribution.vue";
import ChartSupply from "@PM/Pages/Stablecoin/Charts/ChartSupply.vue";
import ChartHolders from "@PM/Pages/Stablecoin/Charts/ChartHolders.vue";
import ChartDepthContainer from "@PM/Pages/Stablecoin/Charts/ChartDepthContainer.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("stable");

.stable {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
}
</style>
