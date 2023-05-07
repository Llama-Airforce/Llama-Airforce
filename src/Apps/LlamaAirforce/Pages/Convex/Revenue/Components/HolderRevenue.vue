<template>
  <CardGraph
    class="holder-revenue"
    :options="options"
    :series="holderRevenueBreakdown"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CardGraph } from "@/Framework";
import { round, unit } from "@/Util";
import { createChartStylesLAF } from "@/Styles/ChartStyles";
import { ColorsLAFDark } from "@/Styles/Themes/LAF/Dark";
import { RevenueBreakdown } from "@LAF/Pages/Convex/Revenue/Models/Revenue";
import { useConvexStore } from "@LAF/Pages/Convex/Store";

// Refs
const store = useConvexStore();

const holderRevenueBreakdown = computed((): RevenueBreakdown[] => [
  {
    name: "CRV",
    data: store.historicalRevenue.map((x) => x.crvRevenueToCvxStakersAmount),
  },
  {
    name: "FXS",
    data: store.historicalRevenue.map((x) => x.fxsRevenueToCvxStakersAmount),
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
  createChartStylesLAF({
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
    colors: [ColorsLAFDark.blue, ColorsLAFDark.purple, ColorsLAFDark.red],
    labels: holderRevenueBreakdown.value.map((x) => x.name),
  })
);

// Methods
const dollarFormatter = (x: number): string =>
  `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
</script>
