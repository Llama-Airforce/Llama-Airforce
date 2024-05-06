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
import { getLineChartColors } from "@/Styles/Themes/PM";
import { useSettingsStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import type { Theme } from "@PM/Models/Theme";
import {
  getHost,
  type DecimalTimeSeries,
  StabilityPoolService,
} from "@PM/Services";

const { t } = useI18n();

// Refs
let serie: ISeriesApi<"Area">;

const storeSettings = useSettingsStore();
const theme = computed(() => storeSettings.theme);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    serie = chart.addAreaSeries(createOptionsSerie(storeSettings.theme));
  }
);

const sbService = new StabilityPoolService(getHost(), storeSettings.flavor);

// Data
const { loading, data } = usePromise(
  () => sbService.getPoolTvl("ethereum", "1m").then((x) => x.deposits),
  []
);

// Watches
watch(data, createSeries);
watch(theme, (newTheme) => {
  serie.applyOptions(createOptionsSerie(newTheme));
});

// Chart
function createOptionsChart(chartRef: HTMLElement, theme: string) {
  return createChartStyles(chartRef, theme as Theme, storeSettings.flavor, {
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
}

function createOptionsSerie(theme: Theme): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "price",
      precision: 2,
      minMove: 0.001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lastValueVisible: false,
    priceLineVisible: false,
    ...getLineChartColors(theme, storeSettings.flavor),
  };
}

function createSeries(newData: DecimalTimeSeries[]): void {
  if (!chart.value || !serie) {
    return;
  }

  const newSerie: LineData[] = chain(newData)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerie.length > 0) {
    serie.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}

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
      height: 300px;
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Total deposits in stability pool
</i18n>
