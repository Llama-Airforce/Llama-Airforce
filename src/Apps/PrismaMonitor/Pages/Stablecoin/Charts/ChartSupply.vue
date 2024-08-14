<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { useSettingsStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import { type DecimalTimeSeries, StableService } from "@PM/Services";

const { t } = useI18n();

// Refs
const { theme, flavor } = storeToRefs(useSettingsStore());

const stableService = new StableService(flavor.value);

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-stable-supply"],
  queryFn: () =>
    stableService.getSupplyHistory("ethereum").then((x) => x.supply),
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Chart

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) =>
    createChartStyles(chartRef, theme.value, {
      height: 300,
      leftPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      localization: {
        priceFormatter: (y: number): string =>
          `${round(y, 1, "dollar")}${unit(y, "dollar")}`,
      },
    }),
  series: {
    type: "Area",
    name: "supply" as const,
    options: computed(
      (): AreaSeriesPartialOptions => ({
        priceFormat: {
          type: "price",
          precision: 2,
          minMove: 0.001,
        },
        lineWidth: 2,
        lineType: LineType.WithSteps,
        lastValueVisible: false,
        priceLineVisible: false,
        ...theme.value.lineChartColors,
      })
    ),
  },
});

watch([data, chart], createSeries);
function createSeries([newData, chart]: [
  DecimalTimeSeries[]?,
  IChartApi?
]): void {
  if (!chart || !series.supply) {
    return;
  }

  const newSerie: LineData[] = chain(newData)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerie.length > 0) {
    series.supply.setData(newSerie);
  }

  chart.timeScale().fitContent();
}
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
title: Supply
</i18n>
