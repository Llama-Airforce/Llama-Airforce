<template>
  <div class="revenue-charts">
    <ChartRevenueChain class="chain-revenues"></ChartRevenueChain>
    <ChartRevenueTopPools class="chain-top-pools"></ChartRevenueTopPools>
    <ChartRevenueBreakdown class="breakdown"></ChartRevenueBreakdown>
  </div>
</template>

<script setup lang="ts">
import ChartRevenueBreakdown from "@CM/Pages/Platform/Revenue/Charts/ChartRevenueBreakdown.vue";
import ChartRevenueChain from "@CM/Pages/Platform/Revenue/Charts/ChartRevenueChain.vue";
import ChartRevenueTopPools from "@CM/Pages/Platform/Revenue/Charts/ChartRevenueTopPools.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.revenue-charts {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 400px 600px;

  .chain-top-pools {
    grid-row: 1;
    grid-column: 2;
  }

  .chain-revenues {
    grid-row: 1;
    grid-column: 1;

    height: 100%;

    @media only screen and (max-width: 1280px) {
      height: 250px;
    }
  }

  .breakdown {
    grid-row: 2;
    grid-column: 1 / -1;

    height: 100%;

    @media only screen and (max-width: 1280px) {
      height: 600px;
    }
  }
}
</style>
