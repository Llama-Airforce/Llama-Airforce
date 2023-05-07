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
  AreaSeriesPartialOptions,
  createChart as createChartFunc,
  HistogramData,
  HistogramSeriesPartialOptions,
  IChartApi,
  ISeriesApi,
  LineData,
  LineType,
  UTCTimestamp,
} from "lightweight-charts";
import { Card } from "@/Framework";
import { round, unit } from "@/Util";
import { getColors } from "@/Styles/Themes/CM";
import type { Price, Volume } from "@CM/Pages/Pool/Models";
import { useCurveMonitorStore } from "@CM/Store";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";

const { t } = useI18n();

let chart: IChartApi;
let areaSerie: ISeriesApi<"Area">;
let volumeSerie: ISeriesApi<"Histogram">;
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

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, store.theme)
  );
  areaSerie = chart.addAreaSeries(createOptionsSeriePrice(store.theme));
  volumeSerie = chart.addHistogramSeries(createOptionsSerieVolume(store.theme));

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

watch(
  () => store.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      areaSerie.applyOptions(createOptionsSeriePrice(newTheme));
      volumeSerie.applyOptions(createOptionsSerieVolume(newTheme));
    }
  }
);

// Methods
const createOptionsChart = (chartRef: HTMLElement, theme: Theme) => {
  return createChartStyles(chartRef, theme, {
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

const createOptionsSeriePrice = (theme: Theme): AreaSeriesPartialOptions => {
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

const createOptionsSerieVolume = (
  theme: Theme
): HistogramSeriesPartialOptions => {
  const colors = getColors(theme);

  return {
    color: colors.yellow,
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
