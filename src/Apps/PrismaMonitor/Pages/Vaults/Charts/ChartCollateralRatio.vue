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
import { useSettingsStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import { ManagerService, type DecimalTimeSeries } from "@PM/Services";

const { t } = useI18n();

// Refs
const { theme, flavor } = storeToRefs(useSettingsStore());

// Services
const managerService = new ManagerService(flavor.value);

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-collateral-ratios"],
  queryFn: () =>
    managerService
      .getCollateralRatioGrouped("ethereum", "all")
      .then((x) => x.data),
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Chart
const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) => createChartStyles(chartRef, theme.value),
  series: {
    type: "Area",
    name: "cr" as const,
    options: computed(
      (): AreaSeriesPartialOptions => ({
        priceFormat: {
          type: "percent",
          precision: 2,
          minMove: 0.1,
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
function createSeries([globalCr, chart]: [
  DecimalTimeSeries[]?,
  IChartApi?
]): void {
  if (!chart || !series.cr) {
    return;
  }

  const newGlobalCrSerie: LineData[] = (globalCr ?? [])
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value * 100,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newGlobalCrSerie.length > 0) {
    series.cr.setData(newGlobalCrSerie);
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
title: Global collateral ratio
</i18n>
