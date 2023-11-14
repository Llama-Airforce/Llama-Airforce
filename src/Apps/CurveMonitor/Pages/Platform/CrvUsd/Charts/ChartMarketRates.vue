<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <InputNumber
          v-model="avgLength"
          class="avg-span"
          placeholder="Avg span (days)"
          :min="1"
          :max="Infinity"
        ></InputNumber>
      </div>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  type AreaSeriesPartialOptions,
  createChart as createChartFunc,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  LineType,
  type UTCTimestamp,
  type LineSeriesPartialOptions,
} from "lightweight-charts";
import { Card, InputNumber, usePromise } from "@/Framework";
import { round, unit } from "@/Util";
import { getHost } from "@/Services/Host";
import { getColors } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@CM/Stores/SettingsStore";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import CurveService, {
  type MarketRates,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import type { Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

// Props
interface Props {
  market?: Market | null;
}

const { market = null } = defineProps<Props>();

// Refs
let chart: IChartApi;
let ratesSerie: ISeriesApi<"Area">;
let ratesEMASerie: ISeriesApi<"Line">;

// Refs
const storeSettings = useSettingsStore();

const chartRef = ref<HTMLElement | null>(null);
const avgLength = ref<number | null>(null);

// Data
const {
  loading,
  data: rates,
  load,
} = usePromise(() => {
  if (market) {
    return curveService.getMarketRates(market.address).then((x) => x.rates);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Hooks
onMounted((): void => {
  if (!chartRef.value) return;

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, storeSettings.theme)
  );
  ratesSerie = chart.addAreaSeries(
    createOptionsSerieRates(storeSettings.theme)
  );
  ratesEMASerie = chart.addLineSeries(
    createOptionsSerieRatesEMA(storeSettings.theme)
  );

  createSeries(rates.value);
});

// Watches
watch(() => market, load);

watch(
  () => storeSettings.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      ratesSerie.applyOptions(createOptionsSerieRates(newTheme));
      ratesEMASerie.applyOptions(createOptionsSerieRatesEMA(newTheme));
    }
  }
);

watch(rates, (newRates) => {
  createSeries(newRates);
});

watch(avgLength, () => {
  createSeries(rates.value);
});

// Methods
const createOptionsChart = (chartRef: HTMLElement, theme: Theme) => {
  return createChartStyles(chartRef, theme, {
    height: 200,
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    localization: {
      priceFormatter: (rate: number) => formatterRate(rate),
    },
  });
};

const createOptionsSerieRates = (theme: Theme): AreaSeriesPartialOptions => {
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

const createOptionsSerieRatesEMA = (theme: Theme): LineSeriesPartialOptions => {
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

const createSeries = (newRates: MarketRates[]): void => {
  if (!chart || !ratesSerie) {
    return;
  }

  const newRatesSerie: LineData[] = chain(newRates)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.rate,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const averages = average(
    newRatesSerie.map((x) => x.value),
    avgLength.value ?? 31
  );

  const newRatesEMASerie: LineData[] = chain(averages)
    .zip(newRatesSerie)
    .map((x) => ({
      time: x[1]!.time,
      value: x[0]!,
    }))
    .value();

  // EMA rates serie.
  if (newRatesEMASerie.length > 0) {
    ratesEMASerie.setData(newRatesEMASerie);
  }

  // Normal rates serie.
  if (newRatesSerie.length > 0) {
    ratesSerie.setData(newRatesSerie);

    const from = newRatesSerie[0].time;
    const to = newRatesSerie[newRatesSerie.length - 1].time;

    chart.timeScale().setVisibleRange({ from, to });
  }
};

const formatterRate = (x: number): string => {
  return `${round(x * 100, 2, "percentage")}${unit(x, "percentage")}`;
};

/**
 * Normal non-weighted N sized average.
 * let values: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * output: [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7]
 */
const average = (data: number[], n = 7): number[] =>
  data.map((_x, i) => {
    // Start from the current index and go back (n - 1) more days (total n days)
    const start = Math.max(i - (n - 1), 0);
    const end = i + 1;

    // Slice the portion of the array for the n-day average and compute its average
    const slice = data.slice(start, end);
    const average = slice.reduce((acc, value) => acc + value, 0) / slice.length;

    return average;
  });
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }

  .actions {
    > .avg-span {
      width: 8rem;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Market Rates
</i18n>
