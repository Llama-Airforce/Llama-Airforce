<template>
  <CardGraph
    class="chart"
    title="crvUSD Price Deviation from $1 Histogram"
    :loading="loading"
    :options="options"
    :series="series"
  ></CardGraph>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { CardGraph } from "@/Framework";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { type DataPoint, round, unit } from "@/Util";
import { getHost } from "@/Services/Host";
import CurveService, {
  type PriceHistogram,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import { useSettingsStore } from "@CM/Stores/SettingsStore";

const curveService = new CurveService(getHost());

// Refs
const storeSettings = useSettingsStore();

const loading = ref(true);
const data = ref<PriceHistogram>({ x: [], y: [] });

// eslint-disable-next-line max-lines-per-function
const options = computed(() => {
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
      xaxis: {
        categories: categories.value,
        labels: {
          formatter: formatterX,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
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
        custom: (x: DataPoint<number>) => {
          const price = categories.value[x.dataPointIndex];
          const count = x.series[0][x.dataPointIndex];

          const data = [
            `<div><b>${price}</b>:</div><div>${formatterY(count)}</div>`,
          ];

          return data.join("");
        },
      },
    }
  );
});

const categories = computed((): string[] =>
  data.value.x.map((x) => x.toString())
);

const series = computed((): { data: number[] }[] => [
  {
    data: data.value.y,
  },
]);

// Hooks
onMounted(async () => {
  loading.value = true;

  data.value = await curveService.getCrvUsdPriceHistogram();

  loading.value = false;
});

// Methods
const formatterX = (x: number): string => {
  const delta = x - 1;

  return delta < 0
    ? `-$${delta.toString().substring(2, 7)}`
    : `$${delta.toString().substring(1, 6)}`;
};

const formatterY = (x: number): string => {
  const sumY = series.value[0]?.data?.reduce((acc, x) => acc + x, 0) ?? 1;
  const y = (x / sumY) * 100;

  return `${round(y, 0, "dollar")}${unit(y, "percentage")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.card-graph {
  ::v-deep(.card-body) {
    height: 300px;

    @media only screen and (max-width: 1280px) {
      height: 300px;
    }
  }
}
</style>
