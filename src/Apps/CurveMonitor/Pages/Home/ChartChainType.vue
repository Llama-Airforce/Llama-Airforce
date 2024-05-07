<template>
  <CardGraph
    class="chart"
    title="TVL & Volume per Chain"
    :loading="loading"
    :options="options"
    :series="series"
  ></CardGraph>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import CurveService from "@CM/Pages/Home/Services/CurveService";
import { useSettingsStore } from "@CM/Stores";

const curveService = new CurveService(getHost());

// Refs
const { theme } = storeToRefs(useSettingsStore());

// Data
const { loading, data } = usePromise(
  () =>
    curveService
      .getTvlBreakdownChain()
      .then((x) => x.tvl_breakdown_chain.sort((a, b) => b.tvl - a.tvl)),
  []
);

// eslint-disable-next-line max-lines-per-function
const options = computed((): unknown => {
  return createChartStyles(theme.value, {
    chart: {
      type: "bar",
      stacked: true,
      stackType: "100%",
      animations: {
        enabled: false,
      },
    },
    legend: {
      position: "top",
    },
    xaxis: { categories: ["TVL", "Volume"] },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      followCursor: false,
      enabled: true,
      intersect: false,
      custom: (x: DataPoint<[number, number]>) => {
        const chain = series.value[x.seriesIndex].name;
        const delta = x.series[x.seriesIndex][x.dataPointIndex];

        const data = [
          `<div><b>${chain}</b>:</div><div>${formatter(delta[0])}</div>`,
        ];

        return data.join("");
      },
    },
  });
});

const series = computed((): { name: string; data: number[] }[] => {
  return [...data.value.map((x) => ({ name: x.chain, data: [x.tvl, x.tvl] }))];
});

// Methods
const formatter = (x: number): string => {
  return `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.card-graph {
  ::v-deep(.card-body) {
    @media only screen and (max-width: 1280px) {
      height: 200px;
    }
  }
}
</style>
