<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items="['Borrowable', 'Debt ceiling']"
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
import { type Market, type AvailableCap } from "@CM/Services/CrvUsd";
import { useQueryAvailableCap } from "@CM/Services/CrvUsd/Queries";

const { t } = useI18n();

// Props
interface Props {
  market?: Market;
}

const { market } = defineProps<Props>();

// Refs
let availSerie: ISeriesApi<"Area">;
let capSerie: ISeriesApi<"Area">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    availSerie = chart.addAreaSeries(createAvailOptionsSerie());
    capSerie = chart.addAreaSeries(createCapOptionsSerie());
  }
);

// Data
const { isFetching: loading, data: availableCap } = useQueryAvailableCap(
  toRef(() => market)
);

// Watches
watch([availableCap, chart], createSeries);
watch(theme, () => {
  availSerie.applyOptions(createAvailOptionsSerie());
  capSerie.applyOptions(createCapOptionsSerie());
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
    localization: {
      priceFormatter: (price: number) => formatter(price),
    },
  });
}

function createAvailOptionsSerie(): AreaSeriesPartialOptions {
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

function createCapOptionsSerie(): AreaSeriesPartialOptions {
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

function createSeries([newAvCap, chart]: [AvailableCap[]?, IChartApi?]): void {
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
}

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
