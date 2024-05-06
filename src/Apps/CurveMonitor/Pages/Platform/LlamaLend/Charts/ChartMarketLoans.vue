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
import {
  type IChartApi,
  type HistogramData,
  type HistogramSeriesPartialOptions,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { useQuery } from "@tanstack/vue-query";
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
let loansSerie: ISeriesApi<"Histogram">;

const storeSettings = useSettingsStore();
const theme = computed(() => storeSettings.theme);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    loansSerie = chart.addHistogramSeries(
      createOptionsSerieLoans(storeSettings.theme)
    );
  }
);

// Data
const { isFetching: loading, data: snapshots } = useQuery({
  queryKey: ["llama-market-snapshots", market?.controller, chain] as const,
  queryFn: ({ queryKey: [, controller, chain] }) => {
    if (controller && chain) {
      return llameLendService.getSnapshots(chain, controller);
    } else {
      return Promise.resolve([]);
    }
  },
});

// Watches
watch([snapshots, chart], createSeriesLoans);
watch(theme, (newTheme) => {
  loansSerie.applyOptions(createOptionsSerieLoans(newTheme));
});

// Chart
function createOptionsChart(chartRef: HTMLElement, theme: string) {
  return createChartStyles(chartRef, theme as Theme, {
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
}

function createOptionsSerieLoans(theme: Theme): HistogramSeriesPartialOptions {
  const colors = getColors(theme);

  return {
    color: colors.yellow,
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
    gap: 1rem;

    overflow-x: hidden;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Market Loans
</i18n>
