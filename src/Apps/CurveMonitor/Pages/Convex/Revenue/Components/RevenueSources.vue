<template>
  <CardChart
    class="breakdown-revenue"
    :options="options"
    :series="series"
  >
  </CardChart>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { type RevenueSource } from "@CM/Pages/Convex/Revenue/Models/Revenue";
import { useConvexStore } from "@CM/Pages/Convex/Store";
import { useSettingsStore } from "@CM/Stores";

// Refs
const store = useConvexStore();

const { theme } = storeToRefs(useSettingsStore());

const revenueBreakdown = computed((): RevenueSource[] => [
  { source: "CRV", value: store.revenue.totalCrvRevenue },
  {
    source: "3CRV",
    value: store.revenue.totalThreeCrvRevenueToCvxCrvStakers,
  },
  { source: "FXS", value: store.revenue.totalFxsRevenue },
  {
    source: "Others (POL, Votemarket)",
    value: store.revenue.totalOtherRevenue,
  },
  {
    source: "Bribes",
    value: store.revenue.totalBribeRevenue,
  },
]);

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
      pie: {
        donut: {
          size: "60%",
        },
        dataLabels: {
          offset: 5,
          minAngleToShowLabel: 3,
        },
      },
    },
    dataLabels: {
      style: {
        fontSize: "12px",
      },
      formatter: function (x: number) {
        return Math.round(x).toString() + "%";
      },
      dropShadow: false,
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
      type: "donut",
      animations: {
        enabled: false,
      },
    },
    colors: [
      colors.blue,
      colors.green,
      colors.purple,
      colors.yellow,
      colors.red,
    ],
    labels: revenueBreakdown.value.map((x) => x.source),
  });
});

const series = computed(() => revenueBreakdown.value.map((x) => x.value));

// Methods
const dollarFormatter = (x: number): string =>
  `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
</script>
