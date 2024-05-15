<template>
  <div class="revenue-charts">
    <GraphRevenueChain
      class="chain-revenues"
      :title="t('revenue-charts')"
      :loading="loadingRevenueChain"
    ></GraphRevenueChain>

    <GraphRevenueTopPools
      class="chain-top-pools"
      :title="t('chain-top-pools')"
    ></GraphRevenueTopPools>

    <GraphRevenueBreakdown
      class="breakdown"
      :title="t('breakdown')"
      :loading="loadingRevenueBreakdown"
    ></GraphRevenueBreakdown>
  </div>
</template>

<script setup lang="ts">
import { useCurveStore } from "@CM/Pages/Platform/Store";
import RevenueService from "@CM/Services/Revenue";
import GraphRevenueBreakdown from "@CM/Pages/Platform/Revenue/Components/GraphRevenueBreakdown.vue";
import GraphRevenueChain from "@CM/Pages/Platform/Revenue/Components/GraphRevenueChain.vue";
import GraphRevenueTopPools from "@CM/Pages/Platform/Revenue/Components/GraphRevenueTopPools.vue";

const revenueService = new RevenueService(getHost());

const { t } = useI18n();

// Refs
const store = useCurveStore();

const loadingRevenueChain = ref(false);
const loadingRevenuePools = ref(false);
const loadingRevenueBreakdown = ref(false);

const abort = new AbortController();

// Hooks
onActivated(() => {
  // Don't request new data if there's already cached.
  if (store.chainRevenues.length > 0) {
    return;
  }

  loadingRevenueChain.value = true;
  loadingRevenuePools.value = true;
  loadingRevenueBreakdown.value = true;

  // Chain revenue
  void revenueService.getByChain(abort.signal).then((chainRevenues) => {
    if (chainRevenues) {
      store.chainRevenues = chainRevenues;
      loadingRevenueChain.value = false;
    }

    return undefined;
  });

  // Breakdown
  void revenueService.getBreakdown(abort.signal).then((breakdown) => {
    if (breakdown) {
      store.breakdown = breakdown;
      loadingRevenueBreakdown.value = false;
    }

    return undefined;
  });
});

onDeactivated(() => {
  abort.abort();
});
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

<i18n lang="yaml" locale="en">
revenue-charts: Total revenue by chain
chain-top-pools: Top 10 pools by revenue (last 7 days)
breakdown: Revenue breakdown by source
</i18n>
