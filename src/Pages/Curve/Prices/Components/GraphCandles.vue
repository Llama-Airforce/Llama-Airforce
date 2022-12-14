<template>
  <Card
    class="candles"
    :title="title"
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
import { onMounted, watch } from "vue";
import { $ref, $computed } from "vue/macros";
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
import { round, unit, shorten } from "@/Util";
import { WEthAddress } from "@/Util/Addresses";
import Pool from "@/Pages/Curve/Models/Pool";
import { useCurveStore } from "@/Pages/Curve/Store";
import Candle from "@/Pages/Curve/Prices/Models/Candle";
// Props
interface Props {
  poolSelected: Pool | null;
}

const { poolSelected } = defineProps<Props>();

const { t } = useI18n();

// Refs
const store = useCurveStore();

const chartRef = $ref<HTMLElement | null>(null);
let chart: IChartApi | null = $ref(null);
let candleSeries: ISeriesApi<"Candlestick"> | null = $ref(null);
let volumeSeries: ISeriesApi<"Histogram"> | null = $ref(null);

const invert = $ref(false);
let max = $ref(1);
let min = $ref(0);

onMounted((): void => {
  if (!chartRef) return;

  chart = createChartFunc(chartRef, {
    width: chartRef.clientWidth,
    height: chartRef.clientHeight,
    layout: {
      background: {
        type: ColorType.Solid,
        color: "rgba(255, 255, 255, 0)",
      },
      textColor: "#71717a",
      fontFamily: "SF Mono, Consolas, monospace",
    },
    grid: {
      vertLines: {
        visible: false,
      },
      horzLines: {
        color: "#71717a",
        style: LineStyle.Dashed,
      },
    },
    crosshair: {
      mode: CrosshairMode.Magnet,
      horzLine: {
        visible: false,
      },
    },
    rightPriceScale: {
      borderVisible: false,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    timeScale: {
      borderVisible: false,
    },
    localization: {
      priceFormatter: (price: number) => formatterPrice(price),
    },
  });

  candleSeries = chart.addCandlestickSeries({
    upColor: "rgb(126, 217, 87)",
    borderUpColor: "rgb(126, 217, 87)",
    wickUpColor: "rgb(126, 217, 87)",
    downColor: "rgb(255, 87, 87)",
    borderDownColor: "rgb(255, 87, 87)",
    wickDownColor: "rgb(255, 87, 87)",
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
  });

  volumeSeries = chart.addHistogramSeries({
    color: "rgb(32, 129, 240)",
    lastValueVisible: false,
    priceFormat: {
      type: "volume",
    },
    priceScaleId: "",
    scaleMargins: {
      top: 0.8,
      bottom: 0,
    },
  });
});

const title = $computed((): string => {
  let title = t("title");
  if (poolSelected) {
    title = shorten(poolSelected.name);
  }

  return title;
});

const candles = $computed((): Candle[] => {
  const id = poolSelected?.id;

  return id ? store.candles[id] ?? [] : [];
});

// Watches
watch(
  () => candles,
  (newCandles) => {
    createChart(newCandles, invert);
  }
);

watch(
  () => invert,
  (newInvert) => {
    createChart(candles, newInvert);
  }
);

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
      color: "rgb(32, 129, 240)",
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
      height: 600px;
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Price
invert: Invert
</i18n>
