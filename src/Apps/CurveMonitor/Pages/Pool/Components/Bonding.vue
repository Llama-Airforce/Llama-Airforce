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
import { computed, ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  createChart as createChartFunc,
  IChartApi,
  ISeriesApi,
  LineData,
  LineSeriesPartialOptions,
  LineType,
  SeriesMarker,
  UTCTimestamp,
} from "lightweight-charts";
import { Card } from "@/Framework";
import { round, unit } from "@/Util";
import { getColors } from "@/Styles/Themes/CM";
import type { Bonding } from "@CM/Pages/Pool/Models";
import { useCurveMonitorStore } from "@CM/Store";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";

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

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, store.theme)
  );
  lineSerie = chart.addLineSeries(createOptionsSerie(store.theme));

  createSeries(bonding.value);
});

// Watches
watch(bonding, (newBonding) => {
  createSeries(newBonding);
});

watch(
  () => store.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      lineSerie.applyOptions(createOptionsSerie(newTheme));
      createMarkers(newTheme);
    }
  }
);

// Methods
const createOptionsChart = (chartRef: HTMLElement, theme: Theme) => {
  return createChartStyles(chartRef, theme, {
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

const createOptionsSerie = (theme: Theme): LineSeriesPartialOptions => {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    color: colors.blue,
    lastValueVisible: false,
    priceLineVisible: false,
  };
};

const createMarkers = (theme: Theme) => {
  const colors = getColors(theme);

  const markers: SeriesMarker<UTCTimestamp>[] = [
    {
      time: bonding.value.balanceCoin1 as UTCTimestamp,
      position: "inBar",
      color: colors.yellow,
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
    createMarkers(store.theme);
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
