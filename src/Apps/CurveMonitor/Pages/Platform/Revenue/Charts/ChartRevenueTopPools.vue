<template>
  <CardChart
    class="graph"
    :options
    :series
    :loading
    :title="t('title')"
  >
    <div
      class="selector"
      :class="{ loading }"
    >
      <SelectChain
        :chain="chain"
        @select-chain="onSelectChain"
      >
      </SelectChain>
    </div>
  </CardChart>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { useSettingsStore } from "@CM/Stores";
import type { Chain } from "@CM/Models/Chain";
import SelectChain from "@CM/Components/SelectChain.vue";
import { useQueryTopPools } from "@CM/Services/Revenue/Queries";

const { t } = useI18n();

// Refs
const { theme } = storeToRefs(useSettingsStore());

const chain = ref<Chain>("ethereum");

// Data
const { isFetching: loading, data: topPools } = useQueryTopPools(chain);

// Chart
const options = computed((): unknown => {
  return createChartStyles(theme.value, {
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
  });
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

// Events
const onSelectChain = (newChain: Chain | "all"): void => {
  if (newChain !== "all") {
    chain.value = newChain;
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

<i18n lang="yaml" locale="en">
title: Top 10 pools by revenue (last 7 days)
</i18n>
