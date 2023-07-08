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
  LineSeriesPartialOptions,
  LineType,
  UTCTimestamp,
} from "lightweight-charts";
import { round, unit } from "@/Util";
import { getColors } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@CM/Stores/SettingsStore";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import { type CrvUsdSupply } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

let chart: IChartApi;
let supplySerie: ISeriesApi<"Area">;
let debtSerie: ISeriesApi<"Line">;

interface Props {
  data: CrvUsdSupply[];
}

const { data = [] } = defineProps<Props>();

// Refs
const storeSettings = useSettingsStore();

const chartRef = ref<HTMLElement | null>(null);

// Hooks
onMounted(() => {
  if (!chartRef.value) return;

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, storeSettings.theme)
  );
  supplySerie = chart.addAreaSeries(
    createSupplyOptionsSerie(storeSettings.theme)
  );
  debtSerie = chart.addLineSeries(createDebtOptionsSerie(storeSettings.theme));

  createSeries(data);
});

// Watches
watch(
  () => storeSettings.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      supplySerie.applyOptions(createSupplyOptionsSerie(newTheme));
      debtSerie.applyOptions(createDebtOptionsSerie(newTheme));
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

const createSupplyOptionsSerie = (theme: Theme): AreaSeriesPartialOptions => {
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

const createDebtOptionsSerie = (theme: Theme): LineSeriesPartialOptions => {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    color: colors.yellow,
    lastValueVisible: false,
    priceLineVisible: false,
  };
};

const createSeries = (newSupply: CrvUsdSupply[]): void => {
  if (!chart || !supplySerie) {
    return;
  }

  const newSupplySerie: (LineData & { debt: number })[] = chain(newSupply)
    .groupBy((x) => x.timestamp)
    .mapValues((x) => ({
      time: x[0].timestamp as UTCTimestamp,
      value: x.reduce((acc, y) => acc + y.totalSupply, 0),
      debt: x[0].totalSupply,
    }))
    .entries()
    .map((x) => x[1])
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const newDebtSerie: LineData[] = newSupplySerie.map((x) => ({
    time: x.time,
    value: x.value - x.debt,
  }));

  if (newSupplySerie.length > 0) {
    supplySerie.setData(newSupplySerie);
  }

  if (newDebtSerie.length > 0) {
    debtSerie.setData(newDebtSerie);
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
