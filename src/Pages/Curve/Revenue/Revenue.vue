<template>
  <div class="pools">
    <div class="dashboard">
      <div class="revenue-charts">
        <div class="chain-revenues">
          <GraphChainRevenue
            title="Total revenue by chain"
            class="graph-chain-revenue"
          ></GraphChainRevenue>
        </div>
        <div class="chain-top-pools">
          <GraphChainTopPools
            title="Top 10 pools by revenue (last 7 days)"
            class="graph-top-pools"
            :chain-selected="selectedChain"
          ></GraphChainTopPools>
          <div class="chain-selector">
            <ChainSelector
              class="chain-selector-2"
              @select-chain="onSelectChain"
            >
            </ChainSelector>
          </div>
        </div>
        <div class="historical-revenue">
          <GraphPoolRevenue
            title="Historical revenue breakdown"
            class="graph-pool-revenue"
          ></GraphPoolRevenue>
        </div>
      </div>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { onMounted } from "vue";
import RevenueService, {
  ChainRevenueService,
  ChainTopPoolsRevenueService,
} from "@/Pages/Curve/Revenue/Services/RevenueService";
import { minDelay } from "@/Util/PromiseHelper";
import { useCurveStore } from "@/Pages/Curve/Store";
import { getHost } from "@/Services/Host";
import GraphPoolRevenue from "@/Pages/Curve/Revenue/Components/GraphPoolRevenue.vue";
import GraphChainRevenue from "@/Pages/Curve/Revenue/Components/GraphChainRevenue.vue";
import ChainSelector from "@/Pages/Curve/Revenue/Components/ChainSelector.vue";
import GraphChainTopPools from "@/Pages/Curve/Revenue/Components/GraphChainTopPools.vue";
import { $computed } from "vue/macros";
import { Chain } from "@/Pages/Curve/Revenue/Models/Chain";

const revenueService = new RevenueService(getHost());
const chainRevenueService = new ChainRevenueService(getHost());
const topPoolService = new ChainTopPoolsRevenueService(getHost());

// Refs
const store = useCurveStore();

onMounted(async (): Promise<void> => {
  const revenues = await minDelay(revenueService.get(), 500);
  const chainRevenues = await minDelay(chainRevenueService.get(), 500);

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
  const topPools = await minDelay(topPoolService.get(chain), 500);

  if (topPools) {
    store.setTopPools(chain, topPools);
  }
};

const selectedChain = $computed((): Chain | null => {
  return store.selectedChain;
});

// Events
const onSelectChain = (chain: Chain): void => {
  store.selectedChain = chain;
  console.log(chain);
  void getTopPools(chain);
};
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.pools {
  display: flex;
  justify-content: center;

  .dashboard {
    width: 100%;
    padding: $page-margin;

    display: grid;
    grid-gap: 1.5rem;

    grid-template-rows: 1fr;
    grid-template-columns: 1fr;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
    }

    .revenue-charts {
      position: relative;
      grid-column: 1;
      grid-row: 2;

      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 400px 600px;
      gap: 1rem;
      .chain-top-pools {
        grid-row: 1;
        grid-column: auto;
        .graph-top-pools {
          height: 90%;
        }
        .chain-selector {
          height: 10%;
          background-color: $background-color-widget;
          padding-left: 10px;
          padding-right: 10px;
        }
      }
      .chain-revenues {
        grid-row: 1;
        grid-column: auto;
        .graph-chain-revenue {
          height: 100%;
        }
      }
      .historical-revenue {
        grid-row: 2;
        grid-column: 1 / span 2;
        .graph-pool-revenue {
          height: 100%;
        }
      }
    }
  }
}
</style>
