<template>
  <CardGraph
    class="breakdown-revenue"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CardGraph } from "@/Framework";
import { round, unit } from "@/Util";
import { createChartStylesLAF } from "@/Styles/ChartStyles";
import { ColorsLAFDark } from "@/Styles/Themes/LAF/Dark";
import { RevenueSource } from "@LAF/Pages/Convex/Revenue/Models/Revenue";
import { useConvexStore } from "@LAF/Pages/Convex/Store";

// Refs
const store = useConvexStore();

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
      ColorsLAFDark.blue,
      ColorsLAFDark.green,
      ColorsLAFDark.purple,
      ColorsLAFDark.yellow,
      ColorsLAFDark.red,
    ],
    labels: revenueBreakdown.value.map((x) => x.source),
  })
);

const series = computed(() => revenueBreakdown.value.map((x) => x.value));

// Methods
const dollarFormatter = (x: number): string =>
  `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
</script>
