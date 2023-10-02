<template>
  <div class="pool">
    <KPIs></KPIs>
    <ChartPrice></ChartPrice>
    <ChartPriceDistribution></ChartPriceDistribution>
    <ChartHolders></ChartHolders>
  </div>
</template>

<script setup lang="ts">
import ChartPrice from "@PM/Pages/Stablecoin/Charts/ChartPrice.vue";
import ChartPriceDistribution from "@PM/Pages/Stablecoin/Charts/ChartPriceDistribution.vue";
import ChartHolders from "@PM/Pages/Stablecoin/Charts/ChartHolders.vue";
import KPIs from "@PM/Pages/Stablecoin/KPIs.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("pool");

.pool {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr auto;
}
</style>
