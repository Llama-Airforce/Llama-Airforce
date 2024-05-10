<template>
  <CardGraph
    class="chart"
    title="Liquidity Usage"
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
const { isFetching: loading, data } = useQuery({
  queryKey: ["curve-liquidity-top"],
  queryFn: () =>
    curveService
      .getLiquidityTop()
      .then((x) => x.liquidity_use.sort((a, b) => b.liq_use - a.liq_use)),
  initialData: [],
  initialDataUpdatedAt: 0,
});

const options = computed((): unknown => {
  return createChartStyles(theme.value, {
    chart: {
      type: "bar",
      animations: {
        enabled: false,
      },
    },
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
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
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
            <div>${formatterX(delta)}</div>
            <div>${chain}<div>`;

        return tooltip;
      },
    },
  });
});

const categories = computed((): string[] => data.value.map((x) => x.name));

const series = computed((): { data: number[] }[] => [
  { data: data.value.map((x) => x.liq_use) },
]);

// Methods
const formatterX = (x: number): string => `${round(Math.abs(x), 2, "dollar")}`;

const formatterY = (x: string): string => x.toString().substring(0, 12);
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
