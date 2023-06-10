<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
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
  AreaSeriesPartialOptions,
  createChart as createChartFunc,
  IChartApi,
  ISeriesApi,
  LineData,
  LineType,
  UTCTimestamp,
} from "lightweight-charts";
import { Card } from "@/Framework";
import { round, unit } from "@/Util";
import { getHost } from "@/Services/Host";
import { getColors } from "@/Styles/Themes/CM";
import { useCurveMonitorStore } from "@CM/Store";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import CurveService, {
  type MarketRates,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

// Props
interface Props {
  market: string;
}

const { market } = defineProps<Props>();

// Refs
let chart: IChartApi;
let ratesSerie: ISeriesApi<"Area">;

// Refs
const store = useCurveMonitorStore();

const chartRef = ref<HTMLElement | null>(null);
const rates = ref<MarketRates[]>([]);
const loading = ref(false);

// Hooks
onMounted((): void => {
  if (!chartRef.value) return;

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, store.theme)
  );
  ratesSerie = chart.addAreaSeries(createOptionsSerieRates(store.theme));

  createSeriesRates(rates.value);
});

// Watches
watch(
  () => market,
  async (newMarket) => {
    loading.value = true;

    rates.value = await curveService
      .getMarketRates(newMarket)
      .then((x) => x.rates);

    loading.value = false;
  },
  { immediate: true }
);

watch(
  () => store.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      ratesSerie.applyOptions(createOptionsSerieRates(newTheme));
    }
  }
);

watch(rates, (newRates) => {
  createSeriesRates(newRates);
});

// Methods
const createOptionsChart = (chartRef: HTMLElement, theme: Theme) => {
  return createChartStyles(chartRef, theme, {
    height: 200,
    width: 300,
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

const createSeriesRates = (newRates: MarketRates[]): void => {
  if (!chart || !ratesSerie) {
    return;
  }

  const newRatesSeries: LineData[] = chain(newRates)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.rate,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newRatesSeries.length > 0) {
    ratesSerie.setData(newRatesSeries);

    const from = newRatesSeries[0].time;
    const to = newRatesSeries[newRatesSeries.length - 1].time;

    chart.timeScale().setVisibleRange({ from, to });
  }
};

const formatterRate = (x: number): string => {
  return `${round(x * 100, 2, "percentage")}${unit(x, "percentage")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Market Rates
</i18n>
