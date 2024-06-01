<template>
  <CardChart
    class="chart"
    title="TVL & Volume per Chain"
    :loading="loading"
    :options="options"
    :series="series"
  ></CardChart>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { useSettingsStore } from "@CM/Stores";
import { useQueryTvlBreakdown } from "@CM/Services/Protocol/Queries";

// Refs
const { theme } = storeToRefs(useSettingsStore());

// Data
const { isFetching: loading, data } = useQueryTvlBreakdown();

const options = computed(() => {
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

.cart-chart {
  ::v-deep(.card-body) {
    @media only screen and (max-width: 1280px) {
      height: 200px;
    }
  }
}
</style>
