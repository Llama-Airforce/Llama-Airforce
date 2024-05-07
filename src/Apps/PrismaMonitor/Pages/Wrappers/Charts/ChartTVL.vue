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
  getHost,
  WrapperService,
  type Contract,
  type DecimalTimeSeries,
} from "@PM/Services";

const { t } = useI18n();

const prismaService = new WrapperService(getHost());

// Props
interface Props {
  contract: Contract;
}

const { contract } = defineProps<Props>();

// Refs
let serie: ISeriesApi<"Area">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    serie = chart.addAreaSeries(createOptionsSerie());
  }
);

// Data
const { loading, data } = usePromise(
  () => prismaService.getTVL(contract).then((x) => x.tvl),
  []
);

// Watches
watch(data, createSeries);
watch(theme, () => serie.applyOptions(createOptionsSerie()));

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    leftPriceScale: {
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

function createOptionsSerie(): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.01,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lastValueVisible: false,
    priceLineVisible: false,
    ...theme.value.lineChartColors,
  };
}

function createSeries(newData: DecimalTimeSeries[]): void {
  if (!chart.value || !serie) {
    return;
  }

  const newSerie: LineData[] = chain(newData)
    .filter((x) => x.value > 0)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerie.length > 0) {
    serie.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}

const formatter = (y: number): string => {
  return `$${round(y, 0, "dollar")}${unit(y, "dollar")}`;
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
      height: 300px;
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: TVL
</i18n>
