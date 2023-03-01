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
import { computed, ref } from "vue";
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
  SeriesMarker,
  UTCTimestamp,
} from "lightweight-charts";
import { Card } from "@/Framework";
import { Colors, round, unit } from "@/Util";
import type { Bonding } from "@CM/Models";
import { useCurveMonitorStore } from "@CM/Store";
import { onMounted, watch } from "vue";

const { t } = useI18n();

let chart: IChartApi;
let lineSerie: ISeriesApi<"Line">;

// Refs
const store = useCurveMonitorStore();

const chartRef = ref<HTMLElement | null>(null);

const bonding = computed((): Bonding => {
  return store.bonding;
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
    rightPriceScale: {
      visible: false,
    },
    leftPriceScale: {
      visible: true,
      borderVisible: false,
      scaleMargins: {
        top: 0.1,
        bottom: 0,
      },
    },
    timeScale: {
      borderVisible: false,
      fixLeftEdge: true,
      fixRightEdge: true,
      tickMarkFormatter: (time: UTCTimestamp) => formatter(time),
    },
    handleScale: false,
    handleScroll: false,
    localization: {
      priceFormatter: (price: number) => formatter(price),
      timeFormatter: (time: number) => formatter(time),
    },
  });

  initCharts();
  createChart(bonding.value);
});

// Watches
watch(bonding, (newBonding) => {
  createChart(newBonding);
});

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
    color: Colors.blue,
    lastValueVisible: false,
    priceLineVisible: false,
  });
};

const createChart = (newBonding: Bonding): void => {
  if (!chart || !lineSerie) {
    return;
  }

  const newSerie: LineData[] = chain(newBonding.curve)
    .map((x) => ({
      time: x.x as UTCTimestamp,
      value: x.y,
    }))
    .value();

  const markers: SeriesMarker<UTCTimestamp>[] = [
    {
      time: newBonding.balanceCoin1 as UTCTimestamp,
      position: "inBar",
      color: Colors.yellow,
      shape: "circle",
    },
  ];

  if (newSerie.length > 0) {
    lineSerie.setData(newSerie);
    lineSerie.setMarkers(markers);
  }

  chart.timeScale().fitContent();
};

const formatter = (x: number): string => {
  if (x < 0) {
    return "";
  }

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
