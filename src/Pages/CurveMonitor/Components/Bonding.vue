<template>
  <Card
    class="bondings"
    :title="t('title')"
  >
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { $computed, $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
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
import { Card } from "@/Framework";
import { round, unit } from "@/Util";
import type { Bonding } from "@/Pages/CurveMonitor/Models";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import { onMounted, watch } from "vue";

const { t } = useI18n();

const chartRef = $ref<HTMLElement | null>(null);
let chart: IChartApi | null = $ref(null);
let lineSerie: ISeriesApi<"Line"> | null = $ref(null);

// Refs
const store = useCurveMonitorStore();

const bondings = $computed((): Bonding[] => {
  return store.bondings;
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
      visible: false,
    },
    leftPriceScale: {
      visible: true,
      borderVisible: false,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    timeScale: {
      borderVisible: false,
      fixLeftEdge: true,
      fixRightEdge: true,
      tickMarkFormatter: (time: UTCTimestamp) => formatter(time),
    },
    handleScale: {
      axisPressedMouseMove: {
        time: false,
        price: false,
      },
    },
    localization: {
      priceFormatter: (price: number) => formatter(price),
      timeFormatter: (time: number) => formatter(time),
    },
  });
});

// Watches
watch(
  () => bondings,
  (newBondings) => {
    initCharts();
    createChart(newBondings);
  }
);

// Methods
const initCharts = (): void => {
  if (!chart) {
    return;
  }

  lineSerie = chart.addLineSeries({
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    color: "rgb(32, 129, 240)",
    lastValueVisible: false,
    priceLineVisible: false,
  });
};

const createChart = (newBondings: Bonding[]): void => {
  if (!chart || !lineSerie) {
    return;
  }

  const newSerie: LineData[] = chain(newBondings)
    .map((x) => ({
      time: x.x as UTCTimestamp,
      value: x.y,
    }))
    .value();

  if (newSerie.length > 0) {
    lineSerie.setData(newSerie);
  }

  chart.timeScale().fitContent();
};

const formatter = (x: number): string => {
  return `${round(Math.abs(x), 0, "dollar")}${unit(x, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.bondings {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;

    .chart {
      height: 100%;
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Bonding Curve
</i18n>
