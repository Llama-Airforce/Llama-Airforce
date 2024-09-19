<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { type Market } from "@CM/Services/CrvUsd";
import { useQuerySnapshots } from "@CM/Services/CrvUsd/Queries";

const { market } = defineProps<{
  market: Market | undefined;
}>();

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market)
);

// Chart
const theme = useTheme();

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: {
    type: "Histogram",
    name: "loans" as const,
    options: computed<HistogramSeriesPartialOptions>(() => ({
      color: theme.value.colors.yellow,
      lastValueVisible: false,
      priceFormat: {
        type: "volume",
      },
      priceLineVisible: false,
    })),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.loans) {
    return;
  }

  const newLoansSeries = snapshots.value
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

<template>
  <Card
    title="Loans"
    :loading
  >
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
