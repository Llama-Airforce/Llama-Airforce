<template>
  <CardChart
    class="chart"
    title="Liquidity Usage"
    :loading="loading"
    :options="options"
    :series="series"
  ></CardChart>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { useSettingsStore } from "@CM/Stores";
import { useQueryLiquidityTop } from "@CM/Services/Protocol/Queries";

// Refs
const { theme } = storeToRefs(useSettingsStore());

// Data
const { isFetching: loading, data } = useQueryLiquidityTop();

const options = computed(() => {
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

.cart-chart {
  :deep(.card-body) {
    @media only screen and (max-width: 1280px) {
      height: 200px;
    }
  }
}
</style>
