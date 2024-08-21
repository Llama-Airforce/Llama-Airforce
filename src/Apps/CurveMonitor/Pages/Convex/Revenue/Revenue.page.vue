<script setup lang="ts">
import ProtocolRevenueService, {
  HistoricalRevenueService,
} from "@CM/Pages/Convex/Revenue/Services/RevenueService";
import { useConvexStore } from "@CM/Pages/Convex/Store";
import RevenueSources from "@CM/Pages/Convex/Revenue/Components/RevenueSources.vue";
import LPRevenue from "@CM/Pages/Convex/Revenue/Components/LPRevenue.vue";
import HolderRevenue from "@CM/Pages/Convex/Revenue/Components/HolderRevenue.vue";
import HistoricalRevenue from "@CM/Pages/Convex/Revenue/Components/HistoricalRevenue.vue";
import LiquidRevenue from "@CM/Pages/Convex/Revenue/Components/LiquidRevenue.vue";
import Summary from "@CM/Pages/Convex/Revenue/Components/Summary.vue";

const protocolRevenueService = new ProtocolRevenueService();
const historicalRevenueService = new HistoricalRevenueService();

let isInitializing = false;

// Refs
const store = useConvexStore();
const loading = ref(false);

// Hooks.
onBeforeMount(async (): Promise<void> => {
  if (isInitializing) {
    return;
  }

  isInitializing = true;
  loading.value = true;

  const totalRevenue = await protocolRevenueService.get();

  if (totalRevenue) {
    store.revenue = totalRevenue;
  }

  const historicalRevenue = await historicalRevenueService.get();
  if (historicalRevenue) {
    store.historicalRevenue = historicalRevenue;
  }

  loading.value = false;
  isInitializing = false;
});

onBeforeUnmount((): void => {
  isInitializing = false;
});
</script>

<template>
  <div class="revenue">
    <div
      class="dashboard"
      :class="{ loading }"
    >
      <Spinner
        v-if="loading"
        class="spinner"
      ></Spinner>

      <div class="revenue-charts">
        <Summary class="summary"></Summary>
        <RevenueSources
          class="chart-revenue-sources"
          title="Breakdown of total revenue by source"
        ></RevenueSources>

        <HistoricalRevenue
          class="chart-historical-revenue"
          title="Historical total revenue breakdown"
        ></HistoricalRevenue>

        <LPRevenue
          class="chart-lp-revenue"
          title="Liquidity providers rewards breakdown"
        ></LPRevenue>

        <HolderRevenue
          class="chart-holder-revenue"
          title="CVX holders rewards breakdown"
        ></HolderRevenue>

        <LiquidRevenue
          class="chart-liquid-revenue"
          title="Liquid lockers rewards breakdown"
        ></LiquidRevenue>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("revenue");

.revenue {
  .dashboard {
    gap: unset;
    grid-gap: unset;

    &.loading {
      .total-revenue-charts,
      .spec-revenue-charts {
        opacity: 0.5;
      }
    }

    .spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(100%);
      z-index: 1;
    }

    .revenue-charts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto auto auto;
      gap: 1rem;

      @media only screen and (max-width: 1280px) {
        display: flex;
        flex-direction: column;
      }

      .summary {
        grid-row: 1;
        grid-column: 1;
      }

      .chart-revenue-sources {
        grid-row: 1;
        grid-column: 2;
      }

      .chart-historical-revenue {
        grid-row: 2;
        grid-column: 1;
        height: 400px;
      }

      .chart-holder-revenue {
        grid-row: 2;
        grid-column: 2;
        height: 400px;
      }

      .chart-lp-revenue {
        grid-row: 3;
        grid-column: 1;
        height: 400px;
      }

      .chart-liquid-revenue {
        grid-row: 3;
        grid-column: 2;
        height: 400px;
      }
    }
  }
}
</style>
