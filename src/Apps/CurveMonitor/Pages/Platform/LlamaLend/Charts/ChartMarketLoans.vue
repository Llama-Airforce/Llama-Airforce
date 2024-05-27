<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading
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
import { useQuerySnapshots } from "@CM/Services/LlamaLend/Queries";
import { type Chain } from "@CM/Models/Chain";
import createChartStyles from "@CM/Util/ChartStyles";
import { type Market, type Snapshot } from "@CM/Services/LlamaLend";

const { t } = useI18n();

// Props
interface Props {
  market: Market | undefined;
  chain: Chain | undefined;
}

const { market, chain } = defineProps<Props>();

// Refs
let loansSerie: ISeriesApi<"Histogram">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    loansSerie = chart.addHistogramSeries(createOptionsSerieLoans());
  }
);

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market),
  toRef(() => chain)
);

// Watches
watch([snapshots, chart], createSeriesLoans);
watch(theme, () => loansSerie.applyOptions(createOptionsSerieLoans()));

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    height: 300,
    rightPriceScale: {
      scaleMargins: {
        top: 0.15,
        bottom: 0.1,
      },
    },
    localization: {
      priceFormatter: formatter,
    },
  });
}

function createOptionsSerieLoans(): HistogramSeriesPartialOptions {
  return {
    color: theme.value.colors.yellow,
    lastValueVisible: false,
    priceFormat: {
      type: "volume",
    },
    priceLineVisible: false,
  };
}

function createSeriesLoans([newSnapshots, chart]: [
  Snapshot[]?,
  IChartApi?
]): void {
  if (!chart || !loansSerie) {
    return;
  }

  const newLoansSeries: HistogramData[] = chain_(newSnapshots)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.numLoans,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newLoansSeries.length > 0) {
    loansSerie.setData(newLoansSeries);

    const from = newLoansSeries[0].time;
    const to = newLoansSeries[newLoansSeries.length - 1].time;
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
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Loans
</i18n>
