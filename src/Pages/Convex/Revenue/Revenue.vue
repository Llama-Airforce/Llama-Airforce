<template>
  <div
    class="dashboard"
    :class="{ loading }"
  >
    <Spinner
      v-if="loading"
      class="spinner"
    ></Spinner>

    <div class="total-revenue-charts">
      <Summary class="summary"></Summary>
      <RevenueSources
        class="graph-revenue-sources"
        :title="t('revenue-breakdown')"
      ></RevenueSources>
    </div>

    <div class="spec-revenue-charts">
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
  <p />
</template>

<script setup lang="ts">
import Summary from "@/Pages/Convex/Revenue/Components/Summary.vue";
import { onBeforeMount, onBeforeUnmount } from "vue";
import { getHost } from "@/Services/Host";
import ProtocolRevenueService, {
  HistoricalRevenueService,
} from "@/Pages/Convex/Revenue/Services/RevenueService";
import { useConvexStore } from "@/Pages/Convex/Store";
import RevenueSources from "@/Pages/Convex/Revenue/Components/RevenueSources.vue";
import LPRevenue from "@/Pages/Convex/Revenue/Components/LPRevenue.vue";
import HolderRevenue from "@/Pages/Convex/Revenue/Components/HolderRevenue.vue";
import HistoricalRevenue from "@/Pages/Convex/Revenue/Components/HistoricalRevenue.vue";
import LiquidRevenue from "@/Pages/Convex/Revenue/Components/LiquidRevenue.vue";
import { useI18n } from "vue-i18n";
import { Spinner } from "@/Framework";
import { $ref } from "vue/macros";

const { t } = useI18n();
let loading = $ref(false);
let isInitializing = false;
const store = useConvexStore();
const protocolRevenueService = new ProtocolRevenueService(getHost());
const historicalRevenueService = new HistoricalRevenueService(getHost());

// Hooks.
onBeforeMount(async (): Promise<void> => {
  if (isInitializing) {
    return;
  }

  isInitializing = true;
  loading = true;

  const totalRevenue = await protocolRevenueService.get();

  if (totalRevenue) {
    store.setRevenue(totalRevenue);
  }

  const historicalRevenue = await historicalRevenueService.get();
  if (historicalRevenue) {
    store.setHistoricalRevenue(historicalRevenue);
  }

  loading = false;
  isInitializing = false;
});

onBeforeUnmount((): void => {
  isInitializing = false;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("pools");

.dashboard {
  &.loading {
    .total-revenue-charts {
      opacity: 0.5;
    }

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

  .total-revenue-charts {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 1rem;
    padding: 1.5rem 1rem 0rem;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
    }

    .summary {
      grid-row: 1;
      grid-column: 1;
      display: grid;
    }

    .graph-revenue-sources {
      grid-row: 1;
      grid-column: 2;
    }
  }

  .spec-revenue-charts {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 1rem;
    padding: 0rem 1rem;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
    }

    .graph-historical-revenue {
      grid-row: 1;
      grid-column: 1;
      height: 400px;
    }

    .graph-holder-revenue {
      grid-row: 1;
      grid-column: 2;
      height: 400px;
    }

    .graph-lp-revenue {
      grid-row: 2;
      grid-column: 1;
      height: 400px;
    }

    .graph-liquid-revenue {
      grid-row: 2;
      grid-column: 2;
      height: 400px;
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
