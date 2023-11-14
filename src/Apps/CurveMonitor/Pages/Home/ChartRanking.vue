<template>
  <CardGraph
    class="chart"
    title="TVL Gainers & Losers"
    :loading="loading"
    :options="options"
    :series="series"
  ></CardGraph>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CardGraph, usePromise } from "@/Framework";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { type DataPoint, round, unit } from "@/Util";
import { getHost } from "@/Services/Host";
import CurveService from "@CM/Pages/Home/Services/CurveService";
import { useSettingsStore } from "@CM/Stores/SettingsStore";

const curveService = new CurveService(getHost());

// Refs
const storeSettings = useSettingsStore();

// Data
const { loading, data } = usePromise(async () => {
  const gainers_ = curveService.getTvlGainers();
  const losers_ = curveService.getTvlLosers();
  const [gainers, losers] = [await gainers_, await losers_];

  return [...gainers.tvl_gainers, ...losers.tvl_losers].sort(
    (a, b) => b.tvl_growth - a.tvl_growth
  );
}, []);

// eslint-disable-next-line max-lines-per-function
const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        type: "bar",
        animations: {
          enabled: false,
        },
      },
      colors: [
        (x: { value: number }) => (x.value < 0 ? colors.red : colors.green),
      ],
      xaxis: {
        categories: categories.value,
        labels: {
          formatter: formatterX,
        },
      },
      yaxis: {
        labels: {
          formatter: formatterY,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "75%",
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        followCursor: false,
        enabled: true,
        intersect: false,
        custom: (x: DataPoint<number>) => {
          const pool = categories.value[x.dataPointIndex];
          const delta = x.series[0][x.dataPointIndex];
          const chain = data.value.find((x) => x.name === pool)?.chain;

          const tooltip = `
            <div><b>${pool}</b>:</div>
            <div>${formatterY(delta)}</div>
            <div>${chain}<div>`;

          return tooltip;
        },
      },
    }
  );
});

const categories = computed((): string[] => data.value.map((x) => x.name));

const series = computed((): { data: number[] }[] => [
  {
    data: data.value.map((x) => x.tvl_growth),
  },
]);

// Methods
const formatterX = (x: string): string => x.toString().substring(0, 12);

const formatterY = (x: number): string =>
  `${round(x, 0, "dollar")}${unit(x, "percentage")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.card-graph {
  ::v-deep(.card-body) {
    @media only screen and (max-width: 1280px) {
      height: 300px;
    }
  }
}
</style>
