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
import { getHost } from "@/Services/Host";
import { getColors } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import CurveService, {
  type HistoricalMedianLoss,
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

const storeSettings = useSettingsStore();
const theme = computed(() => storeSettings.theme);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    areaSerie = chart.addAreaSeries(createOptionsSerie(storeSettings.theme));
  }
);

// Data
const {
  loading,
  data: losses,
  load,
} = usePromise(() => {
  if (market) {
    return curveService
      .getHistoricalMedianLoss(market.address)
      .then((x) => x.losses);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Watches
watch(() => market, load);
watch(losses, createSeries);
watch(theme, (newTheme) => {
  areaSerie.applyOptions(createOptionsSerie(newTheme));
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
}

function createSeries(newLosses: HistoricalMedianLoss[]): void {
  if (!chart.value || !areaSerie) {
    return;
  }

  const newSerie: LineData[] = chain(newLosses)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.lossPct,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerie.length > 0) {
    areaSerie.setData(newSerie);
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
title: Median Loss % Among Loans with Losses
</i18n>
