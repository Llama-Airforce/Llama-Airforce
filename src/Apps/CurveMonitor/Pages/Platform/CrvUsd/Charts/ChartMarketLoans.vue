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
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import { type Market } from "@CM/Services/CrvUsd";
import { useQuerySnapshots } from "@CM/Services/CrvUsd/Queries";

const { t } = useI18n();

// Props
interface Props {
  market: Market | undefined;
}

const { market } = defineProps<Props>();

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market)
);

// Chart
const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) =>
    createChartStyles(chartRef, theme.value, {
      localization: {
        // Needed to fix weird right margin wtf.
        priceFormatter: (y: number): string => Math.round(y).toString(),
      },
    }),
  series: {
    type: "Histogram",
    name: "loans" as const,
    options: computed(
      (): HistogramSeriesPartialOptions => ({
        color: theme.value.colors.yellow,
        lastValueVisible: false,
        priceFormat: {
          type: "volume",
        },
        priceLineVisible: false,
      })
    ),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.loans) {
    return;
  }

  const newLoansSeries: HistogramData[] = snapshots.value
    .map((v) => ({
      time: v.timestamp as UTCTimestamp,
      value: v.nLoans,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newLoansSeries.length > 0) {
    series.loans.setData(newLoansSeries);

    const from = newLoansSeries[0].time;
    const to = newLoansSeries[newLoansSeries.length - 1].time;
    chart.value.timeScale().setVisibleRange({ from, to });
  }
}
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  :deep(.card-body) {
    flex-direction: column;
    justify-content: stretch;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Loans
</i18n>
