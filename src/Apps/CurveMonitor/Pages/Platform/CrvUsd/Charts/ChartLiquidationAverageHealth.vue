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
import Legend from "@CM/Components/Legend.vue";
import { Card } from "@/Framework";
import { getHost } from "@/Services/Host";
import { getColors } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@CM/Stores/SettingsStore";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import CurveService, {
  type HistoricalAverageHealth
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import type { Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

let chart: IChartApi;
let areaSerie: ISeriesApi<"Area">;
let areaQ1Serie: ISeriesApi<"Area">;
let areaQ3Serie: ISeriesApi<"Area">;

// Props
interface Props {
  market?: Market | null;
}

const { market = null } = defineProps<Props>();

// Refs
const storeSettings = useSettingsStore();

const chartRef = ref<HTMLElement | null>(null);
const health = ref<HistoricalAverageHealth[]>([]);
const loading = ref(false);

// Hooks
onMounted((): void => {
  if (!chartRef.value) return;

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, storeSettings.theme)
  );
  areaSerie = chart.addAreaSeries(createOptionsSerie(storeSettings.theme));
  areaQ1Serie = chart.addAreaSeries(createQ1OptionsSerie(storeSettings.theme));
  areaQ3Serie = chart.addAreaSeries(createQ3OptionsSerie(storeSettings.theme));

  createSeries(health.value);
});

// Watches
watch(
  () => market,
  async (newMarket) => {
    loading.value = true;

    if (!newMarket) {
      return;
    }

    health.value = await curveService
      .getHistoricalAverageHealth(newMarket.address)
      .then((x) => x.health);

    loading.value = false;
  },
  { immediate: true }
);

watch(
  () => storeSettings.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      areaQ1Serie.applyOptions(createOptionsSerie(newTheme));
      areaSerie.applyOptions(createOptionsSerie(newTheme));
      areaQ3Serie.applyOptions(createOptionsSerie(newTheme));
    }
  }
);

watch(health, (newHealth) => {
  createSeries(newHealth);
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

const createOptionsSerie = (theme: Theme): AreaSeriesPartialOptions => {
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
};

const createQ1OptionsSerie = (theme: Theme): AreaSeriesPartialOptions => {
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

const createQ3OptionsSerie = (theme: Theme): AreaSeriesPartialOptions => {
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
};

const createSeries = (newLosses: HistoricalAverageHealth[]): void => {
  if (!chart || !areaSerie || !areaQ1Serie || !areaQ3Serie) {
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
title: Historical Health Distribution
</i18n>
