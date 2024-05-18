<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items="['1st Quartile', 'Median', '3rd Quartile']"
          :colors="theme.colorsArray"
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
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import { type HistoricalAverageHealth, type Market } from "@CM/Services/CrvUsd";
import { useQueryLiqAvgHealth } from "@CM/Services/CrvUsd/Queries";

const { t } = useI18n();

// Props
interface Props {
  market?: Market;
}

const { market } = defineProps<Props>();

// Refs
let areaSerie: ISeriesApi<"Area">;
let areaQ1Serie: ISeriesApi<"Area">;
let areaQ3Serie: ISeriesApi<"Area">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    areaSerie = chart.addAreaSeries(createOptionsSerie());
    areaQ1Serie = chart.addAreaSeries(createQ1OptionsSerie());
    areaQ3Serie = chart.addAreaSeries(createQ3OptionsSerie());
  }
);

// Data
const { isFetching: loading, data: health } = useQueryLiqAvgHealth(
  toRef(() => market)
);

// Watches
watch([health, chart], createSeries);
watch(theme, () => {
  areaQ1Serie.applyOptions(createOptionsSerie());
  areaSerie.applyOptions(createOptionsSerie());
  areaQ3Serie.applyOptions(createOptionsSerie());
});

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
}

function createOptionsSerie(): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: theme.value.colors.yellow,
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createQ1OptionsSerie(): AreaSeriesPartialOptions {
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
}

function createQ3OptionsSerie(): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: theme.value.colors.green,
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeries([newLosses, chart]: [
  HistoricalAverageHealth[]?,
  IChartApi?
]): void {
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
title: Historical Health Distribution
</i18n>
