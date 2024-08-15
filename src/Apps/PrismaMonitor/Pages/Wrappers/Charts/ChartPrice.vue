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
import { useSettingsStore, useSocketStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import { type Contract } from "@PM/Services";
import {
  CurvePriceService,
  CurveVolumeService,
  type OHLC,
  type Volume,
} from "@/Services";
import {
  getPriceSettings,
  getVolumeSettings,
} from "@PM/Pages/Wrappers/Settings";

const { t } = useI18n();

// Props
interface Props {
  contract: Contract;
}

const { contract } = defineProps<Props>();

// Data
const priceSettings = getPriceSettings(contract);
const volumeSettings = getVolumeSettings(contract);
const socket = useSocketStore().getSocket("prices");
const priceService = new CurvePriceService(socket, "ethereum", priceSettings);
const volumeService = new CurveVolumeService(
  socket,
  "ethereum",
  volumeSettings
);

const dataPrice = useObservable(priceService.ohlc$, []);
const dataVolume = useObservable(volumeService.volume$, []);
const loading = computed(
  () => dataPrice.value.length + dataVolume.value.length === 0
);

// Chart
let max = 1;
let min = 0;

const { theme, flavor } = storeToRefs(useSettingsStore());

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) =>
    createChartStyles(chartRef, theme.value, {
      localization: {
        priceFormatter: (price: number) => formatterPrice(price),
      },
    }),
  series: [
    {
      type: "Candlestick",
      name: "price" as const,
      options: computed((): CandlestickSeriesPartialOptions => {
        const { colors } = theme.value;

        return {
          priceFormat: {
            type: "price",
            precision: 6,
            minMove: 0.01,
          },

          upColor: colors.green,
          borderUpColor: colors.green,
          wickUpColor: colors.green,
          downColor: colors.red,
          borderDownColor: colors.red,
          wickDownColor: colors.red,

          lastValueVisible: false,
          priceLineVisible: false,
        };
      }),
    },
    {
      type: "Histogram",
      name: "volume" as const,
      options: computed((): HistogramSeriesPartialOptions => {
        const { colors } = theme.value;

        return {
          color: flavor.value === "lsd" ? colors.blue : colors.purple,
          lastValueVisible: false,
          priceFormat: {
            type: "volume",
          },
          priceScaleId: "left",
          priceLineVisible: false,
        };
      }),
    },
  ],
});

watch(dataPrice, createSeriesPrice);
watch(dataVolume, createSeriesVolume);
function createSeriesPrice(newData: OHLC[]): void {
  if (!chart.value || !series.price) {
    return;
  }

  const invertMultiplier = 1;

  const newSerie: CandlestickData[] = newData
    .map((c) => ({
      time: c.time as UTCTimestamp,
      open: Math.pow(c.open, invertMultiplier),
      high: Math.pow(c.high, invertMultiplier),
      low: Math.pow(c.low, invertMultiplier),
      close: Math.pow(c.close, invertMultiplier),
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.price.setData(newSerie);
    chart.value.timeScale().fitContent();

    min = Math.min(...newSerie.map((c) => c.low));
    max = Math.max(...newSerie.map((c) => c.high));
  }

  chart.value.timeScale().fitContent();
}

function createSeriesVolume(newVolumes: Volume[]): void {
  if (!chart.value || !series.volume) {
    return;
  }

  const newVolumeSeries: HistogramData[] = newVolumes
    .map((v) => ({
      time: v.timestamp as UTCTimestamp,
      value: v.volume,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newVolumeSeries.length > 0) {
    series.volume.setData(newVolumeSeries);
  }
}

const formatterPrice = (x: number): string => {
  // Count number of leading zeroes after the decimal.
  const delta = max - min;
  const y = delta > 1 ? delta - Math.floor(delta) : delta;
  const m = -Math.floor(Math.log10(y) + 1) + 2;

  return `${round(x, m, "dollar")}${unit(x, "dollar")}`;
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
title: Price (peg)
</i18n>
