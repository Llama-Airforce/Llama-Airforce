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
import { getColors } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import CurveService, {
  type MarketLoans,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import type { Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

// Props
interface Props {
  market?: Market | null;
}

const { market = null } = defineProps<Props>();

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
const {
  loading,
  data: loans,
  load,
} = usePromise(() => {
  if (market) {
    return curveService.getMarketLoans(market.address).then((x) => x.loans);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Watches
watch(() => market, load);
watch(loans, createSeriesLoans);
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

function createSeriesLoans(newLoans: MarketLoans[]): void {
  if (!chart.value || !loansSerie) {
    return;
  }

  const newLoansSeries: HistogramData[] = chain(newLoans)
    .map((v) => ({
      time: v.timestamp as UTCTimestamp,
      value: v.nLoans,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newLoansSeries.length > 0) {
    loansSerie.setData(newLoansSeries);

    const from = newLoansSeries[0].time;
    const to = newLoansSeries[newLoansSeries.length - 1].time;
    chart.value.timeScale().setVisibleRange({ from, to });
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
