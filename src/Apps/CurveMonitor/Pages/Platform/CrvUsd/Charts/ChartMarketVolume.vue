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
import { ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  createChart as createChartFunc,
  IChartApi,
  ISeriesApi,
  LineData,
  AreaSeriesPartialOptions,
  LineType,
  UTCTimestamp,
} from "lightweight-charts";
import { Card } from "@/Framework";
import { round, unit } from "@/Util";
import { getHost } from "@/Services/Host";
import { getColors } from "@/Styles/Themes/CM";
import { useCurveMonitorStore } from "@CM/Store";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import CurveService, {
  type MarketVolume,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

let chart: IChartApi;
let areaSerie: ISeriesApi<"Area">;

// Props
interface Props {
  market: string;
}

const { market } = defineProps<Props>();

// Refs
const store = useCurveMonitorStore();

const chartRef = ref<HTMLElement | null>(null);
const volumes = ref<MarketVolume[]>([]);
const loading = ref(false);

// Hooks
onMounted((): void => {
  if (!chartRef.value) return;

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, store.theme)
  );
  areaSerie = chart.addAreaSeries(createOptionsSerie(store.theme));

  createSeries(volumes.value);
});

// Watches
watch(
  () => market,
  async (newMarket) => {
    loading.value = true;

    volumes.value = await curveService
      .getMarketVolume(newMarket)
      .then((x) => x.volumes);

    loading.value = false;
  },
  { immediate: true }
);

watch(
  () => store.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      areaSerie.applyOptions(createOptionsSerie(newTheme));
    }
  }
);

watch(volumes, (newVolumes) => {
  createSeries(newVolumes);
});

// Methods
const createOptionsChart = (chartRef: HTMLElement, theme: Theme) => {
  return createChartStyles(chartRef, theme, {
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

const createOptionsSerie = (theme: Theme): AreaSeriesPartialOptions => {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: colors.blue,
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
};

const createSeries = (newTvl: MarketVolume[]): void => {
  if (!chart || !areaSerie) {
    return;
  }

  const newSerie: LineData[] = chain(newTvl)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.swapVolumeUsd,
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
title: Market Volume
</i18n>
