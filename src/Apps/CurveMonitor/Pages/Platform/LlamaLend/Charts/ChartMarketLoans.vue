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
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { chain as chain_ } from "lodash";
import {
  createChart as createChartFunc,
  type HistogramData,
  type HistogramSeriesPartialOptions,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { Card, usePromise } from "@/Framework";
import { getHost } from "@/Services/Host";
import { getColors } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@CM/Stores";
import { type Chain } from "@CM/Models/Chain";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import LlamaLendService from "@CM/Pages/Platform/LlamaLend/Services/LlamaLendService";
import type { Market, Snapshot } from "@CM/Pages/Platform/LlamaLend/Models";

const { t } = useI18n();

const llameLendService = new LlamaLendService(getHost());

// Props
interface Props {
  market?: Market | null;
  chain?: Chain | null;
}

const { market = null, chain = null } = defineProps<Props>();

// Refs
let chart: IChartApi;
let loansSerie: ISeriesApi<"Histogram">;

// Refs
const storeSettings = useSettingsStore();

const chartRef = ref<HTMLElement | null>(null);

// Data
const {
  loading,
  data: snapshots,
  load,
} = usePromise(() => {
  if (market && chain) {
    return llameLendService.getSnapshots(chain, market.controller);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Hooks
onMounted((): void => {
  if (!chartRef.value) return;

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, storeSettings.theme)
  );
  loansSerie = chart.addHistogramSeries(
    createOptionsSerieLoans(storeSettings.theme)
  );

  createSeriesLoans(snapshots.value);
});

// Watches
watch(() => market, load);

watch(
  () => storeSettings.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      loansSerie.applyOptions(createOptionsSerieLoans(newTheme));
    }
  }
);

watch(snapshots, (newSnapshots) => {
  createSeriesLoans(newSnapshots);
});

// Methods
const createOptionsChart = (chartRef: HTMLElement, theme: Theme) => {
  return createChartStyles(chartRef, theme, {
    height: 200,
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
};

const createOptionsSerieLoans = (
  theme: Theme
): HistogramSeriesPartialOptions => {
  const colors = getColors(theme);

  return {
    color: colors.yellow,
    lastValueVisible: false,
    priceFormat: {
      type: "volume",
    },
    priceLineVisible: false,
  };
};

const createSeriesLoans = (newSnapshots: Snapshot[]): void => {
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
};

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
title: Market Loans
</i18n>
