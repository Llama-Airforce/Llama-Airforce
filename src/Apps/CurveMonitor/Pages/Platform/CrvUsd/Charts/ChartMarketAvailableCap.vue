<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items="['Borrowable', 'Debt ceiling']"
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
import { round, unit } from "@/Util";
import { getHost } from "@/Services/Host";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import CurveService, {
  type AvailableCap,
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
let availSerie: ISeriesApi<"Area">;
let capSerie: ISeriesApi<"Area">;

const storeSettings = useSettingsStore();
const theme = computed(() => storeSettings.theme);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    availSerie = chart.addAreaSeries(
      createAvailOptionsSerie(storeSettings.theme)
    );
    capSerie = chart.addAreaSeries(createCapOptionsSerie(storeSettings.theme));
  }
);

// Data
const {
  loading,
  data: availableCap,
  load,
} = usePromise(() => {
  if (market) {
    return curveService
      .getMarketAvailableCap(market.address)
      .then((x) => x.available);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Watches
watch(() => market, load);
watch(availableCap, createSeries);
watch(theme, (newTheme) => {
  availSerie.applyOptions(createAvailOptionsSerie(newTheme));
  capSerie.applyOptions(createCapOptionsSerie(newTheme));
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
    localization: {
      priceFormatter: (price: number) => formatter(price),
    },
  });
}

function createAvailOptionsSerie(theme: Theme): AreaSeriesPartialOptions {
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

function createCapOptionsSerie(theme: Theme): AreaSeriesPartialOptions {
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

function createSeries(newAvCap: AvailableCap[]): void {
  if (!chart.value || !availSerie) {
    return;
  }

  const newAvailSerie: LineData[] = chain(newAvCap)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.borrowable,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newAvailSerie.length > 0) {
    availSerie.setData(newAvailSerie);
  }

  const newCapSerie: LineData[] = chain(newAvCap)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.ceiling,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newCapSerie.length > 0) {
    capSerie.setData(newCapSerie);
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
      height: 200px;
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Borrowable & Debt Ceiling
</i18n>
