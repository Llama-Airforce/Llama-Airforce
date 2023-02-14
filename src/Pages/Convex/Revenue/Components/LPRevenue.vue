<template>
  <CardGraph
    class="lp-revenue"
    :options="options"
    :series="lpRevenueBreakdown"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { $computed } from "vue/macros";
import { CardGraph } from "@/Framework";
import { Colors, round, unit } from "@/Util";
import createChartStyles from "@/Styles/ChartStyles";
import { RevenueBreakdown } from "@/Pages/Convex/Revenue/Models/Revenue";
import { useConvexStore } from "@/Pages/Convex/Store";

// Refs
const store = useConvexStore();

const lpRevenueBreakdown = $computed((): RevenueBreakdown[] => [
  {
    name: "CRV",
    data: store.historicalRevenue.map((x) => x.crvRevenueToLpProvidersAmount),
  },
  {
    name: "CVX",
    data: store.historicalRevenue.map((x) => x.cvxRevenueToLpProvidersAmount),
  },
  {
    name: "FXS",
    data: store.historicalRevenue.map((x) => x.fxsRevenueToLpProvidersAmount),
  },
]);

const categories = $computed((): Date[] =>
  store.historicalRevenue.map((x) => new Date(x.timestamp * 1000))
);

const options = $computed((): unknown =>
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
    colors: [Colors.blue, Colors.yellow, Colors.purple],
    labels: lpRevenueBreakdown.map((x) => x.name),
  })
);

// Methods
const dollarFormatter = (x: number): string =>
  `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
</script>
