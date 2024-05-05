<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items="['1st Quartile', 'Median', '3rd Quartile']"
          :colors="getColorsArray(storeSettings.theme)"
        ></Legend>
      </div>
    </template>
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
import { Legend } from "@/Framework/Monitor";
import { getHost } from "@/Services/Host";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import CurveService, {
  type HistoricalAverageHealth,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import type { Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

// Props
interface Props {
  market?: Market | null;
}

const { market = null } = defineProps<Props>();

// Refs
let areaSerie: ISeriesApi<"Area">;
let areaQ1Serie: ISeriesApi<"Area">;
let areaQ3Serie: ISeriesApi<"Area">;

const storeSettings = useSettingsStore();
const theme = computed(() => storeSettings.theme);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    areaSerie = chart.addAreaSeries(createOptionsSerie(storeSettings.theme));
    areaQ1Serie = chart.addAreaSeries(
      createQ1OptionsSerie(storeSettings.theme)
    );
    areaQ3Serie = chart.addAreaSeries(
      createQ3OptionsSerie(storeSettings.theme)
    );
  }
);

// Data
const {
  loading,
  data: health,
  load,
} = usePromise(() => {
  if (market) {
    return curveService
      .getHistoricalAverageHealth(market.address)
      .then((x) => x.health);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Watches
watch(() => market, load);
watch(theme, (newTheme) => {
  areaQ1Serie.applyOptions(createOptionsSerie(newTheme));
  areaSerie.applyOptions(createOptionsSerie(newTheme));
  areaQ3Serie.applyOptions(createOptionsSerie(newTheme));
});

watch(health, (newHealth) => {
  createSeries(newHealth);
});

// Chart
function createOptionsChart(chartRef: HTMLElement, theme: string) {
  return createChartStyles(chartRef, theme as Theme, {
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
}

function createOptionsSerie(theme: Theme): AreaSeriesPartialOptions {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: colors.yellow,
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createQ1OptionsSerie(theme: Theme): AreaSeriesPartialOptions {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: colors.blue,
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createQ3OptionsSerie(theme: Theme): AreaSeriesPartialOptions {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: colors.green,
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeries(newLosses: HistoricalAverageHealth[]): void {
  if (!chart.value || !areaSerie || !areaQ1Serie || !areaQ3Serie) {
    return;
  }

  const newSerie: LineData[] = chain(newLosses)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.quartiles[2],
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const newQ1Serie: LineData[] = chain(newLosses)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.quartiles[1],
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const newQ3Serie: LineData[] = chain(newLosses)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.quartiles[3],
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newQ1Serie.length > 0) {
    areaQ1Serie.setData(newQ1Serie);
  }

  if (newSerie.length > 0) {
    areaSerie.setData(newSerie);
  }

  if (newQ3Serie.length > 0) {
    areaQ3Serie.setData(newQ3Serie);
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
      height: 200px;
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Historical Health Distribution
</i18n>
