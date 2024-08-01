<template>
  <Card
    class="tvl"
    :title="t('title')"
  >
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { createChart as createChartFunc } from "lightweight-charts";
import type { Tvl } from "@CM/Pages/Platform/MonitorLegacy/Models";
import { useMonitorStore } from "@CM/Pages/Platform/MonitorLegacy/Store";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";

const { t } = useI18n();

let chart: IChartApi;
let areaSerie: ISeriesApi<"Area">;

// Refs
const store = useMonitorStore();
const { theme } = storeToRefs(useSettingsStore());

const chartRef = ref<HTMLElement | null>(null);

const tvl = computed((): Tvl[] => {
  return store.tvl;
});

// Hooks
onMounted((): void => {
  if (!chartRef.value) return;

  chart = createChartFunc(chartRef.value, createOptionsChart(chartRef.value));
  areaSerie = chart.addAreaSeries(createOptionsSerie());

  createSeries(tvl.value);
});

// Watches
watch(tvl, (newTvl) => {
  createSeries(newTvl);
});

watch(theme, () => {
  if (chartRef.value) {
    chart.applyOptions(createOptionsChart(chartRef.value));
    areaSerie.applyOptions(createOptionsSerie());
  }
});

// Methods
const createOptionsChart = (chartRef: HTMLElement) => {
  return createChartStyles(chartRef, theme.value, {
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

const createOptionsSerie = (): AreaSeriesPartialOptions => {
  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: theme.value.colors.blue,
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
};

const createSeries = (newTvl: Tvl[]): void => {
  if (!chart || !areaSerie) {
    return;
  }

  const newSerie: LineData[] = chain(newTvl)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.tvl,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerie.length > 0) {
    areaSerie.setData(newSerie);
  }

  chart.timeScale().fitContent();
};

const formatter = (y: number): string => {
  return `$${round(y, 1, "dollar")}${unit(y, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.tvl {
  :deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;

    .chart {
      height: 100%;
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: TVL
</i18n>
