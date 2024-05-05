<template>
  <div
    ref="chartRef"
    class="chart"
  ></div>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import {
  type ISeriesApi,
  type LineData,
  type AreaSeriesPartialOptions,
  type LineSeriesPartialOptions,
  LineType,
  type UTCTimestamp,
} from "lightweight-charts";
import { useLightweightChart } from "@/Framework";
import { round, unit } from "@/Util";
import { getColors } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import { type CrvUsdSupply } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

// Props
interface Props {
  data: CrvUsdSupply[];
}

const { data = [] } = defineProps<Props>();

// Refs
let supplySerie: ISeriesApi<"Area">;
let debtSerie: ISeriesApi<"Line">;

const storeSettings = useSettingsStore();
const theme = computed(() => storeSettings.theme);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    supplySerie = chart.addAreaSeries(
      createSupplyOptionsSerie(storeSettings.theme)
    );
    debtSerie = chart.addLineSeries(
      createDebtOptionsSerie(storeSettings.theme)
    );
  }
);

// Watches
watch(() => data, createSeries);
watch(theme, (newTheme) => {
  supplySerie.applyOptions(createSupplyOptionsSerie(newTheme));
  debtSerie.applyOptions(createDebtOptionsSerie(newTheme));
});

// Chart
function createOptionsChart(chartRef: HTMLElement, theme: string) {
  return createChartStyles(chartRef, theme as Theme, {
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
}

function createSupplyOptionsSerie(theme: Theme): AreaSeriesPartialOptions {
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
}

function createDebtOptionsSerie(theme: Theme): LineSeriesPartialOptions {
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
}

function createSeries(newSupply: CrvUsdSupply[]): void {
  if (!chart.value || !supplySerie) {
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

  chart.value.timeScale().fitContent();
}

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
