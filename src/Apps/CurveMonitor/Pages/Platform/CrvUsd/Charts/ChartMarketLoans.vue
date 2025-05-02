<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { useQuerySnapshots } from "@CM/queries/crvusd";

const { market } = defineProps<{
  market: Parameters<typeof useQuerySnapshots>[0]["value"];
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
    type: HistogramSeries,
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
      time: v.timestamp.getUTCTimestamp(),
      value: v.nLoans,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newLoansSeries.length > 0) {
    series.loans.setData(newLoansSeries);
    chart.value.timeScale().fitContent();
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
