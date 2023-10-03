<template>
  <div class="mkusd">
    <KPIs style="grid-column: 1 / -1"></KPIs>
    <ChartPrice></ChartPrice>
    <ChartPriceDistribution></ChartPriceDistribution>
    <ChartHolders></ChartHolders>
    <ChartDepthContainer></ChartDepthContainer>
  </div>
</template>

<script setup lang="ts">
import ChartPrice from "@PM/Pages/Stablecoin/Charts/ChartPrice.vue";
import ChartPriceDistribution from "@PM/Pages/Stablecoin/Charts/ChartPriceDistribution.vue";
import ChartHolders from "@PM/Pages/Stablecoin/Charts/ChartHolders.vue";
import KPIs from "@PM/Pages/Stablecoin/KPIs.vue";
import ChartDepthContainer from "@PM/Pages/Stablecoin/Charts/ChartDepthContainer.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("mkusd");

.mkusd {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
}
</style>
