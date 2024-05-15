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
import { chain as chain_ } from "lodash";
import { useSettingsStore } from "@CM/Stores";
import { type Chain } from "@CM/Models/Chain";
import createChartStyles from "@CM/Util/ChartStyles";
import LlamaLendService, {
  type Market,
  type LiqHistory,
} from "@CM/Services/LlamaLend";

const { t } = useI18n();

const llameLendService = new LlamaLendService(getHost());

// Props
interface Props {
  market?: Market | null;
  chain?: Chain | null;
}

const { market = null, chain = null } = defineProps<Props>();

// Refs
let serieCount: ISeriesApi<"Histogram">;
let serieValue: ISeriesApi<"Line">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    serieCount = chart.addHistogramSeries(createOptionsSerieCount());
    serieValue = chart.addLineSeries(createOptionsSerieValue());
  }
);

// Data
const { isFetching: loading, data: history } = useQuery({
  queryKey: [
    "llama-market-liq-history",
    computed(() => market?.controller),
  ] as const,
  queryFn: ({ queryKey: [, controller] }) => {
    if (controller && chain) {
      return llameLendService.getLiqHistory(chain, controller);
    } else {
      return Promise.resolve([]);
    }
  },
});

// Watches
watch([history, chart], createSeries);
watch(theme, () => {
  serieCount.applyOptions(createOptionsSerieCount());
  serieValue.applyOptions(createOptionsSerieValue());
});

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    height: 200,
    rightPriceScale: {
      scaleMargins: {
        top: 0.15,
        bottom: 0.1,
      },
    },
    leftPriceScale: {
      visible: true,
      scaleMargins: {
        top: 0.15,
        bottom: 0.1,
      },
    },
    localization: {
      priceFormatter: formatter,
    },
    timeScale: {
      barSpacing: 320,
      minBarSpacing: 320,
    },
  });
}

function createOptionsSerieCount(): HistogramSeriesPartialOptions {
  return {
    color: theme.value.colors.yellow,
    lastValueVisible: false,
    priceFormat: {
      type: "volume",
    },
    priceLineVisible: false,
    priceScaleId: "left",
  };
}

function createOptionsSerieValue(): LineSeriesPartialOptions {
  return {
    priceFormat: {
      type: "price",
      precision: 2,
      minMove: 0.01,
    },
    lineWidth: 2,
    color: theme.value.colors.blue,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeries([newHistory, chart]: [LiqHistory[]?, IChartApi?]): void {
  if (!chart || !serieCount || !serieValue) {
    return;
  }

  const newSerieCount: HistogramData[] = chain_(newHistory)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.self_count,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const newSerieValue: LineData[] = chain_(newHistory)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.self_value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerieCount.length > 0) {
    serieCount.setData(newSerieCount);
  }

  if (newSerieValue.length > 0) {
    serieValue.setData(newSerieValue);
  }

  if (newSerieCount.length > 0 && newSerieValue.length > 0) {
    const from = newSerieCount[0].time;
    const to = newSerieCount[newSerieCount.length - 1].time;
    chart.timeScale().setVisibleRange({ from, to });
  }
}

// Needed to fix weird right margin wtf.
const formatter = (y: number): string => Math.round(y).toString();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: stretch;
    gap: 1rem;

    overflow-x: hidden;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Liquidation History
</i18n>
