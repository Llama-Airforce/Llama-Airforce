<template>
  <CardGraph
    class="chain-revenue"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { orderBy } from "lodash";
import { CardGraph } from "@/Framework";
import { round, unit } from "@/Util";
import { createChartStylesLAF } from "@/Styles/ChartStyles";
import { ChainRevenue } from "@LAF/Pages/Curve/Revenue/Models/Revenue";
import { useCurveStore } from "@LAF/Pages/Curve/Store";

// Refs
const store = useCurveStore();

const chainRevenues = computed((): ChainRevenue[] => {
  return orderBy(store.chainRevenues ?? [], (x) => x.totalDailyFeesUSD, "asc");
});

const options = computed((): unknown => {
  return createChartStylesLAF({
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
      "#8C564B",
      "#E377C2",
      "#7F7F7F",
      "#BCBD22",
      "#17BECF",
      "#1F77B4",
      "#FF7F0E",
      "#2CA02C",
      "#D62728",
      "#9467BD",
    ],
    labels: chainRevenues.value.map((x) => x.chain),
  });
});

const series = computed(() =>
  chainRevenues.value.map((x) => x.totalDailyFeesUSD)
);

// Methods
const dollarFormatter = (x: number): string => {
  return `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.pool-revenue {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;

    .apexcharts-tooltip {
      width: auto;
      padding: 0.5rem;
      line-height: 0rem;

      display: grid;
      grid-template-rows: auto auto;
      gap: 0.5rem;
    }
  }
}
</style>
