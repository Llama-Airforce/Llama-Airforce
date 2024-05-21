<template>
  <CardChart
    class="lp-revenue"
    :options="options"
    :series="lpRevenueBreakdown"
  >
  </CardChart>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { type RevenueBreakdown } from "@CM/Pages/Convex/Revenue/Models/Revenue";
import { useConvexStore } from "@CM/Pages/Convex/Store";
import { useSettingsStore } from "@CM/Stores";

// Refs
const store = useConvexStore();

const { theme } = storeToRefs(useSettingsStore());

const lpRevenueBreakdown = computed((): RevenueBreakdown[] => [
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

const categories = computed((): Date[] =>
  store.historicalRevenue.map((x) => new Date(x.timestamp * 1000))
);

const options = computed((): unknown => {
  const { colors } = theme.value;

  return createChartStyles(theme.value, {
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
    colors: [colors.blue, colors.yellow, colors.purple],
    labels: lpRevenueBreakdown.value.map((x) => x.name),
  });
});

// Methods
const dollarFormatter = (x: number): string =>
  `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
</script>
