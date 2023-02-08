<template>
  <div
    ref="chartRef"
    class="chart"
  ></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { $ref, $computed } from "vue/macros";
import { chain } from "lodash";
import {
  ColorType,
  createChart as createChartFunc,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  LineData,
  LineStyle,
  LineType,
  UTCTimestamp,
} from "lightweight-charts";
import { round, unit } from "@/Util";
import type { Price } from "@/Pages/CurveMonitor/Models";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";

// Refs
const store = useCurveMonitorStore();

const chartRef = $ref<HTMLElement | null>(null);
let chart: IChartApi | null = $ref(null);
let areaSeries: ISeriesApi<"Area"> | null = $ref(null);

let max = $ref(1);
let min = $ref(0);

const prices = $computed((): Price[] => {
  return store.prices;
});

// Hooks
onMounted((): void => {
  if (!chartRef) return;

  chart = createChartFunc(chartRef, {
    width: chartRef.clientWidth,
    height: chartRef.clientHeight,
    layout: {
      background: {
        type: ColorType.Solid,
        color: "rgba(255, 255, 255, 0)",
      },
      textColor: "#71717a",
      fontFamily: "SF Mono, Consolas, monospace",
    },
    grid: {
      vertLines: {
        visible: false,
      },
      horzLines: {
        color: "#35353b",
        style: LineStyle.Solid,
      },
    },
    crosshair: {
      mode: CrosshairMode.Magnet,
      horzLine: {
        visible: false,
      },
    },
    rightPriceScale: {
      borderVisible: false,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    timeScale: {
      borderVisible: false,
    },
    localization: {
      priceFormatter: (price: number) => formatterPrice(price),
    },
  });

  initChart();
  createChart(prices);
});

// Watches
watch(
  () => prices,
  (newPrices) => {
    initChart();
    createChart(newPrices);
  }
);

// Methods
const initChart = (): void => {
  if (!chart) {
    return;
  }

  areaSeries = chart.addAreaSeries({
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: "rgb(32, 129, 240)",
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  });
};

const createChart = (newPrices: Price[]): void => {
  if (!chart || !areaSeries) {
    return;
  }

  const newLineSeries: LineData[] = chain(newPrices)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newLineSeries.length > 0) {
    areaSeries.setData(newLineSeries);
    chart.timeScale().fitContent();

    min = Math.min(...newLineSeries.map((c) => c.value));
    max = Math.max(...newLineSeries.map((c) => c.value));
  }
};

const formatterPrice = (x: number): string => {
  // Count number of leading zeroes after the decimal.
  const delta = max - min;
  const y = delta > 1 ? delta - Math.floor(delta) : delta;
  const m = -Math.floor(Math.log10(y) + 1) + 2;

  return `${round(x, m, "dollar")}${unit(x, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart {
  height: 100%;
  z-index: 0;
}
</style>
