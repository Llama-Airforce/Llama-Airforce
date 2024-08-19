<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { useSettingsStore } from "@CM/Stores";
import { useQueryRevenueChains } from "@CM/Services/Revenue/Queries";

const { t } = useI18n();

// Refs
const { theme } = storeToRefs(useSettingsStore());

// Data
const { isFetching: loading, data: chainRevenues } = useQueryRevenueChains();

// Chart
const options = computed(() => {
  return createChartStyles(theme.value, {
    chart: {
      id: "chainRevenues",
      type: "donut",
      animations: {
        enabled: false,
      },
    },
    legend: {
      inverseOrder: true,
    },
    stroke: {
      width: 0.5,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      custom: (x: DataPoint<number>) => {
        const chain = x.w.globals.labels[x.seriesIndex];
        const revenue = x.series[x.seriesIndex][0];

        const data = [
          `<div><b>${chain}</b>:</div><div>${formatter(revenue)}</div>`,
        ];

        return data.join("");
      },
    },
    labels: chainRevenues.value.map((x) => x.chain),
  });
});

const series = computed(() =>
  chainRevenues.value.map((x) => x.totalDailyFeesUSD)
);

// Methods
const formatter = (x: number): string =>
  `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
</script>

<template>
  <CardChart
    class="chart"
    :options
    :series
    :loading
    :title="t('title')"
  >
  </CardChart>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart {
  :deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto auto;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Total revenue by chain
</i18n>
