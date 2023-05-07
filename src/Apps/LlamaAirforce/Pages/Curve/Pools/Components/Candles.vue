<template>
  <Card
    class="candles"
    :title="t('title')"
  >
    <div
      ref="chartRef"
      class="chart"
    ></div>

    <div class="buttons">
      <ButtonToggle v-model="invert">{{ t("invert") }}</ButtonToggle>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  CandlestickData,
  ColorType,
  createChart as createChartFunc,
  CrosshairMode,
  HistogramData,
  IChartApi,
  ISeriesApi,
  LineStyle,
  UTCTimestamp,
} from "lightweight-charts";
import { Card, ButtonToggle } from "@/Framework";
import { round, unit } from "@/Util";
import { WEthAddress } from "@/Util/Addresses";
import { ColorsLAFDark } from "@/Styles/Themes/LAF/Dark";
import type { Pool, Candle } from "@LAF/Pages/Curve/Pools/Models";
import { useCurvePoolsStore } from "@LAF/Pages/Curve/Pools/Store";

const { t } = useI18n();

let chart: IChartApi;
let candleSeries: ISeriesApi<"Candlestick">;
let volumeSeries: ISeriesApi<"Histogram">;
let max = 1;
let min = 0;

// Props
interface Props {
  poolSelected: Pool | null;
}

const { poolSelected } = defineProps<Props>();

// Refs
const store = useCurvePoolsStore();

const chartRef = ref<HTMLElement | null>(null);
const invert = ref(false);

onMounted((): void => {
  if (!chartRef.value) return;

  chart = createChartFunc(chartRef.value, {
    width: chartRef.value.clientWidth,
    height: chartRef.value.clientHeight,
    layout: {
      background: {
        type: ColorType.Solid,
        color: ColorsLAFDark.backgroundColor,
      },
      textColor: ColorsLAFDark.level5,
      fontFamily: "SF Mono, Consolas, monospace",
    },
    grid: {
      vertLines: {
        visible: false,
      },
      horzLines: {
        color: ColorsLAFDark.level4,
        style: LineStyle.Dashed,
      },
    },
    crosshair: {
      mode: CrosshairMode.Magnet,
      horzLine: {
        visible: false,
      },
    },
    leftPriceScale: {
      borderVisible: false,
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    },
    rightPriceScale: {
      borderVisible: false,
    },
    timeScale: {
      borderVisible: false,
    },
    localization: {
      priceFormatter: (price: number) => formatterPrice(price),
    },
  });

  candleSeries = chart.addCandlestickSeries({
    upColor: ColorsLAFDark.green,
    borderUpColor: ColorsLAFDark.green,
    wickUpColor: ColorsLAFDark.green,
    downColor: ColorsLAFDark.red,
    borderDownColor: ColorsLAFDark.red,
    wickDownColor: ColorsLAFDark.red,
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
  });

  volumeSeries = chart.addHistogramSeries({
    color: ColorsLAFDark.blue,
    lastValueVisible: false,
    priceFormat: {
      type: "volume",
    },
    priceScaleId: "left",
  });
});

const candles = computed((): Candle[] => {
  const id = poolSelected?.id;

  return id ? store.candles[id] ?? [] : [];
});

// Watches
watch(candles, (newCandles) => {
  createChart(newCandles, invert.value);
});

watch(invert, (newInvert) => {
  createChart(candles.value, newInvert);
});

// Methods
const createChart = (newCandles: Candle[], newInvert: boolean): void => {
  if (!chart || !candleSeries || !volumeSeries || !poolSelected) {
    return;
  }

  // Make price ETH/X if the first coin is WETH.
  let invertMultiplier =
    poolSelected.coins[0].toLocaleLowerCase() === WEthAddress ? -1 : 1;
  invertMultiplier = invertMultiplier * (newInvert ? -1 : 1);

  const newCandleSeries: CandlestickData[] = chain(newCandles)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      open: Math.pow(c.open, invertMultiplier),
      high: Math.pow(c.high, invertMultiplier),
      low: Math.pow(c.low, invertMultiplier),
      close: Math.pow(c.close, invertMultiplier),
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const newVolumeSeries: HistogramData[] = chain(newCandles)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.token0TotalAmount,
      color: ColorsLAFDark.blue,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newCandleSeries.length > 0 && newVolumeSeries.length > 0) {
    candleSeries.setData(newCandleSeries);
    volumeSeries.setData(newVolumeSeries);
    chart.timeScale().fitContent();

    min = Math.min(...newCandleSeries.map((c) => c.low));
    max = Math.max(...newCandleSeries.map((c) => c.high));
  }
};

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

.candles {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;

    .chart {
      height: 400px;
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Price
invert: Invert
</i18n>
