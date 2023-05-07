<template>
  <Card
    class="balances"
    :title="t('title')"
  >
    <Legend></Legend>

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
import { getColorsArray } from "@/Styles/Themes/CM";
import type { Balances } from "@CM/Pages/Pool/Models";
import Legend from "@CM/Components/Legend.vue";
import { useCurveMonitorStore } from "@CM/Store";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";

type Mode = "percentage" | "absolute";

const { t } = useI18n();

let chart: IChartApi;
let lineSeries: ISeriesApi<"Line">[] = [];
const mode: Mode = "absolute";

// Refs
const store = useCurveMonitorStore();

const chartRef = ref<HTMLElement | null>(null);

const balances = computed((): Balances[] => {
  return store.balances;
});

// Using balances directly instead of coins, because coins array info may come later.
const numCoins = computed((): number => {
  return store.balances[0]?.balances?.length ?? 0;
});

// Hooks
onMounted((): void => {
  if (!chartRef.value) return;

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, store.theme)
  );

  addSeries();
  createSeries(balances.value);
});

// Watches
watch(balances, (newBalances) => {
  addSeries();
  createSeries(newBalances);
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
      priceFormatter:
        mode === "absolute"
          ? (price: number) => formatterAbsolute(price)
          : (price: number) => formatterPercentage(price),
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
  for (let i = 0; i < numCoins.value; i++) {
    const lineSerie = chart.addLineSeries(createOptionsSerie(i, store.theme));

    lineSeries.push(lineSerie);
  }
};

const createSeries = (newBalances: Balances[]): void => {
  if (!chart || lineSeries.length < 0) {
    return;
  }

  for (let i = 0; i < numCoins.value; i++) {
    const newLineSerie: LineData[] = chain(newBalances)
      .map((b) => ({
        time: b.timestamp as UTCTimestamp,
        value:
          mode === "absolute"
            ? b.balances[i]
            : (b.balances[i] / b.balances.reduce((acc, x) => acc + x, 0)) * 100,
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

const formatterPercentage = (y: number): string => {
  return `${round(y, 2, "percentage")}${unit(y, "percentage")}`;
};

const formatterAbsolute = (y: number): string => {
  return `${round(y, 1, "dollar")}${unit(y, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.balances {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;

    .chart {
      height: calc(100% - 3.125rem);
      z-index: 0;
    }

    > .legend {
      justify-content: center;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Balances
</i18n>
