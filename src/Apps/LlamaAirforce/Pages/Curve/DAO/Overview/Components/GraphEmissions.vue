<template>
  <CardGraph
    class="graph-mock"
    :options="options"
    :series="series"
    title="CRV Emissions"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CardGraph } from "@/Framework";
import { round, unit, type DataPoint } from "@/Util";
import { createChartStylesLAF } from "@/Styles/ChartStyles";

type Serie = {
  name: string;
  type: string;
  data: { x: number; y: number }[];
};

// Refs
const data = computed((): { x: number; y: number }[] => {
  return [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: 3, y: 3 },
    { x: 4, y: 7 },
    { x: 5, y: 4 },
  ];
});

const options = computed((): unknown => {
  return createChartStylesLAF({
    chart: {
      id: "mock",
      animations: {
        enabled: false,
      },
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: 2,
    },
    xaxis: {
      type: "category",
    },
    yaxis: [
      {
        seriesName: "mock",
        tickAmount: 4,
        labels: {
          formatter: (y: number): string => formatter(y),
        },
        min: Math.min(...data.value.map((d) => d.y)),
        max: Math.max(...data.value.map((d) => d.y)),
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
    tooltip: {
      followCursor: false,
      enabled: true,
      intersect: false,
      custom: (x: DataPoint<Serie>) => {
        const y = x.w.globals.initialSeries[0].data[x.dataPointIndex].y;

        const data = [`<div><b>Data</b>:</div><div>${formatter(y)}</div>`];

        return data.join("");
      },
    },
  });
});

const series = computed((): Serie[] => {
  return [
    {
      name: "mock",
      type: "area",
      data: data.value.map((s) => ({
        x: s.x,
        y: s.y,
      })),
    },
  ];
});

// Methods
const formatter = (x: number): string => {
  return `${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.graph-mock {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;

    .apexcharts-tooltip {
      width: auto;
      background: rgb(30, 30, 30);
      padding: 1rem;
      line-height: 0.5rem;

      display: grid;
      grid-template-rows: auto auto;
      grid-template-columns: 1fr auto;
      gap: 0.5rem;
    }
  }
}
</style>
