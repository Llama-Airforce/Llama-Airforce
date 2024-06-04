<template>
  <Card
    ref="chartCard"
    class="chart-container"
    :title="t('title')"
    :loading
    :class="{ fullscreen }"
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items
          :disabled
          @toggle="toggles[$event].value = !toggles[$event].value"
        ></Legend>

        <BtnChartLWFullscreen
          v-model="fullscreen"
          :chart="chart"
          :target="chartCard?.$el"
        />
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
import { type AutoscaleInfo } from "lightweight-charts";
import { useSettingsStore } from "@CM/Stores";
import { BtnChartLWFullscreen } from "@CM/Components/";
import createChartStyles from "@CM/Util/ChartStyles";
import { type PoolPrice } from "@CM/Services/CrvUsd";
import {
  useQueryKeepers,
  useQueryKeeperPrices,
} from "@CM/Services/CrvUsd/Queries";

const { t } = useI18n();

// Refs
let lineSeries: ISeriesApi<"Line">[] = [];

const { theme } = storeToRefs(useSettingsStore());

// Legend
const coins = ["USDC", "USDT", "TUSD", "USDP"] as const;

const { items, toggles, disabled } = useLegend(() => {
  return coins.map((coin, i) => ({
    id: coin,
    label: coin,
    color: theme.value.colorsArray[i],
    togglable: true,
  }));
});

// Data
const loading = computed(
  () => loadingKeepers.value || loadingKeeperPrices.value
);
const { isFetching: loadingKeepers, data: keepers } = useQueryKeepers();
const { isFetching: loadingKeeperPrices, data: prices } =
  useQueryKeeperPrices(keepers);

// Chart
const fullscreen = ref(false);
const chartCard = ref<ComponentPublicInstance | undefined>(undefined);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  () => {
    addSeries();
  }
);

watch(theme, () => {
  for (const [i, serie] of lineSeries.entries()) {
    serie.applyOptions(createOptionsSerie(i));
  }
});

function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    height: chartRef.clientHeight || 300,
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
}

function createOptionsSerie(i: number): LineSeriesPartialOptions {
  return {
    priceFormat: {
      type: "custom",
      formatter,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    color: theme.value.colorsArray[i],
    lastValueVisible: false,
    priceLineVisible: false,
    autoscaleInfoProvider: (original: () => AutoscaleInfo) => {
      const res = original();

      if (res !== null) {
        res.priceRange.minValue = Math.max(0.98, res.priceRange.minValue);
        res.priceRange.maxValue = Math.min(1.02, res.priceRange.maxValue);
      }

      return res;
    },
  };
}

function addSeries(): void {
  if (!chart.value) {
    return;
  }

  // Clear old line series before adding new ones.
  for (const serie of lineSeries) {
    chart.value.removeSeries(serie);
  }

  lineSeries = [];
  for (let i = 0; i < coins.length; i++) {
    const lineSerie = chart.value.addLineSeries(createOptionsSerie(i));

    lineSeries.push(lineSerie);
  }
}

watchEffect(createSeries);
function createSeries(): void {
  if (!chart.value || lineSeries.length < 0) {
    return;
  }

  for (const [i, coin] of coins.entries()) {
    // Don't render disabled coins. But keep the serie so colors don't get mixed up.
    if (!toggles[coin].value) {
      lineSeries[i].setData([]);
      continue;
    }

    const newLineSerie: LineData[] = chain(prices.value as PoolPrice[])
      .map((x) => ({
        time: x.timestamp as UTCTimestamp,
        value: x[coin],
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((c) => c.time, "asc")
      .value();

    if (newLineSerie.length > 0) {
      lineSeries[i].setData(newLineSerie);
    }
  }

  chart.value.timeScale().fitContent();
}

const formatter = (y: number): string => {
  return `${round(y, 3, "dollar")}${unit(y, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }

  .actions {
    display: flex;
    gap: 1rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Stablecoin Prices of Pegkeepers
</i18n>
