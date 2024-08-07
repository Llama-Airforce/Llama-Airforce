<template>
  <div class="cards">
    <Recipe title="Line Chart">
      <template #example>
        <CardChart
          class="chart"
          title="Line Chart"
          :options="options"
          :series="series"
        ></CardChart>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="CardChartLine1"
        ></Code>

        <Code
          lang="typescript"
          :code="CardChartLine2"
        ></Code>

        <Code
          lang="scss"
          :code="CardChartLine3"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<script setup lang="ts">
import { createChartStylesLAF } from "@/Styles/ChartStyles";
import Recipe from "@CB/Recipe.vue";

type Serie = {
  name: string;
  type: string;
  data: { x: number; y: number }[];
};

const options = computed(() => {
  return createChartStylesLAF({
    chart: {
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
      custom: (x: DataPoint<Serie>) => {
        const emissions = x.w.globals.initialSeries[0].data[x.dataPointIndex].y;

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
  });
});

const series = computed((): Serie[] => {
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

const CardChartLine1 = `<CardChart
  class="chart"
  title="LineChart"
  :options="options"
  :series="series"
></CardChart>`;

const CardChartLine2 = `import createChartStyles from "@/Styles/ChartStyles";

type Serie = {
  name: string;
  type: string;
  data: { x: number; y: number }[];
};

const optionsLineChart = computed(() => {
  return createChartStyles({
    chart: {
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
        const emissions = x.w.globals.initialSeries[0].data[x.dataPointIndex].y;

        const fees = x.w.globals.initialSeries[1].data[x.dataPointIndex]
          ? x.w.globals.initialSeries[1].data[x.dataPointIndex].y
          : 0;

        const data = [
          \`<div><b>Emissions</b>:</div><div>\${formatterEmissions(
            emissions
          )}</div>\`,
          \`<div><b>Fees</b>:</div><div>\${formatterFees(fees)}</div>\`,
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
  });
});

const series = computed((): Serie[] => {
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
  return \`$\${round(Math.abs(x), 1, "dollar")}\${unit(x, "dollar")}\`;
};

const formatterFees = (x: number): string => {
  return \`$\${round(x, 1, "dollar")}\${unit(x, "dollar")}\`;
};`;

const CardChartLine3 = `.chart {
  height: 400px;

  :deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto auto;
      grid-template-columns: 1fr auto;
    }
  }
}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("cards");

.chart {
  height: 400px;

  :deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto auto;
      grid-template-columns: 1fr auto;
    }
  }
}
</style>
