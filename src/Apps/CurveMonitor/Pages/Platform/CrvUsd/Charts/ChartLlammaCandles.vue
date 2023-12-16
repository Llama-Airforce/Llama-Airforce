<template>
  <Card
    class="candles"
    :title="dynamicTitle"
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
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import type { Subscription } from "rxjs";
import { getAddress } from "ethers/lib/utils";
import {
  type CandlestickData,
  ColorType,
  createChart as createChartFunc,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  LineStyle,
  type UTCTimestamp,
} from "lightweight-charts";
import { Card, ButtonToggle } from "@/Framework";
import { round, unit } from "@/Util";
import { getColors } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@CM/Stores";
import type { Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import {
  OHLCService,
  type OhlcModel,
} from "@CM/Services/Sockets/CurvePrices/LlammaOhlcService";

const { t } = useI18n();
let ohlcService: OHLCService;
let chart: IChartApi;
let candleSeries: ISeriesApi<"Candlestick">;
let max = 1;
let min = 0;

// Props
interface Props {
  market?: Market | null;
}

const { market } = defineProps<Props>();

// Refs
const storeSettings = useSettingsStore();
const ohlcData = ref<OhlcModel[]>([]);

let subscription: Subscription; // assuming you're using RxJS
const chartRef = ref<HTMLElement | null>(null);
const invert = ref(false);
const url =
  "ws://a85d6d4c6054a4f1f806c8af90dcfdeb-282892957.eu-central-1.elb.amazonaws.com/v1/stream/ws";
const chainName = "ethereum";
const interval = 86400;

const dynamicTitle = computed(() => {
  if (!market) return t("title");
  return `Daily candles ${
    !invert.value ? `${market.name}/crvUSD` : `crvUSD/${market.name}`
  }`;
});

onMounted(async (): Promise<void> => {
  if (!chartRef.value || !market) return;
  await nextTick();
  const llamma = getAddress(market.llamma);
  const now = Date.now();
  const fifteenDays = 15 * 24 * 60 * 60 * 1000;
  const end = Math.floor(now / 1000);
  const start = Math.floor((now - fifteenDays) / 1000);
  ohlcService = new OHLCService(url, llamma, chainName, interval, start, end);
  const colors = getColors(storeSettings.theme);
  subscription = ohlcService.data$.subscribe((data) => {
    ohlcData.value = data;
    createChart(data, invert.value);
  });

  chart = createChartFunc(chartRef.value, {
    width: chartRef.value.clientWidth,
    height: chartRef.value.clientHeight,
    layout: {
      background: {
        type: ColorType.Solid,
        color: colors.backgroundColor,
      },
      textColor: colors.level5,
      fontFamily:
        "ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, monospace",
    },
    grid: {
      vertLines: {
        visible: false,
      },
      horzLines: {
        color: colors.level2,
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
    upColor: colors.green,
    borderUpColor: colors.green,
    wickUpColor: colors.green,
    downColor: colors.red,
    borderDownColor: colors.red,
    wickDownColor: colors.red,
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
  });
});

onUnmounted(() => {
  subscription.unsubscribe();
});

// Watches
watch(ohlcData, (newData) => {
  createChart(newData, invert.value);
});

watch(invert, (newInvert) => {
  createChart(ohlcData.value, newInvert);
});

watch(
  () => market,
  (
    newMarket: Market | null | undefined,
    oldMarket: Market | null | undefined
  ) => {
    if (newMarket && newMarket !== oldMarket) {
      subscription.unsubscribe();

      const llamma = getAddress(newMarket.llamma);
      const now = Date.now();
      const fifteenDays = 15 * 24 * 60 * 60 * 1000;
      const end = Math.floor(now / 1000);
      const start = Math.floor((now - fifteenDays) / 1000);
      ohlcService = new OHLCService(
        url,
        llamma,
        chainName,
        interval,
        start,
        end
      );

      subscription = ohlcService.data$.subscribe((data) => {
        ohlcData.value = data;
        createChart(data, invert.value);
      });
    }
  }
);

// Methods
const createChart = (newCandles: OhlcModel[], newInvert: boolean): void => {
  if (!chart || !candleSeries || !newCandles) {
    return;
  }

  const invertMultiplier = newInvert ? -1 : 1;

  const newCandleSeries: CandlestickData[] = chain(newCandles)
    .map((c) => ({
      time: c.time as UTCTimestamp,
      open: Math.pow(c.open, invertMultiplier),
      high: Math.pow(c.high, invertMultiplier),
      low: Math.pow(c.low, invertMultiplier),
      close: Math.pow(c.close, invertMultiplier),
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newCandleSeries.length > 0) {
    candleSeries.setData(newCandleSeries);
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
