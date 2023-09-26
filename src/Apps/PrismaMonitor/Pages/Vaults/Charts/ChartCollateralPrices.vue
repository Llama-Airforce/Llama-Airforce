<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <Legend :items="['Oracle', 'Market']"></Legend>
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
import Legend from "@PM/Components/Legend.vue";
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
import { getColors } from "@/Styles/Themes/PM";
import { useSettingsStore } from "@PM/Stores/SettingsStore";
import createChartStyles from "@PM/Util/ChartStyles";
import type { Theme } from "@PM/Models/Theme";
import PrismaService, {
  type DecimalTimeSeries,
} from "@PM/Services/PrismaService";
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";

const { t } = useI18n();

const prismaService = new PrismaService(getHost());

let chart: IChartApi;
let oracleSerie: ISeriesApi<"Area">;
let marketSerie: ISeriesApi<"Area">;

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}

const { vault = null } = defineProps<Props>();

// Refs
const storeSettings = useSettingsStore();

const chartRef = ref<HTMLElement | null>(null);
const data = ref<{ oracle: DecimalTimeSeries[]; market: DecimalTimeSeries[] }>({
  oracle: [],
  market: [],
});
const loading = ref(false);

// Hooks
onMounted(async (): Promise<void> => {
  if (!chartRef.value) return;
  await nextTick();

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, storeSettings.theme)
  );
  oracleSerie = chart.addAreaSeries(
    createProportionOptionsSerie(storeSettings.theme)
  );
  marketSerie = chart.addAreaSeries(
    createPriceOptionsSerie(storeSettings.theme)
  );
  createSeries(data.value);
});

// Watches
watch(
  () => vault,
  async (newMarket) => {
    loading.value = true;

    if (!newMarket) {
      return;
    }

    const rawData = await prismaService.getCollateralPrices(
      "ethereum",
      newMarket.collateral,
      "7d"
    );
    data.value = processSeries(rawData.oracle, rawData.market);
    loading.value = false;
  },
  { immediate: true }
);

watch(
  () => storeSettings.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      oracleSerie.applyOptions(createProportionOptionsSerie(newTheme));
      marketSerie.applyOptions(createPriceOptionsSerie(newTheme));
    }
  }
);

watch(data, (newData) => {
  createSeries(newData);
});

// Methods
const processSeries = (
  oracle: DecimalTimeSeries[],
  market: DecimalTimeSeries[]
): { oracle: DecimalTimeSeries[]; market: DecimalTimeSeries[] } => {
  const startTimestamp = Math.max(oracle[0].timestamp, market[0].timestamp);
  const endTimestamp = Math.min(
    oracle[oracle.length - 1].timestamp,
    market[market.length - 1].timestamp
  );

  const filteredOracle = oracle.filter(
    (point) =>
      point.timestamp >= startTimestamp && point.timestamp <= endTimestamp
  );
  const filteredMarket = market.filter(
    (point) =>
      point.timestamp >= startTimestamp && point.timestamp <= endTimestamp
  );

  if (filteredOracle[filteredOracle.length - 1].timestamp < endTimestamp) {
    filteredOracle.push({
      timestamp: endTimestamp,
      value: filteredOracle[filteredOracle.length - 1].value,
    });
  }

  if (filteredMarket[filteredMarket.length - 1].timestamp < endTimestamp) {
    filteredMarket.push({
      timestamp: endTimestamp,
      value: filteredMarket[filteredMarket.length - 1].value,
    });
  }

  return { oracle: filteredOracle, market: filteredMarket };
};

const createOptionsChart = (chartRef: HTMLElement, theme: Theme) => {
  return createChartStyles(chartRef, theme, {
    leftPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
};

const createPriceOptionsSerie = (theme: Theme): AreaSeriesPartialOptions => {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "price",
      precision: 2,
      minMove: 0.001,
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

const createProportionOptionsSerie = (
  theme: Theme
): AreaSeriesPartialOptions => {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "price",
      precision: 2,
      minMove: 0.001,
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

const createSeries = (newData: {
  oracle: DecimalTimeSeries[];
  market: DecimalTimeSeries[];
}): void => {
  if (!chart || !oracleSerie) {
    return;
  }

  const newOracleSerie: LineData[] = chain(newData.oracle)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const newMarketSerie: LineData[] = chain(newData.market)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newMarketSerie.length > 0) {
    marketSerie.setData(newMarketSerie);
  }

  if (newOracleSerie.length > 0) {
    oracleSerie.setData(newOracleSerie);
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
title: Oracle & Market price
</i18n>
