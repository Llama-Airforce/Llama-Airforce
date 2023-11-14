<template>
  <div class="yprisma">
    <ChartTVL contract="yearn"></ChartTVL>
    <ChartFlow contract="yearn"></ChartFlow>
    <ChartAPR contract="yearn"></ChartAPR>
    <ChartDistribution contract="yearn"></ChartDistribution>
  </div>
</template>

<script setup lang="ts">
import ChartTVL from "@PM/Pages/Wrappers/Charts/ChartTVL.vue";
import ChartFlow from "@PM/Pages/Wrappers/Charts/ChartFlow.vue";
import ChartAPR from "@PM/Pages/Wrappers/Charts/ChartAPR.vue";
import ChartDistribution from "@PM/Pages/Wrappers/Charts/ChartDistribution.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.yprisma {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
}
</style>
