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
import {
  ManagerService,
  type TroveManagerDetails,
  type DecimalTimeSeries,
} from "@PM/Services";

const { t } = useI18n();

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();

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
const managerService = new ManagerService(getHost(), flavor.value);

// Data
const { loading, data, load } = usePromise(() => {
  if (vault) {
    return managerService
      .getVaultTroveCount("ethereum", vault.address, "1m")
      .then((x) => x.count);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Watches
watch(data, createSeries);
watch(() => vault, load);
watch(theme, () => globalCrSerie.applyOptions(createGlobalCrOptionsSerie()));

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

function createGlobalCrOptionsSerie(): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "price",
      precision: 0,
      minMove: 0.1,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lastValueVisible: false,
    priceLineVisible: false,
    ...theme.value.lineChartColors,
  };
}

function createSeries(globalCr: DecimalTimeSeries[]): void {
  if (!chart.value || !globalCrSerie) {
    return;
  }

  const newGlobalCrSerie: LineData[] = chain(globalCr)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();
  if (newGlobalCrSerie.length > 0) {
    globalCrSerie.setData(newGlobalCrSerie);
  }

  chart.value.timeScale().fitContent();
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
      height: 300px;
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Number of open troves
</i18n>
