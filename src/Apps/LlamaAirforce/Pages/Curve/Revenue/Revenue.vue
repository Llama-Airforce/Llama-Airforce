<template>
  <div class="pools">
    <div
      class="dashboard"
      :class="{ loading }"
    >
      <Spinner
        v-if="loading"
        class="spinner"
      ></Spinner>

      <div class="revenue-charts">
        <div class="chain-revenues">
          <GraphChainRevenue
            :title="t('revenue-charts')"
            class="graph-chain-revenue"
          ></GraphChainRevenue>
        </div>

        <div class="chain-top-pools">
          <GraphChainTopPools
            class="graph-top-pools"
            :title="t('chain-top-pools')"
            :chain-selected="selectedChain"
          ></GraphChainTopPools>

          <div class="chain-selector-container">
            <ChainSelect
              class="chain-selector"
              @select-chain="onSelectChain"
            >
            </ChainSelect>
          </div>
        </div>

        <div class="historical-revenue">
          <GraphPoolRevenue
            class="graph-pool-revenue"
            :title="t('historical-revenue')"
          ></GraphPoolRevenue>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Spinner } from "@/Framework";
import { minDelay } from "@/Util";
import RevenueService, {
  ChainRevenueService,
  ChainTopPoolsRevenueService,
} from "@LAF/Pages/Curve/Revenue/Services/RevenueService";
import { useCurveStore } from "@LAF/Pages/Curve/Store";
import { getHost } from "@/Services/Host";
import GraphPoolRevenue from "@LAF/Pages/Curve/Revenue/Components/GraphPoolRevenue.vue";
import GraphChainRevenue from "@LAF/Pages/Curve/Revenue/Components/GraphChainRevenue.vue";
import ChainSelect from "@LAF/Pages/Curve/Revenue/Components/ChainSelect.vue";
import GraphChainTopPools from "@LAF/Pages/Curve/Revenue/Components/GraphChainTopPools.vue";
import { Chain } from "@LAF/Pages/Curve/Revenue/Models/Chain";

const revenueService = new RevenueService(getHost());
const chainRevenueService = new ChainRevenueService(getHost());
const topPoolService = new ChainTopPoolsRevenueService(getHost());

const { t } = useI18n();

// Refs
const store = useCurveStore();
const loading = ref(false);

onMounted(async (): Promise<void> => {
  // Don't request new data if there's already cached.
  if (store.poolRevenues.length > 0 || store.chainRevenues.length > 0) {
    return;
  }

  const { revenues, chainRevenues } = await minDelay(
    (async () => ({
      revenues: await revenueService.get(),
      chainRevenues: await chainRevenueService.get(),
    }))(),
    500
  );

  if (revenues) {
    store.setPoolRevenues(revenues);
  }
  if (chainRevenues) {
    store.setChainRevenues(chainRevenues);
  }

  onSelectChain("mainnet");
});

const getTopPools = async (chain: string): Promise<void> => {
  if (!chain) {
    return;
  }

  if (store.topPools[chain]) {
    return;
  }

  loading.value = true;

  try {
    const topPools = await minDelay(topPoolService.get(chain), 500);

    if (topPools) {
      store.setTopPools(chain, topPools);
    }
  } finally {
    loading.value = false;
  }
};

const selectedChain = computed((): Chain | null => {
  return store.selectedChain;
});

// Events
const onSelectChain = (chain: Chain): void => {
  store.selectedChain = chain;
  void getTopPools(chain);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("pools");

.pools {
  .dashboard {
    &.loading {
      .revenue-charts {
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
      position: relative;
      grid-column: 1;
      grid-row: 1;

      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 400px 600px;
      gap: 1rem;

      @media only screen and (max-width: 1280px) {
        display: flex;
        flex-direction: column;
        padding: 1.5rem 1rem;
      }

      .chain-top-pools {
        grid-row: 1;
        grid-column: auto;
        display: grid;
        grid-template-rows: 85% 15%;

        .graph-top-pools {
          height: auto;
          grid-row: 1;

          @media only screen and (max-width: 1280px) {
            height: 400px;
          }
        }

        .chain-selector-container {
          grid-row: 2;
          height: auto;
          background-color: var(--c-lvl1);
          padding-left: 10px;
          padding-right: 10px;
        }
      }

      .chain-revenues {
        grid-row: 1;
        grid-column: auto;

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
}
</style>

<i18n lang="yaml" locale="en">
revenue-charts: Total revenue by chain
chain-top-pools: Top 10 pools by revenue (last 7 days)
historical-revenue: Historical revenue breakdown
</i18n>
