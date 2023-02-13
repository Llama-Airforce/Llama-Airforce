<template>
  <CardGraph
    class="historical-revenue"
    :options="options"
    :series="historicalRevenueBreakdown"
  >
  </CardGraph>
</template>

<script setup lang="ts">
/* eslint-disable indent */
import { $computed } from "vue/macros";
import { CardGraph } from "@/Framework";
import { round, unit } from "@/Util";
import createChartStyles from "@/Styles/ChartStyles";
import { RevenueBreakdown } from "@/Pages/Convex/Revenue/Models/Revenue";
import { useConvexStore } from "@/Pages/Convex/Store";

// Refs
const store = useConvexStore();

const historicalRevenueBreakdown = $computed((): RevenueBreakdown[] => {
  return [
    {
      name: "CRV",
      data: store.historicalRevenue
        ? store.historicalRevenue.map((x) => x.totalCrvRevenue)
        : [0],
    },
    {
      name: "FXS",
      data: store.historicalRevenue
        ? store.historicalRevenue.map((x) => x.totalFxsRevenue)
        : [0],
    },
    {
      name: "3CRV",
      data: store.historicalRevenue
        ? store.historicalRevenue.map(
            (x) => x.threeCrvRevenueToCvxCrvStakersAmount
          )
        : [0],
    },
    {
      name: "Bribes",
      data: store.historicalRevenue
        ? store.historicalRevenue.map((x) => x.bribeRevenue)
        : [0],
    },
  ];
});

const categories = $computed((): Date[] => {
  return store.historicalRevenue
    ? store.historicalRevenue.map((x) => new Date(x.timestamp * 1000))
    : [];
});

const options = $computed((): unknown => {
  return createChartStyles({
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
      categories: categories.map((x) => x.toISOString().split("T")[0]),
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
    colors: [
      "rgb(32, 129, 240)",
      "rgb(140, 82, 255)",
      "rgb(126, 217, 87)",
      "rgb(255, 87, 87)",
    ],
    labels: historicalRevenueBreakdown.map((x) => x.name),
  });
});

// Methods
const dollarFormatter = (x: number): string => {
  return `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};
</script>
