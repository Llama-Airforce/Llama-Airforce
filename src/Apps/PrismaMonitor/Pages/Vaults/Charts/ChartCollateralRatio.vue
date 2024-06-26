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
import { ManagerService, type DecimalTimeSeries } from "@PM/Services";

const { t } = useI18n();

// Refs
let globalCrSerie: ISeriesApi<"Area">;

const { theme, flavor } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    globalCrSerie = chart.addAreaSeries(createGlobalCrOptionsSerie());
  }
);

// Services
const managerService = new ManagerService(useHost(), flavor.value);

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

// Watches
watch([data, chart], createSeries);
watch(theme, () => globalCrSerie.applyOptions(createGlobalCrOptionsSerie()));

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

function createGlobalCrOptionsSerie(): AreaSeriesPartialOptions {
  return {
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
  };
}

function createSeries([globalCr, chart]: [
  DecimalTimeSeries[]?,
  IChartApi?
]): void {
  if (!chart || !globalCrSerie) {
    return;
  }

  const newGlobalCrSerie: LineData[] = chain(globalCr)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value * 100,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newGlobalCrSerie.length > 0) {
    globalCrSerie.setData(newGlobalCrSerie);
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
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Global collateral ratio
</i18n>
