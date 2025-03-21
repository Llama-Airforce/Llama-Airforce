<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import type { CrvUsdSupply } from "@curvefi/prices-api/crvusd";

type Serie = { name: string; data: { x: string; y: number }[] };

const { data } = defineProps<{
  data: CrvUsdSupply[];
}>();

const options = computed(() =>
  createChartStyles({
    chart: {
      type: "bar",
      stacked: true,
      animations: {
        enabled: false,
      },
    },
    xaxis: {
      categories: categories.value,
      labels: {
        formatter: formatterX,
        rotate: 0,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: formatterY,
      },
      min: 0,
      max: max.value,
    },
    plotOptions: {
      bar: {
        columnWidth: "75%",
        dataLabels: {
          position: "top",
          hideOverflowingLabels: false,
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      followCursor: false,
      enabled: true,
    },
  })
);

const categories = computed(() =>
  data
    .orderBy((x) => x.timestamp.getTime(), "asc")
    .groupBy((x) => x.timestamp.getTime())
    .entries()
    .map(([timestamp]) =>
      new Date(parseInt(timestamp, 10)).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
      })
    )
    .map((x, i) => (i % 8 === 0 ? x : ""))
);

const series = computed((): Serie[] =>
  data
    .groupBy((x) => x.market)
    .entries()
    .map(([market, supplyData]) => ({
      name: market,
      data: supplyData
        .groupBy((s) => s.timestamp.getTime())
        .entries()
        .map(([timestamp, supplyByTimestamp]) => ({
          x: new Date(parseInt(timestamp, 10)).toLocaleDateString(),
          y: supplyByTimestamp.reduce((acc, s) => acc + s.supply, 0),
        }))
        .orderBy((s) => s.x, "asc"),
    }))
);

const max = computed(
  (): number =>
    Math.max(
      ...data
        .groupBy((x) => x.timestamp.getTime())
        .entries()
        .map(([, supply]) => supply.reduce((acc, x) => acc + x.supply, 0))
    ) * 1.1
);

const formatterX = (x: string) => x;
const formatterY = (y: number) => `${round(y, 1, "dollar")}${unit(y)}`;
</script>

<template>
  <ChartApex
    :options
    :series
  />
</template>

<style scoped>
.chart {
  height: 300px;
  z-index: 0;

  &:deep(.apexcharts-tooltip-title) {
    display: none;
  }
}
</style>
