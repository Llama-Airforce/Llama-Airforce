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
import { chain as chain_ } from "lodash";
import {
  createChart as createChartFunc,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  type AreaSeriesPartialOptions,
  LineType,
  type UTCTimestamp,
} from "lightweight-charts";
import { Card, usePromise } from "@/Framework";
import { round, unit } from "@/Util";
import { getHost } from "@/Services/Host";
import { getColors } from "@/Styles/Themes/CM";
import { type Chain } from "@CM/Models/Chain";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import LlamaLendService from "@CM/Pages/Platform/LlamaLend/Services/LlamaLendService";
import type { Market, SoftLiqRatio } from "@CM/Pages/Platform/LlamaLend/Models";

const { t } = useI18n();

const llamaLendService = new LlamaLendService(getHost());

// Props
interface Props {
  market?: Market | null;
  chain?: Chain | null;
}

const { market = null, chain = null } = defineProps<Props>();

// Refs
let chart: IChartApi;
let softLiqSerie: ISeriesApi<"Area">;

const storeSettings = useSettingsStore();

const chartRef = ref<HTMLElement | null>(null);

// Data
const {
  loading,
  data: softLiqRatios,
  load,
} = usePromise(() => {
  if (market && chain) {
    return llamaLendService.getSoftLiqRatios(chain, market.controller);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Hooks
onMounted(() => {
  if (!chartRef.value) return;

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, storeSettings.theme)
  );
  softLiqSerie = chart.addAreaSeries(
    createSoftLiqOptionsSerie(storeSettings.theme)
  );

  createSeries(softLiqRatios.value);
});

// Watches
watch(() => market, load);

watch(
  () => storeSettings.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      softLiqSerie.applyOptions(createSoftLiqOptionsSerie(newTheme));
    }
  }
);

watch(softLiqRatios, (newSoftLiqRatios) => {
  createSeries(newSoftLiqRatios);
});

// Methods
const createOptionsChart = (chartRef: HTMLElement, theme: Theme) => {
  return createChartStyles(chartRef, theme, {
    height: 200,
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
};

const createSoftLiqOptionsSerie = (theme: Theme): AreaSeriesPartialOptions => {
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
};

const createSeries = (newSoftLiq: SoftLiqRatio[]): void => {
  if (!chart || !softLiqSerie) {
    return;
  }

  const newSoftLiqSerie: LineData[] = chain_(newSoftLiq)
    .groupBy((x) => x.timestamp)
    .mapValues((x) => ({
      time: x[0].timestamp as UTCTimestamp,
      value: x[0].proportion,
    }))
    .entries()
    .map((x) => x[1])
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSoftLiqSerie.length > 0) {
    softLiqSerie.setData(newSoftLiqSerie);
  }

  chart.timeScale().fitContent();
};

const formatter = (x: number): string =>
  `${round(x * 100, 2, "percentage")}${unit(x, "percentage")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Soft liquidation ratios
</i18n>
