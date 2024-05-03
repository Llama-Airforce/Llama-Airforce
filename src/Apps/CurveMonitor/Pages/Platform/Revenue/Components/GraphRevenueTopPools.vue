<template>
  <CardGraph
    class="graph"
    :options="options"
    :series="series"
    :loading="loading"
  >
    <div
      class="selector"
      :class="{ loading }"
    >
      <SelectChain
        :chain="store.selectedChain"
        @select-chain="onSelectChain"
      >
      </SelectChain>
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
import { type ChainTopPoolRevenue } from "@CM/Pages/Platform/Revenue/Services/RevenueService";
import SelectChain from "@CM/Components/SelectChain.vue";
import { useCurveStore } from "@CM/Pages/Platform/Store";
import { useSettingsStore } from "@CM/Stores";
import type { Chain } from "@CM/Models/Chain";
import RevenueService from "@CM/Pages/Platform/Revenue/Services/RevenueService";

const revenueService = new RevenueService(getHost());

// Refs
const store = useCurveStore();
const storeSettings = useSettingsStore();

const loading = ref(false);

const selectedChain = computed((): Chain | null => store.selectedChain);

const topPools = computed((): ChainTopPoolRevenue[] =>
  selectedChain.value ? store.topPools[selectedChain.value] ?? [] : []
);

const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        id: "chainRevenues",
        type: "bar",
        animations: {
          enabled: false,
        },
      },
      xaxis: {
        categories: topPools.value.map((x) => x.name),
        labels: {
          formatter,
        },
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
        formatter,
        dropShadow: false,
      },
      grid: {
        yaxis: {
          lines: {
            show: false,
          },
        },
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      tooltip: {
        enabled: false,
      },
    }
  );
});

// Hooks
onMounted(() => {
  onSelectChain("ethereum");
});

const series = computed((): { data: number[] }[] => [
  { data: topPools.value.map((x) => x.totalDailyFeesUSD) },
]);

// Methods
const formatter = (x: number): string =>
  `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;

const getTopPools = async (chain: string): Promise<void> => {
  if (!chain) {
    return;
  }

  if (store.topPools[chain]) {
    return;
  }

  loading.value = true;

  try {
    const topPools = await minDelay(revenueService.getTopPools(chain), 500);

    if (topPools) {
      store.setTopPools(chain, topPools);
    }
  } finally {
    loading.value = false;
  }
};

// Events
const onSelectChain = (chain: Chain | "all"): void => {
  if (chain !== "all") {
    store.selectedChain = chain;
    void getTopPools(chain);
  }
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.graph {
  height: calc(100% - 2.5rem);

  .selector {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
