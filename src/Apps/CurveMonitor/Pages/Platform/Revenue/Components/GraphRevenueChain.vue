<template>
  <CardGraph
    class="graph"
    :options
    :series
    :loading
    :title="t('title')"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { useSettingsStore } from "@CM/Stores";
import RevenueService from "@CM/Services/Revenue";

const { t } = useI18n();

const revenueService = new RevenueService(getHost());

// Refs
const { theme } = storeToRefs(useSettingsStore());

// Data
const { isFetching: loading, data: chainRevenues } = useQuery({
  queryKey: ["curve-revenue-chain"],
  queryFn: () =>
    revenueService
      .getByChain()
      .then((x) => x.sort((a, b) => b.totalDailyFeesUSD - a.totalDailyFeesUSD)),
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Chart
const options = computed((): unknown => {
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.graph {
  ::v-deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto auto;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Total revenue by chain
</i18n>
