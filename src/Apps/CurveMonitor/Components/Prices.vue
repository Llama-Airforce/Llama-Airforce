<template>
  <Card
    class="prices"
    :title="t('title')"
  >
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  ColorType,
  createChart as createChartFunc,
  HistogramData,
  IChartApi,
  ISeriesApi,
  LineData,
  LineStyle,
  LineType,
  UTCTimestamp,
} from "lightweight-charts";
import { Card } from "@/Framework";
import { Colors, round, unit } from "@/Util";
import type { Price, Volume } from "@CM/Models";
import { useCurveMonitorStore } from "@CM/Store";

const { t } = useI18n();

let chart: IChartApi;
let areaSeries: ISeriesApi<"Area">;
let volumeSeries: ISeriesApi<"Histogram">;
let max = 1;
let min = 0;

// Refs
const store = useCurveMonitorStore();

const chartRef = ref<HTMLElement | null>(null);

const prices = computed((): Price[] => {
  return store.prices;
});

const volumes = computed((): Volume[] => {
  return store.volumes;
});

// Hooks
onMounted((): void => {
  if (!chartRef.value) return;

  chart = createChartFunc(chartRef.value, {
    width: chartRef.value.clientWidth,
    height: chartRef.value.clientHeight,
    layout: {
      background: {
        type: ColorType.Solid,
        color: "rgba(255, 255, 255, 0)",
      },
      textColor: Colors.level5,
      fontFamily: "SF Mono, Consolas, monospace",
    },
    grid: {
      vertLines: {
        visible: false,
      },
      horzLines: {
        color: Colors.level4,
        style: LineStyle.Solid,
      },
    },
    leftPriceScale: {
      borderVisible: false,
      scaleMargins: {
        top: 0.6,
        bottom: 0,
      },
    },
    rightPriceScale: {
      borderVisible: false,
    },
    timeScale: {
      borderVisible: false,
      fixLeftEdge: true,
      fixRightEdge: true,
    },
    handleScale: false,
    handleScroll: false,
    localization: {
      priceFormatter: (price: number) => formatterPrice(price),
    },
  });

  initChart();
  createChartPrice(prices.value);
  createChartVolume(volumes.value);
});

// Watches
watch(prices, (newPrices) => {
  createChartPrice(newPrices);
});

watch(volumes, (newVolumes) => {
  createChartVolume(newVolumes);
});

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
    lineColor: Colors.blue,
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  });

  volumeSeries = chart.addHistogramSeries({
    color: Colors.yellow,
    lastValueVisible: false,
    priceFormat: {
      type: "volume",
    },
    priceScaleId: "left",
    priceLineVisible: false,
  });
};

const createChartPrice = (newPrices: Price[]): void => {
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

    const from = newLineSeries[0].time;
    const to = newLineSeries[newLineSeries.length - 1].time;

    chart.timeScale().setVisibleRange({ from, to });

    min = Math.min(...newLineSeries.map((c) => c.value));
    max = Math.max(...newLineSeries.map((c) => c.value));
  }
};

const createChartVolume = (newVolumes: Volume[]): void => {
  if (!chart || !volumeSeries) {
    return;
  }

  const newVolumeSeries: HistogramData[] = chain(newVolumes)
    .map((v) => ({
      time: v.timestamp as UTCTimestamp,
      value: v.volume,
      color: Colors.yellow,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newVolumeSeries.length > 0) {
    volumeSeries.setData(newVolumeSeries);
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

.prices {
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
title: Price
</i18n>
