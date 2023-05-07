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
          class="graph-revenue-sources"
          :title="t('revenue-breakdown')"
        ></RevenueSources>

        <HistoricalRevenue
          class="graph-historical-revenue"
          :title="t('revenue-historical')"
        ></HistoricalRevenue>

        <LPRevenue
          class="graph-lp-revenue"
          :title="t('revenue-lp')"
        ></LPRevenue>

        <HolderRevenue
          class="graph-holder-revenue"
          :title="t('revenue-holder')"
        ></HolderRevenue>

        <LiquidRevenue
          class="graph-liquid-revenue"
          :title="t('revenue-liquid')"
        ></LiquidRevenue>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { Spinner } from "@/Framework";
import { getHost } from "@/Services/Host";
import ProtocolRevenueService, {
  HistoricalRevenueService,
} from "@LAF/Pages/Convex/Revenue/Services/RevenueService";
import { useConvexStore } from "@LAF/Pages/Convex/Store";
import RevenueSources from "@LAF/Pages/Convex/Revenue/Components/RevenueSources.vue";
import LPRevenue from "@LAF/Pages/Convex/Revenue/Components/LPRevenue.vue";
import HolderRevenue from "@LAF/Pages/Convex/Revenue/Components/HolderRevenue.vue";
import HistoricalRevenue from "@LAF/Pages/Convex/Revenue/Components/HistoricalRevenue.vue";
import LiquidRevenue from "@LAF/Pages/Convex/Revenue/Components/LiquidRevenue.vue";
import Summary from "@LAF/Pages/Convex/Revenue/Components/Summary.vue";

const { t } = useI18n();

const protocolRevenueService = new ProtocolRevenueService(getHost());
const historicalRevenueService = new HistoricalRevenueService(getHost());

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

      .graph-revenue-sources {
        grid-row: 1;
        grid-column: 2;
      }

      .graph-historical-revenue {
        grid-row: 2;
        grid-column: 1;
        height: 400px;
      }

      .graph-holder-revenue {
        grid-row: 2;
        grid-column: 2;
        height: 400px;
      }

      .graph-lp-revenue {
        grid-row: 3;
        grid-column: 1;
        height: 400px;
      }

      .graph-liquid-revenue {
        grid-row: 3;
        grid-column: 2;
        height: 400px;
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
revenue-breakdown: Breakdown of total revenue by source
revenue-lp: Liquidity providers rewards breakdown
revenue-holder: CVX holders rewards breakdown
revenue-historical: Historical total revenue breakdown
revenue-liquid: Liquid lockers rewards breakdown
</i18n>
