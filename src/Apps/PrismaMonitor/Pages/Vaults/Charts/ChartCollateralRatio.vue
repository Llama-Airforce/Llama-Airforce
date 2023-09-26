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
import { ref, watch, onMounted } from "vue";
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
import { getColors } from "@/Styles/Themes/PM";
import { useSettingsStore } from "@PM/Stores/SettingsStore";
import createChartStyles from "@PM/Util/ChartStyles";
import type { Theme } from "@PM/Models/Theme";
import PrismaService, {
  type DecimalTimeSeries,
} from "@PM/Services/PrismaService";
import { getHost } from "@/Services/Host";

const { t } = useI18n();

const prismaService = new PrismaService(getHost());

let chart: IChartApi;
let globalCrSerie: ISeriesApi<"Area">;
const storeSettings = useSettingsStore();

// Refs
const chartRef = ref<HTMLElement | null>(null);
const data = ref<DecimalTimeSeries[]>([]);
const loading = ref(false);

const loadData = async () => {
  loading.value = true;
  try {
    data.value = await prismaService
      .getCollateralRatioGrouped("ethereum", "all")
      .then((x) => x.data);
  } catch (error) {
    console.error("An error occurred while loading data:", error);
  } finally {
    loading.value = false;
  }
};

// Hooks
onMounted(async (): Promise<void> => {
  await loadData();

  if (!chartRef.value) return;

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, storeSettings.theme)
  );
  globalCrSerie = chart.addAreaSeries(
    createGlobalCrOptionsSerie(storeSettings.theme)
  );

  createSeries(data.value);
});

// Watches
watch(
  () => storeSettings.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      globalCrSerie.applyOptions(createGlobalCrOptionsSerie(newTheme));
    }
  }
);

watch(data, (newData) => {
  createSeries(newData);
});

// Methods
const createOptionsChart = (chartRef: HTMLElement, theme: Theme) => {
  return createChartStyles(chartRef, theme, {
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
};

const createGlobalCrOptionsSerie = (theme: Theme): AreaSeriesPartialOptions => {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "percent",
      precision: 2,
      minMove: 0.1,
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

const createSeries = (globalCr: DecimalTimeSeries[]): void => {
  if (!chart || !globalCrSerie) {
    return;
  }

  const newGlobalCrSerie: LineData[] = chain(globalCr)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value * 100,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();
  if (newGlobalCrSerie.length > 0) {
    globalCrSerie.setData(newGlobalCrSerie);
  }

  chart.timeScale().fitContent();
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
title: Global collateral ratio
</i18n>
