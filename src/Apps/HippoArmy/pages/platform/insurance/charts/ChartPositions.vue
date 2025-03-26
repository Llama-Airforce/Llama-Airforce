<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import type { Bin } from "@HA/services/insurance/schema";

const { bins } = defineProps<{
  bins: Bin[];
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
    },
    xaxis: {
      categories: categories.value,
      labels: {
        formatter: (x: string) => x,
        rotate: -60,
      },
      tickPlacement: "on",
    },
    yaxis: {
      labels: {
        formatter: (y: number) => y,
      },
    },
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
        const count = x.series[0][x.dataPointIndex];
        const range = categories.value[x.dataPointIndex];
        return `<div><b>Range</b>: ${range}</div><div><b>Users</b>: ${count}</div>`;
      },
    },
  })
);

const categories = computed((): string[] =>
  bins.map((bin) => {
    const minValueFormatted = bin.minValue
      ? `${round(bin.minValue, 0, "dollar")}${unit(bin.minValue)}`
      : "0";
    const maxValueFormatted = bin.maxValue
      ? `${round(bin.maxValue, 0, "dollar")}${unit(bin.maxValue)}`
      : "0";

    return `${minValueFormatted} - ${maxValueFormatted}`;
  })
);

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: "Users",
    data: bins.map((bin) => bin.count),
  },
]);
</script>

<template>
  <Card title="User positions">
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
