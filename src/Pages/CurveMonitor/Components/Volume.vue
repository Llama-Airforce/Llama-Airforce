<template>
  <div
    ref="chartRef"
    class="chart"
  ></div>
</template>

<script setup lang="ts">
import { $computed, $ref } from "vue/macros";
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
import type { Volume } from "@/Pages/CurveMonitor/Models";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import { onMounted, watch } from "vue";

const chartRef = $ref<HTMLElement | null>(null);
let chart: IChartApi | null = $ref(null);
let areaSerie: ISeriesApi<"Area"> | null = $ref(null);

// Refs
const store = useCurveMonitorStore();

const volumes = $computed((): Volume[] => {
  return store.volumes;
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
      priceFormatter: (price: number) => formatter(price),
    },
  });

  initChart();
  createChart(volumes);
});

// Watches
watch(
  () => volumes,
  (newVolumes) => {
    initChart();
    createChart(newVolumes);
  }
);

// Methods
const initChart = (): void => {
  if (!chart) {
    return;
  }

  areaSerie = chart.addAreaSeries({
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

const createChart = (newVolume: Volume[]): void => {
  if (!chart || !areaSerie) {
    return;
  }

  const newSerie: LineData[] = chain(newVolume)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.volume,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerie.length > 0) {
    areaSerie.setData(newSerie);
  }

  chart.timeScale().fitContent();
};

const formatter = (x: number): string => {
  return `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart {
  height: 100%;
  z-index: 0;
}
</style>
