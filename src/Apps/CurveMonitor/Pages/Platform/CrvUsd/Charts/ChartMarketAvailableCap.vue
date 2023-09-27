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
import { Legend } from "@/Framework/Monitor";
import { round, unit } from "@/Util";
import { getHost } from "@/Services/Host";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@CM/Stores/SettingsStore";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import CurveService, {
  type AvailableCap,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import type { Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

let chart: IChartApi;
let availSerie: ISeriesApi<"Area">;
let capSerie: ISeriesApi<"Area">;

// Props
interface Props {
  market?: Market | null;
}

const { market = null } = defineProps<Props>();

// Refs
const storeSettings = useSettingsStore();

const chartRef = ref<HTMLElement | null>(null);
const availableCap = ref<AvailableCap[]>([]);
const loading = ref(false);

// Hooks
onMounted((): void => {
  if (!chartRef.value) return;

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, storeSettings.theme)
  );
  availSerie = chart.addAreaSeries(
    createAvailOptionsSerie(storeSettings.theme)
  );
  capSerie = chart.addAreaSeries(createCapOptionsSerie(storeSettings.theme));

  createSeries(availableCap.value);
});

// Watches
watch(
  () => market,
  async (newMarket) => {
    loading.value = true;

    if (!newMarket) {
      return;
    }

    availableCap.value = await curveService
      .getMarketAvailableCap(newMarket.address)
      .then((x) => x.available);

    loading.value = false;
  },
  { immediate: true }
);

watch(
  () => storeSettings.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      availSerie.applyOptions(createAvailOptionsSerie(newTheme));
      capSerie.applyOptions(createCapOptionsSerie(newTheme));
    }
  }
);

watch(availableCap, (newAvailables) => {
  createSeries(newAvailables);
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
    localization: {
      priceFormatter: (price: number) => formatter(price),
    },
  });
};

const createAvailOptionsSerie = (theme: Theme): AreaSeriesPartialOptions => {
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

const createCapOptionsSerie = (theme: Theme): AreaSeriesPartialOptions => {
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

const createSeries = (newAvCap: AvailableCap[]): void => {
  if (!chart || !availSerie) {
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

  chart.timeScale().fitContent();
};

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
