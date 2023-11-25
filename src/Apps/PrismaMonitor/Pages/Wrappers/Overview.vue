<template>
  <div class="overview">
    <ChartComparisonPrice></ChartComparisonPrice>
    <ChartComparisonTVL></ChartComparisonTVL>
  </div>
</template>

<script setup lang="ts">
import ChartComparisonPrice from "@PM/Pages/Wrappers/Charts/ChartComparisonPrice.vue";
import ChartComparisonTVL from "@PM/Pages/Wrappers/Charts/ChartComparisonTVL.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.overview {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto 400px;
}
</style>
