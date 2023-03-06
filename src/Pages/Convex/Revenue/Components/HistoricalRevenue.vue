<template>
  <CardGraph
    class="historical-revenue"
    :options="options"
    :series="historicalRevenueBreakdown"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CardGraph } from "@/Framework";
import { Colors, round, unit } from "@/Util";
import createChartStyles from "@/Styles/ChartStyles";
import { RevenueBreakdown } from "@/Pages/Convex/Revenue/Models/Revenue";
import { useConvexStore } from "@/Pages/Convex/Store";

// Refs
const store = useConvexStore();

const historicalRevenueBreakdown = computed((): RevenueBreakdown[] => [
  {
    name: "CRV",
    data: store.historicalRevenue.map((x) => x.totalCrvRevenue),
  },
  {
    name: "FXS",
    data: store.historicalRevenue.map((x) => x.totalFxsRevenue),
  },
  {
    name: "3CRV",
    data: store.historicalRevenue.map(
      (x) => x.threeCrvRevenueToCvxCrvStakersAmount
    ),
  },
  {
    name: "Bribes",
    data: store.historicalRevenue.map((x) => x.bribeRevenue),
  },
]);

const categories = computed((): Date[] =>
  store.historicalRevenue.map((x) => new Date(x.timestamp * 1000))
);

const options = computed((): unknown =>
  createChartStyles({
    legend: {
      inverseOrder: true,
    },
    stroke: {
      width: 0.5,
    },
    fill: {
      type: "solid",
      opacity: 0.9,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: categories.value.map((x) => x.toISOString().split("T")[0]),
    },
    yaxis: {
      labels: {
        formatter: dollarFormatter,
      },
    },
    tooltip: {
      inverseOrder: true,
      style: {
        fontSize: "10px",
      },
      y: {
        formatter: dollarFormatter,
      },
    },
    chart: {
      id: "chainRevenues",
      type: "bar",
      stacked: true,
      animations: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [Colors.blue, Colors.purple, Colors.green, Colors.red],
    labels: historicalRevenueBreakdown.value.map((x) => x.name),
  })
);

// Methods
const dollarFormatter = (x: number): string =>
  `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
</script>
