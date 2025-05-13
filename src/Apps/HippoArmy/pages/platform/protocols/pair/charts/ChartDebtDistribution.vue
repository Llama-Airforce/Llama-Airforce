<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { round, unit } from "@/Utils/Number";
import type { DebtDistributionResponse } from "@HA/services/health/schema";

const { data } = defineProps<{
  data: DebtDistributionResponse | undefined;
}>();

const options = computed(() =>
  createChartStyles({
    chart: {
      type: "bar",
      animations: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      stacked: false,
    },
    xaxis: {
      categories: categories.value,
      labels: {
        formatter: (x: string) => x,
        rotate: -30,
        offsetY: 10,
        rotateAlways: true,
      },
      tickPlacement: "on",
    },
    yaxis: [
      {
        title: {
          text: "Users",
        },
        labels: {
          formatter: (y: number) => y,
        },
      },
      {
        opposite: true,
        title: {
          text: "Total Debt ($)",
        },
        labels: {
          formatter: (y: number) => `$${round(y, 0, "dollar")}${unit(y)}`,
        },
      },
    ],
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      followCursor: false,
      enabled: true,
      intersect: true,
      custom: (x: DataPoint<number>) => {
        const userCount = x.series[0][x.dataPointIndex];
        const debt = x.series[1][x.dataPointIndex];
        const range = categories.value[x.dataPointIndex];
        return `<div style="display: grid; grid-template-columns: auto 1fr; gap: 1ch; align-items: center;">
                <div><b>Range:</b></div><div>${range}</div>
                <div><b>Users:</b></div><div>${userCount}</div>
                <div><b>Debt:</b></div><div>$${round(debt, 2, "dollar")}${unit(
          debt
        )}</div>
                <div><b>Avg Debt/User:</b></div><div>$${round(
                  debt / userCount,
                  2,
                  "dollar"
                )}${unit(debt / userCount)}</div>
                </div>`;
      },
    },
    legend: {
      show: true,
    },
  })
);

const categories = computed((): string[] =>
  (data?.bins ?? []).map((bin) => {
    const [min, max] = bin.rangeLabel.split(" - ").map(parseFloat);
    const formattedMin = `$${round(min, 0, "dollar")}${unit(min)}`;
    const formattedMax = `$${round(max, 0, "dollar")}${unit(max)}`;
    return `${formattedMin} - ${formattedMax}`;
  })
);

const series = computed(() => [
  {
    name: "Users",
    type: "column",
    data: (data?.bins ?? []).map((bin) => bin.userCount),
  },
  {
    name: "Debt",
    type: "line",
    data: (data?.bins ?? []).map((bin) => bin.totalDebt),
  },
]);
</script>

<template>
  <Card>
    <ChartApex
      :options
      :series
    />
  </Card>
</template>

<style scoped>
.chart {
  height: 300px;
}
</style>
