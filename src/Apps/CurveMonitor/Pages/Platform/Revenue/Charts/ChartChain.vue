<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { useQueryRevenueChains } from "@CM/queries/revenue";

// Data
const { isFetching: loading, data: chainRevenues } = useQueryRevenueChains();

// Chart
const options = computed(() => {
  return createChartStyles({
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
  `$${round(Math.abs(x), 1, "dollar")}${unit(x)}`;
</script>

<template>
  <Card
    title="Total revenue by chain"
    :loading
  >
    <ChartApex
      :options
      :series
    />
  </Card>
</template>

<style scoped>
.chart {
  &:deep(.apexcharts-tooltip) {
    grid-template-rows: auto auto;
  }
}
</style>
