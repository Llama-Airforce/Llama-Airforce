<template>
  <div class="revenue-charts">
    <ChartChain
      style="grid-area: chain"
      class="chain"
    ></ChartChain>

    <ChartTopPools style="grid-area: top-pools"></ChartTopPools>

    <ChartBreakdown
      style="grid-area: breakdown"
      class="breakdown"
    ></ChartBreakdown>
  </div>
</template>

<script setup lang="ts">
import ChartBreakdown from "@CM/Pages/Platform/Revenue/Charts/ChartBreakdown.vue";
import ChartChain from "@CM/Pages/Platform/Revenue/Charts/ChartChain.vue";
import ChartTopPools from "@CM/Pages/Platform/Revenue/Charts/ChartTopPools.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.revenue-charts {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 400px 600px;

  grid-template-areas:
    "chain top-pools"
    "breakdown breakdown";

  .chain-revenues {
    height: 100%;

    @media only screen and (max-width: 1280px) {
      height: 250px;
    }
  }

  .breakdown {
    height: 100%;

    @media only screen and (max-width: 1280px) {
      height: 600px;
    }
  }
}
</style>
