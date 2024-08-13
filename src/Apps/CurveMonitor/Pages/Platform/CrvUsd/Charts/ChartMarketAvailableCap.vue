<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading
  >
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
import { type Snapshot, type Market } from "@CM/Services/CrvUsd";
import { useQuerySnapshots } from "@CM/Services/CrvUsd/Queries";

const { t } = useI18n();

// Props
interface Props {
  market: Market | undefined;
}

const { market } = defineProps<Props>();

// Refs
let availSerie: ISeriesApi<"Area"> | undefined;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => (availSerie = chart.addAreaSeries(createAvailOptionsSerie()))
);

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market)
);

// Watches
watch([snapshots, chart], createSeries);
watch(theme, () => {
  availSerie?.applyOptions(createAvailOptionsSerie());
});

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    height: 300,
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
}

function createAvailOptionsSerie(): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "custom",
      formatter,
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

function createSeries([newSnapshots, chart]: [Snapshot[]?, IChartApi?]): void {
  if (!chart || !availSerie) {
    return;
  }

  const newAvailSerie: LineData[] = chain(newSnapshots)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.borrowable,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .dropWhile((x) => x.value === 0)
    .value();

  if (newAvailSerie.length > 0) {
    availSerie.setData(newAvailSerie);
  }

  chart.timeScale().fitContent();
}

const formatter = (y: number): string => {
  return `$${round(y, 0, "dollar")}${unit(y, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  :deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Borrowable & Debt Ceiling
</i18n>
