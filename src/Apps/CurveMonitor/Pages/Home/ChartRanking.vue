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
import { createChartStyles } from "@/Styles/ChartStyles";
import { useSettingsStore } from "@CM/Stores";
import { useQueryTvlGainersLosers } from "@CM/Services/Protocol/Queries";

// Refs
const { theme } = storeToRefs(useSettingsStore());

// Data
const { isFetching: loading, data } = useQueryTvlGainersLosers();

const options = computed((): unknown => {
  const { colors } = theme.value;

  return createChartStyles(theme.value, {
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
  });
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
