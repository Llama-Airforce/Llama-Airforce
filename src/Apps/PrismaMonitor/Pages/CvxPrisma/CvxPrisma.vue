<template>
  <div class="cvxprisma">
    <ChartTVL></ChartTVL>
    <ChartFlow></ChartFlow>
    <ChartAPR></ChartAPR>
    <ChartDistribution></ChartDistribution>
  </div>
</template>

<script setup lang="ts">
import ChartTVL from "@PM/Pages/CvxPrisma/Charts/ChartTVL.vue";
import ChartFlow from "@PM/Pages/CvxPrisma/Charts/ChartFlow.vue";
import ChartAPR from "@PM/Pages/CvxPrisma/Charts/ChartAPR.vue";
import ChartDistribution from "@PM/Pages/CvxPrisma/Charts/ChartDistribution.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("cvxprisma");

.cvxprisma {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
