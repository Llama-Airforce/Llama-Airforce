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
import { chain } from "lodash";
import {
  createChart as createChartFunc,
  type SeriesMarker,
} from "lightweight-charts";
import type { Bonding } from "@CM/Pages/Platform/MonitorLegacy/Models";
import { useMonitorStore } from "@CM/Pages/Platform/MonitorLegacy/Store";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";

const { t } = useI18n();

let chart: IChartApi;
let lineSerie: ISeriesApi<"Line">;

// Refs
const store = useMonitorStore();
const { theme } = storeToRefs(useSettingsStore());

const chartRef = ref<HTMLElement | null>(null);

const bonding = computed((): Bonding => {
  return store.bonding;
});

// Hooks
onMounted((): void => {
  if (!chartRef.value) return;

  chart = createChartFunc(chartRef.value, createOptionsChart(chartRef.value));
  lineSerie = chart.addLineSeries(createOptionsSerie());

  createSeries(bonding.value);
});

// Watches
watch(bonding, (newBonding) => {
  createSeries(newBonding);
});

watch(theme.value, () => {
  if (chartRef.value) {
    chart.applyOptions(createOptionsChart(chartRef.value));
    lineSerie.applyOptions(createOptionsSerie());
    createMarkers();
  }
});

// Methods
const createOptionsChart = (chartRef: HTMLElement) => {
  return createChartStyles(chartRef, theme.value, {
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
      tickMarkFormatter: (time: UTCTimestamp) => formatter(time),
    },
    localization: {
      priceFormatter: (price: number) => formatter(price),
      timeFormatter: (time: number) => formatter(time),
    },
  });
};

const createOptionsSerie = (): LineSeriesPartialOptions => {
  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    color: theme.value.colors.blue,
    lastValueVisible: false,
    priceLineVisible: false,
  };
};

const createMarkers = () => {
  const markers: SeriesMarker<UTCTimestamp>[] = [
    {
      time: bonding.value.balanceCoin1 as UTCTimestamp,
      position: "inBar",
      color: theme.value.colors.yellow,
      shape: "circle",
    },
  ];

  lineSerie.setMarkers(markers);
};

const createSeries = (newBonding: Bonding): void => {
  if (!chart || !lineSerie) {
    return;
  }

  const newSerie: LineData[] = chain(newBonding.curve)
    .map((x) => ({
      time: x.x as UTCTimestamp,
      value: x.y,
    }))
    .value();

  if (newSerie.length > 0) {
    lineSerie.setData(newSerie);
    createMarkers();
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
title: Bonding Curve
</i18n>
