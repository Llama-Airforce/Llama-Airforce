<template>
  <div class="revenue-charts">
    <div class="chain-revenues">
      <GraphRevenueChain
        :title="t('revenue-charts')"
        :loading="loadingRevenueChain"
        class="graph-chain-revenue"
      ></GraphRevenueChain>
    </div>

    <GraphRevenueTopPools :title="t('chain-top-pools')"></GraphRevenueTopPools>

    <div class="historical-revenue">
      <GraphRevenueBreakdownV1
        class="graph-pool-revenue"
        :title="t('historical-revenue')"
        :loading="loadingRevenuePools"
      ></GraphRevenueBreakdownV1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { minDelay } from "@/Util";
import { getHost } from "@/Services/Host";
import { useCurveStore } from "@CM/Pages/Platform/Store";
import RevenueService from "@CM/Pages/Platform/Revenue/Services/RevenueService";
import GraphRevenueBreakdownV1 from "@CM/Pages/Platform/Revenue/Components/GraphRevenueBreakdownV1.vue";
import GraphRevenueChain from "@CM/Pages/Platform/Revenue/Components/GraphRevenueChain.vue";
import GraphRevenueTopPools from "@CM/Pages/Platform/Revenue/Components/GraphRevenueTopPools.vue";

const revenueService = new RevenueService(getHost());

const { t } = useI18n();

// Refs
const store = useCurveStore();

const loadingRevenueChain = ref(false);
const loadingRevenuePools = ref(false);

// Hooks
onMounted(async (): Promise<void> => {
  // Don't request new data if there's already cached.
  if (store.poolRevenues.length > 0 || store.chainRevenues.length > 0) {
    return;
  }

  loadingRevenueChain.value = true;
  loadingRevenuePools.value = true;

  const { revenues, chainRevenues } = await minDelay(
    (async () => ({
      revenues: await revenueService.getBreakdownV1(),
      chainRevenues: await revenueService.getByChain(),
    }))(),
    500
  );

  if (revenues) {
    store.setPoolRevenues(revenues);
    loadingRevenuePools.value = false;
  }
  if (chainRevenues) {
    store.setChainRevenues(chainRevenues);
    loadingRevenueChain.value = false;
  }
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

    .graph-chain-revenue {
      height: 100%;

      @media only screen and (max-width: 1280px) {
        height: 250px;
      }
    }
  }

  .historical-revenue {
    grid-row: 2;
    grid-column: 1 / span 2;

    .graph-pool-revenue {
      height: 100%;

      @media only screen and (max-width: 1280px) {
        height: 600px;
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
revenue-charts: Total revenue by chain
chain-top-pools: Top 10 pools by revenue (last 7 days)
historical-revenue: Historical revenue breakdown
</i18n>
