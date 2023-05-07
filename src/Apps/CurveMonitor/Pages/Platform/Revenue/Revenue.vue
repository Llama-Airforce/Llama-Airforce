<template>
  <div class="pools">
    <div class="revenue-charts">
      <div class="chain-revenues">
        <GraphChainRevenue
          :title="t('revenue-charts')"
          :loading="loadingRevenueChain"
          class="graph-chain-revenue"
        ></GraphChainRevenue>
      </div>

      <GraphChainTopPools :title="t('chain-top-pools')"></GraphChainTopPools>

      <div class="historical-revenue">
        <GraphPoolRevenue
          class="graph-pool-revenue"
          :title="t('historical-revenue')"
          :loading="loadingRevenuePools"
        ></GraphPoolRevenue>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { minDelay } from "@/Util";
import { getHost } from "@/Services/Host";
import { useCurveStore } from "@CM/Pages/Platform/Store";
import RevenueService, {
  ChainRevenueService,
} from "@CM/Pages/Platform/Revenue/Services/RevenueService";
import GraphPoolRevenue from "@CM/Pages/Platform/Revenue/Components/GraphPoolRevenue.vue";
import GraphChainRevenue from "@CM/Pages/Platform/Revenue/Components/GraphChainRevenue.vue";
import GraphChainTopPools from "@CM/Pages/Platform/Revenue/Components/GraphChainTopPools.vue";

const revenueService = new RevenueService(getHost());
const chainRevenueService = new ChainRevenueService(getHost());

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
      revenues: await revenueService.get(),
      chainRevenues: await chainRevenueService.get(),
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

@include dashboard("pools");

.pools {
  position: relative;
  max-width: calc(1920px - 18.125rem);

  &.loading {
    .revenue-charts {
      opacity: 0.25;
    }
  }

  .spinner {
    position: absolute;
    top: 50dvh;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    z-index: 1;
  }

  .revenue-charts {
    position: relative;
    grid-column: 1;
    grid-row: 1;

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
}
</style>

<i18n lang="yaml" locale="en">
revenue-charts: Total revenue by chain
chain-top-pools: Top 10 pools by revenue (last 7 days)
historical-revenue: Historical revenue breakdown
</i18n>
