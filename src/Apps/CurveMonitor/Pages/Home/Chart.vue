<template>
  <CardGraph
    class="lineChart"
    title="LineChart"
    :options="optionsLineChart"
    :series="seriesLineChart"
  ></CardGraph>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CardGraph } from "@/Framework";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { round, unit, type DataPoint, addDays } from "@/Util";
import { useCurveMonitorStore } from "@CM/Store";

// Refs
const store = useCurveMonitorStore();

/** Line Chart */
type SerieLineChart = {
  name: string;
  type: string;
  data: { x: number; y: number }[];
};

// eslint-disable-next-line max-lines-per-function
const optionsLineChart = computed((): unknown => {
  const colors = getColors(store.theme);
  const colorsArray = getColorsArray(store.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        id: "curve-emissions",
        animations: {
          enabled: false,
        },
        toolbar: {
          tools: {
            download: true,
          },
        },
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: [
        {
          seriesName: "emissions",
          tickAmount: 4,
          labels: {
            formatter: (y: number): string => formatterEmissions(y),
          },
          min: 0,
          max: 10,
        },
        {
          seriesName: "emissions",
          tickAmount: 4,
          labels: {
            formatter: (y: number): string => formatterFees(y),
          },
          show: false,
          min: 0,
          max: 10,
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
        custom: (x: DataPoint<SerieLineChart>) => {
          const emissions =
            x.w.globals.initialSeries[0].data[x.dataPointIndex].y;

          const fees = x.w.globals.initialSeries[1].data[x.dataPointIndex]
            ? x.w.globals.initialSeries[1].data[x.dataPointIndex].y
            : 0;

          const data = [
            `<div><b>Emissions</b>:</div><div>${formatterEmissions(
              emissions
            )}</div>`,
            `<div><b>Fees</b>:</div><div>${formatterFees(fees)}</div>`,
          ];

          return data.join("");
        },
      },
      dataLabels: {
        enabled: false,
      },
      csv: {
        filename: "emissions.csv",
        columnDelimiter: ",",
        headerCategory: "category",
        headerValue: "value",
        dateFormatter(timestamp: number) {
          return timestamp;
        },
      },
    }
  );
});

const seriesLineChart = computed((): SerieLineChart[] => {
  return [
    {
      name: "Emissions",
      type: "line",
      data: [
        { x: new Date().getTime(), y: 1 },
        { x: addDays(new Date(), 1).getTime(), y: 5 },
        { x: addDays(new Date(), 2).getTime(), y: 7 },
        { x: addDays(new Date(), 3).getTime(), y: 3 },
        { x: addDays(new Date(), 4).getTime(), y: 9 },
      ],
    },
    {
      name: "Fees",
      type: "line",
      data: [
        { x: new Date().getTime(), y: 5 },
        { x: addDays(new Date(), 1).getTime(), y: 0 },
        { x: addDays(new Date(), 2).getTime(), y: 3 },
        { x: addDays(new Date(), 3).getTime(), y: 9 },
        { x: addDays(new Date(), 4).getTime(), y: 2 },
      ],
    },
  ];
});

// Methods
const formatterEmissions = (x: number): string => {
  return `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};

const formatterFees = (x: number): string => {
  return `$${round(x, 1, "dollar")}${unit(x, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.lineChart {
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
