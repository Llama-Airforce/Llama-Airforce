<template>
  <CardGraph
    class="bonding"
    title="Bonding Curve"
    :options="options"
    :series="series"
  ></CardGraph>
</template>

<script setup lang="ts">
import { $computed } from "vue/macros";
import { CardGraph } from "@/Framework";
import createChartStyles from "@/Styles/ChartStyles";
import { round, unit, type DataPoint } from "@/Util";

/** Line Chart */
type Serie = {
  name: string;
  type: string;
  data: { x: number; y: number }[];
};

// eslint-disable-next-line max-lines-per-function
const options = $computed((): unknown => {
  return createChartStyles({
    chart: {
      id: "bonding",
      animations: {
        enabled: false,
      },
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      type: "numeric",
      tickAmount: 4,
      labels: {
        formatter: (y: number): string => formatter(y),
      },
      min: 0,
    },
    yaxis: [
      {
        seriesName: "bonding",
        tickAmount: 4,
        labels: {
          formatter: (y: number): string => formatter(y),
        },
        min: 0,
        max: 10000,
      },
    ],
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
        const bondings = x.w.globals.initialSeries[0].data[x.dataPointIndex].y;

        const data = [
          `<div><b>Bonding</b>:</div><div>${Math.round(bondings)}</div>`,
        ];

        return data.join("");
      },
    },
    dataLabels: {
      enabled: false,
    },
  });
});

const series = $computed((): Serie[] => {
  return [
    {
      name: "Bonding",
      type: "line",
      data: [...Array(250).keys()].map((i) => {
        return {
          x: i + 1,
          y: 10000 / ((i + 1) / 20),
        };
      }),
    },
  ];
});

// Methods
const formatter = (x: number): string => {
  return `${round(Math.abs(x), 0, "dollar")}${unit(x, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("mev");

.bonding {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;

    .apexcharts-tooltip {
      width: auto;
      background: rgb(30, 30, 30);
      padding: 1rem;
      line-height: 0.5rem;

      display: grid;
      grid-template-rows: auto;
      grid-template-columns: 1fr auto;
      gap: 0.5rem;
    }
  }
}
</style>
