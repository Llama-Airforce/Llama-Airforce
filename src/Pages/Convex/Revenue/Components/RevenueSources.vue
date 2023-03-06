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
import { Colors, round, unit } from "@/Util";
import createChartStyles from "@/Styles/ChartStyles";
import { RevenueSource } from "@/Pages/Convex/Revenue/Models/Revenue";
import { useConvexStore } from "@/Pages/Convex/Store";

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
    source: "Bribes",
    value: store.revenue.totalBribeRevenue,
  },
]);

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
    colors: [Colors.blue, Colors.green, Colors.purple, Colors.red],
    labels: revenueBreakdown.value.map((x) => x.source),
  })
);

const series = computed(() => revenueBreakdown.value.map((x) => x.value));

// Methods
const dollarFormatter = (x: number): string =>
  `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
</script>
