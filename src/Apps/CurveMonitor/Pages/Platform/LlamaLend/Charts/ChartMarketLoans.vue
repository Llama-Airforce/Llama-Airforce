<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { useQuerySnapshots } from "@CM/queries/llamalend";
import type { Chain } from "@curvefi/prices-api";

const { market, chain } = defineProps<{
  market: Parameters<typeof useQuerySnapshots>[0]["value"];
  chain: Chain | undefined;
}>();

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market),
  toRef(() => chain)
);

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

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
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.numLoans,
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
    ref="card"
    title="Loans"
    :loading
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="loans"
          :series
        />

        <BtnChartLWFullscreen
          :chart
          :target="card"
        />
      </div>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
