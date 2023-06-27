<template>
  <div
    ref="chartRef"
    class="chart"
  ></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { chain } from "lodash";
import {
  createChart as createChartFunc,
  IChartApi,
  ISeriesApi,
  LineData,
  AreaSeriesPartialOptions,
  LineType,
  UTCTimestamp,
} from "lightweight-charts";
import { round, unit } from "@/Util";
import { getColors } from "@/Styles/Themes/CM";
import { useCurveMonitorStore } from "@CM/Store";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import { type CrvUsdSupply } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

let chart: IChartApi;
let areaSerie: ISeriesApi<"Area">;

interface Props {
  data: CrvUsdSupply[];
}

const { data = [] } = defineProps<Props>();

// Refs
const store = useCurveMonitorStore();

const chartRef = ref<HTMLElement | null>(null);

// Hooks
onMounted(() => {
  if (!chartRef.value) return;

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, store.theme)
  );
  areaSerie = chart.addAreaSeries(createOptionsSerie(store.theme));

  createSeries(data);
});

// Watches
watch(
  () => store.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      areaSerie.applyOptions(createOptionsSerie(newTheme));
    }
  }
);

watch(
  () => data,
  (newData) => {
    createSeries(newData);
  }
);

// Methods
const createOptionsChart = (chartRef: HTMLElement, theme: Theme) => {
  return createChartStyles(chartRef, theme, {
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    localization: {
      priceFormatter: (price: number) => formatter(price),
    },
  });
};

const createOptionsSerie = (theme: Theme): AreaSeriesPartialOptions => {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: colors.blue,
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
};

const createSeries = (newSupply: CrvUsdSupply[]): void => {
  if (!chart || !areaSerie) {
    return;
  }

  const newSerie: LineData[] = chain(newSupply)
    .groupBy((x) => x.timestamp)
    .mapValues((x) => ({
      time: x[0].timestamp as UTCTimestamp,
      value: x.reduce((acc, y) => acc + y.totalSupply, 0),
    }))
    .entries()
    .map((x) => x[1])
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerie.length > 0) {
    areaSerie.setData(newSerie);
  }

  chart.timeScale().fitContent();
};

const formatter = (y: number): string =>
  `${round(y, 1, "dollar")}${unit(y, "dollar")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart {
  height: 300px;
  z-index: 0;
}
</style>