<template>
  <CardGraph
    class="breakdown-revenue"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import {$computed} from "vue/macros";
import {CardGraph} from "@/Framework";
import {round, unit} from "@/Util";
import createChartStyles from "@/Styles/ChartStyles";
import {RevenueSource} from "@/Pages/Convex/Revenue/Models/Revenue";
import {useConvexStore} from "@/Pages/Convex/Store";

// Refs
const store = useConvexStore();

const revenueBreakdown = $computed((): RevenueSource[] => {
  return [{"source": "CRV", "value": store.revenue ? store.revenue.totalCrvRevenue : 0},
    {"source": "3CRV", "value": store.revenue ? store.revenue.totalThreeCrvRevenueToCvxCrvStakers : 0},
    {"source": "FXS", "value": store.revenue ? store.revenue.totalFxsRevenue : 0},
    {"source": "Bribes", "value": store.revenue ? store.revenue.totalBribeRevenue : 0}];
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
        return Math.round(x)
          .toString() + "%";
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
      "rgb(32, 129, 240)",
      "rgb(126, 217, 87)",
      "rgb(140, 82, 255)",
      "rgb(255, 87, 87)",
    ],
    labels: revenueBreakdown.map((x) => x.source),
  });
});

const series = $computed(() => revenueBreakdown.map((x) => x.value));

// Methods
const dollarFormatter = (x: number): string => {
  return `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};
</script>

