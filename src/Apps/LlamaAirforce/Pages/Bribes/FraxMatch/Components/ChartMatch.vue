<template>
  <CardChart
    class="matching"
    :title="t('title')"
    :options="options"
    :series="series"
  >
  </CardChart>
</template>

<script setup lang="ts">
import { createChartStylesLAF } from "@/Styles/ChartStyles";
import type { EpochFrax } from "@LAF/Pages/Bribes/FraxMatch/Models/EpochFrax";

type Serie = {
  name: string;
  data: number[];
};

const { t } = useI18n();

// Props
interface Props {
  epochs: EpochFrax[];
}

const { epochs = [] } = defineProps<Props>();

// Refs
const bribesNative = computed((): number[] =>
  epochs.map((epoch) => epoch.native)
);
const bribesFrax = computed((): number[] => epochs.map((epoch) => epoch.frax));
const categories = computed(() => epochs.map((epoch) => epoch.round));

const options = computed(() => {
  return createChartStylesLAF({
    chart: {
      id: "frax-match",
      type: "bar",
      stacked: true,
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
      categories,
    },
    yaxis: {
      labels: {
        formatter: (y: number): string => formatter(y),
      },
    },
    plotOptions: {
      bar: {
        columnWidth:
          optimalColumnWidthPercent(categories.value.length).toString() + "%",
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
        const native = x.w.globals.initialSeries[0].data[x.dataPointIndex];

        const frax = x.w.globals.initialSeries[1].data[x.dataPointIndex]
          ? x.w.globals.initialSeries[1].data[x.dataPointIndex]
          : 0;

        const data = [
          `<div><b>Native</b>:</div><div>${formatter(native)}</div>`,
          `<div><b>Frax</b>:</div><div>${formatter(frax)}</div>`,
        ];

        return data.join("");
      },
    },
    dataLabels: {
      enabled: false,
      formatter: (_value: number, x: DataPoint<Serie>) => {
        if (x.seriesIndex === x.w.config.series.length - 1) {
          const sum = x.w.globals.stackedSeriesTotals[x.dataPointIndex];
          return `$${round(sum, 2, "dollar")}${unit(sum, "dollar")}`;
        }
        return "";
      },
      offsetY: -25,
      style: {
        fontSize: "12px",
        fontFamily:
          "ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, monospace",
      },
    },
    csv: {
      filename: "fraxmatch.csv",
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
      name: "Bribes Native",
      data: bribesNative.value,
    },
    {
      name: "Bribes Frax",
      data: bribesFrax.value,
    },
  ];
});

// Methods
const formatter = (x: number): string => {
  return `$${round(x, 1, "dollar")}${unit(x, "dollar")}`;
};

const optimalColumnWidthPercent = (numBars: number): number => {
  return 20 + 60 / (1 + 30 * Math.exp(-numBars / 3));
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.matching {
  ::v-deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto auto;
      grid-template-columns: 1fr auto;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Round by Round
</i18n>
