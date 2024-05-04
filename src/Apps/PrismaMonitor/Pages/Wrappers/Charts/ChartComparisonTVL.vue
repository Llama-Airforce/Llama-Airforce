<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items="['cvxPRISMA', 'yPRISMA']"
          :colors="getColorsArray(storeSettings.theme, storeSettings.flavor)"
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
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  type ISeriesApi,
  type LineData,
  type LineSeriesPartialOptions,
  LineType,
  type UTCTimestamp,
} from "lightweight-charts";
import { Card, usePromise, useLightweightChart } from "@/Framework";
import { Legend } from "@/Framework/Monitor";
import { round, unit } from "@/Util";
import { getColors, getColorsArray } from "@/Styles/Themes/PM";
import { useSettingsStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import type { Theme } from "@PM/Models/Theme";
import {
  getHost,
  WrapperService,
  type Contract,
  type DecimalTimeSeries,
} from "@PM/Services";

const { t } = useI18n();

const prismaService = new WrapperService(getHost());

// Refs
let serieConvex: ISeriesApi<"Line">;
let serieYearn: ISeriesApi<"Line">;

const storeSettings = useSettingsStore();
const theme = computed(() => storeSettings.theme);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    serieConvex = chart.addLineSeries(
      createOptionsSerie(storeSettings.theme, "convex")
    );
    serieYearn = chart.addLineSeries(
      createOptionsSerie(storeSettings.theme, "yearn")
    );
  }
);

// Data
const { loading: loadingConvex, data: dataConvex } = usePromise(
  () => prismaService.getTVL("convex").then((x) => x.tvl),
  []
);
const { loading: loadingYearn, data: dataYearn } = usePromise(
  () => prismaService.getTVL("yearn").then((x) => x.tvl),
  []
);

const loading = computed(() => loadingConvex.value || loadingYearn.value);

// Watches
watch(theme, (newTheme) => {
  serieConvex.applyOptions(createOptionsSerie(newTheme, "convex"));
  serieYearn.applyOptions(createOptionsSerie(newTheme, "yearn"));
});

watch(dataConvex, (newData) => createSeries(newData, "convex"));
watch(dataYearn, (newData) => createSeries(newData, "yearn"));

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

function createOptionsSerie(
  theme: Theme,
  contract: Contract
): LineSeriesPartialOptions {
  const colors = getColors(theme, storeSettings.flavor);
  const color = contract === "convex" ? colors.blue : colors.yellow;

  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    color,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeries(newData: DecimalTimeSeries[], contract: Contract): void {
  if (!chart.value || !serieConvex || !serieYearn) {
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
    if (contract === "convex") {
      serieConvex.setData(newSerie);
    } else if (contract === "yearn") {
      serieYearn.setData(newSerie);
    }

    chart.value.timeScale().fitContent();
  }
}

const formatter = (y: number): string => {
  return `$${round(y, 0, "dollar")}${unit(y, "dollar")}`;
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
title: TVL
</i18n>
