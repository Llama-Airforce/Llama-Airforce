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
import { $computed, $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  ColorType,
  createChart as createChartFunc,
  IChartApi,
  ISeriesApi,
  LineData,
  LineStyle,
  LineType,
  UTCTimestamp,
} from "lightweight-charts";
import { Card } from "@/Framework";
import { Colors, ColorsArray, round, unit } from "@/Util";
import type { Balances } from "@/Pages/CurveMonitor/Models";
import Legend from "@/Pages/CurveMonitor/Components/Legend.vue";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import { onMounted, watch } from "vue";

type Mode = "percentage" | "absolute";

const { t } = useI18n();

const chartRef = $ref<HTMLElement | null>(null);
let chart: IChartApi | null = $ref(null);
let lineSeries: ISeriesApi<"Line">[] = $ref([]);

// Refs
const store = useCurveMonitorStore();
const mode: Mode = $ref("absolute");

const balances = $computed((): Balances[] => {
  return store.balances;
});

// Using balances directly instead of coins, because coins array info may come later.
const numCoins = $computed((): number => {
  return store.balances[0]?.balances?.length ?? 0;
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
    rightPriceScale: {
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
    },
    handleScale: false,
    handleScroll: false,
    localization: {
      priceFormatter:
        mode === "absolute"
          ? (price: number) => formatterAbsolute(price)
          : (price: number) => formatterPercentage(price),
    },
  });

  initCharts();
  createChart(balances);
});

// Watches
watch(
  () => balances,
  (newBalances) => {
    initCharts();
    createChart(newBalances);
  }
);

// Methods
const initCharts = (): void => {
  if (!chart) {
    return;
  }

  // Clear old line series before adding new ones.
  for (const serie of lineSeries) {
    chart.removeSeries(serie);
  }

  lineSeries = [];
  for (let i = 0; i < numCoins; i++) {
    const lineSerie = chart.addLineSeries({
      priceFormat: {
        type: "price",
        precision: 6,
        minMove: 0.000001,
      },
      lineWidth: 2,
      lineType: LineType.WithSteps,
      color: ColorsArray[i],
      lastValueVisible: false,
      priceLineVisible: false,
    });

    lineSeries.push(lineSerie);
  }
};

const createChart = (newBalances: Balances[]): void => {
  if (!chart || lineSeries.length < 0) {
    return;
  }

  for (let i = 0; i < numCoins; i++) {
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
