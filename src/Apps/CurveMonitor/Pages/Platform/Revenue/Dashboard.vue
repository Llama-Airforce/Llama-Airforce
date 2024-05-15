<template>
  <div class="revenue-charts">
    <GraphRevenueChain class="chain-revenues"></GraphRevenueChain>
    <GraphRevenueTopPools class="chain-top-pools"></GraphRevenueTopPools>
    <GraphRevenueBreakdown class="breakdown"></GraphRevenueBreakdown>
  </div>
</template>

<script setup lang="ts">
import GraphRevenueBreakdown from "@CM/Pages/Platform/Revenue/Components/GraphRevenueBreakdown.vue";
import GraphRevenueChain from "@CM/Pages/Platform/Revenue/Components/GraphRevenueChain.vue";
import GraphRevenueTopPools from "@CM/Pages/Platform/Revenue/Components/GraphRevenueTopPools.vue";
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
