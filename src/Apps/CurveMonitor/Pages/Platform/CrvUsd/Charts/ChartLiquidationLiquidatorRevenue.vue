<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items="['Liquidator Revenue', 'Discount']"
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
import { getHost } from "@/Services/Host";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import CurveService, {
  type LiquidatorRevenue,
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
let discountSerie: ISeriesApi<"Area">;
let revenueSerie: ISeriesApi<"Area">;

const storeSettings = useSettingsStore();
const theme = computed(() => storeSettings.theme);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    discountSerie = chart.addAreaSeries(
      createDiscountOptionsSerie(storeSettings.theme)
    );
    revenueSerie = chart.addAreaSeries(
      createRevenueOptionsSerie(storeSettings.theme)
    );
  }
);

// Data
const {
  loading,
  data: softLiqs,
  load,
} = usePromise(() => {
  if (market) {
    return curveService
      .getLiquidatorRevenue(market.address)
      .then((x) => x.revenue);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Watches
watch(() => market, load);
watch(softLiqs, createSeries);
watch(theme, (newTheme) => {
  discountSerie.applyOptions(createDiscountOptionsSerie(newTheme));
  revenueSerie.applyOptions(createRevenueOptionsSerie(newTheme));
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
    leftPriceScale: {
      visible: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
}

function createRevenueOptionsSerie(theme: Theme): AreaSeriesPartialOptions {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "price",
      precision: 0,
      minMove: 1,
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

function createDiscountOptionsSerie(theme: Theme): AreaSeriesPartialOptions {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "percent",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: colors.yellow,
    priceScaleId: "left",
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeries(newSoftLiq: LiquidatorRevenue[]): void {
  if (!chart.value || !discountSerie) {
    return;
  }

  const newDiscountSerie: LineData[] = chain(newSoftLiq)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.discount * 100,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const newRevenueSerie: LineData[] = chain(newSoftLiq)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.amount,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newRevenueSerie.length > 0) {
    revenueSerie.setData(newRevenueSerie);
  }

  if (newDiscountSerie.length > 0) {
    discountSerie.setData(newDiscountSerie);
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
title: Liquidator Revenue
</i18n>
