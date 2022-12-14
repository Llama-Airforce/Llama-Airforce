<template>
  <CardGraph
    class="pool-revenue"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { $computed } from "vue/macros";
import { CardGraph } from "@/Framework";
import { round, unit } from "@/Util";
import createChartStyles from "@/Styles/ChartStyles";
import PoolRevenue from "@/Pages/Curve/Revenue/Models/Revenue";
import { useCurveStore } from "@/Pages/Curve/Store";

type Serie = {
  name: string;
  data: { x: number; y: number }[];
};

// Refs
const store = useCurveStore();

const poolRevenues = $computed((): PoolRevenue[] => {
  return store.poolRevenues ?? [];
});

const options = $computed((): unknown => {
  return createChartStyles({
    stroke: {
      width: 1,
    },
    legend: {
      inverseOrder: true,
    },
    fill: {
      type: "solid",
      opacity: 0.5,
    },
    tooltip: {
      inverseOrder: true,
      style: {
        fontSize: "10px",
      },
    },
    chart: {
      id: "poolRevenues",
      type: "area",
      stacked: true,
      animations: {
        enabled: false,
      },
    },
    colors: [
      "#1F77B4",
      "#AEC7E8",
      "#FF7F0E",
      "#FFBB78",
      "#2CA02C",
      "#98DF8A",
      "#D62728",
      "#FF9896",
      "#9467BD",
      "#C5B0D5",
      "#8C564B",
      "#C49C94",
      "#E377C2",
      "#F7B6D2",
      "#7F7F7F",
      "#C7C7C7",
      "#BCBD22",
      "#DBDB8D",
      "#17BECF",
      "#9EDAE5",
    ],
    xaxis: {
      type: "datetime",
    },
    yaxis: [
      {
        seriesName: "volume",
        tickAmount: 4,
        labels: {
          formatter: (y: number): string => formatter(y),
        },
        min: 0,
        max: series
          .map((x) => Math.max(...x.data.map((x) => x.y)))
          .reduce((acc, rev) => acc + rev, 0),
      },
    ],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        distributed: false,
        dataLabels: {
          position: "top",
          hideOverflowingLabels: false,
        },
      },
    },
  });
});

const series = $computed((): Serie[] => {
  const data = poolRevenues.reduce(
    (acc: { [key: string]: { x: number; y: number }[] }, elem) => {
      const { pool, timestamp, revenue } = elem;
      return {
        ...acc,
        [pool]: [...(acc[pool] || []), { x: timestamp * 1000, y: revenue }],
      };
    },
    {}
  );
  return Object.entries(data)
    .map((x) => ({
      name: x[0],
      data: x[1],
    }))
    .reverse();
});

// Methods
const formatter = (x: number): string => {
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
