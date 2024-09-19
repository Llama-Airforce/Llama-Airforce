<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { type LiquidationAggregate } from "@CM/Services/Liquidations";

type Serie = { name: string; data: { x: string; y: number }[] };

const { liqs = [] } = defineProps<{
  liqs: LiquidationAggregate[];
}>();

const options = computed(() => {
  return createChartStyles({
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
      show: true,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      followCursor: false,
      enabled: true,
    },
  });
});

const categories = computed((): string[] =>
  liqs
    .orderBy((x) => x.timestamp, "asc")
    .groupBy((x) => x.timestamp)
    .entries()
    .map(([timestamp]) =>
      new Date(parseInt(timestamp, 10) * 1000).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
      })
    )
    .map((x, i) => (i % 8 === 0 ? x : ""))
);

const series = computed((): Serie[] => [
  {
    name: "Self liquidations",
    data: Object.values(liqs).map((s) => ({
      x: new Date(s.timestamp * 1000).toLocaleDateString(),
      y: s.selfValue,
    })),
  },
  {
    name: "Hard liquidations",
    data: Object.values(liqs).map((s) => ({
      x: new Date(s.timestamp * 1000).toLocaleDateString(),
      y: s.hardValue,
    })),
  },
]);

const max = computed(
  (): number =>
    Math.max(
      ...liqs
        .groupBy((x) => x.timestamp)
        .entries()
        .map(([, supply]) =>
          supply.reduce((acc, x) => acc + x.selfValue + x.hardValue, 0)
        )
    ) * 1.1
);

const formatterX = (x: string): string => x;

const formatterY = (y: number): string =>
  `${round(y, 1, "dollar")}${unit(y, "dollar")}`;
</script>

<template>
  <ChartApex
    :options
    :series
  ></ChartApex>
</template>

<style scoped>
.chart {
  height: 300px;
}
</style>
