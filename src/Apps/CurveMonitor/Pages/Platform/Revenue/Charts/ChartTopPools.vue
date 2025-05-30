<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { useQueryTopPools } from "@CM/queries/revenue";
import type { Chain } from "@curvefi/prices-api";

const chain = ref<Chain>("ethereum");

// Data
const { isFetching: loading, data: topPools } = useQueryTopPools(chain);

// Chart
const options = computed(() =>
  createChartStyles({
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
  })
);

// Hooks
onMounted(() => {
  onSelectChain("ethereum");
});

const series = computed((): { data: number[] }[] => [
  { data: topPools.value.map((x) => x.totalDailyFeesUSD) },
]);

// Methods
const formatter = (x: number) =>
  `$${round(Math.abs(x), 1, "dollar")}${unit(x)}`;

// Events
const onSelectChain = (newChain: Chain | "all"): void => {
  if (newChain !== "all") {
    chain.value = newChain;
  }
};
</script>

<template>
  <Card
    class="graph"
    title="Top 10 pools by revenue (last 7 days)"
    :loading
  >
    <template #actions>
      <div
        class="selector"
        :class="{ loading }"
      >
        <SelectChain
          :chain
          :chains="['ethereum']"
          @select-chain="onSelectChain"
        />
      </div>
    </template>

    <ChartApex
      :options
      :series
    />
  </Card>
</template>

<style scoped>
.graph {
  --header-column-title: auto;

  .selector {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
