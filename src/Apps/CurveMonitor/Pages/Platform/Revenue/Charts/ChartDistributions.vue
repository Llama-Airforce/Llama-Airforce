<template>
  <Card
    class="chart-container"
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
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import { type Distribution } from "@CM/Services/Revenue";

const { t } = useI18n();

// Props
interface Props {
  distributions: Distribution[];
}

const { distributions } = defineProps<Props>();

// Refs
let distributionsSerie: ISeriesApi<"Histogram">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    distributionsSerie = chart.addHistogramSeries(
      createOptionsSerieDistributions()
    );
  }
);

// Watches
watch([toRef(() => distributions), chart], createSeriesDistributions);
watch(theme, () =>
  distributionsSerie.applyOptions(createOptionsSerieDistributions())
);

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    height: 300,
    rightPriceScale: {
      scaleMargins: {
        top: 0.15,
        bottom: 0.1,
      },
    },
  });
}

function createOptionsSerieDistributions(): HistogramSeriesPartialOptions {
  return {
    priceFormat: {
      type: "custom",
      formatter: (x: number) => formatterPrice(x),
      minMove: 0.01,
    },
    color: theme.value.colors.blue,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeriesDistributions([newDistributions, chart]: [
  Distribution[]?,
  IChartApi?
]): void {
  if (!chart || !distributionsSerie) {
    return;
  }

  const newDistributionsSeries: HistogramData[] = chain(newDistributions)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.feesUsd,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .takeRight(52)
    .value();

  if (newDistributionsSeries.length > 0) {
    distributionsSerie.setData(newDistributionsSeries);

    const from = newDistributionsSeries[0].time;
    const to = newDistributionsSeries[newDistributionsSeries.length - 1].time;
    chart.timeScale().setVisibleRange({ from, to });
  }
}

const formatterPrice = (x: number): string =>
  `$${round(x, 0, "dollar")}${unit(x, "dollar")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: stretch;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Distributions (1y)
</i18n>
