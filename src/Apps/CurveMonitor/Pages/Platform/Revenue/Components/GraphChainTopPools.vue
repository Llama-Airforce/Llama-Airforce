<template>
  <CardGraph
    class="chain-top-pools"
    :options="options"
    :series="series"
    :loading="loading"
  >
    <div
      class="chain-selector-container"
      :class="{ loading }"
    >
      <ChainSelect
        class="chain-selector"
        @select-chain="onSelectChain"
      >
      </ChainSelect>
    </div>
  </CardGraph>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { CardGraph } from "@/Framework";
import { minDelay, round, unit } from "@/Util";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { getHost } from "@/Services/Host";
import { ChainTopPoolRevenue } from "@CM/Pages/Platform/Revenue/Models/Revenue";
import ChainSelect from "@CM/Pages/Platform/Revenue/Components/ChainSelect.vue";
import { useCurveStore } from "@CM/Pages/Platform/Store";
import { useCurveMonitorStore } from "@CM/Store";
import { Chain } from "@CM/Pages/Platform/Revenue/Models/Chain";
import { ChainTopPoolsRevenueService } from "@CM/Pages/Platform/Revenue/Services/RevenueService";

const topPoolService = new ChainTopPoolsRevenueService(getHost());

// Refs
const store = useCurveStore();
const storeCM = useCurveMonitorStore();

const loading = ref(false);

const selectedChain = computed((): Chain | null => {
  return store.selectedChain;
});

const topPools = computed((): ChainTopPoolRevenue[] => {
  return selectedChain.value ? store.topPools[selectedChain.value] ?? [] : [];
});

const options = computed((): unknown => {
  const colors = getColors(storeCM.theme);
  const colorsArray = getColorsArray(storeCM.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      legend: {
        inverseOrder: true,
      },
      fill: {
        type: "solid",
        opacity: 0.9,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        style: {
          fontSize: "11px",
        },
        formatter: dollarFormatter,
        dropShadow: false,
      },
      grid: {
        strokeDashArray: 2,
      },
      tooltip: {
        enabled: false,
      },
      chart: {
        id: "chainRevenues",
        type: "bar",
        animations: {
          enabled: false,
        },
      },
      colors: colorsArray,
      xaxis: {
        categories: topPools.value.map((x) => x.name),
        labels: {
          formatter: dollarFormatter,
        },
      },
    }
  );
});

// Hooks
onMounted(() => {
  onSelectChain("mainnet");
});

const series = computed((): { data: number[] }[] => {
  return [{ data: topPools.value.map((x) => x.totalDailyFeesUSD) }];
});

// Methods
const dollarFormatter = (x: number): string => {
  return `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};

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

// Events
const onSelectChain = (chain: Chain): void => {
  store.selectedChain = chain;
  void getTopPools(chain);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chain-top-pools {
  height: calc(100% - 2.5rem);

  .chain-selector-container {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
