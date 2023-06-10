<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <Legend :items="coins"></Legend>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  createChart as createChartFunc,
  IChartApi,
  ISeriesApi,
  LineData,
  LineSeriesPartialOptions,
  LineType,
  UTCTimestamp,
} from "lightweight-charts";
import { Card } from "@/Framework";
import { round, unit } from "@/Util";
import { getHost } from "@/Services/Host";
import { getColorsArray } from "@/Styles/Themes/CM";
import { useCurveMonitorStore } from "@CM/Store";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import Legend from "@CM/Components/Legend.vue";
import CurveService, {
  type PoolPrice,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

let chart: IChartApi;
let lineSeries: ISeriesApi<"Line">[] = [];

// Refs
const store = useCurveMonitorStore();

const chartRef = ref<HTMLElement | null>(null);
const prices = ref<PoolPrice[]>([{ timestamp: 0 }]);
const loading = ref(false);

const coins = computed((): string[] =>
  Object.keys(prices.value[0]).filter(
    (key) => key !== "timestamp" && key !== "USD"
  )
);

// Hooks
onMounted(async () => {
  if (!chartRef.value) return;

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, store.theme)
  );

  loading.value = true;
  prices.value = await curveService.getPoolPrices().then((x) => x.prices);
  loading.value = false;

  addSeries();
  createSeries(prices.value);
});

// Watches
watch(prices, (newPrices) => {
  addSeries();
  createSeries(newPrices);
});

watch(
  () => store.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));

      for (const [i, serie] of lineSeries.entries()) {
        serie.applyOptions(createOptionsSerie(i, store.theme));
      }
    }
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
      priceFormatter: formatter,
    },
  });
};

const createOptionsSerie = (
  i: number,
  theme: Theme
): LineSeriesPartialOptions => {
  const colorsArray = getColorsArray(theme);

  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    color: colorsArray[i],
    lastValueVisible: false,
    priceLineVisible: false,
  };
};

const addSeries = (): void => {
  if (!chart) {
    return;
  }

  // Clear old line series before adding new ones.
  for (const serie of lineSeries) {
    chart.removeSeries(serie);
  }

  lineSeries = [];
  for (let i = 0; i < coins.value.length; i++) {
    const lineSerie = chart.addLineSeries(createOptionsSerie(i, store.theme));

    lineSeries.push(lineSerie);
  }
};

const createSeries = (newPrices: PoolPrice[]): void => {
  if (!chart || lineSeries.length < 0) {
    return;
  }

  for (const [i, coin] of coins.value.entries()) {
    const newLineSerie: LineData[] = chain(newPrices)
      .map((x) => ({
        time: x.timestamp as UTCTimestamp,
        value: x[coin],
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((c) => c.time, "asc")
      .value();

    if (newLineSerie.length > 0) {
      lineSeries[i].setData(newLineSerie);
    }
  }

  chart.timeScale().fitContent();
};

const formatter = (y: number): string => {
  return `${round(y, 3, "dollar")}${unit(y, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;

    .chart {
      height: 300px;
    }

    > .legend {
      justify-content: center;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Prices
</i18n>
