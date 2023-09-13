<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <Legend :items="['Liquidator Revenue', 'Discount']"></Legend>
      </div>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
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
import { getHost } from "@/Services/Host";
import { getColors } from "@/Styles/Themes/CM";
import Legend from "@CM/Components/Legend.vue";
import { useSettingsStore } from "@CM/Stores/SettingsStore";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import CurveService, {
  type LiquidatorRevenue,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import type { Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

let chart: IChartApi;
let discountSerie: ISeriesApi<"Area">;
let revenueSerie: ISeriesApi<"Area">;

// Props
interface Props {
  market?: Market | null;
}

const { market = null } = defineProps<Props>();

// Refs
const storeSettings = useSettingsStore();

const chartRef = ref<HTMLElement | null>(null);
const softLiqs = ref<LiquidatorRevenue[]>([]);
const loading = ref(false);

// Hooks
onMounted(async (): Promise<void> => {
  if (!chartRef.value) return;
  await nextTick();

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, storeSettings.theme)
  );
  discountSerie = chart.addAreaSeries(
    createDiscountOptionsSerie(storeSettings.theme)
  );
  revenueSerie = chart.addAreaSeries(
    createRevenueOptionsSerie(storeSettings.theme)
  );
  createSeries(softLiqs.value);
});

// Watches
watch(
  () => market,
  async (newMarket) => {
    loading.value = true;

    if (!newMarket) {
      return;
    }

    softLiqs.value = await curveService
      .getLiquidatorRevenue(newMarket.address)
      .then((x) => x.revenue);

    loading.value = false;
  },
  { immediate: true }
);

watch(
  () => storeSettings.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      discountSerie.applyOptions(createDiscountOptionsSerie(newTheme));
      revenueSerie.applyOptions(createRevenueOptionsSerie(newTheme));
    }
  }
);

watch(softLiqs, (newSoftLiqs) => {
  createSeries(newSoftLiqs);
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
    leftPriceScale: {
      visible: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
};

const createRevenueOptionsSerie = (theme: Theme): AreaSeriesPartialOptions => {
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
};

const createDiscountOptionsSerie = (theme: Theme): AreaSeriesPartialOptions => {
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
};

const createSeries = (newSoftLiq: LiquidatorRevenue[]): void => {
  if (!chart || !discountSerie) {
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
title: Liquidator Revenue
</i18n>
