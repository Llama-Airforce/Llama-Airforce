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
import { chain } from "lodash";
import {
  type ISeriesApi,
  type LineData,
  type AreaSeriesPartialOptions,
  LineType,
  type UTCTimestamp,
} from "lightweight-charts";
import { Card, usePromise, useLightweightChart } from "@/Framework";
import { getLineChartColors } from "@/Styles/Themes/PM";
import { useSettingsStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import type { Theme } from "@PM/Models/Theme";
import { getHost, ManagerService, type DecimalTimeSeries } from "@PM/Services";

const { t } = useI18n();

// Refs
let globalCrSerie: ISeriesApi<"Area">;

const storeSettings = useSettingsStore();
const theme = computed(() => storeSettings.theme);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    globalCrSerie = chart.addAreaSeries(
      createGlobalCrOptionsSerie(storeSettings.theme)
    );
  }
);

// Services
const managerService = new ManagerService(getHost(), storeSettings.flavor);

// Data
const { loading, data } = usePromise(
  () =>
    managerService
      .getCollateralRatioGrouped("ethereum", "all")
      .then((x) => x.data),
  []
);

// Watches
watch(data, createSeries);
watch(theme, (newTheme) => {
  globalCrSerie.applyOptions(createGlobalCrOptionsSerie(newTheme));
});

// Chart
function createOptionsChart(chartRef: HTMLElement, theme: string) {
  return createChartStyles(chartRef, theme as Theme, storeSettings.flavor, {
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
}

function createGlobalCrOptionsSerie(theme: Theme): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "percent",
      precision: 2,
      minMove: 0.1,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lastValueVisible: false,
    priceLineVisible: false,
    ...getLineChartColors(theme, storeSettings.flavor),
  };
}

function createSeries(globalCr: DecimalTimeSeries[]): void {
  if (!chart.value || !globalCrSerie) {
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

  chart.value.timeScale().fitContent();
}
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
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Global collateral ratio
</i18n>
