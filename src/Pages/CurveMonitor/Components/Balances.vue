<template>
  <Card
    class="balances"
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
import type { Balances } from "@/Pages/CurveMonitor/Models";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import { onMounted, watch } from "vue";

const { t } = useI18n();

const chartRef = $ref<HTMLElement | null>(null);
let chart: IChartApi | null = $ref(null);
let lineSeries: ISeriesApi<"Line">[] = $ref([]);

// Refs
const store = useCurveMonitorStore();

const balances = $computed((): Balances[] => {
  return store.balances;
});

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

  const colors = [
    "rgb(32, 129, 240)",
    "rgb(255, 204, 0)",
    "rgb(126, 217, 87)",
    "rgb(255, 87, 87)",
  ];

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
      color: colors[i],
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
          (b.balances[i] / b.balances.reduce((acc, x) => acc + x, 0)) * 100,
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
  return `${round(y, 2, "percentage")}${unit(y, "percentage")}`;
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
      height: 400px;
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Balances
</i18n>
