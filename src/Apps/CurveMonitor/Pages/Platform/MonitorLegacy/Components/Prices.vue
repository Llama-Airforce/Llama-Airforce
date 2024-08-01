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
import { chain } from "lodash";
import { createChart as createChartFunc } from "lightweight-charts";
import type { Price, Volume } from "@CM/Services/MonitorLegacy";
import { useMonitorStore } from "@CM/Pages/Platform/MonitorLegacy/Store";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";

const { t } = useI18n();

let chart: IChartApi;
let areaSerie: ISeriesApi<"Area">;
let volumeSerie: ISeriesApi<"Histogram">;
let max = 1;
let min = 0;

// Refs
const store = useMonitorStore();
const { theme } = storeToRefs(useSettingsStore());

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

  chart = createChartFunc(chartRef.value, createOptionsChart(chartRef.value));
  areaSerie = chart.addAreaSeries(createOptionsSeriePrice());
  volumeSerie = chart.addHistogramSeries(createOptionsSerieVolume());

  createSeriesPrice(prices.value);
  createSeriesVolume(volumes.value);
});

// Watches
watch(prices, (newPrices) => {
  createSeriesPrice(newPrices);
});

watch(volumes, (newVolumes) => {
  createSeriesVolume(newVolumes);
});

watch(theme.value, () => {
  if (chartRef.value) {
    chart.applyOptions(createOptionsChart(chartRef.value));
    areaSerie.applyOptions(createOptionsSeriePrice());
    volumeSerie.applyOptions(createOptionsSerieVolume());
  }
});

// Methods
const createOptionsChart = (chartRef: HTMLElement) => {
  return createChartStyles(chartRef, theme.value, {
    leftPriceScale: {
      scaleMargins: {
        top: 0.6,
        bottom: 0,
      },
    },
    localization: {
      priceFormatter: (price: number) => formatterPrice(price),
    },
  });
};

const createOptionsSeriePrice = (): AreaSeriesPartialOptions => {
  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: theme.value.colors.blue,
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
};

const createOptionsSerieVolume = (): HistogramSeriesPartialOptions => {
  return {
    color: theme.value.colors.yellow,
    lastValueVisible: false,
    priceFormat: {
      type: "volume",
    },
    priceScaleId: "left",
    priceLineVisible: false,
  };
};

const createSeriesPrice = (newPrices: Price[]): void => {
  if (!chart || !areaSerie) {
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
    areaSerie.setData(newLineSeries);

    const from = newLineSeries[0].time;
    const to = newLineSeries[newLineSeries.length - 1].time;

    chart.timeScale().setVisibleRange({ from, to });

    min = Math.min(...newLineSeries.map((c) => c.value));
    max = Math.max(...newLineSeries.map((c) => c.value));
  }
};

const createSeriesVolume = (newVolumes: Volume[]): void => {
  if (!chart || !volumeSerie) {
    return;
  }

  const newVolumeSeries: HistogramData[] = chain(newVolumes)
    .map((v) => ({
      time: v.timestamp as UTCTimestamp,
      value: v.volume,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newVolumeSeries.length > 0) {
    volumeSerie.setData(newVolumeSeries);
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
  :deep(.card-body) {
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
