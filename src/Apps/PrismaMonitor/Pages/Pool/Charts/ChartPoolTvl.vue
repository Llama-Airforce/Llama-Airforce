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
import {ref, watch, onMounted, nextTick} from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  createChart as createChartFunc,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  type AreaSeriesPartialOptions,
  LineType,
  type UTCTimestamp,
} from "lightweight-charts";
import { Card } from "@/Framework";
import { getHost } from "@/Services/Host";
import { getColors } from "@/Styles/Themes/PM";
import { useSettingsStore } from "@PM/Stores/SettingsStore";
import createChartStyles from "@PM/Util/ChartStyles";
import type { Theme } from "@PM/Models/Theme";
import PrismaService, {
  type DecimalTimeSeries,
} from "@PM/Services/PrismaService";
import {round, unit} from "@/Util";

const { t } = useI18n();

const prismaService = new PrismaService(getHost());

let chart: IChartApi;
let tvlSerie: ISeriesApi<"Area">;


// Refs
const storeSettings = useSettingsStore();

const chartRef = ref<HTMLElement | null>(null);
const data = ref<DecimalTimeSeries[]>([]);
const loading = ref(false);

// Hooks
onMounted(async (): Promise<void> => {
  if (!chartRef.value) return;
  await nextTick();

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, storeSettings.theme)
  );
  tvlSerie = chart.addAreaSeries(createTvlOptionsSerie(storeSettings.theme));
  createSeries(data.value);
});

// Hooks
onMounted(async () => {
  loading.value = true;


  data.value = await prismaService
    .getPoolTvl("ethereum", "1m").then((x) => x.deposits);
  loading.value = false;
}
);

// Watches
watch(
  () => storeSettings.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      tvlSerie.applyOptions(createTvlOptionsSerie(newTheme));
    }
  }
);

watch(data, (newData) => {
  createSeries(newData);
});

// Methods

const createOptionsChart = (chartRef: HTMLElement, theme: Theme) => {
  return createChartStyles(chartRef, theme, {
    leftPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    localization: {
      priceFormatter: (price: number) => formatter(price),
    },
  });
};

const createTvlOptionsSerie = (theme: Theme): AreaSeriesPartialOptions => {
  const colors = getColors(theme);

  return {

    priceFormat: {
      type: "price",
      precision: 2,
      minMove: 0.001,
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

const createSeries = (newData: DecimalTimeSeries[]): void => {
  if (!chart || !tvlSerie) {
    return;
  }

  const newTvlSerie: LineData[] = chain(newData)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newTvlSerie.length > 0) {
    tvlSerie.setData(newTvlSerie);
  }

  chart.timeScale().fitContent();
};

const formatter = (y: number): string => {
  return `$${round(y, 1, "dollar")}${unit(y, "dollar")}`;
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
      height: 200px;
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Total deposits in stability pool
</i18n>
